# main changeset guards

Objective:
Add main-branch changeset PR guards; done when workflows/tests prove minor/major retarget to next and main blocks non-patch/pre.json.

Goal plan:
docs/plans/2026-06-15-main-changeset-guards.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: chat
- id / link: N/A
- title: Add main branch guard for minor/major changeset PRs
- acceptance criteria: from `felix-main`, add guard automation so patch PRs can still target `main`, minor/major changeset PRs targeting `main` are automatically retargeted to `next`, and CI blocks non-patch changesets or `.changeset/pre.json` from `main`.

Completion threshold:
- `.github/workflows/auto-retarget.yml` exists and retargets `minor`/`major` changeset PRs from `main` to `next`.
- `.github/workflows/verify-changesets.yml` exists and blocks `.changeset/pre.json`, missing package changesets, and `minor`/`major` changesets on `main`.
- Existing patch changeset PR behavior remains allowed on `main`.
- Local tests cover the parser and workflow contracts.
- Task closure is legal only when the source-of-truth acceptance criteria are
  satisfied or explicitly narrowed, required verification evidence is recorded,
  code-review and release-artifact gates are closed when applicable, tracker/PR
  sync is complete or marked N/A with reason, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-main-changeset-guards.md` passes.

Verification surface:
- `node --test tooling/scripts/auto-release-pr.test.mjs tooling/scripts/release-workflow.test.mjs`
- `pnpm lint:fix`
- source audit of new workflow guards.

Constraints:
- Preserve existing user-facing behavior outside the task scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, comments, commits, or pushes unless the task/user/skill
  requires them.
- Do not add broad ceremony when the task is trivial or docs-only.

Boundaries:
- Source of truth: user request plus Better Auth local guard workflows in `../better-auth/.github/workflows`.
- Allowed edit scope: GitHub workflows, existing changeset PR helper/tests, and this goal plan.
- Browser surface: N/A, workflow automation only.
- Tracker sync: N/A, chat task.
- Non-goals: no docs version switcher, no npm publish, no PR creation, no branch push unless separately requested.

Output budget strategy:
- Use focused `sed`/`rg` reads and targeted Node tests.

Blocked condition:
- Stop if GitHub Actions cannot express the guard without executing untrusted PR code, or if local tests/lint are blocked by unrelated install corruption after the repo-defined retry.

Task state:
- task_type: release automation guard
- task_complexity: normal
- current_phase: implementation
- current_phase_status: complete
- next_phase: final response
- goal_status: active

Current verdict:
- verdict: complete
- confidence: high
- next owner: user
- reason: workflows, parser tests, workflow contract tests, lint, source audit, and autoreview passed.

Completion rule:
- Do not call `update_goal(status: complete)` while any required checklist item
  remains unchecked. If an item does not apply, check it and add `N/A: <reason>`.
- Do not call `update_goal(status: complete)` until every completion threshold
  above is satisfied, final handoff evidence is recorded, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-main-changeset-guards.md` passes.
- Do not create hook state for this goal. This file plus the active goal are the
  durable state.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Skill analysis before edits | yes | Loaded `autogoal` and `task`. |
