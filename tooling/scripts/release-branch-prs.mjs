#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
export const mainToNextSyncBranch = 'sync/main-to-next';
const newlinePattern = /\r?\n/;
const shellSafeArgPattern = /^[A-Za-z0-9_./:=@-]+$/;
const stableVersionPattern = /^\d+\.\d+\.\d+$/;
const semverPattern = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

export function getStableVersion(version) {
  const stableVersion = String(version ?? '').split('-')[0];

  if (!stableVersionPattern.test(stableVersion)) {
    throw new Error(`Invalid package version: ${JSON.stringify(version)}`);
  }

  return stableVersion;
}

export function buildPromotePullRequest({ version }) {
  const stableVersion = getStableVersion(version);

  return {
    base: 'main',
    body: [
      `Promotes v${stableVersion} from beta to stable.`,
      '',
      'Merging this PR publishes Plate packages to npm with the `latest` tag.',
      '',
      '**Merge with `Create a merge commit`**. Do not squash or rebase; the promotion needs branch history intact so future `main -> next` sync stays clean.',
    ].join('\n'),
    head: 'next',
    title: `chore: promote v${stableVersion} to stable`,
  };
}

export function buildMainToNextSyncPullRequest() {
  return {
    base: 'next',
    body: [
      'Brings stable fixes from `main` into the beta branch.',
      '',
      'This PR is prepared from `next` by merging `main` into `sync/main-to-next` first. Release metadata conflicts are resolved automatically before the PR opens.',
      '',
      '**Merge with `Create a merge commit`**. Do not squash or rebase; this preserves the stable fix commits before the next beta cut.',
      '',
      'If this PR still has conflicts, they are real source conflicts. Package versions, beta pre-release state, and changelog section ordering are handled by automation.',
    ].join('\n'),
    head: mainToNextSyncBranch,
    title: 'chore: sync main to next [skip release]',
  };
}

function run(command, args, { allowFailure = false, capture = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && !allowFailure) {
    throw new Error(
      `${command} ${args.join(' ')} exited with ${result.status}`
    );
  }

  return capture ? result.stdout.trim() : '';
}

function logDryRun(command, args) {
  console.log(`dry-run: ${command} ${args.map(formatArg).join(' ')}`);
}

function formatArg(arg) {
  if (shellSafeArgPattern.test(arg)) {
    return arg;
  }

  return JSON.stringify(arg);
}

function runGh(args, { capture = false, dryRun = false } = {}) {
  if (dryRun) {
    logDryRun('gh', args);
    return '';
  }

  return run('gh', args, { capture });
}

function runGit(
  args,
  { allowFailure = false, capture = false, dryRun = false } = {}
) {
  if (dryRun) {
    logDryRun('git', args);
    return '';
  }

  return run('git', args, { allowFailure, capture });
}

function requireRepository(env) {
  const repository = env.GITHUB_REPOSITORY;

  if (!repository) {
    throw new Error('GITHUB_REPOSITORY is required.');
  }

  return repository;
}

function readGitStage(stage, file) {
  return runGit(['show', `:${stage}:${file}`], { capture: true });
}

function writeRepoFile(file, content) {
  writeFileSync(
    path.join(repoRoot, file),
    content.endsWith('\n') ? content : `${content}\n`
  );
}

function getUnmergedFiles() {
  const output = runGit(['diff', '--name-only', '--diff-filter=U'], {
    capture: true,
  });

  return output.split(newlinePattern).filter(Boolean);
}

function isPackageManifest(file) {
  return file === 'package.json' || file.endsWith('/package.json');
}

function isChangelog(file) {
  return file.endsWith('/CHANGELOG.md') || file === 'CHANGELOG.md';
}

function normalizePackageForVersionOnlyCompare(packageJson) {
  return JSON.stringify({
    ...packageJson,
    version: '__plate_sync_version__',
  });
}

export function resolvePackageManifestForMainToNextSync({ ours, theirs }) {
  const oursJson = JSON.parse(ours);
  const theirsJson = JSON.parse(theirs);

  if (
    typeof oursJson.version !== 'string' ||
    typeof theirsJson.version !== 'string'
  ) {
    throw new Error('Package manifest conflict does not include versions.');
  }

  if (
    normalizePackageForVersionOnlyCompare(oursJson) !==
    normalizePackageForVersionOnlyCompare(theirsJson)
  ) {
    throw new Error(
      'Package manifest conflict changed fields other than version.'
    );
  }

  return `${JSON.stringify(oursJson, null, 2)}\n`;
}

function parseSemver(version) {
  const match = version.match(semverPattern);

  if (!match) return null;

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    pre: match[4] ?? '',
  };
}

