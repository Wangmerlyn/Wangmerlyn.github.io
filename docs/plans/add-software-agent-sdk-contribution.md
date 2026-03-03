# Add software-agent-sdk Contribution

## Background
The Projects page already lists Open Source contributions, and the user requested one additional item based on merged PRs in `OpenHands/software-agent-sdk`.

## Goal
Add one new Open Source contribution entry with accurate links to merged PRs authored by Wangmerlyn.

## Solution
- Query merged PRs with GitHub CLI.
- Add one `ProjectItem` in `Open Source Contributions` for `OpenHands software-agent-sdk`.
- Include merged PR links using the existing `prs` field.

## Todo
- [x] Collect merged PRs from `OpenHands/software-agent-sdk`.
- [x] Create/update planning artifacts.
- [ ] Update `src/data/projects.ts` with the new contribution item.
- [ ] Run `pnpm check`.
- [ ] Push branch, open PR, address Gemini/CodeRabbit comments, and squash merge.
