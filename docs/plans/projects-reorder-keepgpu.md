# Projects Page Reorder + KeepGPU Entry

## Background
The current Projects page lists "Open Source Contributions" before "Competitions & Demos". The requested layout is the opposite order, and a new KeepGPU item should be added based on repository information.

## Goal
1. Show "Competitions & Demos" above "Open Source Contributions".
2. Add a KeepGPU entry in Open Source with accurate, concise content.
3. Keep page structure and styling unchanged.

## Solution
- Update `src/data/projects.ts` ordering in `projectCategories`.
- Insert a new `ProjectItem` for KeepGPU under Open Source.
- Use GitHub metadata (`description`, repo URL, language/license context) for truthful copy.

## Todo
- [x] Inspect current projects rendering and data order.
- [x] Fetch KeepGPU metadata with GitHub CLI.
- [x] Reorder categories in `src/data/projects.ts`.
- [x] Add KeepGPU project entry.
- [x] Run `pnpm check` and confirm no regressions.
