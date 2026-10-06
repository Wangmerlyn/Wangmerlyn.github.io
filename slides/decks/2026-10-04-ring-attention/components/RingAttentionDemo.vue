<script setup>
import { computed, ref, watch } from "vue";
import { onSlideEnter, onSlideLeave } from "@slidev/client";
import RingIcon from "./RingIcon.vue";
import RingKvBlock from "./RingKvBlock.vue";
import { accumulate, denseAttention, makeExample, ownerAtRound, partition, scoresForBlock } from "../lib/attention.js";

const devices = ref(4);
const sequenceLength = ref(4096);
const causal = ref(false);
const speed = ref(1);
const selected = ref(0);
const rounds = ref(0);
const playing = ref(false);
const stepping = ref(false);
const moving = ref(false);
const progress = ref(0);
const reducedMotion = ref(false);
const colors = ["#171717", "#454545", "#6e6e6e", "#a8a8a8", "#2c2c2c", "#5a5a5a", "#888888", "#c4c4c4"];
const subscripts = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇"];
const indices = computed(() => Array.from({ length: devices.value }, (_, i) => i));
const done = computed(() => rounds.value === devices.value);
const activeRound = computed(() => Math.min(rounds.value, devices.value - 1));
const currentBlock = computed(() => ownerAtRound(selected.value, activeRound.value, devices.value));
const example = computed(() => makeExample(devices.value));
const accumulator = computed(() => accumulate(example.value, selected.value, rounds.value, devices.value, causal.value));
const dense = computed(() => denseAttention(example.value, selected.value * 2, causal.value));
const error = computed(() => Math.max(...accumulator.value.o.map((value, i) => Math.abs(value - dense.value[i]))));
const processed = computed(() => new Set(Array.from({ length: rounds.value }, (_, r) => ownerAtRound(selected.value, r, devices.value))));
const skipping = computed(() => causal.value && currentBlock.value > selected.value);
const stageTitle = computed(() =>
	done.value ? "所有分块已完成" : moving.value ? "计算与传递，同时发生" : rounds.value === 0 ? "从本地分块开始" : "新的 K/V 分块已就位",
);
const stageDescription = computed(() =>
	done.value
		? `每台设备完成 ${devices.value} 轮遍历，保留自己的输出 O。`
		: moving.value
			? rounds.value === devices.value - 1
				? "最后一轮：合并当前分块，完成输出，不再发送 K/V。"
				: "各设备计算当前分块，同时把 K/V 发给下一台。Q 始终留在原处。"
			: rounds.value === 0
				? "长序列沿 token 维度分片，每台设备持有自己的 Q、K 和 V。"
				: "上一轮已合并。继续用本地 Q 计算收到的 K/V。",
);

function point(angle, radius = 174) {
	const rad = (angle * Math.PI) / 180;
	return { x: 400 + radius * Math.cos(rad), y: 250 + radius * Math.sin(rad) };
}
function angle(i) {
	return -135 + (i * 360) / devices.value;
}
const nodes = computed(() => indices.value.map((i) => ({ i, ...point(angle(i)) })));
const arcs = computed(() =>
	indices.value.map((i) => {
		const margin = 26;
		const start = point(angle(i) + margin);
		const end = point(angle(i) + 360 / devices.value - margin);
		return `M ${start.x} ${start.y} A 174 174 0 0 1 ${end.x} ${end.y}`;
	}),
);
const packets = computed(() =>
	indices.value.map((i) => ({
		i,
		owner: ownerAtRound(i, activeRound.value, devices.value),
		...point(angle(i) + (360 / devices.value) * progress.value),
	})),
);

