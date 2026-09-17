# Personal Image Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans (recommended) to implement this plan task-by-task. Steps use checkbox ([ ] syntax) for tracking.

**Goal:** Organize the uploaded personal images into a consistently named public asset set while removing exact and low-quality duplicates.

**Architecture:** Keep site-wide personal assets in public/images/, where Astro publishes them at /images/<filename>. Normalize existing homepage assets first, then add only the selected uploads and update the homepage path for the renamed portrait.

**Tech Stack:** Astro 5, pnpm, static JPEG/PNG assets, Git.

**Spec:** Approved user request and image inventory from /home/wsy0227/bulk_upload_images_for_codex.

## Global Constraints

- Use lowercase kebab-case filenames with truthful file extensions.
- Preserve unrelated root-checkout resume.tex; all work stays in .worktrees/organize-personal-images.
- Do not add exact duplicates already present in public/images/.
- Do not add resized or near-duplicate Marshall derivatives when a higher-quality canonical remains.
- Keep homepage behavior unchanged except for the corrected path to the renamed portrait.
- Remove EXIF metadata from published JPEGs while preserving their encoded pixel frames.
- Do not update README for this one-off import; existing /public asset guidance is sufficient.

---

### Task 1: Record the approved asset mapping

**Files:** Create docs/plans/2026-09-17-personal-image-organization.md; create ignored task_plan.md, findings.md, and progress.md.

**Interfaces:** Consumes the approved cleanup design and upload inventory; produces an auditable retained/discarded mapping.

- [x] Step 1: Record canonical filenames and duplicate decisions.

Retain these files under public/images/:

~~~text
cat-avatar.jpg                  <- existing light-cat.jpg
siyuan-wang-portrait-bw.jpg     <- existing dark-portrait.png (JPEG bytes)
hooded-portrait-bw.jpg          <- 32165022c15cbab73a0e03cdfaf70819.jpg
beach-group-2025.jpg            <- IMG20250608183405.jpg
marshall-dj-wide.png            <- a645042989aae57f02f2e18545d99c98.png
marshall-dj-portrait.png        <- a645042989aae57f02f2e18545d99c98 (1).png
marshall-dj-wide-poster.png     <- a645042989aae57f02f2e18545d99c98 (3).png
~~~

Discard the incoming cat and dark-portrait.png exact duplicates, the WechatIMG44.jpg crop duplicate, posterized portrait (2), alternate posterized wide (4), and resized wide derivatives (5), (6), and profile.png.

- [x] Step 2: Record verification commands.

Run from the worktree:

~~~bash
git diff --check
file public/images/*
pnpm check
pnpm build
for image in cat-avatar.jpg siyuan-wang-portrait-bw.jpg hooded-portrait-bw.jpg beach-group-2025.jpg marshall-dj-wide.png marshall-dj-portrait.png marshall-dj-wide-poster.png; do test -f "dist/images/$image"; done
for image in public/images/*.jpg; do ! file "$image" | grep -q Exif; done
~~~

- [x] Step 3: Commit the plan.

~~~bash
git add docs/plans/2026-09-17-personal-image-organization.md
git commit -m "docs(images): plan personal asset cleanup"
~~~

### Task 2: Normalize existing homepage assets

**Files:** Rename public/images/light-cat.jpg to public/images/cat-avatar.jpg; rename public/images/dark-portrait.png to public/images/siyuan-wang-portrait-bw.jpg; modify src/pages/index.astro.

**Interfaces:** Consumes existing public asset URLs; produces truthful semantic names with equivalent homepage rendering.

- [x] Step 1: Rename the tracked files.

~~~bash
mv public/images/light-cat.jpg public/images/cat-avatar.jpg
mv public/images/dark-portrait.png public/images/siyuan-wang-portrait-bw.jpg
~~~

- [x] Step 2: Update both homepage image paths. Change /images/light-cat.jpg to /images/cat-avatar.jpg and /images/dark-portrait.png to /images/siyuan-wang-portrait-bw.jpg in src/pages/index.astro; keep alt text and loading behavior unchanged.

- [x] Step 3: Check and commit the rename.

~~~bash
git diff --check
git add public/images src/pages/index.astro
git commit -m "refactor(images): normalize homepage asset names"
~~~

### Task 3: Add the curated uploaded assets

**Files:** Create five files in public/images/: hooded-portrait-bw.jpg, beach-group-2025.jpg, marshall-dj-wide.png, marshall-dj-portrait.png, and marshall-dj-wide-poster.png.

**Interfaces:** Consumes the five selected source files in /home/wsy0227/bulk_upload_images_for_codex; produces reusable public assets without source filename artifacts or low-quality derivatives.

- [x] Step 1: Copy the selected source files.

~~~bash
cp /home/wsy0227/bulk_upload_images_for_codex/32165022c15cbab73a0e03cdfaf70819.jpg public/images/hooded-portrait-bw.jpg
cp /home/wsy0227/bulk_upload_images_for_codex/IMG20250608183405.jpg public/images/beach-group-2025.jpg
cp /home/wsy0227/bulk_upload_images_for_codex/a645042989aae57f02f2e18545d99c98.png public/images/marshall-dj-wide.png
cp "/home/wsy0227/bulk_upload_images_for_codex/a645042989aae57f02f2e18545d99c98 (1).png" public/images/marshall-dj-portrait.png
cp "/home/wsy0227/bulk_upload_images_for_codex/a645042989aae57f02f2e18545d99c98 (3).png" public/images/marshall-dj-wide-poster.png
~~~

- [x] Step 2: Verify formats, dimensions, and JPEG metadata. file reports JPEG for the two new JPEGs and PNG for the three PNGs; dimensions are 744x992, 7872x2912, 1752x1168, 1920x2212, and 7008x4672 respectively. EXIF APP1 segments were removed from all published JPEGs and ffmpeg frame hashes match the original source frames.

- [x] Step 3: Commit the curated assets.

~~~bash
git add public/images
git commit -m "feat(images): add curated personal assets"
~~~

### Task 4: Validate and prepare the PR

**Files:** Verify all files changed by Tasks 1-3; no additional documentation is required.

**Interfaces:** Consumes the normalized and curated asset set; produces a verified branch, pushed PR, and reviewer feedback.

- [x] Step 1: Install dependencies if needed.

~~~bash
if [ ! -d node_modules ]; then pnpm install --frozen-lockfile; fi
~~~

- [x] Step 2: Run validation.

~~~bash
git diff --check
pnpm check
pnpm build
for image in cat-avatar.jpg siyuan-wang-portrait-bw.jpg hooded-portrait-bw.jpg beach-group-2025.jpg marshall-dj-wide.png marshall-dj-portrait.png marshall-dj-wide-poster.png; do test -f "dist/images/$image"; done
~~~

- [x] Step 3: Review the final branch.

~~~bash
git status --short --branch
git diff origin/main...HEAD --stat
git log --oneline origin/main..HEAD
~~~

- [x] Step 4: Push and open the PR with title [images] feat: organize personal assets, listing retained assets, duplicate-removal rationale, validation results, and why README was unchanged.

- [ ] Step 5: Dispatch two independent reviewers. Address Critical or Important findings, rerun validation, and update the PR before handoff.
