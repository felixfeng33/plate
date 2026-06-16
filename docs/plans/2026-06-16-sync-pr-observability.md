# sync pr observability

Objective:
Make main-to-next sync PRs auditable: PR body shows resolver decisions and CI verifies metadata resolution safety.

Goal plan:
docs/plans/2026-06-16-sync-pr-observability.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: chat request
- id / link: local thread
- title: Add observability for main -> next sync resolver
- acceptance criteria: sync PR body names resolver decisions; a sync PR check verifies no conflict markers, beta versions preserved, stable changelogs inserted, and package manifests avoid third-state edits.

Completion threshold:
- `tooling/scripts/release-branch-prs.mjs` records main -> next resolver decisions and can verify a sync merge commit.
- Sync PR body includes the resolver report.
- A pull_request workflow runs the verifier for `sync/main-to-next` PRs into `next`.
- Unit tests cover the report and verifier behavior.
- Task closure is legal only when the source-of-truth acceptance criteria are
  satisfied or explicitly narrowed, required verification evidence is recorded,
  code-review and release-artifact gates are closed when applicable, tracker/PR
  sync is complete or marked N/A with reason, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-16-sync-pr-observability.md` passes.

Verification surface:
- `node --test tooling/scripts/release-workflow.test.mjs`
- `pnpm lint:fix`
- `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-16-sync-pr-observability.md`

Constraints:
- Preserve existing user-facing behavior outside the task scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, comments, commits, or pushes unless the task/user/skill
  requires them.
- Do not add broad ceremony when the task is trivial or docs-only.

Boundaries:
- Source of truth: `tooling/scripts/release-branch-prs.mjs`, `.github/workflows/release.yml`, `.github/workflows/verify-changesets.yml`, current sync PR evidence.
- Allowed edit scope: release branch PR tooling, release workflow tests, sync verification workflow, goal plan.
- Browser surface: N/A, release automation only.
- Tracker sync: N/A, no issue tracker requested.
- Non-goals: no npm publish, no release PR merge, no beta docs switcher work.

Output budget strategy:
- Use scoped `sed`/`rg` reads only for release tooling, workflows, and relevant docs/solutions. Cap command output and avoid broad history dumps.

Blocked condition:
- Blocked only if local tests expose unrelated repo-wide install corruption that persists after the documented reinstall retry, or if GitHub workflow semantics require a remote-only secret/path not visible from repo source.

Task state:
- task_type: release automation tooling
- task_complexity: medium
- current_phase: implementation
- current_phase_status: in_progress
- next_phase: verification
- goal_status: active

Current verdict:
- verdict: implement
- confidence: medium-high
- next owner: task
- reason: Current resolver works but needs audit output and an independent PR check before it deserves trust.

Completion rule:
- Do not call `update_goal(status: complete)` while any required checklist item
  remains unchecked. If an item does not apply, check it and add `N/A: <reason>`.
- Do not call `update_goal(status: complete)` until every completion threshold
  above is satisfied, final handoff evidence is recorded, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-16-sync-pr-observability.md` passes.
- Do not create hook state for this goal. This file plus the active goal are the
  durable state.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Skill analysis before edits | yes | read `autogoal`, `task`, and `autoreview` skill instructions relevant to this task |