function stateOf(row, column) {
	if (causal.value && column > row) return "masked";
	if (ownerAtRound(row, column, devices.value) < rounds.value) return "complete";
	if (!done.value && column === ownerAtRound(row, rounds.value, devices.value)) return moving.value ? "active" : "queued";
	return "pending";
}
function rangeLabel(i) {
	const [start, end] = partition(sequenceLength.value, devices.value, i);
	return `${start.toLocaleString()}–${(end - 1).toLocaleString()}`;
}
function format(value) {
	return value === -Infinity ? "−∞" : value.toFixed(3);
}
function ink(color) {
	const n = Number.parseInt(color.slice(1), 16);
	const r = (n >> 16) & 255;
	const g = (n >> 8) & 255;
	const b = n & 255;
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.54 ? "#111" : "#fff";
}
function reset() {
	rounds.value = 0;
	progress.value = 0;
	playing.value = false;
	stepping.value = false;
	moving.value = false;
	idleTime = 0;
}
function startRound() {
	if (done.value) return;
	progress.value = 0;
	moving.value = true;
	idleTime = 0;
}
function togglePlay() {
	if (playing.value || stepping.value) {
		playing.value = false;
		stepping.value = false;
		return;
	}
	if (done.value) reset();
	playing.value = true;
	if (!moving.value) startRound();
}
function next() {
	if (done.value) return;
	playing.value = false;
	stepping.value = true;
	if (!moving.value) startRound();
}
function seek(round) {
	reset();
	rounds.value = round;
}
function changeSpeed() {
	speed.value = speed.value === 2 ? 0.5 : speed.value === 0.5 ? 1 : 2;
}

watch([devices, sequenceLength, causal], () => {
	reset();
	if (selected.value >= devices.value) selected.value = 0;
});

let frameId;
let lastTime = 0;
let idleTime = 0;
function tick(time) {
	const delta = lastTime ? Math.min(time - lastTime, 80) : 0;
	lastTime = time;
	if (playing.value || stepping.value) {
		if (moving.value) {
			progress.value = Math.min(1, progress.value + (delta * speed.value) / 2600);
			if (progress.value >= 1) {
				rounds.value++;
				moving.value = false;
				stepping.value = false;
				progress.value = 0;
				idleTime = 0;
				if (done.value) playing.value = false;
			}
		} else if (playing.value && !done.value) {
			idleTime += delta;
			if (idleTime > 450 / speed.value) startRound();
		}
	}
	frameId = requestAnimationFrame(tick);
}

onSlideEnter(() => {
	reducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	lastTime = 0;
	frameId = requestAnimationFrame(tick);
});
onSlideLeave(() => {
	cancelAnimationFrame(frameId);
	playing.value = false;
	stepping.value = false;
});
</script>

