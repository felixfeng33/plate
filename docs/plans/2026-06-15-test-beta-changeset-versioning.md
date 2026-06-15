# test beta changeset versioning

Objective:
Test beta changeset versioning on fork `next`; done when a test changeset branch is merged into local `next` and `pnpm ci:version` proves v54 beta prerelease version changes.

Goal plan:
docs/plans/2026-06-15-test-beta-changeset-versioning.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- package-api (docs/plans/templates/packs/package-api.md)

Task source:
- type: user prompt
- id / link: chat request, no tracker
- title: Test beta changeset versioning after merge to next
- acceptance criteria: create a new test branch from fork `next`, add test changesets, merge into local `next`, run versioning, and prove generated package versions use beta prerelease versions.

Completion threshold:
- Local `next` contains a merged test changeset branch.
- `pnpm ci:version` runs successfully with active `.changeset/pre.json` beta mode.
- Generated version output proves `@platejs/core`, `@platejs/slate`, `platejs`, `@platejs/utils`, and representative `@platejs/*` packages become `54.0.0-beta.0`.
- Generated version output is left uncommitted for inspection, not pushed.
- Task closure is legal only when the source-of-truth acceptance criteria are
  satisfied or explicitly narrowed, required verification evidence is recorded,
  code-review and release-artifact gates are closed when applicable, tracker/PR
  sync is complete or marked N/A with reason, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-test-beta-changeset-versioning.md` passes.

Verification surface:
- `node tooling/scripts/guard-beta-pre-release.mjs`.
- `pnpm ci:version` with `GITHUB_TOKEN="$(gh auth token)"`.
- Node package-version audit for representative packages.
- `git status --short` and `git diff` source audit of generated version changes.

Constraints:
- Preserve existing user-facing behavior outside the task scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, comments, commits, or pushes unless the task/user/skill
  requires them.
- Do not add broad ceremony when the task is trivial or docs-only.

Boundaries:
- Source of truth: latest user prompt plus current fork `next` state.
- Allowed edit scope: local test branch, test `.changeset/*.md` files, generated version output, and this plan.
- Browser surface: N/A, release versioning only.
- Tracker sync: N/A, no tracker.
- Non-goals: no npm publish, no PR, no push unless explicitly requested, no production changeset wording.

Output budget strategy:
- Use focused git/package/version commands with output caps; avoid dumping full generated changelog diffs.

Blocked condition:
- Stop if Changesets cannot generate versions locally after GitHub token injection, or if versioning requires npm publish.

Task state:
- task_type: release versioning proof
- task_complexity: normal
- current_phase: closeout
- current_phase_status: complete
- next_phase: final response
- goal_status: active

Current verdict:
- verdict: complete locally
- confidence: high
- next owner: task
- reason: local merge and `pnpm ci:version` prove the beta prerelease version output.

Completion rule:
- Do not call `update_goal(status: complete)` while any required checklist item
  remains unchecked. If an item does not apply, check it and add `N/A: <reason>`.
- Do not call `update_goal(status: complete)` until every completion threshold
  above is satisfied, final handoff evidence is recorded, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-test-beta-changeset-versioning.md` passes.
- Do not create hook state for this goal. This file plus the active goal are the
  durable state.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Skill analysis before edits | yes | Read `autogoal` and `changeset` skills. |
| Active goal checked or created | yes | `get_goal` returned none; created goal for beta changeset versioning proof. |
| Source of truth read before edits | yes | User prompt and current `next` state with `.changeset/pre.json`. |
| Tracker comments and attachments read | no | N/A: no tracker. |
| Video transcript evidence required | no | N/A: no video. |
| `docs/solutions` checked for non-trivial existing-code work | no | N/A: pure release proof, no implementation search needed. |
| TDD decision before behavior change or bug fix | yes | Version behavior is tested by running Changesets, not unit TDD. |
| Branch decision for code-changing task | yes | Created `codex/test-beta-changeset-versioning`, merged into local `next`. |
| Release artifact decision | yes | Test changesets only; generated version output left uncommitted. |
| Browser tool decision for browser surface | no | N/A: no browser surface. |
| PR expectation decision | no | N/A: no PR requested. |
| Tracker sync expectation decision | no | N/A: no tracker. |
| Output budget strategy recorded | yes | Focused commands with capped output. |
| Package/API pack selected | yes | Package versioning and release artifacts are the whole surface. |
| Public surface or package boundary identified | yes | npm package versions and changelogs. |
| Release artifact path selected | yes | Test `.changeset` files plus generated version output; no real release artifact commit. |
| `changeset` skill loaded when `.changeset` is required | yes | Loaded changeset skill and used one package per file. |
| Barrel/export impact decision recorded | no | N/A: no exports or files under exported package paths changed manually. |

Work Checklist:
- [x] Short objective plus outcome, completion threshold, verification surface,
      constraints, boundaries, and blocked condition are concrete.
- [x] Task source classified with source type, id/link, title, task type,
      acceptance criteria, caveats, likely files/routes/packages, browser
      surface, and root-cause layer.
- [x] Required video or screen-recording evidence is cached/read as normalized
      `<video-transcripts>` XML, or marked N/A with reason.
- [x] Nearby repo instructions and implementation patterns read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason.
- [x] Release artifact requirement recorded: changeset, registry changelog, or
      N/A with reason.
- [x] Final handoff shape decided: bug/feature/testing/batch/review/tracker
      requirements, PR body sync, and issue/Linear sync when applicable.
- [x] Branch handling recorded for code-changing work: dedicated branch used,
      new branch needed, or N/A with reason.
- [x] Local-env-rot retry policy recorded for any surprising repo-wide failure:
      reinstall/rerun evidence or N/A with reason.
- [x] Workspace authority recorded: every proof command names the cwd/tool that
      owns the changed behavior.
- [x] High-risk note recorded for public API, runtime, package-boundary,
      browser behavior, agent-action, or command-contract changes, or marked
      N/A with reason.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason.
- [x] Agent-native review decision recorded for `.agents/**`, `.claude/**`,
      `.codex/**`, skills, hooks, commands, prompts, or user-action tooling.
- [x] Output budget discipline recorded and followed: broad searches are
      scoped, capped, counted, or artifacted instead of streamed into goal
      context.
- [x] Package/API pack: public API, package boundary, export, and release-artifact impact are recorded.
- [x] Package/API pack: release artifact matrix is applied: `.changeset`, registry changelog, or explicit no-artifact reason.
- [x] Package/API pack: `.changeset` work loads `changeset` and follows its package/version/prose rules.
- [x] Package/API pack: registry-only work updates `tooling/data/plate-ui-changelog.mdx` and generated `/registry/changelog/*` JSON instead of adding a package changeset.
- [x] Package/API pack: no-artifact decisions state why the diff has no published package user-visible delta from `main`.
- [x] Package/API pack: compatibility, migration, or hard-cut decision is explicit when public shape changes.
- [x] Package/API pack: package-owned typecheck/build/test proof is recorded or marked N/A with reason.
- [x] Package/API pack: generated barrels or release notes are updated when required.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the command, proof, source audit, or artifact check named in this plan | `GITHUB_TOKEN="$(gh auth token)" pnpm ci:version` passed after local merge. |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: this is release behavior proof, not a bug fix. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Package audit shows `@platejs/core`, `@platejs/slate`, `platejs`, `@platejs/utils`, and `@platejs/ai` at `54.0.0-beta.0`. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: version generation test only. |
| Package exports or file layout changed | no | Run `pnpm brl` before final verification and keep generated barrel updates | N/A: no exports or exported file layout changed. |
| Package manifests, lockfile, or install graph changed | yes | Run `pnpm install` and relevant package checks | `pnpm ci:version` ran `pnpm install --no-frozen-lockfile`; lockfile stayed up to date. |
| Agent rules or skills changed | no | Run `pnpm install` and verify generated skill sync | N/A: no agent rules or skills edited; install prepare re-applied skiller successfully. |
| Workspace authority proof | yes | Run verification in the owning repo/package/app/route/tool and record cwd; do not count the wrong workspace as proof | All proof ran in `/Users/felixfeng/Desktop/repos/plate` on local `next`. |
| Browser surface changed | no | Capture Browser Use proof or record explicit waiver/blocker | N/A: no browser surface. |
| Browser final proof | no | Attach screenshot or exact browser verification caveat when browser proof applies | N/A: release versioning only. |
| CI-controlled template output changed | no | Restore generated template output or record why it is intentionally kept | N/A: no `templates/**` changed. |
| Package behavior or public API changed | yes | Add a changeset or record why no changeset applies | Test changesets were added for `@platejs/core` and `@platejs/slate`; generated output is proof, not final release content. |
| Registry-only component work changed | no | Update `tooling/data/plate-ui-changelog.mdx`, run `node tooling/scripts/generate-ui-changelog-entries.mjs --write`, or record N/A | N/A: no registry component work. |
| Docs or content changed | no | For docs-heavy work, use `--template docs`; for incidental docs, verify source-backed claims, links, examples, and rendered output or record N/A | N/A: only this local plan changed. |
| High-risk mini gate | yes | For public API/runtime/package-boundary/browser/agent-action/command-contract changes, record realistic failure mode, proof plan, and why the chosen boundary is right; otherwise N/A | Failure mode: beta pre mode does not create v54 prerelease versions; proof: local merge plus `pnpm ci:version` generated `54.0.0-beta.0`. |
| Agent-native review for agent/tooling changes | no | For `.agents/**`, `.claude/**`, `.codex/**`, skills, hooks, commands, prompts, or user-action tooling, load `.agents/skills/agent-native-reviewer/SKILL.md` and close accepted/actionable findings, or record N/A | N/A: no agent/tooling behavior changed. |
| Local install corruption suspected | no | Run `pnpm run reinstall` once, rerun the exact failing command, or record N/A | N/A: no install-corruption failure shape. |
| Autoreview for non-trivial implementation changes | no | Load `.agents/skills/autoreview/SKILL.md`; use dirty local `--mode local`, branch/PR `--mode branch --base <base>`, or committed slice `--mode commit --commit <ref>` until no accepted/actionable findings, or record N/A for docs-only/trivial/no local patch | N/A: this is a fork-local proof with generated release output, not an implementation patch. |
| PR create or update | no | Run `check` before PR work and sync PR body to the task-style final handoff | N/A: no PR requested. |
| Task-style PR body verified | no | Verify the PR body with `gh pr view --json body`; it must preserve auto-release blocks when applicable, must not include a current-PR self-link, and must use the kitcn PR #270 emoji format: `🐛 Fixes ...`, `🟢 95-100% confidence`, `Phase / 🧪 Tests / 🌐 Browser` table, and bold emoji Outcome/Caveat/Design/Verified sections | N/A: no PR created. |
| PR proof image hosting | no | If PR body needs browser proof, replace local image paths with hosted GitHub URLs or record N/A | N/A: no browser proof. |
| Tracker sync-back | no | Post concise issue/Linear sync after PR exists, or record N/A/blocker | N/A: no tracker. |
| Final handoff contract | yes | Fill the final handoff fields below with exact PR/issue/confidence/tests/browser/outcome/caveats/design/verification content or N/A reason | Final handoff fields filled below. |
| Final lint | no | Run `pnpm lint:fix` or scoped equivalent | N/A: no source implementation patch; generated version output was inspected, not finalized. |
| Output budget discipline | yes | Verify no unbounded high-volume command output was streamed, or record the accidental output and recovery | Used focused output caps and avoided full changelog diff dumps; one bad shell substitution was rerun with a here-doc. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-test-beta-changeset-versioning.md` | To run after this plan update. |
| Public API / package boundary proof | yes | Source-audit public API, exports, and package boundary impact | Version audit confirms package boundary result: 48 packages beta, 7 independent/udecode packages stable. |
| Release artifact classification | yes | Record whether the change is published package behavior/API/types/config/runtime, registry-only, or no published user-visible delta | Local test-only release artifact output; not a final package release commit. |
| Published package changeset | yes | If published package users see a delta, load `changeset`, add/update one `.changeset/*.md` per package, and prove no forbidden `minor` on `@platejs/slate`, `@platejs/core`, or `platejs` | Used two test major changesets, one per package: `@platejs/core` and `@platejs/slate`, because v54 beta proof needs major prerelease versions. |
| Registry changelog | no | If the change is registry-only under `apps/www/src/registry/**`, update `tooling/data/plate-ui-changelog.mdx`, run `node tooling/scripts/generate-ui-changelog-entries.mjs --write`, and do not add a package changeset | N/A: no registry-only work. |
| No release artifact | no | If no artifact is needed, record the exact reason: internal-only, docs-only, agent-only, test-only, or no user-visible delta from `main` | N/A: this proof intentionally creates local test changesets and generated version output. |
| Package typecheck/build/test | yes | Run owning package checks or record N/A with reason | Owning proof is `pnpm ci:version`; no runtime package typecheck required for generated package metadata. |
| Barrel/export generation | no | Run `pnpm brl` when exports or exported file layout changed, otherwise N/A | N/A: no package exports changed. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | read current `next`, beta pre state, and changeset rules | implementation |
| Implementation | complete | created test branch, added changesets, merged into local `next`, added slate changeset correction | verification |
| Verification | complete | `pnpm ci:version` passed and version audit proves beta output | closeout |
| PR / tracker sync | complete | N/A: no PR/tracker requested | final response |
| Closeout | complete | plan updated; check-complete is final gate | final response |

Findings:
- A single `@platejs/core` major changeset did not bump `@platejs/slate`; `@platejs/slate` needs its own changeset to become `54.0.0-beta.0`.
- With both `@platejs/core` and `@platejs/slate` test major changesets, `pnpm ci:version` produces v54 beta output.

Decisions and tradeoffs:
- Left generated version output uncommitted for inspection.
- Did not push this test state; objective was local proof.
- Added `pr: #5019` metadata to test changesets so the repo changelog generator can resolve GitHub metadata during local proof.

Implementation notes:
- Created `codex/test-beta-changeset-versioning`.
- Added `.changeset/test-v54-beta-versioning.md` for `@platejs/core`.
- Merged the test branch into local `next`.
- Added `.changeset/test-v54-beta-slate-versioning.md` on local `next` after discovering `@platejs/slate` stayed at `53.0.7`.
- Ran `GITHUB_TOKEN="$(gh auth token)" pnpm ci:version`.

Review fixes:
- Corrected initial incomplete proof by adding a separate `@platejs/slate` major test changeset.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| `pnpm ci:version` without `GITHUB_TOKEN` failed in changelog generation | 1 | Use GitHub CLI token without printing it | Reran with `GITHUB_TOKEN="$(gh auth token)"`. |
| `pnpm ci:version` with local-only commit metadata failed to resolve changelog author | 1 | Add test-only upstream PR metadata to changeset summary | Added `pr: #5019`; version generation passed. |
| Shell package audit used zsh-unsafe substitution | 1 | Rerun audit via Node here-doc | Rerun passed and recorded versions. |
| Core-only changeset left `@platejs/slate` at `53.0.7` | 1 | Add a separate `@platejs/slate` test changeset | Rerun produced `@platejs/slate@54.0.0-beta.0`. |

Verification evidence:
- `node tooling/scripts/guard-beta-pre-release.mjs` passed with current `.changeset/pre.json`.
- `GITHUB_TOKEN="$(gh auth token)" pnpm ci:version` passed.
- Version audit: `@platejs/core@54.0.0-beta.0`, `@platejs/slate@54.0.0-beta.0`, `platejs@54.0.0-beta.0`, `@platejs/utils@54.0.0-beta.0`, `@platejs/ai@54.0.0-beta.0`.
- Workspace package audit: `beta=48`; stable packages left outside the v54 beta group are `@plate/scripts@1.0.0`, `@udecode/cmdk@1.0.2`, `@udecode/cn@52.3.4`, `depset@0.1.2`, `@udecode/react-hotkeys@52.0.11`, `@udecode/react-utils@52.3.4`, `@udecode/utils@52.3.4`.
- `git status --short` shows generated package/changelog output plus this plan as local uncommitted inspection state.

Final handoff contract:
- PR line: N/A, no PR requested.
- Issue / tracker line: N/A, no tracker.
- Confidence line: high for local versioning proof.
- Flow table:
  - Reproduced: local merge with test changesets into `next`.
  - Verified: `pnpm ci:version` generated v54 beta package versions.
- Browser check: N/A, no browser surface.
- Outcome: beta prerelease versioning works locally when `next` has active beta pre mode and major test changesets for both `@platejs/core` and `@platejs/slate`.
- Caveat: no npm publish and no fork Actions run; generated output is local and uncommitted.
- Design:
  - Chosen boundary: actual Changesets versioning command on local `next`.
  - Why not quick patch: reading config alone cannot prove generated prerelease versions.
  - Why not broader change: npm publish is a separate proof lane and was intentionally not run here.
- Verified: guard, version command, package version audit, generated diff status.
- PR body verified: N/A, no PR.

Task-style PR body contract:
- Preserve any existing `<!-- auto-release:start -->` block. If a changeset is
  part of the diff and repo policy expects auto release, include that block.
- Use the accepted kitcn PR #270 visual format. The body starts with an emoji
  issue/tracker/fix line, for example `🐛 Fixes #123` or `🐛 Fixes ➖ N/A`, then
  an emoji confidence line like `🟢 95-100% confidence`.
- Use this exact table header: `| Phase | 🧪 Tests | 🌐 Browser |`.
- Use `Reproduced` and `Verified` rows. Mark passing proof with `🟢`, repro or
  failing proof with `🔴`, and non-applicable cells with `➖ N/A`.
- Use bold emoji section headings: `**✅ Outcome**`, `**⚠️ Caveat**`,
  `**🏗️ Design**`, and `**🧪 Verified**`.
- Never include a line that links to the current PR itself. The current PR URL
  belongs in the final response, not in its own description.
- Do not replace this with a generic `Summary` / `Verification` PR body, an
  adaptive prose body from a git helper skill, plain `## Outcome` sections, or
  an unrelated generated badge footer unless the caller or repo template
  explicitly asks for it.
- Proof is `gh pr view --json body` output or a concise source-backed summary
  of that output.

Final handoff / sync:
- PR: N/A.
- Issue / tracker: N/A.
- Browser proof: N/A.
- Caveats: local generated output remains uncommitted for inspection; no publish.

Timeline:
- 2026-06-15T10:05:37.032Z Task goal plan created.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Run `check-complete`, mark goal complete, final response |
| What is the goal? | Prove local beta changeset merge into `next` generates v54 beta prerelease versions. |
| What have I learned? | Core-only changeset does not bump Slate; v54 beta needs a separate Slate changeset. |
| What have I done? | Merged test changesets into local `next`, ran versioning, and audited generated beta versions. |

Open risks:
- No npm publish, no fork Actions proof, and local generated output is not committed.
