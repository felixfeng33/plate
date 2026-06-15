#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const shellSafeArgPattern = /^[A-Za-z0-9_./:=@-]+$/;
const stableVersionPattern = /^\d+\.\d+\.\d+$/;

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
      '**Merge with `Create a merge commit`**. Do not squash or rebase; this preserves the stable fix commits before the next beta cut.',
      '',
      'If there are conflicts, keep `next` versions for package manifests and changelogs. `next` is ahead of `main` while beta is active.',
    ].join('\n'),
    head: 'main',
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

function runGit(args, { capture = false, dryRun = false } = {}) {
  if (dryRun) {
    logDryRun('git', args);
    return '';
  }

  return run('git', args, { capture });
}

function requireRepository(env) {
  const repository = env.GITHUB_REPOSITORY;

  if (!repository) {
    throw new Error('GITHUB_REPOSITORY is required.');
  }

  return repository;
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

  runGit(['fetch', 'origin', 'next'], { dryRun });

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