<template>
	<div class="ring-demo" @keydown.stop>
		<div class="configuration">
			<div class="configuration-label"><RingIcon name="chip" :size="16" /> Ring Attention</div>
			<div class="config-field">
				<span>注意力</span>
				<div class="segmented" role="group">
					<button type="button" :class="{ selected: !causal }" @click.stop="causal = false">Full</button>
					<button type="button" :class="{ selected: causal }" @click.stop="causal = true">Causal</button>
				</div>
			</div>
			<span class="live-status" :class="{ running: playing || stepping, finished: done }">
				<i></i>{{ done ? "计算完成" : playing || stepping ? "正在运行" : moving ? "已暂停" : "准备就绪" }}
			</span>
		</div>

		<div class="workspace">
			<div class="ring-panel">
				<div class="ring-diagram" :class="{ 'is-working': moving && (playing || stepping), 'is-finished': done, 'reduced-motion': reducedMotion }">
					<svg class="ring-svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
						<defs>
							<marker id="ring-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
								<path d="M0,0 L6,3 L0,6" fill="none" stroke="#bbb" stroke-width="1.2" />
							</marker>
							<marker id="ring-arrow-active" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
								<path d="M0,0 L6,3 L0,6" fill="none" stroke="#111" stroke-width="1.2" />
							</marker>
						</defs>
						<circle cx="400" cy="250" r="174" class="ring-guide" />
						<circle cx="400" cy="250" r="118" class="inner-guide" />
						<path
							v-for="(arc, i) in arcs"
							:key="i"
							:d="arc"
							class="connection"
							:class="{ highlighted: moving && !done && rounds < devices - 1 }"
							:marker-end="moving && rounds < devices - 1 ? 'url(#ring-arrow-active)' : 'url(#ring-arrow)'"
						/>
						<g v-if="moving && rounds < devices - 1 && !reducedMotion" class="kv-packets">
							<g v-for="packet in packets" :key="packet.i" :transform="`translate(${packet.x}, ${packet.y})`">
								<rect x="-26" y="-13" width="52" height="26" :fill="colors[packet.owner]" :stroke="ink(colors[packet.owner])" stroke-width="0" />
								<text text-anchor="middle" dominant-baseline="central" :fill="ink(colors[packet.owner])">KV{{ subscripts[packet.owner] }}</text>
							</g>
						</g>
					</svg>

					<div class="ring-center">
						<div class="center-kicker">{{ done ? "ALL BLOCKS VISITED" : "COMPUTE ROUND" }}</div>
						<div class="round-number">
							<span>{{ done ? devices : activeRound + 1 }}</span>
							<span class="round-denominator">/ {{ devices }}</span>
						</div>
						<div class="center-caption">{{ done ? "完整 attention 已就绪" : moving ? (rounds < devices - 1 ? "计算 + K/V 传递" : "最终结果合并") : "Q 固定 · K/V 顺时针流动" }}</div>
						<div class="center-progress"><span :style="{ width: `${done ? 100 : moving ? progress * 100 : 0}%` }"></span></div>
					</div>

					<button
						v-for="node in nodes"
						:key="node.i"
						type="button"
						class="gpu-node"
						:class="{ 'selected-node': selected === node.i, computing: moving, 'node-done': done }"
						:style="{ left: `${node.x / 8}%`, top: `${node.y / 5}%`, '--gpu-color': colors[node.i], '--kv-color': colors[ownerAtRound(node.i, activeRound, devices)] }"
						@click.stop="selected = node.i"
					>
						<div class="node-heading">
							<span><RingIcon name="chip" :size="12" />GPU {{ node.i }}</span>
							<span class="node-status">{{ done ? "完成" : moving && causal && ownerAtRound(node.i, activeRound, devices) > node.i ? "掩码跳过" : moving ? "计算中" : "本地设备" }}</span>
						</div>
						<div class="node-blocks">
							<span class="q-block">Q{{ subscripts[node.i] }}</span>
							<RingKvBlock
								:label="`K${subscripts[ownerAtRound(node.i, activeRound, devices)]}`"
								:color="colors[ownerAtRound(node.i, activeRound, devices)]"
								:reduced-motion="reducedMotion"
							/>
							<RingKvBlock
								:label="`V${subscripts[ownerAtRound(node.i, activeRound, devices)]}`"
								:color="colors[ownerAtRound(node.i, activeRound, devices)]"
								:reduced-motion="reducedMotion"
							/>
						</div>
						<div class="node-range">tokens {{ rangeLabel(node.i) }}</div>
					</button>
				</div>
			</div>

			<aside class="inspector">
				<div class="inspector-label">分块矩阵 <span>GPU {{ selected }}</span></div>
				<div class="attention-matrix" :style="{ '--n': devices }">
					<span class="matrix-corner">Q/K</span>
					<span v-for="i in indices" :key="`k${i}`" class="matrix-col-label">K{{ subscripts[i] }}</span>
					<template v-for="row in indices" :key="row">
						<button type="button" class="matrix-row-label" :class="{ 'selected-row': selected === row }" @click.stop="selected = row">Q{{ subscripts[row] }}</button>
						<button
							v-for="col in indices"
							:key="`${row}-${col}`"
							type="button"
							class="matrix-cell"
							:class="[stateOf(row, col), { 'inspected-row': selected === row }]"
							@click.stop="selected = row"
						>
							<RingIcon v-if="stateOf(row, col) === 'complete'" name="check" :size="12" />
							<span v-else-if="stateOf(row, col) === 'active'" class="cell-dot"></span>
							<span v-else-if="stateOf(row, col) === 'masked'" class="masked-dash">–</span>
						</button>
					</template>
				</div>
				<div class="operation-formula" :class="{ 'formula-done': done }">
					<template v-if="done">O{{ subscripts[selected] }} = u / ℓ</template>
					<template v-else>Q{{ subscripts[selected] }} × K{{ subscripts[currentBlock] }}ᵀ / √d</template>
				</div>
				<p class="op-copy">
					{{
						done
							? `与 dense attention 最大误差 ${error.toExponential(1)}`
							: skipping
								? "当前 K/V 是未来 token，跳过计算。"
								: `本地 Q${subscripts[selected]} 与 GPU ${currentBlock} 的 K/V 做 online softmax。`
					}}
				</p>
				<div class="visit-order">
					<template v-for="r in devices" :key="r">
						<span :class="{ visited: processed.has(ownerAtRound(selected, r - 1, devices)), visiting: !done && r === rounds + 1 }" :style="{ '--visit-color': colors[ownerAtRound(selected, r - 1, devices)], '--visit-ink': ink(colors[ownerAtRound(selected, r - 1, devices)]) }">{{
							ownerAtRound(selected, r - 1, devices)
						}}</span>
						<span v-if="r < devices" class="visit-arrow">›</span>
					</template>
				</div>
				<div class="stats">
					<span>m {{ format(accumulator.m) }}</span>
					<span>ℓ {{ format(accumulator.l) }}</span>
				</div>
			</aside>
		</div>

		<div class="playback">
			<div class="playback-actions">
				<button type="button" class="play-button" @click.stop="togglePlay">
					<RingIcon :name="playing || stepping ? 'pause' : done ? 'reset' : 'play'" :size="16" />
					{{ playing || stepping ? "暂停" : done ? "重播" : moving ? "继续" : "播放" }}
				</button>
				<button type="button" class="secondary-button" :disabled="done || stepping" @click.stop="next">
					<RingIcon name="next" :size="16" />下一步
				</button>
				<button type="button" class="icon-button" aria-label="重置" @click.stop="reset"><RingIcon name="reset" :size="16" /></button>
			</div>
			<div class="timeline">
				<button type="button" class="timeline-start" :class="{ active: rounds === 0 }" @click.stop="seek(0)">初始化</button>
				<div class="timeline-track">
					<div class="timeline-line"></div>
					<div class="timeline-fill" :style="{ width: `${((rounds + (moving ? progress : 0)) / devices) * 100}%` }"></div>
					<button
						v-for="r in devices"
						:key="r"
						type="button"
						class="round-stop"
						:class="{ reached: rounds >= r, 'current-stop': moving && r === rounds + 1 }"
						@click.stop="seek(r)"
					>
						<span class="stop-dot"><RingIcon v-if="rounds >= r" name="check" :size="9" /></span>
						<span class="stop-label">第 {{ r }} 轮</span>
					</button>
				</div>
				<span class="timeline-end" :class="{ active: done }">完成</span>
			</div>
			<button type="button" class="speed-button" @click.stop="changeSpeed">{{ speed }}×</button>
		</div>
		<div class="step-description">
			<strong>{{ stageTitle }}</strong>
			<p>{{ stageDescription }}</p>
		</div>
	</div>