function parseChangelog(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const sectionMatches = [...normalized.matchAll(/^##\s+(.+?)\s*$/gm)];

  if (sectionMatches.length === 0) {
    return {
      header: normalized.trimEnd(),
      sections: [],
    };
  }

  const header = normalized.slice(0, sectionMatches[0].index).trimEnd();
  const sections = sectionMatches.map((match, index) => {
    const start = match.index;
    const end =
      index + 1 < sectionMatches.length
        ? sectionMatches[index + 1].index
        : normalized.length;
    const version = match[1].trim().replace(/^`|`$/g, '');

    return {
      index,
      raw: normalized.slice(start, end).trimEnd(),
      version,
    };
  });

  return { header, sections };
}

function isStableChangelogSection(section) {
  const version = parseSemver(section.version);

  return !!version && !version.pre;
}

function collectStableChangelogInsertions({ oursVersions, theirsSections }) {
  const sectionsByAnchorVersion = new Map();
  const pendingSections = [];
  for (const section of theirsSections) {
    if (!isStableChangelogSection(section)) continue;

    if (!oursVersions.has(section.version)) {
      pendingSections.push(section);
      continue;
    }

    if (pendingSections.length > 0) {
      sectionsByAnchorVersion.set(section.version, [...pendingSections]);
      pendingSections.length = 0;
    }
  }

  return {
    sectionsByAnchorVersion,
    trailingSections: pendingSections,
  };
}

export function mergeChangelogsForMainToNextSync({ ours, theirs }) {
  const oursChangelog = parseChangelog(ours);
  const theirsChangelog = parseChangelog(theirs);
  const oursVersions = new Set(
    oursChangelog.sections.map((section) => section.version)
  );
  const theirsByVersion = new Map(
    theirsChangelog.sections.map((section) => [section.version, section])
  );
  const stableInsertions = collectStableChangelogInsertions({
    oursVersions,
    theirsSections: theirsChangelog.sections,
  });
  const sections = [];

  for (const section of oursChangelog.sections) {
    const sectionsToInsert = stableInsertions.sectionsByAnchorVersion.get(
      section.version
    );
    const theirsSection = theirsByVersion.get(section.version);

    if (sectionsToInsert) {
      sections.push(...sectionsToInsert);
    }

    sections.push(
      theirsSection && isStableChangelogSection(section)
        ? theirsSection
        : section
    );
  }

  sections.push(...stableInsertions.trailingSections);

  const header = oursChangelog.header || theirsChangelog.header;

  return `${header}\n\n${sections.map((section) => section.raw).join('\n\n')}\n`;
}

function resolveMainToNextMetadataConflict(file) {
  if (isPackageManifest(file)) {
    writeRepoFile(
      file,
      resolvePackageManifestForMainToNextSync({
        ours: readGitStage(2, file),
        theirs: readGitStage(3, file),
      })
    );
    runGit(['add', file]);
    return true;
  }

  if (file === '.changeset/pre.json') {
    writeRepoFile(file, readGitStage(2, file));
    runGit(['add', file]);
    return true;
  }

  if (isChangelog(file)) {
    writeRepoFile(
      file,
      mergeChangelogsForMainToNextSync({
        ours: readGitStage(2, file),
        theirs: readGitStage(3, file),
      })
    );
    runGit(['add', file]);
    return true;
  }

  return false;
}

function resolveMainToNextMetadataConflicts() {
  const unmergedFiles = getUnmergedFiles();
  const unresolvedFiles = [];

  for (const file of unmergedFiles) {
    try {
      if (!resolveMainToNextMetadataConflict(file)) {
        unresolvedFiles.push(file);
      }
    } catch (error) {
      unresolvedFiles.push(`${file} (${error.message})`);
    }
  }

  if (unresolvedFiles.length > 0) {
    throw new Error(
      [
        'Manual main -> next sync conflict resolution required:',
        ...unresolvedFiles.map((file) => `- ${file}`),
      ].join('\n')
    );
  }

  const remainingFiles = getUnmergedFiles();

  if (remainingFiles.length > 0) {
    throw new Error(
      [
        'Manual main -> next sync conflict resolution required:',
        ...remainingFiles.map((file) => `- ${file}`),
      ].join('\n')
    );
  }
}

export function createOrUpdatePromotePullRequest({
  dryRun = false,
  env = process.env,
  version,
} = {}) {
  const repository = requireRepository(env);
  const pullRequest = buildPromotePullRequest({ version });
  const existing = runGh(
    [
      'pr',
      'list',
      '--base',
      pullRequest.base,
      '--head',
      pullRequest.head,
      '--state',
      'open',
      '--repo',
      repository,
      '--json',
      'number',
      '--jq',
      '.[0].number // empty',
    ],
    { capture: true, dryRun }
  );

  if (existing) {
    runGh(
      [
        'pr',
        'edit',
        existing,
        '--repo',
        repository,
        '--title',
        pullRequest.title,
        '--body',
        pullRequest.body,
      ],
      { dryRun }
    );
    console.log(`Updated promote PR #${existing}.`);
    return { action: 'updated', number: existing };
  }

  runGh(
    [
      'pr',
      'create',
      '--base',
      pullRequest.base,
      '--head',
      pullRequest.head,
      '--repo',
      repository,
      '--title',
      pullRequest.title,
      '--body',
      pullRequest.body,
    ],
    { dryRun }
  );
  console.log('Created promote PR.');

  return { action: 'created' };
}

export function createOrUpdateMainToNextSyncPullRequest({
  dryRun = false,
  env = process.env,
} = {}) {
  const repository = requireRepository(env);
  const pullRequest = buildMainToNextSyncPullRequest();

  runGit(['fetch', 'origin', 'main', 'next'], { dryRun });

  const aheadText = dryRun
    ? (env.PLATE_SYNC_AHEAD ?? '1')
    : runGit(['rev-list', '--count', 'origin/next..origin/main'], {
        capture: true,
      });
  const ahead = Number(aheadText);

  if (!Number.isInteger(ahead) || ahead < 0) {
    throw new Error(`Invalid main-to-next ahead count: ${aheadText}`);
  }

  if (ahead === 0) {
    console.log('No new commits to sync from main to next.');
    return { action: 'skipped', ahead };
  }

  runGit(['config', 'user.name', 'github-actions[bot]'], { dryRun });
  runGit(
    [
      'config',
      'user.email',
      '41898282+github-actions[bot]@users.noreply.github.com',
    ],
    {
      dryRun,
    }
  );
  runGit(['checkout', '-B', mainToNextSyncBranch, 'origin/next'], { dryRun });
  runGit(['merge', '--no-ff', '--no-commit', 'origin/main'], {
    allowFailure: true,
    dryRun,
  });

  if (!dryRun) {
    resolveMainToNextMetadataConflicts();
  }

  runGit(
    [
      'commit',
      '--allow-empty',
      '-m',
      'chore: sync main to next [skip release]',
    ],
    {
      dryRun,
    }
  );
  runGit(['push', 'origin', `HEAD:${mainToNextSyncBranch}`, '--force'], {
    dryRun,
  });

  const existing = runGh(
    [
      'pr',
      'list',
      '--base',
      pullRequest.base,
      '--head',
      pullRequest.head,
      '--state',
      'open',
      '--repo',
      repository,
      '--json',
      'number',
      '--jq',
      '.[0].number // empty',
    ],
    { capture: true, dryRun }
  );

  if (existing) {
    runGh(
      [
        'pr',
        'edit',
        existing,
        '--repo',
        repository,
        '--title',
        pullRequest.title,
        '--body',
        pullRequest.body,
      ],
      { dryRun }
    );
    console.log(
      `Updated main -> next sync PR #${existing} (${ahead} commits pending).`
    );
    return { action: 'updated', ahead, number: existing };
  }

  runGh(
    [
      'pr',
      'create',
      '--base',
      pullRequest.base,
      '--head',
      pullRequest.head,
      '--repo',
      repository,
      '--title',
      pullRequest.title,
      '--body',
      pullRequest.body,
    ],
    { dryRun }
  );
  console.log(`Created main -> next sync PR (${ahead} commits pending).`);

  return { action: 'created', ahead };
}

function readOption(args, name) {
  const index = args.indexOf(name);

  if (index === -1) {
    const inline = args.find((arg) => arg.startsWith(`${name}=`));

    return inline ? inline.slice(name.length + 1) : undefined;
  }

  return args[index + 1];
}

function isMainModule() {
  const entrypoint = process.argv[1];

  return (
    !!entrypoint && path.resolve(entrypoint) === fileURLToPath(import.meta.url)
  );
}

if (isMainModule()) {
  try {
    const [command, ...args] = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');

    if (command === 'promote') {
      createOrUpdatePromotePullRequest({
        dryRun,
        version: readOption(args, '--version'),
      });
    } else if (command === 'sync-main-to-next') {
      createOrUpdateMainToNextSyncPullRequest({ dryRun });
    } else {
      throw new Error(
        'Usage: release-branch-prs.mjs <promote --version x.y.z | sync-main-to-next> [--dry-run]'
      );
    }
  } catch (error) {
    console.error(`::error::${error.message}`);
    process.exit(1);
  }
}
