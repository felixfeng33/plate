# clean beta branch history

Objective:
Clean beta branch history; done when felix/main is clean and felix/next is exactly one beta-init commit ahead; plan docs/plans/2026-06-16-clean-beta-branch-history.md.

Goal plan:
docs/plans/2026-06-16-clean-beta-branch-history.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- agent-native (docs/plans/templates/packs/agent-native.md)

Task source:
- type: chat request
- id / link: current thread
- title: reset fork beta history to clean upstream-shaped state
- acceptance criteria: reset to the initial udecode/plate-shaped state, keep only real beta initialization and workflow changes, and make next only one beta initialization commit ahead of felix-main when no beta Version PR is intentionally retained.

Completion threshold:
- `felix/main` points at a clean base containing the real workflow changes and no test release/change history.
- `felix/next` points at `felix/main` plus exactly one real beta initialization commit.
- `git rev-list --left-right --count felix/main...felix/next` reports `0 1`.
- `git log --oneline felix/main..felix/next` shows only the beta initialization commit.
- Task closure is legal only when the source-of-truth acceptance criteria are
  satisfied or explicitly narrowed, required verification evidence is recorded,
  code-review and release-artifact gates are closed when applicable, tracker/PR
  sync is complete or marked N/A with reason, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-16-clean-beta-branch-history.md` passes.

Verification surface:
- `git fetch felix main next` and commit-count/source audits against `felix/main` and `felix/next`.
- Focused file audits for workflow scripts and beta prerelease state.
- No browser proof; this is branch history/release-workflow plumbing.

Constraints:
- Preserve existing user-facing behavior outside the task scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, comments, commits, or pushes unless the task/user/skill
  requires them.
- Do not add broad ceremony when the task is trivial or docs-only.

Boundaries:
- Source of truth: user request in this thread, current `felix` remote branches, and upstream-shaped `udecode/plate` history available from remotes or local refs.
- Allowed edit scope: local branch pointers and `felix/main` / `felix/next` remote branch pointers; plan file may be updated for evidence.
- Browser surface: N/A, no UI route changed.
- Tracker sync: N/A, no issue/PR tracker item owns this cleanup.
- Non-goals: do not publish npm, do not run release CI, do not keep test changeset/version PR history, do not rewrite upstream `udecode/plate`.

Output budget strategy:
- Use focused `git fetch`, `git log --oneline`, `git show --stat`, `git diff --name-only`, and short `sed` reads. Cap logs to relevant commit ranges; avoid full repo scans and large generated output.

Blocked condition:
- Stop if no trustworthy clean upstream/base ref can be identified, if required workflow commits cannot be isolated, or if `felix` rejects protected/force-with-lease branch updates.

Task state:
- task_type: git branch history cleanup
- task_complexity: non-trivial
- current_phase: closeout
- current_phase_status: complete
- next_phase: final response
- goal_status: active

Current verdict:
- verdict: complete
- confidence: high
- next owner: user
- reason: remote `felix/main...felix/next` reads back as `0 1`, with only `.changeset/pre.json` on `next`.

Completion rule:
- Do not call `update_goal(status: complete)` while any required checklist item
  remains unchecked. If an item does not apply, check it and add `N/A: <reason>`.
- Do not call `update_goal(status: complete)` until every completion threshold
  above is satisfied, final handoff evidence is recorded, and
  `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-16-clean-beta-branch-history.md` passes.
- Do not create hook state for this goal. This file plus the active goal are the
  durable state.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Skill analysis before edits | yes | Loaded `autogoal` and `task`; used one-shot execution. |
| Active goal checked or created | yes | `get_goal` returned no active goal; creating goal from this plan before branch edits |
| Source of truth read before edits | yes | Current thread request plus repo AGENTS context and relevant memory entry were read |
| Tracker comments and attachments read | no | N/A: chat request, no tracker source. |
| Video transcript evidence required | no | N/A: no video evidence. |
| `docs/solutions` checked for non-trivial existing-code work | no | N/A: branch-history cleanup, relevant memory entry checked instead. |
| TDD decision before behavior change or bug fix | no | N/A: no product behavior change; used existing release workflow tests. |
| Branch decision for code-changing task | yes | Created local clean refs `codex/clean-fork-main` and `codex/clean-fork-next`; force-pushed them to `felix/main` and `felix/next`. |
| Release artifact decision | yes | No changeset/publish; release workflows ran and skipped publish/artifact steps. |
| Browser tool decision for browser surface | no | N/A: no browser/UI surface. |
| PR expectation decision | yes | No PR; user asked direct cleanup/reset. Open PR list after push was empty. |
| Tracker sync expectation decision | no | N/A: no tracker. |
| Output budget strategy recorded | yes | Focused git/file audits only; capped logs and no broad scans |
| Agent-native pack selected | no | N/A: current task changes branch history, not agent-facing rules; pack was over-selected and rows are waived |
| Agent-facing action surface identified | no | N/A: no agent action surface should change |
| Source rule versus generated mirror boundary identified | no | N/A: no `.agents/rules/**` or generated skill mirror edits planned |
| `agent-native-reviewer` loaded or waiver recorded | no | N/A: no agent/tooling source edits planned |

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
      is recorded with reason. Used branch refs/commit-tree cleanup rather than editing package/version files.
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
      implementation work, or marked N/A with reason. N/A: this task rewrote branch history using already-tested workflow file states; targeted tests and live workflow runs are the owning proof.
- [x] Agent-native review decision recorded for `.agents/**`, `.claude/**`,
      `.codex/**`, skills, hooks, commands, prompts, or user-action tooling.
- [x] Output budget discipline recorded and followed: broad searches are
      scoped, capped, counted, or artifacted instead of streamed into goal
      context.
- [x] Agent-native pack: source-of-truth rule files are edited instead of generated skill mirrors. N/A: no agent source edits.
- [x] Agent-native pack: the changed agent action is discoverable from the skill/rule text. N/A: no agent action changed.
- [x] Agent-native pack: generated mirrors are synced when `.agents/rules/**` changed, or N/A reason is recorded.
- [x] Agent-native pack: accepted agent-native review findings are fixed or explicitly rejected with reason. N/A: no agent-native review applies.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the command, proof, source audit, or artifact check named in this plan | `git rev-list --left-right --count felix/main...felix/next` -> `0 1`; `git log felix/main..felix/next` -> only `fad6b814ec chore: enter beta prerelease mode`. |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: not a bug repro task. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `node --test tooling/scripts/release-workflow.test.mjs tooling/scripts/auto-release-pr.test.mjs tooling/scripts/prepare-release-changesets.test.mjs` -> 31 pass. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: no TypeScript or typed config authored in this task. |
| Package exports or file layout changed | no | Run `pnpm brl` before final verification and keep generated barrel updates | N/A: no package exports or barrels. |
| Package manifests, lockfile, or install graph changed | yes | Run relevant package/workflow checks | `package.json` release scripts restored from verified workflow state; targeted Node workflow tests passed. |
| Agent rules or skills changed | no | Run `pnpm install` and verify generated skill sync | N/A: no `.agents/rules/**` edits. |
| Workspace authority proof | yes | Run verification in owning repo/tool | All git, tests, and `gh` checks ran in `/Users/felixfeng/Desktop/repos/plate` against `felixfeng33/plate`. |
| Browser surface changed | no | Capture Browser Use proof or record explicit waiver/blocker | N/A: no browser surface. |
| Browser final proof | no | Attach screenshot or exact browser verification caveat when browser proof applies | N/A: no browser surface. |
| CI-controlled template output changed | no | Restore generated template output or record why intentionally kept | N/A: no template output included in clean branch commits. |
| Package behavior or public API changed | no | Add a changeset or record why no changeset applies | N/A: release workflow cleanup only; no package runtime/API change. |
| Registry-only component work changed | no | Update registry changelog or record N/A | N/A: no registry component work. |
| Docs or content changed | no | Verify source-backed claims or record N/A | N/A: no docs/content pushed to cleaned branches. |
| High-risk mini gate | yes | Record realistic failure mode, proof plan, and chosen boundary | Risk: force push could retain test history or trigger release PR. Proof: force-with-lease used; remote readback `0 1`; open PR list empty; ReleaseOrVersionPR runs for `main` and `next` succeeded with publish/artifact steps skipped. |
| Agent-native review for agent/tooling changes | no | Load reviewer or record N/A | N/A: no agent/tooling source changed in cleaned branches. |
| Local install corruption suspected | no | Run reinstall/rerun or record N/A | N/A: tests passed; no local-corruption failure. |
| Autoreview for non-trivial implementation changes | no | Run autoreview or record N/A | N/A: no new implementation authored; branch reset composed previously verified workflow state and was proven by targeted tests plus live workflow runs. |
| PR create or update | no | Run check before PR work and sync PR body | N/A: direct branch reset requested; no PR created. |
| Task-style PR body verified | no | Verify PR body with `gh pr view --json body` | N/A: no PR. |
| PR proof image hosting | no | Host browser proof images or record N/A | N/A: no PR/browser image. |
| Tracker sync-back | no | Post issue/Linear sync or record N/A | N/A: no tracker. |
| Final handoff contract | yes | Fill final handoff fields below | Filled below. |
| Final lint | no | Run lint fix or scoped equivalent | N/A: no source formatting changes authored in worktree; targeted workflow tests are the relevant check. |
| Output budget discipline | yes | Verify no unbounded high-volume command output was streamed | Used focused logs/diffs; one branch ref listing was capped with `sed -n`. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-16-clean-beta-branch-history.md` | Run after evidence update; expected pass once closeout phase is complete. |
| Agent source / generated sync | no | Run `pnpm install` when `.agents/rules/**` changed and verify generated mirrors | N/A: no agent source changed. |
| Agent action discoverability | no | Source-audit skill/rule path | N/A: no agent action changed. |
| Agent-native review | no | Load reviewer and close accepted findings, or N/A | N/A: no agent-native change. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read current request, repo AGENTS, relevant memory entry, remote logs/diffs. | implementation |
| Implementation | complete | Created `codex/clean-fork-main` and `codex/clean-fork-next`; pushed to `felix/main` and `felix/next` with force-with-lease. | verification |
| Verification | complete | Remote readback `0 1`, targeted tests passed, ReleaseOrVersionPR `main` and `next` succeeded. | closeout |
| PR / tracker sync | complete | N/A: no PR/tracker; open PR list empty. | final response |
| Closeout | complete | Plan evidence updated and ready for mechanical checker. | final response |

Findings:
- Local `main` at `dd016bb8a0` is the original upstream-shaped base used for this cleanup; current upstream `udecode/main` has moved forward and was intentionally not mixed in.
- Old `felix/main` contained test release history (`#7/#9/#11/#12/#15/#16`) that should not survive.
- Clean `felix/main` differs from local base only by workflow/script/test release plumbing files.
- Clean `felix/next` differs from clean `felix/main` only by `.changeset/pre.json`.

Decisions and tradeoffs:
- Used commit-tree/index composition instead of cherry-picking whole commits, because prior workflow commits included `docs/plans` run logs and test package version history.
- Did not sync current `udecode/main`, because the user asked to return to the initial upstream-shaped state, not to import unrelated newer upstream releases/features.

Implementation notes:
- `codex/clean-fork-main` -> `8b4f1fa4e196ad932092d7abe0e1214d9a8bdb71`.
- `codex/clean-fork-next` -> `fad6b814ec265636804a95bdd9ced4c23cae2faa`.
- Forced `felix/main` from `d1d14ecb1163779ff786b5dbdcd4f4b92f2364c603d4b2abe40`? Correction: actual old ref was `d1d14ecb1163779ff786b5dbdcd4f4cb8db861b6` to `8b4f1fa4e196ad932092d7abe0e1214d9a8bdb71`.
- Forced `felix/next` from `be6cf3ba89b13ceceffef7f3d15fc67d1637e682` to `fad6b814ec265636804a95bdd9ced4c23cae2faa`.

Review fixes:
- N/A: no review findings in this cleanup slice.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None | 0 | N/A | N/A |

Verification evidence:
- `node --test tooling/scripts/release-workflow.test.mjs tooling/scripts/auto-release-pr.test.mjs tooling/scripts/prepare-release-changesets.test.mjs` in `/Users/felixfeng/Desktop/repos/plate` -> 31 pass.
- `git push felix --force-with-lease=main:<old> codex/clean-fork-main:main --force-with-lease=next:<old> codex/clean-fork-next:next` -> forced update succeeded.
- `git fetch felix main next --prune && git rev-list --left-right --count felix/main...felix/next` -> `0 1`.
- `git log --oneline felix/main..felix/next` -> `fad6b814ec chore: enter beta prerelease mode`.
- `git diff --name-status felix/main..felix/next` -> only `A .changeset/pre.json`.
- `gh pr list --repo felixfeng33/plate --state open` -> no open PRs.
- `gh run watch 27589902338 --exit-status` -> `main` ReleaseOrVersionPR success; publish/release artifact steps skipped; sync job success.
- `gh run view 27589902350` -> `next` ReleaseOrVersionPR completed success; sync and artifact jobs skipped.

Final handoff contract:
- PR line: N/A, direct branch reset requested.
- Issue / tracker line: N/A.
- Confidence line: high.
- Flow table:
  - Reproduced: N/A, branch history cleanup.
  - Verified: targeted workflow tests passed; remote branch count/diff verified; browser N/A.
- Browser check: N/A.
- Outcome: `felix/main` clean, `felix/next` exactly one beta init commit ahead.
- Caveat: ordinary CI runs for push events may still be in progress; ReleaseOrVersionPR is already green.
- Design:
  - Chosen boundary: rewrite fork branch refs to clean commits.
  - Why not quick patch: patching current `next` would preserve test history.
  - Why not broader change: syncing current upstream `udecode/main` would import unrelated new upstream work.
- Verified: remote readback, targeted tests, workflow runs, open PR check.
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
- Caveats: ordinary CI still in progress at last run-list check; release workflows succeeded.

Timeline:
- 2026-06-16T02:22:33.172Z Task goal plan created.
- 2026-06-16 Remote/history audit found old test release history on `felix/main` and 16 extra `next` commits.
- 2026-06-16 Built clean commits with temporary indexes and updated local refs `codex/clean-fork-main` / `codex/clean-fork-next`.
- 2026-06-16 Targeted Node workflow tests passed on clean main.
- 2026-06-16 Force-with-lease pushed clean refs to `felix/main` and `felix/next`.
- 2026-06-16 Remote readback verified `0 1`; open PR list empty; ReleaseOrVersionPR runs succeeded.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Final response |
| Where am I going? | Final response |
| What is the goal? | Clean beta branch history so `felix/next` is exactly one beta init commit ahead of clean `felix/main`. |
| What have I learned? | Current upstream moved; using local original main is the right cleanup base for this request. |
| What have I done? | Force-with-lease reset `felix/main` and `felix/next`, verified remote state and release workflows. |

Open risks:
- Ordinary CI runs from the force-push were still in progress at last check; ReleaseOrVersionPR, the risky lane for accidental version/publish behavior, already succeeded.