</template>

<style scoped>
.ring-demo {
	--accent: #111;
	--line: #222;
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	overflow: hidden;
	color: #111;
	background: #fff;
	border: 1px solid #222;
}

.ring-demo :deep(*) {
	font-family: inherit !important;
	letter-spacing: normal;
	user-select: text;
}

.ring-demo button,
.ring-demo select {
	font: inherit;
	cursor: pointer;
}

.ring-demo button:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.configuration,
.playback,
.step-description,
.workspace {
	min-width: 0;
}

.configuration {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 8px 14px;
	border-bottom: 1px solid var(--line);
	background: #fff;
}

.configuration-label {
	display: flex;
	align-items: center;
	gap: 6px;
	padding-right: 14px;
	border-right: 1px solid var(--line);
	font-size: 12px;
	font-weight: 600;
}

.config-field {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 11px;
	color: #666;
}

.segmented {
	display: flex;
	border: 1px solid #222;
}

.segmented button {
	padding: 4px 10px;
	border: none;
	background: #fff;
	color: #666;
	font-size: 11px;
}

.segmented button.selected {
	background: #111;
	color: #fff;
}

.live-status {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-left: auto;
	font-size: 11px;
	color: #666;
}

.live-status i {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: #bbb;
}

.live-status.running,
.live-status.finished {
	color: #111;
}

