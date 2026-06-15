import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { validateBetaPreState } from './guard-beta-pre-release.mjs';
import {
  buildMainToNextSyncPullRequest,
  buildPromotePullRequest,
  getStableVersion,
} from './release-branch-prs.mjs';
import { getReleasePlan, resolveReleaseChannel } from './release-packages.mjs';

const releaseWorkflowPath = new URL(
  '../../.github/workflows/release.yml',
  import.meta.url
);
const promoteWorkflowPath = new URL(
  '../../.github/workflows/promote.yml',
  import.meta.url
);
const packageJsonPath = new URL('../../package.json', import.meta.url);
const releasePackagesPath = new URL('./release-packages.mjs', import.meta.url);
const nextConfigPath = new URL(
  '../../apps/www/next.config.ts',
  import.meta.url
);

test('release workflow uses the pruned GitHub Release path', async () => {
  const workflow = await readFile(releaseWorkflowPath, 'utf8');

  assert.match(workflow, /branches:\s*\n\s*-\s*main\s*\n\s*-\s*next/);
  assert.match(
    workflow,
    /github\.ref == 'refs\/heads\/main' \|\| github\.ref == 'refs\/heads\/next'/
  );
  assert.match(workflow, /Guard release channel/);
  assert.match(
    workflow,
    /main cannot publish while \.changeset\/pre\.json exists/
  );
  assert.match(workflow, /node tooling\/scripts\/guard-beta-pre-release\.mjs/);
  assert.match(workflow, /npm_tag=latest/);
  assert.match(
    workflow,
    /NPM_CONFIG_TAG:\s*\$\{\{ steps\.release_channel\.outputs\.npm_tag \}\}/
  );
  assert.match(
    workflow,
    /PLATE_RELEASE_CHANNEL:\s*\$\{\{ steps\.release_channel\.outputs\.channel \}\}/
  );
  assert.match(workflow, /createGithubReleases:\s*false/);
  assert.match(workflow, /version:\s*pnpm ci:version/);
  assert.match(workflow, /publish:\s*pnpm ci:release/);
  assert.match(workflow, /node tooling\/scripts\/published-package-tags\.mjs/);
  assert.match(workflow, /refs\/tags\/\$\{tag\}:refs\/tags\/\$\{tag\}/);
  assert.match(
    workflow,
    /node tooling\/scripts\/sync-version-package-releases\.mjs --pr "\$RELEASE_PR" --from v49/
  );
  assert.match(
    workflow,
    /git status --porcelain --untracked-files=all -- apps\/www\/src\/generated\/release-index\.json/
  );
  assert.match(workflow, /node tooling\/scripts\/release-notes\.mjs/);
  assert.match(workflow, /anthropics\/claude-code-action\/base-action/);
  assert.match(workflow, /PRERELEASE_FLAG=\(\)/);
  assert.match(workflow, /--prerelease/);
  assert.match(
    workflow,
    /node tooling\/scripts\/release-notes\.mjs add-package-changelogs "\$\{RAW_PATH\}\.final"/
  );
  assert.match(workflow, /touch "\$\{RAW_PATH\}\.final\.validated"/);
  assert.match(
    workflow,
    /-f "\$\{RAW_PATH\}\.final" && -f "\$\{RAW_PATH\}\.final\.validated"/
  );
  assert.match(workflow, /Ignoring unvalidated AI-rewritten release notes/);
  assert.match(workflow, /gh release (create|edit)/);
  assert.match(workflow, /sync-release-artifacts:/);
  assert.match(
    workflow,
    /needs\.release\.outputs\.published == 'true' && github\.ref_name == 'main'/
  );
  assert.match(workflow, /sync-main-to-next:/);
  assert.match(
    workflow,
    /needs:\s*\n\s*-\s*release\s*\n\s*-\s*sync-release-artifacts/
  );
  assert.match(
    workflow,
    /needs\.release\.outputs\.published == 'true' && github\.ref_name == 'main'/
  );
  assert.match(
    workflow,
    /node tooling\/scripts\/release-branch-prs\.mjs sync-main-to-next/
  );
  assert.doesNotMatch(workflow, /sync-release-docs/);
  assert.doesNotMatch(workflow, /global-release/);
  assert.doesNotMatch(workflow, /pr-analyzer/);
  assert.doesNotMatch(workflow, /snapshot:/);
  assert.doesNotMatch(workflow, /release\/\*\*/);
});

test('promote workflow exits beta mode and creates next to main PR', async () => {
  const workflow = await readFile(promoteWorkflowPath, 'utf8');

  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /dry_run:/);
  assert.match(workflow, /if:\s*github\.ref == 'refs\/heads\/next'/);
  assert.match(workflow, /ref:\s*next/);
  assert.match(workflow, /pnpm changeset pre exit/);
  assert.match(workflow, /pnpm ci:version/);
  assert.match(workflow, /packages\/plate\/package\.json/);
  assert.match(workflow, /\[skip release\]/);
  assert.match(workflow, /git push origin next/);
  assert.match(
    workflow,
    /node tooling\/scripts\/release-branch-prs\.mjs "\$\{args\[@\]\}"/
  );
  assert.match(workflow, /promote --version "\$VERSION"/);
  assert.match(workflow, /--dry-run/);
});

