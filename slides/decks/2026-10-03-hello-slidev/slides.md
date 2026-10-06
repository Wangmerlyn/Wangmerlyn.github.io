---
theme: default
title: Hello Slidev
info: |
  Starter deck that verifies talks build to /slides/<slug>/ next to this Astro site.
highlighter: shiki
mdc: true
---

# Hello Slidev

Talks on this site are written in Slidev and deployed next to the Astro homepage.

---

# Adding a talk

1. Copy `slides/decks/_template`
2. Write `slides.md`
3. Register the deck in `src/data/slides.ts`

---

# Source

Deck source lives in the same repo as the site.

CI builds each deck to `/slides/<slug>/`.
