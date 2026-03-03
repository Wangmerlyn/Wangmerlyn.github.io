# Add software-agent-sdk Contribution

## Background
The Projects page already lists open-source contributions, and the user requested one additional item based on merged PRs in `OpenHands/software-agent-sdk`.

## Goal
Add one new open-source contribution entry with accurate links to merged PRs authored by Wangmerlyn.

## Solution
- Query merged PRs with GitHub CLI.
- Add one `ProjectItem` in `Open-source Contributions` for `OpenHands software-agent-sdk`.
- Include merged PR links using the existing `prs` field.

## Todo
- [x] Collect merged PRs from `OpenHands/software-agent-sdk`.
- [x] Create/update planning artifacts.
- [x] Update `src/data/projects.ts` with the new contribution item.
- [x] Run `pnpm check`.
- [x] Push branch and open PR.
- [x] Address Gemini/CodeRabbit comments.
- [ ] Squash merge.