| Active goal checked or created | yes | `get_goal` returned no active goal; created this goal. |
| Source of truth read before edits | yes | Read Better Auth `auto-retarget.yml` and `verify-changesets.yml`; read Plate workflow/helper patterns. |
| Tracker comments and attachments read | no | N/A: chat task, no tracker. |
| Video transcript evidence required | no | N/A: no video evidence. |
| `docs/solutions` checked for non-trivial existing-code work | no | N/A: source pattern is the local Better Auth implementation requested by user. |
| TDD decision before behavior change or bug fix | yes | No red-first TDD; guard behavior will be covered by focused helper/workflow tests. |
| Branch decision for code-changing task | yes | Switched from `codex/test-pr-flow` to `felix-main`, tracking `felix/main`, before edits. |
| Release artifact decision | yes | No changeset: workflow guard only, no package behavior/API change. |
| Browser tool decision for browser surface | no | N/A: no browser surface. |
| PR expectation decision | no | N/A: no PR requested. |
| Tracker sync expectation decision | no | N/A: no tracker. |
| Output budget strategy recorded | yes | Focused reads and tests only. |

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
| Named verification threshold | yes | Run the command, proof, source audit, or artifact check named in this plan | `node --test tooling/scripts/auto-release-pr.test.mjs tooling/scripts/release-workflow.test.mjs` passed with 22 tests; `pnpm lint:fix` passed; final autoreview clean. |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: guard feature, not bug repro. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Parser tests cover patch/minor/major and validation; workflow tests cover retarget and verify guard contracts. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: YAML and JS helper/test changes only. |
| Package exports or file layout changed | no | Run `pnpm brl` before final verification and keep generated barrel updates | N/A: no package exports or barrels changed. |
| Package manifests, lockfile, or install graph changed | no | Run `pnpm install` and relevant package checks | N/A: no manifest or lockfile changes. |
| Agent rules or skills changed | no | Run `pnpm install` and verify generated skill sync | N/A: no agent rule or skill source changed. |
| Workspace authority proof | yes | Run verification in the owning repo/package/app/route/tool and record cwd; do not count the wrong workspace as proof | Commands ran in `/Users/felixfeng/Desktop/repos/plate`. |
| Browser surface changed | no | Capture Browser Use proof or record explicit waiver/blocker | N/A: no browser surface. |
| Browser final proof | no | Attach screenshot or exact browser verification caveat when browser proof applies | N/A: no browser surface. |
| CI-controlled template output changed | no | Restore generated template output or record why it is intentionally kept | N/A: no `templates/**` changes. |
| Package behavior or public API changed | no | Add a changeset or record why no changeset applies | N/A: workflow guard only, no package behavior/API change. |
| Registry-only component work changed | no | Update `tooling/data/plate-ui-changelog.mdx`, run `node tooling/scripts/generate-ui-changelog-entries.mjs --write`, or record N/A | N/A: no registry work. |
| Docs or content changed | no | For docs-heavy work, use `--template docs`; for incidental docs, verify source-backed claims, links, examples, and rendered output or record N/A | N/A: only internal goal plan changed. |
| High-risk mini gate | yes | For public API/runtime/package-boundary/browser/agent-action/command-contract changes, record realistic failure mode, proof plan, and why the chosen boundary is right; otherwise N/A | Failure modes reviewed: `pull_request_target` trust boundary, fork branch-name bypass, promotion pre.json bypass, and accidental patch PR blocking. Fixed and verified. |
| Agent-native review for agent/tooling changes | no | For `.agents/**`, `.claude/**`, `.codex/**`, skills, hooks, commands, prompts, or user-action tooling, load `.agents/skills/agent-native-reviewer/SKILL.md` and close accepted/actionable findings, or record N/A | N/A: no agent-owned files changed. |
| Local install corruption suspected | no | Run `pnpm run reinstall` once, rerun the exact failing command, or record N/A | N/A: no install-corruption signal. |
| Autoreview for non-trivial implementation changes | yes | Load `.agents/skills/autoreview/SKILL.md`; use dirty local `--mode local`, branch/PR `--mode branch --base <base>`, or committed slice `--mode commit --commit <ref>` until no accepted/actionable findings, or record N/A for docs-only/trivial/no local patch | Final autoreview clean. Accepted fixes: pre.json guard before promotion exemption; fork branch names no longer bypass retarget. |
| PR create or update | no | Run `check` before PR work and sync PR body to the task-style final handoff | N/A: no PR requested or created. |
| Task-style PR body verified | no | Verify the PR body with `gh pr view --json body`; it must preserve auto-release blocks when applicable, must not include a current-PR self-link, and must use the kitcn PR #270 emoji format: `🐛 Fixes ...`, `🟢 95-100% confidence`, `Phase / 🧪 Tests / 🌐 Browser` table, and bold emoji Outcome/Caveat/Design/Verified sections | N/A: no PR created. |
| PR proof image hosting | no | If PR body needs browser proof, replace local image paths with hosted GitHub URLs or record N/A | N/A: no PR/browser proof. |
| Tracker sync-back | no | Post concise issue/Linear sync after PR exists, or record N/A/blocker | N/A: chat task, no tracker. |
| Final handoff contract | yes | Fill the final handoff fields below with exact PR/issue/confidence/tests/browser/outcome/caveats/design/verification content or N/A reason | Filled below. |
| Final lint | yes | Run `pnpm lint:fix` or scoped equivalent | `pnpm lint:fix` passed. |
| Output budget discipline | yes | Verify no unbounded high-volume command output was streamed, or record the accidental output and recovery | Outputs were scoped to focused reads/tests/review summaries. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-main-changeset-guards.md` | Running after final plan update. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | done | created plan; read Better Auth guards and Plate helper/workflow patterns | implementation |
| Implementation | done | added auto-retarget and verify workflows; extended parser/tests | verification |
| Verification | done | focused tests, lint, source audit, and autoreview passed | closeout |
| PR / tracker sync | skipped | N/A: no PR/tracker requested | final response |
| Closeout | done | final plan/check next | final response |

Findings:
- Contributor patch PRs should keep targeting `main`.
- Minor/major changeset PRs targeting `main` should be auto-retargeted to `next`.
- CI must still block `minor`/`major`/`.changeset/pre.json` on `main` if retarget fails.

Decisions and tradeoffs:
- Use `pull_request_target` only with default-branch helper checkout and PR file metadata; do not execute PR branch code.
- Do not hard-code `udecode/plate`, so the fork can test the guard.
- Keep `skip-changeset` as the manual escape hatch for package changes that intentionally do not need a package release.

Implementation notes:
- Added `.github/workflows/auto-retarget.yml`.
- Added `.github/workflows/verify-changesets.yml`.
- Extended `tooling/scripts/auto-release-pr.mjs` with exported changeset file validation.
- Added helper and workflow contract coverage in `auto-release-pr.test.mjs` and `release-workflow.test.mjs`.

Review fixes:
- Fixed autoreview finding: `.changeset/pre.json` is checked before `next -> main` promotion exemption.
- Fixed autoreview finding: fork branch names named `next` or `changeset-release/*` cannot bypass auto-retarget.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| `pnpm lint:fix` flagged local regex in helper | 1 | Move regex to top-level constant | Fixed and reran tests/lint. |
| Autoreview found promotion exemption bypassed pre.json guard | 1 | Check files/pre.json before same-repo exemptions | Fixed and reran tests/lint/autoreview. |
| Autoreview found fork branch names could bypass retarget | 1 | Trust branch-name exemptions only for same-repo heads | Fixed and reran tests/lint/autoreview. |

Verification evidence:
- `node --test tooling/scripts/auto-release-pr.test.mjs tooling/scripts/release-workflow.test.mjs` passed with 22 tests.
- `pnpm lint:fix` passed.
- Source audit confirmed `pull_request_target` workflow checks out `github.event.repository.default_branch`.
- Final autoreview clean: no accepted/actionable findings.

Final handoff contract:
- PR line: N/A, no PR created.
- Issue / tracker line: N/A, no tracker.
- Confidence line: high.
- Flow table:
  - Reproduced: N/A, guard feature rather than bug repro.
  - Verified: focused parser/workflow tests, lint, source audit, and autoreview.
- Browser check: N/A, no browser surface.
- Outcome: `main` keeps patch PRs, retargets minor/major to `next`, and blocks non-patch/pre.json if retarget fails.
- Caveat: no GitHub Actions live run and no push/commit yet.
- Design:
  - Chosen boundary: GitHub Actions guard plus shared changeset parser helper.
  - Why not quick patch: shell-only parsing would duplicate existing parser behavior and be harder to test.
  - Why not broader change: docs/version-switcher and release promotion are separate lanes already handled elsewhere.
- Verified: tests/lint/source audit/autoreview.
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
- Caveats: no live Actions run; changes are local on `felix-main`.

Timeline:
- 2026-06-15T13:50:37.376Z Task goal plan created.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Run `check-complete`, mark goal complete, final response |
| What is the goal? | Add main branch PR guards for changeset release lanes. |
| What have I learned? | Guard must preserve patch PR flow while preventing minor/major/pre.json from landing on main; fork branch names cannot be trusted. |
| What have I done? | Implemented workflows/helper tests and verified with tests, lint, source audit, and autoreview. |

Open risks:
- No live GitHub Actions run yet.
- No commit/push yet; changes are local on `felix-main`.
