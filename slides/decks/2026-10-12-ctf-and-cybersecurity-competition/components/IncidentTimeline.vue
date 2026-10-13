<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { timelineEvents, timelineEventsFull } from "../lib/incidentTimeline.js";

const props = defineProps({
	full: { type: Boolean, default: false },
	from: { type: Number, default: 1 },
	to: { type: Number, default: 16 },
});

const events = computed(() => {
	const source = props.full ? timelineEventsFull : timelineEvents;
	return source.filter((e) => e.n >= props.from && e.n <= props.to);
});

const rail = computed(() => {
	const items = [];
	for (const event of events.value) {
		if (!items.some((i) => i.type === "date" && i.date === event.date))
			items.push({ type: "date", date: event.date, n: event.n });
		if (event.gapAfter)
			items.push({ type: "gap", label: event.gapAfter, afterN: event.n });
	}
	return items;
});

const activeIndex = ref(0);
const rootRef = ref(null);
const trackRef = ref(null);
const cardRefs = ref([]);

const activeEvent = computed(() => events.value[activeIndex.value] ?? events.value[0]);
const progressPct = computed(() => {
	const n = events.value.length;
	if (n <= 1)
		return "100%";
	return `${((activeIndex.value + 1) / n) * 100}%`;
});

function pad(n) {
	return String(n).padStart(2, "0");
}

function systemClass(system) {
	if (system === "Hugging Face")
		return "hf";
	if (system === "OpenAI")
		return "oai";
	return "art";
}

function setCardRef(el, index) {
	if (el)
		cardRefs.value[index] = el;
}

function scrollToIndex(index, behavior = "smooth") {
	const i = Math.max(0, Math.min(index, events.value.length - 1));
	activeIndex.value = i;
	const el = cardRefs.value[i];
	const track = trackRef.value;
	if (!el || !track)
		return;
	const pad = 4;
	const left = el.offsetLeft - pad;
	const max = track.scrollWidth - track.clientWidth;
	track.scrollTo({ left: Math.max(0, Math.min(left, max)), behavior });
}

function scrollByCards(delta) {
	const track = trackRef.value;
	if (!track)
		return;
	const card = cardRefs.value[0];
	const step = card
		? card.offsetWidth + Number.parseFloat(getComputedStyle(track).gap || "8")
		: track.clientWidth * 0.75;
	const max = track.scrollWidth - track.clientWidth;
	const left = Math.max(0, Math.min(track.scrollLeft + delta * step, max));
	track.scrollTo({ left, behavior: "smooth" });
	syncIndexFromScroll();
}

function prev() {
	scrollByCards(-1);
}

function next() {
	scrollByCards(1);
}

function jumpToEvent(n) {
	const i = events.value.findIndex((e) => e.n === n);
	if (i >= 0)
		scrollToIndex(i);
}

function onKeydown(e) {
	if (!props.full)
		return;
	if (e.key === "ArrowLeft") {
		e.preventDefault();
		e.stopPropagation();
		prev();
	}
	else if (e.key === "ArrowRight") {
		e.preventDefault();
		e.stopPropagation();
		next();
	}
}

let scrollRaf = 0;
function syncIndexFromScroll() {
	cancelAnimationFrame(scrollRaf);
	scrollRaf = requestAnimationFrame(() => {
		const track = trackRef.value;
		if (!track || !cardRefs.value.length)
			return;
		const anchor = track.scrollLeft + 16;
		let best = 0;
		for (let i = 0; i < cardRefs.value.length; i++) {
			const el = cardRefs.value[i];
			if (el && el.offsetLeft <= anchor + 2)
				best = i;
		}
		activeIndex.value = best;
	});
}

function onWheel(e) {
	const track = trackRef.value;
	if (!track)
		return;
	const max = track.scrollWidth - track.clientWidth;
	if (max <= 0)
		return;
	const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
	const atStart = track.scrollLeft <= 1;
	const atEnd = track.scrollLeft >= max - 1;
	if ((delta > 0 && !atEnd) || (delta < 0 && !atStart)) {
		e.preventDefault();
		e.stopPropagation();
		track.scrollLeft += delta;
		syncIndexFromScroll();
	}
}

watch(
	() => events.value.length,
	() => {
		cardRefs.value = [];
		activeIndex.value = 0;
		nextTick(() => scrollToIndex(0, "auto"));
	},
);

onMounted(() => {
	if (!props.full)
		return;
	nextTick(() => {
		const track = trackRef.value;
		if (track)
			track.addEventListener("wheel", onWheel, { passive: false });
		scrollToIndex(0, "auto");
	});
});

onUnmounted(() => {
	const track = trackRef.value;
	if (track)
		track.removeEventListener("wheel", onWheel);
	cancelAnimationFrame(scrollRaf);
});
</script>

