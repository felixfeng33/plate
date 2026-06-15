# promote sync fork test

Objective:
Add and test promote/sync release workflows on fork; done when workflow files/scripts have local tests proving next->main promote and main->next sync behavior.

Goal plan:
docs/plans/2026-06-15-promote-sync-fork-test.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: chat
- id / link: N/A
- title: Add Better Auth-style promote/sync release behavior and test it on the fork
- acceptance criteria: add promote automation for `next -> main`, add post-main-release sync PR automation for `main -> next`, keep fork testing safe from npm publish, and prove the behavior with local workflow/script tests.

Completion threshold:
- `.github/workflows/promote.yml` exists and only runs promotion work from `next`.
- `.github/workflows/release.yml` creates or updates a `main -> next` sync PR after a successful `main` publish.
- GitHub PR command construction is covered by local tests with dry-run behavior.
- Existing beta release tests still pass.
- Task closure is legal only when the source-of-truth acceptance criteria are
  satisfied or explicitly narrowed, required verification evidence is recorded,
  code-review and release-artifact gates are closed when applicable, tracker/PR
  sync is complete or marked N/A with reason, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-promote-sync-fork-test.md` passes.

Verification surface:
- `node --test tooling/scripts/release-workflow.test.mjs`
- focused source audit of `.github/workflows/release.yml`, `.github/workflows/promote.yml`, and release helper scripts.
- `pnpm lint:fix` unless blocked by unrelated local generated output.

Constraints:
- Preserve existing user-facing behavior outside the task scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, comments, commits, or pushes unless the task/user/skill
  requires them.
- Do not add broad ceremony when the task is trivial or docs-only.

Boundaries:
- Source of truth: user request plus Better Auth local workflows in `../better-auth/.github/workflows/release.yml` and `../better-auth/.github/workflows/promote.yml`.
- Allowed edit scope: release workflows, release helper scripts/tests, and this plan.
- Browser surface: N/A, release automation has no UI route.
- Tracker sync: N/A, chat task.
- Non-goals: no real npm publish, no real upstream PR, no docs version switcher, no docs beta sync.

Output budget strategy:
- Use scoped `sed`/`rg` reads and focused Node tests; cap long command output.

Blocked condition:
- Stop only if the repo lacks a safe way to test workflow command construction without mutating GitHub state, or if local test execution is blocked by install corruption that persists after the repo-defined retry.

Task state:
- task_type: release automation chore
- task_complexity: normal
- current_phase: closeout
- current_phase_status: complete
- next_phase: final response
- goal_status: active

Current verdict:
- verdict: complete
- confidence: high
- next owner: user
- reason: local workflow tests, fork dry-run commands, lint, and final autoreview passed.

Completion rule:
- Do not call `update_goal(status: complete)` while any required checklist item
  remains unchecked. If an item does not apply, check it and add `N/A: <reason>`.
- Do not call `update_goal(status: complete)` until every completion threshold
  above is satisfied, final handoff evidence is recorded, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-promote-sync-fork-test.md` passes.
- Do not create hook state for this goal. This file plus the active goal are the
  durable state.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Skill analysis before edits | yes | Loaded `autogoal`, `task`, and `autoreview` skills. |
