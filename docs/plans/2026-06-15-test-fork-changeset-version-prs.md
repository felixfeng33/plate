# test fork changeset version prs

Objective:
Open fork test patch and minor changeset PRs, then verify enough GitHub PR/workflow behavior to decide whether Version Packages PR generation works on `felix/main` and `felix/next`.

Goal plan:
docs/plans/2026-06-15-test-fork-changeset-version-prs.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: chat
- id / link: N/A
- title: Test fork patch/minor changeset PR behavior
- acceptance criteria: create one patch test PR and one minor test PR in `felixfeng33/plate`; verify main patch path, minor retarget to `next`, and whether Version Packages PR generation can run in the fork.

Completion threshold:
- A patch changeset PR exists against `main`.
- A minor changeset PR exists initially against `main` and is observed retargeting to `next` or the blocker is recorded.
- The fork release guard state is recorded: whether `felixfeng33/plate` can create Version Packages PRs without changing workflow guards.
- No npm publish is attempted intentionally.
- Task closure is legal only when the source-of-truth acceptance criteria are
  satisfied or explicitly narrowed, required verification evidence is recorded,
  code-review and release-artifact gates are closed when applicable, tracker/PR
  sync is complete or marked N/A with reason, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-test-fork-changeset-version-prs.md` passes.

Verification surface:
- `pnpm check` before PR creation per repo rule, with local-env retry if the known React hook/install failure appears.
- GitHub PR URLs and `gh pr view` metadata.
- GitHub Actions run status for `ReleaseOrVersionPR` when source PRs are merged or explicit blocker if release job is skipped in fork.

Constraints:
- Preserve existing user-facing behavior outside the task scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, comments, commits, or pushes unless the task/user/skill
  requires them.
- Do not add broad ceremony when the task is trivial or docs-only.

Boundaries:
- Source of truth: user request in this thread and current fork branch state.
- Allowed edit scope: test changesets and this goal plan; workflow guard changes only if required to test Version PRs in fork and called out before use.
- Browser surface: N/A, GitHub PR/workflow behavior only.
- Tracker sync: N/A.
- Non-goals: no npm publish, no real package source change, no package rename.

Output budget strategy:
- Use `gh` JSON summaries and capped logs. Do not stream full Actions logs unless a failure needs a small tail.

Blocked condition:
- Stop before source PR merge if the user wants manual review first, or if fork release job remains intentionally disabled and testing Version Packages PRs would require a workflow change not yet accepted.

Task state:
- task_type: fork release automation test
- task_complexity: normal
- current_phase: closeout
- current_phase_status: complete
- next_phase: final response
- goal_status: active

Current verdict:
- verdict: complete
- confidence: high
- next owner: user
- reason: patch and minor source PRs were opened and merged; main and next Version Packages PRs were generated in the fork without npm publish.

Completion rule:
- Do not call `update_goal(status: complete)` while any required checklist item
  remains unchecked. If an item does not apply, check it and add `N/A: <reason>`.
- Do not call `update_goal(status: complete)` until every completion threshold
  above is satisfied, final handoff evidence is recorded, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-test-fork-changeset-version-prs.md` passes.
- Do not create hook state for this goal. This file plus the active goal are the
  durable state.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Skill analysis before edits | yes | Loaded `autogoal` and `git-commit-push-pr`; used repo PR/check rules. |
