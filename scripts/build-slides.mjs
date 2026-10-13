import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const slidesDir = join(rootDir, "slides");
const decksDir = join(slidesDir, "decks");
const distRoot = join(rootDir, "dist");
const distSlidesDir = join(distRoot, "slides");

function entryMarkdown(slug) {
	const dir = join(decksDir, slug);
	if (!existsSync(dir)) {
		return null;
	}

	const preferred = "slides.md";
	if (existsSync(join(dir, preferred))) {
		return join("decks", slug, preferred);
	}

	const files = readdirSync(dir).filter(
		(name) => name.endsWith(".md") && !name.toLowerCase().startsWith("readme"),
	);
	const named = files.find((name) => name === `${slug}.md`);
	const chosen = named ?? files[0];
	return chosen ? join("decks", slug, chosen) : null;
}

function listDecks() {
	if (!existsSync(decksDir)) {
		return [];
	}

	return readdirSync(decksDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
		.map((entry) => entry.name)
		.filter((slug) => entryMarkdown(slug))
		.sort();
}

const DECK_MEDIA_EXT = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"]);

/** Copy deck-root images referenced via ./ paths in Vue props (not Vite-imported). */
function copyDeckRootMedia(slug, outDir) {
	const deckDir = join(decksDir, slug);
	let copied = 0;

	for (const name of readdirSync(deckDir)) {
		const filePath = join(deckDir, name);
		if (!statSync(filePath).isFile())
			continue;
		if (!DECK_MEDIA_EXT.has(extname(name).toLowerCase()))
			continue;
		cpSync(filePath, join(outDir, name));
		copied++;
	}

	if (copied > 0)
		console.log(`Copied ${copied} deck media file(s) -> /slides/${slug}/`);
}

/** Copy deck-local static assets (e.g. mogodb/) beside the built SPA. */
function copyDeckStaticAssets(slug, outDir) {
	const staticDir = join(decksDir, slug, "mogodb");
	if (!existsSync(staticDir)) {
		return;
	}

	const dest = join(outDir, "mogodb");
	cpSync(staticDir, dest, { recursive: true });
	console.log(`Copied static mogodb/ -> /slides/${slug}/mogodb/`);
}

function markPagefindIgnore(outDir) {
	if (!existsSync(outDir)) {
		return;
	}

	for (const file of readdirSync(outDir, { recursive: true })) {
		const relativePath = String(file);
		if (!relativePath.endsWith(".html")) {
			continue;
		}

		const filePath = join(outDir, relativePath);
		const html = readFileSync(filePath, "utf8");
		if (html.includes("data-pagefind-ignore")) {
			continue;
		}

		const next = html.replace(/<html\b/, '<html data-pagefind-ignore="all"');
		if (next !== html) {
			writeFileSync(filePath, next);
		}
	}
}

function run(args) {
	const result = spawnSync("pnpm", ["exec", "slidev", "build", ...args], {
		cwd: slidesDir,
		env: process.env,
		stdio: "inherit",
	});

	if (result.error) {
		throw result.error;
	}
	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

if (!existsSync(distRoot)) {
	console.error("dist/ is missing. Run `pnpm build` before `pnpm build:slides`.");
	process.exit(1);
}

const decks = listDecks();
if (decks.length === 0) {
	console.log("No Slidev decks found under slides/decks.");
	process.exit(0);
}

for (const slug of decks) {
	const entry = entryMarkdown(slug);
	const outDir = join(distSlidesDir, slug);
	console.log(`Building ${slug} -> /slides/${slug}/`);
	run([entry, "--base", `/slides/${slug}/`, "--out", outDir, "--router-mode", "hash"]);
	copyDeckRootMedia(slug, outDir);
	copyDeckStaticAssets(slug, outDir);
	markPagefindIgnore(outDir);
}
