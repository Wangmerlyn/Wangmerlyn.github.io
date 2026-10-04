# Slides

Talks are written in [Slidev](https://sli.dev) under `slides/decks/` and deployed next to the Astro site at `/slides/<slug>/`. The `/slides/` listing page is an Astro page; each deck is a separate Slidev build.

Do not put Slidev markdown in `src/content/`, and do not commit built HTML into `public/slides/`.

## Local workflow

```bash
# site
pnpm install
pnpm dev

# one deck
pnpm --dir slides install
pnpm --dir slides exec slidev decks/<slug>/slides.md

# production-like output
pnpm build
pnpm build:slides
pnpm preview
```

`pnpm build` runs Astro and Pagefind first. `pnpm build:slides` writes into `dist/slides/<slug>/` afterwards so search does not index slide fragments. The script also marks generated Slidev HTML with `data-pagefind-ignore`, so a later Pagefind pass still skips the decks.

## Add a talk

1. Copy `slides/decks/_template` to `slides/decks/YYYY-short-slug`.
2. Edit that folder's `slides.md` (or another `.md` entry such as `<slug>.md`), plus optional `public/` or `components/`.
3. Append an entry to `src/data/slides.ts` with the same `slug`.
4. Open a PR to `main`. CI builds the site, then each deck, then deploys.

Folders starting with `_` are skipped by the build script.

Each deck is built with `--base /slides/<slug>/` and `--router-mode hash` so GitHub Pages can serve it under a subdirectory.