<template>
	<div v-if="full" ref="rootRef" class="timeline-carousel" tabindex="0" @keydown="onKeydown">
		<nav class="scrubber" aria-label="Timeline dates">
			<template v-for="(item, index) in rail" :key="`${item.type}-${item.date ?? item.label}-${index}`">
				<button
					v-if="item.type === 'date'"
					type="button"
					class="scrub-date"
					:class="{ active: activeEvent?.date === item.date }"
					@click="jumpToEvent(item.n)"
				>
					{{ item.date }}
				</button>
				<span v-else class="scrub-gap">{{ item.label }}</span>
				<span v-if="index < rail.length - 1" class="scrub-dot" aria-hidden="true" />
			</template>
		</nav>

		<div ref="trackRef" class="track" @scroll.passive="syncIndexFromScroll">
			<article
				v-for="(event, index) in events"
				:key="event.n"
				:ref="(el) => setCardRef(el, index)"
				class="slide-card"
				:class="{ 'is-active': index === activeIndex }"
				:aria-current="index === activeIndex ? 'step' : undefined"
			>
				<header
					v-if="index === 0 || events[index - 1].date !== event.date"
					class="slide-date"
				>
					{{ event.date }}
				</header>
				<div class="slide-meta">
					<span class="system" :class="systemClass(event.system)">{{ event.system }}</span>
					<div class="slide-meta-row">
						<span class="slide-num">{{ event.n }}.</span>
						<span class="iso">{{ event.iso }}</span>
					</div>
				</div>
				<h4 class="slide-title">{{ event.title }}</h4>
				<p class="slide-body">{{ event.body }}</p>
				<div v-if="event.thought" class="thought">
					<div class="thought-kicker">Chain of thought</div>
					{{ event.thought }}
				</div>
			</article>
		</div>

		<footer class="carousel-foot">
			<button type="button" class="nav-btn" :disabled="activeIndex <= 0" @click="prev">
				<span class="nav-label">Previous timeline item</span>
				<span class="nav-sub">{{ pad(activeEvent?.n ?? 1) }} of {{ events.length }}</span>
			</button>

			<div class="progress-wrap">
				<span class="progress-kicker">Timeline progress</span>
				<div class="progress-bar" role="progressbar" :aria-valuenow="activeIndex + 1" :aria-valuemin="1" :aria-valuemax="events.length">
					<div class="progress-fill" :style="{ width: progressPct }" />
				</div>
			</div>

			<button type="button" class="nav-btn nav-next" :disabled="activeIndex >= events.length - 1" @click="next">
				<span class="nav-label">Next timeline item</span>
				<span class="nav-sub">{{ pad(activeEvent?.n ?? 1) }} of {{ events.length }}</span>
			</button>
		</footer>

		<p class="hint">横向滑动、滚轮或 ← →（需先点击时间线区域）</p>
	</div>

	<div v-else class="timeline">
		<div class="rail rail-compact">
			<template v-for="(item, index) in rail" :key="`${item.date ?? item.label}-${index}`">
				<span v-if="item.type === 'date'" class="date">{{ item.date }}</span>
				<span v-else class="gap">{{ item.label }}</span>
				<span v-if="index < rail.length - 1" class="dot" />
			</template>
		</div>

		<div class="board">
			<article v-for="event in events" :key="event.n" class="card">
				<div class="head">
					<div class="kicker">
						<span class="num">{{ pad(event.n) }}</span>
						<span class="when">{{ event.date }}</span>
					</div>
				</div>
				<div class="name">{{ event.title }}</div>
				<p>{{ event.body }}</p>
				<QuoteCard
					v-if="event.thought"
					kind="thought"
					class="card-thought"
					:plain="event.thought"
				/>
			</article>
		</div>
	</div>
</template>

<style scoped>
.timeline-carousel {
	--card-width: 142px;
	--card-height: 16.25rem;
	--card-gap: 6px;
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-top: 0.1em;
	outline: none;
}

.timeline-carousel:focus-visible {
	box-shadow: 0 0 0 2px #0071e3;
	border-radius: 4px;
}

.scrubber {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 5px;
	padding: 0 2px;
	font-size: 10px;
}

.scrub-date {
	padding: 2px 0;
	border: none;
	background: none;
	color: #555;
	font: inherit;
	font-weight: 550;
	cursor: pointer;
	text-decoration: underline transparent;
	transition: color 0.15s, text-decoration-color 0.15s;
}

.scrub-date:hover {
	color: #1d1d1f;
	text-decoration-color: #86868b;
}

.scrub-date.active {
	color: #1d1d1f;
	font-weight: 700;
	text-decoration-color: #1d1d1f;
}

.scrub-gap {
	color: #0071e3;
	font-weight: 650;
}

.scrub-dot {
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background: #222;
	flex-shrink: 0;
}

.track {
	display: flex;
	align-items: stretch;
	gap: var(--card-gap);
	min-height: var(--card-height);
	overflow-x: auto;
	overflow-y: hidden;
	scroll-snap-type: x mandatory;
	scroll-behavior: smooth;
	scroll-padding-inline: 4px;
	-webkit-overflow-scrolling: touch;
	padding: 2px 4px 6px;
	cursor: grab;
	scrollbar-width: thin;
	scrollbar-color: #c7c7cc transparent;
}

.track:active {
	cursor: grabbing;
}

.track::-webkit-scrollbar {
	height: 6px;
}

.track::-webkit-scrollbar-thumb {
	background: #c7c7cc;
	border-radius: 999px;
}