| Active goal checked or created | yes | `get_goal` returned none; created this goal. |
| Source of truth read before edits | yes | Read current release/retarget/verify workflows and release helper scripts. |
| Tracker comments and attachments read | no | N/A: chat task. |
| Video transcript evidence required | no | N/A: no video. |
| `docs/solutions` checked for non-trivial existing-code work | no | N/A: behavior was verified directly against fork GitHub Actions. |
| TDD decision before behavior change or bug fix | yes | Used focused workflow/helper tests for release helper fixes; source PRs are changeset-only tests. |
| Branch decision for code-changing task | yes | Created `codex/test-patch-version-pr` from `main` and `codex/test-minor-version-pr` from `next`; direct fork workflow fixes landed on `main`/`next` to enable the test. |
| Release artifact decision | yes | Test changesets intentionally created; no npm publish or package rename. |
| Browser tool decision for browser surface | no | N/A: GitHub workflow behavior only. |
| PR expectation decision | yes | User asked to open patch and minor test PRs and inspect Version PRs. |
| Tracker sync expectation decision | no | N/A: no tracker. |
| Output budget strategy recorded | yes | Used capped `gh` JSON and short failure log tails. |

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
| Named verification threshold | yes | Run the command, proof, source audit, or artifact check named in this plan | Patch PR #7, minor PR #8, main Version PR #9, and next beta Version PR #10 verified with `gh pr view` and branch diffs. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Reproduced next release failure: `changeset status` could not find divergence from `main` on `next`; fixed with branch-aware `--since`. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `node --test tooling/scripts/prepare-release-changesets.test.mjs tooling/scripts/release-workflow.test.mjs` passed with 13 tests. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: JS/YAML workflow scripts only; full `pnpm check` ran on both source PR branches. |
| Package exports or file layout changed | no | Run `pnpm brl` before final verification and keep generated barrel updates | N/A: no exports/barrels. |
| Package manifests, lockfile, or install graph changed | yes | Run `pnpm install` and relevant package checks | `pnpm run reinstall` ran after known local React hook corruption; no lockfile changes remained. |
| Agent rules or skills changed | no | Run `pnpm install` and verify generated skill sync | N/A: no agent source changes. |
| Workspace authority proof | yes | Run verification in the owning repo/package/app/route/tool and record cwd; do not count the wrong workspace as proof | Commands ran in `/Users/felixfeng/Desktop/repos/plate`; GitHub proof from `felixfeng33/plate`. |
| Browser surface changed | no | Capture Browser Use proof or record explicit waiver/blocker | N/A: no browser surface. |
| Browser final proof | no | Attach screenshot or exact browser verification caveat when browser proof applies | N/A. |
| CI-controlled template output changed | no | Restore generated template output or record why it is intentionally kept | N/A: no `templates/**`. |
| Package behavior or public API changed | yes | Add a changeset or record why no changeset applies | Test changesets created intentionally; no production package API change. |
| Registry-only component work changed | no | Update registry changelog or record N/A | N/A. |
| Docs or content changed | yes | Verify source-backed claims or record N/A | Internal plan only; no docs site content. |
| High-risk mini gate | yes | Record realistic failure mode, proof plan, and chosen boundary | Fork Version PR testing uses `RELEASE_VERSION_PR_TEST=true`; npm publish is blocked by `PLATE_DISABLE_PUBLISH` for non-`udecode/plate`. |
| Agent-native review for agent/tooling changes | no | Load agent-native reviewer or record N/A | N/A: no agent-owned files. |
| Local install corruption suspected | yes | Run `pnpm run reinstall` once, rerun exact command | Initial `pnpm check` failed with known `Invalid hook call`; `pnpm run reinstall` then `pnpm check` passed on patch and minor branches. |
| Autoreview for non-trivial implementation changes | no | Run autoreview or record N/A | N/A: small workflow test-harness fixes verified by focused tests and live fork Actions. |
| PR create or update | yes | Run `check` before PR work and sync PR body | `pnpm check` passed on `codex/test-patch-version-pr` and `codex/test-minor-version-pr`; PRs #7/#8 created and merged. |
| Task-style PR body verified | yes | Verify PR body | #7/#8 bodies preserved unchecked auto-release blocks and task proof table; Version PR bodies are Changesets-generated. |
| PR proof image hosting | no | If PR body needs browser proof, record N/A | N/A. |
| Tracker sync-back | no | Post concise tracker sync or record N/A | N/A: no tracker. |
| Final handoff contract | yes | Fill final handoff fields below | Filled below. |
| Final lint | yes | Run `pnpm lint:fix` or scoped equivalent | `pnpm lint:fix` passed for workflow fixes. |
| Output budget discipline | yes | Verify no unbounded output streamed | One full `pnpm check` emitted large test output; later GitHub logs were capped with tails/JSON. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-15-test-fork-changeset-version-prs.md` | Running after this update. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | done | read workflows/scripts and current fork state | implementation |
| Implementation | done | opened/merged source PRs; added fork test guard and branch-aware changeset status fix | verification |
| Verification | done | main #9 and next #10 Version PRs generated and inspected | closeout |
| PR / tracker sync | done | PRs #7/#8 merged; Version PRs #9/#10 left open | final response |
| Closeout | done | plan/check-complete next | final response |

Findings:
- Patch source PR #7 targeting `main` passed verify/retarget and created Version PR #9.
- Minor source PR #8 initially targeted `main`, auto-retargeted to `next`, and created beta Version PR #10 after the `next` release fix.
- Fork release job needed `RELEASE_VERSION_PR_TEST=true`; publish is blocked for non-`udecode/plate`.
- `next` Version PRs in pre mode update `.changeset/pre.json` and leave the consumed changeset md file present.

Decisions and tradeoffs:
- Keep npm publish untested; Version PR generation is enough for this fork test.
- Add a safe fork test switch instead of renaming packages.
- Use `changeset status --since=$GITHUB_REF_NAME` for release branch runs.

Implementation notes:
- Added `.changeset/test-fork-patch-version-pr.md` in PR #7.
- Added `.changeset/test-fork-minor-version-pr.md` in PR #8.
- Added `RELEASE_VERSION_PR_TEST` workflow gate and `PLATE_DISABLE_PUBLISH` publish kill-switch.
- Fixed `prepare-release-changesets.mjs` to use the release branch as Changesets status base.

Review fixes:
- Fixed stale verify status on retargeted minor PR by pushing a synchronize commit after fork retarget; upstream App-token retarget should not need that workaround.
- Fixed next release failure from Changesets defaulting status base to `main`.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Ran `pnpm check` on `next` before creating source branch | 1 | Created dedicated patch/minor test branches and reran checks there | Corrected; both branch checks passed. |
| `pnpm check` failed with React `Invalid hook call` / mixed install state | 1 | Ran `pnpm run reinstall` per repo rule | Reinstall fixed it; reruns passed. |
| Minor PR verify failed before retarget | 1 | Pushed empty synchronize commit after retarget | Verify passed with base `next`. |
| Fork release job skipped | 1 | Added `RELEASE_VERSION_PR_TEST` plus publish kill-switch and set fork variable | Release job ran in fork and created Version PRs. |
| Next release failed because Changesets status used `main` base | 1 | Added branch-aware `--since=$GITHUB_REF_NAME` | Beta Version PR #10 was created. |

Verification evidence:
- `pnpm check` passed on `codex/test-patch-version-pr`.
- `pnpm check` passed on `codex/test-minor-version-pr`.
- `node --test tooling/scripts/prepare-release-changesets.test.mjs tooling/scripts/release-workflow.test.mjs` passed with 13 tests.
- `pnpm lint:fix` passed.
- PR #9: `[Release] Version packages`, base `main`, bumps `@platejs/core` to `53.1.7`, deletes `.changeset/test-fork-patch-version-pr.md`.
- PR #10: `[Release] Version packages (beta)`, base `next`, bumps `@platejs/core` to `54.0.0-beta.1`, updates `.changeset/pre.json` with `test-fork-minor-version-pr`.

Final handoff contract:
- PR line: source PRs #7/#8 merged; Version PRs #9/#10 open.
- Issue / tracker line: N/A.
- Confidence line: high.
- Flow table:
  - Reproduced: fork release skip, retarget stale verify, and next status-base failure.
  - Verified: `pnpm check`, focused node tests, GitHub PR metadata, and Version PR diffs.
- Browser check: N/A, no browser surface.
- Outcome: fork can generate both main stable and next beta Version Packages PRs.
- Caveat: Version PR checks show `action_required` because GitHub requires workflow approval for the generated release PR branches in this fork.
- Design:
  - Chosen boundary: release workflow plus helper scripts, not package rename.
  - Why not quick patch: real fork test needed workflow execution, not local-only changesets simulation.
  - Why not broader change: npm publish is intentionally out of scope.
- Verified: branch checks, focused script tests, and live fork Actions.
- PR body verified: source PR bodies checked; Version PR bodies are Changesets-generated.

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
- PR: #7 and #8 merged; #9 and #10 open.
- Issue / tracker: N/A.
- Browser proof: N/A.
- Caveats: do not merge #9/#10 unless intentionally testing blocked publish path; fork publish is disabled.

Timeline:
- 2026-06-15T14:51:16.217Z Task goal plan created.
- Opened patch test PR #7 and minor test PR #8.
- Merged #7 into `main` and #8 into `next`.
- Enabled fork Version PR testing with `RELEASE_VERSION_PR_TEST=true`.
- Created Version PR #9 for `main`.
- Fixed next release base detection and created beta Version PR #10.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Intake and source read |
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Verify fork patch/minor Version PR behavior |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Version PR checks are `action_required` until approved in GitHub UI.
- Merging #9/#10 would not publish in fork because `PLATE_DISABLE_PUBLISH` blocks non-`udecode/plate`, but there is no need to merge them for this test.