.live-status.running i,
.live-status.finished i {
	background: #111;
}

.workspace {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 248px;
	flex: 1;
	min-height: 0;
	overflow: hidden;
}

.ring-panel {
	min-width: 0;
	min-height: 0;
	overflow: hidden;
	background: #fff;
}

.ring-diagram {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: #fff;
}

.ring-svg {
	display: block;
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.ring-guide {
	stroke: #ddd;
	stroke-width: 1;
	fill: none;
}

.inner-guide {
	stroke: #ddd;
	stroke-width: 1;
	stroke-dasharray: 2 6;
	fill: none;
}

.connection {
	stroke: #999;
	stroke-width: 1.6;
	fill: none;
}

.connection.highlighted {
	stroke: #111;
}

.kv-packets rect {
	stroke: none;
}

.kv-packets text {
	font-size: 11px;
	font-weight: 600;
}

.ring-center {
	position: absolute;
	left: 50%;
	top: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	transform: translate(-50%, -50%);
	white-space: nowrap;
}

.center-kicker {
	font-size: 8px;
	font-weight: 600;
	letter-spacing: 1.4px;
	color: #888;
}

.round-number {
	display: flex;
	align-items: baseline;
	gap: 6px;
	margin: 2px 0 4px;
}

.round-number > span:first-child {
	font-size: 42px;
	font-weight: 450;
	line-height: 1.1;
	color: #111;
}

.round-denominator {
	font-size: 16px;
	color: #999;
}

.center-caption {
	font-size: 10px;
	color: #666;
}

.center-progress {
	width: 72px;
	height: 2px;
	margin-top: 10px;
	background: #ddd;
}

.center-progress span {
	display: block;
	height: 100%;
	background: var(--accent);
}

.is-finished .round-number > span:first-child {
	color: #111;
}

.gpu-node {
	position: absolute;
	width: 22%;
	max-width: 168px;
	padding: 8px;
	text-align: left;
	background: #fff;
	border: 1px solid #222;
	border-left: 3px solid var(--gpu-color);
	transform: translate(-50%, -50%);
}

.gpu-node.selected-node {
	border-width: 2px;
	border-left-width: 3px;
	border-color: var(--gpu-color);
}

.node-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 6px;
	font-size: 11px;
	font-weight: 600;
}

.node-heading > span:first-child {
	display: flex;
	align-items: center;
	gap: 4px;
}

.node-status {
	font-size: 8px;
	color: #888;
}

.computing .node-status {
	color: var(--accent);
}

.node-blocks {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 4px;
}

.node-blocks > span {
	padding: 5px 0;
	font-size: 12px;
	font-weight: 500;
	line-height: 1;
	text-align: center;
}

.q-block {
	color: #111;
	background: #fff;
	border: 1px solid var(--gpu-color);
}

.kv-block {
	background: var(--kv-color);
	transition: background 0.35s ease;
}

.node-range {
	margin-top: 6px;
	font-size: 8px;
	color: #888;
}

.inspector {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 12px 12px 10px;
	border-left: 1px solid var(--line);
	background: #fff;
}

.inspector-label {
	display: flex;
	justify-content: space-between;
	font-size: 11px;
	font-weight: 600;
	color: #111;
}

.inspector-label span {
	color: #666;
	font-weight: 500;
}

.attention-matrix {
	display: grid;
	grid-template-columns: 22px repeat(var(--n), minmax(0, 1fr));
	gap: 4px;
}

.matrix-corner,
.matrix-col-label,
.matrix-row-label {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 14px;
	font-size: 10px;
	color: #888;
}

.matrix-row-label {
	padding: 0;
	border: none;
	background: transparent;
}

.matrix-row-label.selected-row {
	color: var(--accent);
	font-weight: 650;
}

.matrix-cell {
	display: flex;
	align-items: center;
	justify-content: center;
	aspect-ratio: 1.2;
	padding: 0;
	border: 1px solid #ddd;
	background: #fff;
}

