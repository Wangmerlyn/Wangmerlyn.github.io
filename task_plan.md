# Task Plan: Publications Page

## Goal
Add a Publications page that lists my papers (from provided arXiv links), showing title, link, author list with my name highlighted, and venue/status (e.g., ICLR 2026, ICML 2025, preprint). Ship on a new branch from `main`.

## Phases
1. Research & Gather Metadata (links → title, authors, venue/status) — **done**  
2. Design Page Content/Structure (section layout, highlighting rule) — **done**  
3. Implement Page & Nav Link — **done**  
4. Validate (pnpm check/build) — **done**  
5. Commit & Push branch — pending

## Notes / Decisions
- Highlight my name “Siyuan Wang” in author lists.
- Keep behavior similar to existing pages (Base layout, menu link).

## Risks / Open Questions
- Venue info not in arXiv page: may need manual annotation based on user input (accepted to ICLR 2026 / ICML 2025 / preprint).