test('release branch PR helpers build promote and sync PRs', () => {
  assert.equal(getStableVersion('54.0.0-beta.3'), '54.0.0');
  assert.equal(getStableVersion('54.1.2'), '54.1.2');
  assert.throws(() => getStableVersion('54.0'), /Invalid package version/);

  const promotePullRequest = buildPromotePullRequest({
    version: '54.0.0-beta.0',
  });

  assert.equal(promotePullRequest.base, 'main');
  assert.equal(promotePullRequest.head, 'next');
  assert.equal(promotePullRequest.title, 'chore: promote v54.0.0 to stable');
  assert.match(promotePullRequest.body, /publishes Plate packages to npm/);
  assert.match(promotePullRequest.body, /Create a merge commit/);

  const syncPullRequest = buildMainToNextSyncPullRequest();

  assert.equal(syncPullRequest.base, 'next');
  assert.equal(syncPullRequest.head, 'main');
  assert.equal(
    syncPullRequest.title,
    'chore: sync main to next [skip release]'
  );
  assert.match(syncPullRequest.body, /stable fixes from `main`/);
  assert.match(syncPullRequest.body, /keep `next` versions/);
});

test('package scripts expose CI version and release commands only', async () => {
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

  assert.equal(
    packageJson.scripts['ci:version'],
    'pnpm changeset version && pnpm install --no-frozen-lockfile'
  );
  assert.equal(
    packageJson.scripts['ci:release'],
    'node tooling/scripts/release-packages.mjs'
  );
  assert.equal(
    packageJson.scripts['g:release:beta'],
    'node tooling/scripts/release-packages.mjs --channel beta'
  );
  assert.equal(packageJson.scripts['g:release:next'], 'pnpm g:release:beta');
  assert.doesNotMatch(
    Object.values(packageJson.scripts).join('\n'),
    /changeset publish --tag (?:next|beta)/
  );
  assert.equal(packageJson.scripts['release:releases'], undefined);
});

test('beta package release uses an explicit npm beta tag', async () => {
  const releasePackages = await readFile(releasePackagesPath, 'utf8');

  assert.equal(resolveReleaseChannel({ argv: [], env: {} }), 'latest');
  assert.equal(
    resolveReleaseChannel({ argv: ['--channel', 'beta'], env: {} }),
    'beta'
  );
  assert.equal(
    resolveReleaseChannel({ argv: ['--channel=beta'], env: {} }),
    'beta'
  );
  assert.equal(
    resolveReleaseChannel({ argv: [], env: { PLATE_RELEASE_CHANNEL: 'beta' } }),
    'beta'
  );
  assert.equal(
    resolveReleaseChannel({ argv: [], env: { GITHUB_REF_NAME: 'next' } }),
    'beta'
  );
  assert.deepEqual(getReleasePlan('latest'), {
    release: ['pnpm', ['release']],
  });
  assert.deepEqual(getReleasePlan('beta'), {
    build: ['pnpm', ['build']],
    hidePreStateForPublish: true,
    publish: ['pnpm', ['changeset', 'publish', '--tag', 'beta']],
  });
  assert.match(releasePackages, /pre\.json\.beta-publish-backup/);
  assert.match(
    releasePackages,
    /runCommand\('pnpm', \['changeset', 'publish', '--tag', 'beta'\]\)/
  );
});

test('beta pre-release guard requires active beta pre mode', () => {
  assert.doesNotThrow(() => validateBetaPreState({ mode: 'pre', tag: 'beta' }));

  assert.throws(
    () => validateBetaPreState({ mode: 'exit', tag: 'beta' }),
    /active Changesets pre-release mode/
  );
  assert.throws(
    () => validateBetaPreState({ mode: 'pre', tag: 'next' }),
    /beta pre-release tag/
  );
  assert.throws(
    () => validateBetaPreState({ mode: 'pre' }),
    /beta pre-release tag/
  );
});

test('release docs keep old migration route redirects', async () => {
  const nextConfig = await readFile(nextConfigPath, 'utf8');

  assert.match(
    nextConfig,
    /source:\s*'\/docs\/migration'[\s\S]*destination:\s*'\/docs\/releases'|destination:\s*'\/docs\/releases'[\s\S]*source:\s*'\/docs\/migration'/
  );
  assert.match(
    nextConfig,
    /source:\s*'\/cn\/docs\/migration'[\s\S]*destination:\s*'\/cn\/docs\/releases'|destination:\s*'\/cn\/docs\/releases'[\s\S]*source:\s*'\/cn\/docs\/migration'/
  );
});