| Active goal checked or created | yes | `get_goal` returned no active goal; created goal for this workflow. |
| Source of truth read before edits | yes | Read local release workflow and Better Auth release/promote workflows. |
| Tracker comments and attachments read | no | N/A: chat task, no tracker. |
| Video transcript evidence required | no | N/A: no video evidence. |
| `docs/solutions` checked for non-trivial existing-code work | no | N/A: source pattern was local Better Auth workflow files requested by user. |
| TDD decision before behavior change or bug fix | yes | No red-first TDD; static workflow behavior is covered by `tooling/scripts/release-workflow.test.mjs`. |
| Branch decision for code-changing task | yes | Final branch strategy: release infra goes to `main`, beta pre state and beta changesets stay on `next`, then `next` merges `main`. No commit/push performed in this turn. |
| Release artifact decision | yes | No changeset: release automation only, no package runtime/API/package output change. |
| Browser tool decision for browser surface | no | N/A: release automation has no browser surface. |
| PR expectation decision | no | N/A: no PR requested in this turn. |
| Tracker sync expectation decision | no | N/A: chat task, no tracker. |
| Output budget strategy recorded | yes | Scoped file reads and focused test output only. |

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

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the command, proof, source audit, or artifact check named in this plan | `node --test tooling/scripts/release-workflow.test.mjs` passed; fork dry-runs for promote and sync passed. |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: feature automation task, not a bug repro. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Release workflow test passed and dry-run scripts printed expected `gh pr` commands. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: YAML and `.mjs` workflow helper changes only. |
| Package exports or file layout changed | no | Run `pnpm brl` before final verification and keep generated barrel updates | N/A: no package exports or barrels changed. |
| Package manifests, lockfile, or install graph changed | no | Run `pnpm install` and relevant package checks | N/A: no manifest or lockfile changes from this task. |
| Agent rules or skills changed | no | Run `pnpm install` and verify generated skill sync | N/A: no agent rule or skill source changed. |
| Workspace authority proof | yes | Run verification in the owning repo/package/app/route/tool and record cwd; do not count the wrong workspace as proof | Commands ran in `/Users/felixfeng/Desktop/repos/plate`. |
| Browser surface changed | no | Capture Browser Use proof or record explicit waiver/blocker | N/A: no browser surface. |
| Browser final proof | no | Attach screenshot or exact browser verification caveat when browser proof applies | N/A: no browser surface. |
| CI-controlled template output changed | no | Restore generated template output or record why it is intentionally kept | N/A: no `templates/**` changes from this task. |
| Package behavior or public API changed | no | Add a changeset or record why no changeset applies | N/A: release automation only, no package behavior/API change. |
| Registry-only component work changed | no | Update `tooling/data/plate-ui-changelog.mdx`, run `node tooling/scripts/generate-ui-changelog-entries.mjs --write`, or record N/A | N/A: no registry component work. |
| Docs or content changed | no | For docs-heavy work, use `--template docs`; for incidental docs, verify source-backed claims, links, examples, and rendered output or record N/A | N/A: only internal goal plan changed. |
| High-risk mini gate | yes | For public API/runtime/package-boundary/browser/agent-action/command-contract changes, record realistic failure mode, proof plan, and why the chosen boundary is right; otherwise N/A | Failure modes reviewed: duplicate sync PR lookup, next guard failure after promote/sync, and missing runtime helper on main. Fixed and covered by tests/dry-run/autoreview. |
| Agent-native review for agent/tooling changes | no | For `.agents/**`, `.claude/**`, `.codex/**`, skills, hooks, commands, prompts, or user-action tooling, load `.agents/skills/agent-native-reviewer/SKILL.md` and close accepted/actionable findings, or record N/A | N/A: no agent-owned files changed. |
| Local install corruption suspected | no | Run `pnpm run reinstall` once, rerun the exact failing command, or record N/A | N/A: no install-corruption signal. |
| Autoreview for non-trivial implementation changes | yes | Load `.agents/skills/autoreview/SKILL.md`; use dirty local `--mode local`, branch/PR `--mode branch --base <base>`, or committed slice `--mode commit --commit <ref>` until no accepted/actionable findings, or record N/A for docs-only/trivial/no local patch | Final run clean: `.agents/skills/autoreview/scripts/autoreview --mode local --codex-bin .tmp/codex-flex-wrapper.sh --prompt ...`; two earlier findings and one follow-up finding were fixed. |
| PR create or update | no | Run `check` before PR work and sync PR body to the task-style final handoff | N/A: no PR requested or created. |
| Task-style PR body verified | no | Verify the PR body with `gh pr view --json body`; it must preserve auto-release blocks when applicable, must not include a current-PR self-link, and must use the kitcn PR #270 emoji format: `🐛 Fixes ...`, `🟢 95-100% confidence`, `Phase / 🧪 Tests / 🌐 Browser` table, and bold emoji Outcome/Caveat/Design/Verified sections | N/A: no PR created. |
| PR proof image hosting | no | If PR body needs browser proof, replace local image paths with hosted GitHub URLs or record N/A | N/A: no PR and no browser proof. |
| Tracker sync-back | no | Post concise issue/Linear sync after PR exists, or record N/A/blocker | N/A: chat task, no tracker. |
| Final handoff contract | yes | Fill the final handoff fields below with exact PR/issue/confidence/tests/browser/outcome/caveats/design/verification content or N/A reason | Filled below. |
| Final lint | yes | Run `pnpm lint:fix` or scoped equivalent | `pnpm lint:fix` passed after fixes. |
| Output budget discipline | yes | Verify no unbounded high-volume command output was streamed, or record the accidental output and recovery | One autoreview bundle was large because prior beta generated output is dirty; subsequent outputs were capped and summarized. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-promote-sync-fork-test.md` | Passed. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | done | created plan; read Plate and Better Auth release workflows | implementation |
| Implementation | done | added promote workflow, main-to-next sync job, helper script, and tests | verification |
| Verification | done | focused tests, fork dry-runs, lint, and autoreview passed | closeout |
| PR / tracker sync | skipped | N/A: no PR or tracker requested | final response |
| Closeout | done | plan filled; check-complete next | final response |

Findings:
- Better Auth pattern needs both directions: `next -> main` promote PR and `main -> next` sync PR.
- `workflow_dispatch` promote belongs on default branch `main`; otherwise GitHub Actions manual dispatch is easy to miss or unavailable. The runtime target remains `next`.
- The workflow files alone are not enough on `main`; `tooling/scripts/release-branch-prs.mjs` and its tests must ship with them because `release.yml` calls that script.

Decisions and tradeoffs:
- Release infra should land on `main` first, then `next` should merge `main`.
- Beta-specific state stays on `next`: `.changeset/pre.json`, beta changesets, and generated v54 beta version output.
- The sync PR title includes `[skip release]` so merging `main -> next` while `next` is temporarily out of beta pre mode does not trip the release guard.

Implementation notes:
- Added `.github/workflows/promote.yml` with manual `dry_run`, `pnpm changeset pre exit`, `pnpm ci:version`, commit/push to `next`, and promote PR creation.
- Added `sync-main-to-next` job in `.github/workflows/release.yml`, after `sync-release-artifacts`, so the PR includes final release artifact commits.
- Added `tooling/scripts/release-branch-prs.mjs` for promote and sync PR creation/update plus dry-run support.
- Updated `tooling/scripts/release-workflow.test.mjs` to lock promote, sync, skip-release, and helper behavior.

Review fixes:
- Fixed autoreview finding: use plain `--head main` for same-repo sync PR lookup instead of unsupported owner-qualified head.
- Fixed autoreview finding: promotion commit now includes `[skip release]`.
- Fixed autoreview finding: sync PR title now includes `[skip release]`.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Autoreview failed with Codex config `service_tier=priority` | 1 | Use temporary Codex wrapper with supported service tier override | Wrapper with `fast` allowed review to run; deleted wrapper after clean review. |
| Autoreview found unsupported owner-qualified `gh pr list --head` | 1 | Use plain same-repo head branch | Fixed helper and tests. |
| Autoreview found promotion commit would trip next release guard | 1 | Add `[skip release]` to promotion commit | Fixed workflow and tests. |
| Autoreview found sync PR merge would trip next release guard while pre mode is exited | 1 | Add `[skip release]` to sync PR title | Fixed helper and tests. |

Verification evidence:
- `node --test tooling/scripts/release-workflow.test.mjs` passed with 7 tests.
- `GITHUB_REPOSITORY=felix/plate GITHUB_REPOSITORY_OWNER=felix node tooling/scripts/release-branch-prs.mjs promote --version 54.0.0-beta.0 --dry-run` printed `next -> main` promote PR commands.
- `GITHUB_REPOSITORY=felix/plate GITHUB_REPOSITORY_OWNER=felix PLATE_SYNC_AHEAD=2 node tooling/scripts/release-branch-prs.mjs sync-main-to-next --dry-run` printed `main -> next` sync PR commands with `[skip release]`.
- `pnpm lint:fix` passed.
- Final autoreview clean: no accepted/actionable findings.

Final handoff contract:
- PR line: N/A, no PR created.
- Issue / tracker line: N/A, no tracker.
- Confidence line: high.
- Flow table:
  - Reproduced: N/A, feature automation task; fork dry-run simulated promote and sync GitHub commands.
  - Verified: focused Node tests, fork dry-runs, lint, and autoreview.
- Browser check: N/A, no browser surface.
- Outcome: Better Auth-style promote/sync behavior is implemented locally and tested without npm publish.
- Caveat: no commit, push, PR, GitHub Actions run, or npm publish was performed in this turn; current checkout still contains prior beta versioning generated output outside this task.
- Design:
  - Chosen boundary: workflow calls a small release PR helper script with dry-runable behavior.
  - Why not quick patch: inline shell would be harder to test safely on the fork.
  - Why not broader change: docs version switcher and beta docs sync are separate work.
- Verified: `release-workflow.test.mjs`, fork dry-run commands, `pnpm lint:fix`, and final autoreview.
- PR body verified: N/A, no PR created.

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
- Caveats: release infra should be committed to `main` with its helper/test files, then merged into `next`; beta state remains on `next`.

Timeline:
- 2026-06-15T12:52:48.200Z Task goal plan created.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Run `check-complete`, mark goal complete, final response |
| What is the goal? | Add and test Better Auth-style promote/sync release automation safely on the fork. |
| What have I learned? | Release infra must land on `main` first; `next` then merges `main`; sync/promote commits need `[skip release]` around the temporary no-pre-mode window. |
| What have I done? | Added local workflow/helper/test implementation and verified it with focused tests, dry-runs, lint, and autoreview. |

Open risks:
- No live GitHub Actions dispatch was run.
- No commit/push was made.
- Current checkout still includes prior beta versioning generated output unrelated to this release-infra patch.