.matrix-cell.queued {
	border: 1px dashed #111;
	background: #fff;
}

.matrix-cell.active {
	color: #fff;
	background: #111;
	border-color: #111;
}

.matrix-cell.complete {
	color: #111;
	background: #eee;
	border-color: #ccc;
}

.matrix-cell.masked {
	color: #999;
	background: repeating-linear-gradient(135deg, #fff, #fff 3px, #eee 3px, #eee 4px);
}

.cell-dot {
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background: #fff;
}

.operation-formula {
	padding: 8px 6px;
	font-size: 13px;
	font-weight: 500;
	color: #111;
	text-align: center;
	background: #fff;
	border: 1px solid #222;
}

.formula-done {
	color: #111;
}

.op-copy {
	margin: 0;
	font-size: 10px;
	line-height: 1.6;
	color: #666;
}

.visit-order {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 10px;
}

.visit-order > span:not(.visit-arrow) {
	min-width: 16px;
	padding: 2px 5px;
	color: #999;
	text-align: center;
	border: 1px solid #ccc;
}

.visit-order > span.visited {
	color: var(--visit-ink);
	background: var(--visit-color);
	border-color: var(--visit-color);
}

.visit-order > span.visiting {
	color: #111;
	border-color: #111;
}

.visit-arrow {
	color: #999;
}

.stats {
	display: flex;
	gap: 12px;
	font-size: 11px;
	color: #111;
	font-variant-numeric: tabular-nums;
}

.playback {
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 8px 12px 14px;
	border-top: 1px solid var(--line);
	background: #fff;
}

.playback-actions {
	display: flex;
	align-items: center;
	gap: 6px;
}

.play-button,
.secondary-button,
.speed-button,
.icon-button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
}

.play-button {
	min-width: 88px;
	padding: 8px 12px;
	color: #fff;
	background: #111;
	border: 1px solid #111;
	font-size: 11px;
}

.play-button :deep(svg) {
	fill: currentColor;
	stroke-width: 1;
}

.secondary-button,
.speed-button {
	padding: 8px 10px;
	color: #111;
	background: #fff;
	border: 1px solid #222;
	font-size: 11px;
}

.icon-button {
	padding: 8px;
	color: #111;
	background: transparent;
	border: none;
}

.timeline {
	display: flex;
	flex: 1;
	align-items: center;
	gap: 10px;
	min-width: 0;
	margin-top: -8px;
}

.timeline-start,
.timeline-end {
	font-size: 10px;
	color: #888;
	background: transparent;
	border: none;
}

.timeline-start.active,
.timeline-end.active {
	color: #111;
}

.timeline-track {
	position: relative;
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: space-around;
	height: 16px;
}

.timeline-line,
.timeline-fill {
	position: absolute;
	top: 7px;
	right: 0;
	left: 0;
	height: 2px;
	background: #ddd;
}

.timeline-fill {
	right: auto;
	background: #111;
}

.round-stop {
	position: relative;
	width: 22px;
	height: 16px;
	padding: 0;
	background: transparent;
	border: none;
}

.stop-dot {
	position: relative;
	z-index: 1;
	display: grid;
	place-items: center;
	width: 10px;
	height: 10px;
	margin: 0 auto;
	color: #fff;
	background: #ddd;
	border: 2px solid #fff;
	border-radius: 50%;
	box-shadow: 0 0 0 1px #ddd;
}

.reached .stop-dot {
	background: #111;
	box-shadow: 0 0 0 1px #111;
}

.stop-label {
	position: absolute;
	top: 18px;
	left: 50%;
	font-size: 8px;
	color: #888;
	white-space: nowrap;
	transform: translateX(-50%);
}

.step-description {
	position: relative;
	z-index: 2;
	display: flex;
	align-items: baseline;
	gap: 10px;
	padding: 8px 14px;
	background: #fff;
	border-top: 1px solid #222;
}

.step-description strong {
	font-size: 12px;
	font-weight: 600;
	color: #111;
	white-space: nowrap;
}

.step-description p {
	margin: 0;
	font-size: 11px;
	line-height: 1.5;
	color: #666;
}
</style>