.slide-card {
	flex: 0 0 var(--card-width);
	width: var(--card-width);
	height: var(--card-height);
	scroll-snap-align: start;
	padding: 6px 7px 7px;
	border: 1px solid #d2d2d7;
	background: #fff;
	opacity: 0.82;
	overflow-x: hidden;
	overflow-y: auto;
	transition: opacity 0.2s, border-color 0.2s;
}

.slide-card.is-active {
	opacity: 1;
	border-color: #1d1d1f;
	box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
}

.slide-date {
	margin: 0 0 5px;
	font-size: 10px;
	font-weight: 700;
	line-height: 1.15;
	color: #1d1d1f;
}

.slide-meta {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 3px;
	margin-bottom: 5px;
	font-size: 8px;
	color: #555;
}

.slide-meta-row {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	align-items: baseline;
}

.slide-num {
	font-weight: 700;
	color: #1d1d1f;
}

.iso {
	font-size: 7px;
	font-variant-numeric: tabular-nums;
}

.slide-title {
	margin: 0 0 5px;
	font-size: 9px;
	font-weight: 650;
	line-height: 1.35;
	color: #1d1d1f;
}

.slide-body {
	margin: 0;
	font-size: 8px;
	line-height: 1.45;
	color: #555;
}

.carousel-foot {
	display: grid;
	grid-template-columns: 1fr minmax(100px, 2fr) 1fr;
	gap: 8px;
	align-items: end;
	padding-top: 0;
}

.nav-btn {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1px;
	padding: 4px 6px;
	border: 1px solid #d2d2d7;
	border-radius: 6px;
	background: #f5f5f7;
	color: #1d1d1f;
	font: inherit;
	cursor: pointer;
	text-align: left;
}

.nav-btn.nav-next {
	align-items: flex-end;
	text-align: right;
}

.nav-btn:disabled {
	opacity: 0.35;
	cursor: not-allowed;
}

.nav-btn:not(:disabled):hover {
	border-color: #86868b;
	background: #ebebef;
}

.nav-label {
	font-size: 9px;
	font-weight: 650;
	line-height: 1.2;
}

.nav-sub {
	font-size: 9px;
	color: #555;
}

.progress-wrap {
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
}

.progress-kicker {
	font-size: 10px;
	font-weight: 650;
	color: #555;
	text-align: center;
}

.progress-bar {
	height: 4px;
	border-radius: 999px;
	background: #e8e8ed;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	border-radius: inherit;
	background: #1d1d1f;
	transition: width 0.2s ease;
}

.hint {
	margin: 0;
	font-size: 8px;
	color: #86868b;
	text-align: center;
}

.timeline-carousel .system {
	padding: 0 4px;
	border: 1px solid #222;
	font-size: 7px;
	font-weight: 650;
	line-height: 1.45;
	text-transform: uppercase;
	letter-spacing: 0.03em;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.system.art {
	background: #f5f5f7;
	color: #1d1d1f;
}

.system.hf {
	background: #fff4e5;
	color: #8a5200;
	border-color: #d2a24a;
}

.system.oai {
	background: #e8f2fc;
	color: #004a99;
	border-color: #0071e3;
}

.timeline-carousel .thought {
	margin-top: 6px;
	padding: 3px 0 0 5px;
	border-left: 2px solid #c7c7cc;
	color: #666;
	font-size: 7.5px;
	font-style: italic;
	line-height: 1.4;
}

.timeline-carousel .thought-kicker {
	margin-bottom: 2px;
	font-size: 7px;
	font-style: normal;
	font-weight: 650;
	color: #86868b;
}

/* Compact grid (slide ~9) */
.rail-compact {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
	margin: 0.15em 0 0.75em;
	font-size: 12px;
	color: #555;
}

.date {
	font-weight: 650;
	color: #1d1d1f;
}

.gap {
	color: #0071e3;
	font-weight: 650;
}

.dot {
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background: #222;
}

.board {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 10px;
}

.card {
	display: flex;
	flex-direction: column;
	min-height: 0;
	padding: 10px 12px;
	border: 1px solid #222;
	background: #fff;
}

.head {
	display: flex;
	flex-wrap: wrap;
	gap: 6px 8px;
	align-items: center;
	margin-bottom: 5px;
}

.kicker {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	align-items: baseline;
	color: #555;
	font-size: 11px;
}

.num {
	color: #1d1d1f;
	font-weight: 650;
}

.when {
	color: #555;
}

.name {
	margin-bottom: 5px;
	font-size: 14px;
	font-weight: 650;
	line-height: 1.3;
}

.card p {
	margin: 0;
	color: #555;
	font-size: 12px;
	line-height: 1.4;
}

.card :deep(.quote-card.card-thought) {
	max-width: none;
	margin: 0.55em 0 0;
	padding: 7px 9px 8px;
	border-color: #d2d2d7;
}

.card :deep(.quote-card.card-thought .quote-kicker) {
	margin-bottom: 4px;
	font-size: 10px;
}

.card :deep(.quote-card.card-thought .quote-body) {
	font-size: 11px;
	line-height: 1.42;
}
</style>