| Active goal checked or created | yes | `get_goal` returned none; created active goal for sync PR observability |
| Source of truth read before edits | yes | read `tooling/scripts/release-branch-prs.mjs`, `tooling/scripts/release-workflow.test.mjs`, `.github/workflows/release.yml` sync job |
| Tracker comments and attachments read | no | chat-only task; no tracker |
| Video transcript evidence required | no | no video evidence |
| `docs/solutions` checked for non-trivial existing-code work | yes | scoped `rg` and read release docs solution; no main->next resolver audit runbook exists |
| TDD decision before behavior change or bug fix | yes | add unit tests with the implementation |
| Branch decision for code-changing task | yes | continue current checkout; no PR requested |
| Release artifact decision | yes | N/A: tooling/workflow change only, no package release changeset |
| Browser tool decision for browser surface | no | release automation only |
| PR expectation decision | yes | no PR requested in this turn |
| Tracker sync expectation decision | no | no tracker |
| Output budget strategy recorded | yes | scoped reads and capped outputs recorded above |

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
| Named verification threshold | yes | Run the command, proof, source audit, or artifact check named in this plan | `node --test tooling/scripts/release-workflow.test.mjs`; `pnpm lint:fix`; real #31 verifier run |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: hardening task, not a bug repro |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `node tooling/scripts/release-branch-prs.mjs verify-main-to-next-sync --commit FETCH_HEAD` passed against felix PR #31 |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: JavaScript workflow tooling and YAML only |
| Package exports or file layout changed | no | Run `pnpm brl` before final verification and keep generated barrel updates | N/A: no package exports or file layout changed |
| Package manifests, lockfile, or install graph changed | no | Run `pnpm install` and relevant package checks | N/A: no manifests or lockfile changed |
| Agent rules or skills changed | no | Run `pnpm install` and verify generated skill sync | N/A: no `.agents` source changed |
| Workspace authority proof | yes | Run verification in the owning repo/package/app/route/tool and record cwd; do not count the wrong workspace as proof | all commands ran in `/Users/felixfeng/Desktop/repos/plate` |
| Browser surface changed | no | Capture Browser Use proof or record explicit waiver/blocker | N/A: release automation only |
| Browser final proof | no | Attach screenshot or exact browser verification caveat when browser proof applies | N/A: no browser surface |
| CI-controlled template output changed | no | Restore generated template output or record why it is intentionally kept | N/A: no template output changed |
| Package behavior or public API changed | no | Add a changeset or record why no changeset applies | N/A: no package runtime/API change |
| Registry-only component work changed | no | Update `tooling/data/plate-ui-changelog.mdx`, run `node tooling/scripts/generate-ui-changelog-entries.mjs --write`, or record N/A | N/A: not registry work |
| Docs or content changed | no | For docs-heavy work, use `--template docs`; for incidental docs, verify source-backed claims, links, examples, and rendered output or record N/A | N/A: only goal plan bookkeeping changed |
| High-risk mini gate | yes | For public API/runtime/package-boundary/browser/agent-action/command-contract changes, record realistic failure mode, proof plan, and why the chosen boundary is right; otherwise N/A | failure mode: bad resolver hides metadata damage; proof: unit tests plus real #31 verifier; boundary: release PR tooling and sync workflow |
| Agent-native review for agent/tooling changes | no | For `.agents/**`, `.claude/**`, `.codex/**`, skills, hooks, commands, prompts, or user-action tooling, load `.agents/skills/agent-native-reviewer/SKILL.md` and close accepted/actionable findings, or record N/A | N/A: GitHub workflow/release script, not agent tooling |
| Local install corruption suspected | no | Run `pnpm run reinstall` once, rerun the exact failing command, or record N/A | N/A: no install-corruption signal |
| Autoreview for non-trivial implementation changes | yes | Load `.agents/skills/autoreview/SKILL.md`; use dirty local `--mode local`, branch/PR `--mode branch --base <base>`, or committed slice `--mode commit --commit <ref>` until no accepted/actionable findings, or record N/A for docs-only/trivial/no local patch | `.agents/skills/autoreview/scripts/autoreview --mode local` blocked by Codex config `service_tier=priority`; manual review found and fixed conflict-marker regex gap |
| PR create or update | no | Run `check` before PR work and sync PR body to the task-style final handoff | N/A: no PR requested |
| Task-style PR body verified | no | Verify the PR body with `gh pr view --json body`; it must preserve auto-release blocks when applicable, must not include a current-PR self-link, and must use the kitcn PR #270 emoji format: `🐛 Fixes ...`, `🟢 95-100% confidence`, `Phase / 🧪 Tests / 🌐 Browser` table, and bold emoji Outcome/Caveat/Design/Verified sections | N/A: no PR created |
| PR proof image hosting | no | If PR body needs browser proof, replace local image paths with hosted GitHub URLs or record N/A | N/A: no PR/browser proof image |
| Tracker sync-back | no | Post concise issue/Linear sync after PR exists, or record N/A/blocker | N/A: no tracker |
| Final handoff contract | yes | Fill the final handoff fields below with exact PR/issue/confidence/tests/browser/outcome/caveats/design/verification content or N/A reason | final handoff fields filled below |
| Final lint | yes | Run `pnpm lint:fix` or scoped equivalent | `pnpm lint:fix` passed |
| Output budget discipline | yes | Verify no unbounded high-volume command output was streamed, or record the accidental output and recovery | scoped `sed`, `rg`, and capped command outputs only |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-16-sync-pr-observability.md` | passed |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | source files, workflow, relevant solution doc read | implementation |
| Implementation | complete | release script report/verifier plus workflow added | verification |
| Verification | complete | target test, lint, real #31 verifier passed | closeout |
| PR / tracker sync | complete | N/A: no PR/tracker requested | final response |
| Closeout | complete | plan finalized for checker | final response |

Findings:
- Existing resolver keeps next package versions, keeps `.changeset/pre.json` from next, and merges stable changelog sections deterministically.
- Better Auth keeps main -> next conflict resolution manual; Plate is intentionally stricter because package metadata conflicts are predictable and testable.

Decisions and tradeoffs:
- Keep automatic release metadata resolution, but make it auditable in the PR body and re-check it in CI.
- Do not add comments yet; PR body is less noisy and gets updated with the branch.

Implementation notes:
- None yet.

Review fixes:
- Manual review found conflict marker detection missed bare `=======`; fixed regex and added regression test.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None yet | 0 | | |

Verification evidence:
- `node --test tooling/scripts/release-workflow.test.mjs`: 17 tests passed.
- `pnpm lint:fix`: passed, no fixes applied after final code.
- `git fetch felix pull/31/head && node tooling/scripts/release-branch-prs.mjs verify-main-to-next-sync --commit FETCH_HEAD`: passed; reported `packages/basic-nodes/CHANGELOG.md` inserted `53.1.9` and `packages/basic-nodes/package.json` kept `53.2.0-beta.0`.
- `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-16-sync-pr-observability.md`: passed.

Final handoff contract:
- PR line: N/A, no PR requested.
- Issue / tracker line: N/A, no tracker.
- Confidence line: high after tests plus real #31 proof.
- Flow table:
  - Reproduced: N/A hardening task, browser N/A
  - Verified: tests passed, browser N/A
- Browser check: N/A, release automation only.
- Outcome: sync PRs now expose resolver decisions and get a dedicated metadata verification check.
- Caveat: autoreview helper blocked by local Codex config; manual review performed and caught one real issue.
- Design:
  - Chosen boundary: `release-branch-prs.mjs` owns resolver decisions; workflow owns PR-time check.
  - Why not quick patch: comments without verification would still require blind trust.
  - Why not broader change: no need to replace release flow or make Better Auth-style manual conflicts the default.
- Verified: target test, lint, and real #31 verifier pass.
- PR body verified: N/A, no PR created; helper body covered by unit test.

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
- Caveats: autoreview helper blocked by local Codex config; no browser surface.

Timeline:
- 2026-06-16T03:38:22.532Z Task goal plan created.
- 2026-06-16T03:42:00Z Source read complete; implementation started.
- 2026-06-16T04:02:00Z Implementation, tests, lint, real #31 verifier, and plan closeout completed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Intake and source read |
| Where am I going? | Implementation, verification, PR/tracker sync, closeout |
| What is the goal? | Make sync PR resolver decisions visible and independently verified |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- The package manifest verifier intentionally rejects third-state manifest merges. That is conservative; if a future sync genuinely needs to combine unrelated manifest field changes from both parents, the check should fail and force a human resolution instead of silently guessing.
