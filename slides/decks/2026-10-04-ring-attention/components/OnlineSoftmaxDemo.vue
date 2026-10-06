<script setup>
import { computed, ref, watch } from "vue";
import { onSlideEnter, onSlideLeave } from "@slidev/client";
import RingIcon from "./RingIcon.vue";
import AnimatedValue from "./AnimatedValue.vue";
import { createMergeTrace, demoBlocks, demoReference } from "../lib/onlineSoftmaxDemo.js";

const reducedMotion = ref(false);
const trace = createMergeTrace();
const reference = demoReference();
const step = ref(0);
const committed = ref(0);
const playing = ref(false);
const oneStep = ref(false);
const moving = ref(false);
const progress = ref(1);
const speed = ref(1);
const showNumbers = ref(false);
const finalStep = 10;
const sub = ["₀", "₁", "₂"];
const labels = ["KV 进来", "算出新 O", "乘回 sum", "合到一个分式", "写回 O"];

const roundOf = (value) => (value === 0 ? 0 : Math.floor((value - 1) / 5) + 1);
const phaseOf = (value) => (value === 0 ? 0 : ((value - 1) % 5) + 1);
const blockIndex = computed(() => roundOf(step.value));
const phase = computed(() => phaseOf(step.value));
const current = computed(() => trace[blockIndex.value]);
const seen = computed(() =>
	committed.value === 0 ? 1 : roundOf(committed.value) + (phaseOf(committed.value) === 5 ? 1 : 0),
);
const stored = computed(() => trace[seen.value - 1].after);
const finished = computed(() => committed.value === finalStep);
const active = computed(() => playing.value || oneStep.value);
const partialBlocks = computed(() => Math.max(1, blockIndex.value));
const oldNumerator = computed(() => Array.from({ length: partialBlocks.value }, (_, i) => `w${sub[i]}V${sub[i]}`).join(" + "));
const oldSum = computed(() => Array.from({ length: partialBlocks.value }, (_, i) => `sum${sub[i]}`).join(" + "));
const incomingNumerator = computed(() => `w${sub[blockIndex.value]}V${sub[blockIndex.value]}`);
const incomingSum = computed(() => `sum${sub[blockIndex.value]}`);
const fmt = (n) => n.toFixed(3);
const ink = (hex) => {
	const n = Number.parseInt(hex.slice(1), 16);
	const r = (n >> 16) & 255;
	const g = (n >> 8) & 255;
	const b = n & 255;
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.54 ? "#111" : "#fff";
};

function scene(value) {
	const p = phaseOf(value);
	const ready = p >= 2;
	const joined = p >= 4;
	const restore = p === 3;
	return {
		nx1: joined ? 390 : 250,
		nx2: joined ? 640 : 750,
		ny: joined ? 185 : restore ? 180 : 190,
		dx1: joined ? 390 : 250,
		dx2: joined ? 640 : 750,
		dy: joined ? 310 : 270,
		incoming: ready ? 1 : 0,
		kvX: p === 1 ? 750 : 985,
		kvOpacity: p === 1 ? 1 : 0,
		oldLine: joined ? 0 : 1,
		newLine: ready && !joined ? 1 : 0,
		fx1: restore ? 413 : 250,
		fx2: restore ? 913 : 750,
		fy: restore ? 270 : 385,
		factor: restore ? 1 : 0,
		cancel: restore ? 1 : 0,
		joined: joined ? 1 : 0,
		result: p === 5 ? 1 : 0,
	};
}

let from = scene(0);
const target = computed(() => scene(step.value));
const pose = computed(() => {
	const t = reducedMotion.value ? 1 : 1 - (1 - progress.value) ** 3;
	return Object.fromEntries(Object.entries(target.value).map(([key, value]) => [key, from[key] + (value - from[key]) * t]));
});
const cancellation = computed(() => Math.max(0, Math.min(1, (pose.value.cancel - 0.78) / 0.22)));
const message = computed(() => {
	if (step.value === 0) return ["这份 O 只看过 KV₀。", "它还不完整。Q₀ 留在 GPU 0，等下一个 KV 进来。"];
	if (phase.value === 1) return [`${current.value.block.name} 进入 GPU 0。`, "左边的旧 O 保留，右边先用同一个 Q₀ 计算新片段。"];
	if (phase.value === 2) return ["现在有两份局部 O，各自除过自己的 sum。", "旧 O 只覆盖此前片段，新 O 只覆盖刚进来的这个片段。"];
	if (phase.value === 3) return ["让 sum 移过来，乘回 O，消掉分母。", "看两个 sum 与自己的分母消去：留下的是两份未归一化分子。"];
	if (phase.value === 4) return ["把两份分子、两份 sum，搬进同一个分式。", "分子相加，分母也相加。分式里保留了之前所有片段的贡献。"];
	if (finished.value) return ["全部 KV 都合进来了，O 完整了。", "最终结果与一次性计算所有 KV 的 attention 一致。"];
	return ["这个分式就是更新后的 O。", "把新的 O 与 sum 一起写回。下一个 KV 到来时，重复同样的过程。"];
});

let frame;
let lastTime = 0;
let idle = 0;

function complete() {
	progress.value = 1;
	committed.value = step.value;
	moving.value = false;
	oneStep.value = false;
	idle = 0;
	if (finished.value) playing.value = false;
}
function advance() {
	if (step.value >= finalStep || moving.value) return;
	from = { ...pose.value };
	step.value++;
	progress.value = 0;
	moving.value = true;
	idle = 0;
	if (reducedMotion.value) complete();
}
function stop() {
	playing.value = false;
	oneStep.value = false;
}
function seek(value) {
	stop();
	moving.value = false;
	step.value = value;
	committed.value = value;
	from = scene(value);
	progress.value = 1;
	idle = 0;
}
function next() {
	if (moving.value || step.value >= finalStep) return;
	playing.value = false;
	oneStep.value = true;
	advance();
}
function previous() {
	seek(Math.max(0, step.value - 1));
}
function togglePlay() {
	if (active.value) {
		stop();
		return;
	}
	if (finished.value) seek(0);
	playing.value = true;
	if (!moving.value) advance();
}
function changeSpeed() {
	speed.value = speed.value === 2 ? 0.5 : speed.value === 0.5 ? 1 : 2;
}
function tick(time) {
	const delta = lastTime ? Math.min(time - lastTime, 80) : 0;
	lastTime = time;
	if (active.value) {
		if (moving.value) {
			progress.value = Math.min(1, progress.value + (delta * speed.value) / 1500);
			if (progress.value >= 1 || reducedMotion.value) complete();
		} else if (playing.value && !finished.value) {
			idle += delta * speed.value;
			if (idle >= 1100) advance();
		}
	}
	frame = requestAnimationFrame(tick);
}

watch(reducedMotion, (value) => {
	if (value && moving.value) complete();
});

onSlideEnter(() => {
	reducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	lastTime = 0;
	frame = requestAnimationFrame(tick);
});
onSlideLeave(() => {
	cancelAnimationFrame(frame);
	playing.value = false;
	oneStep.value = false;
});
</script>

<template>
	<div class="softmax-demo" @keydown.stop>
		<div class="flow-topbar">
			<span class="flow-gpu"><RingIcon name="chip" :size="16" />GPU 0 <b>Q₀ 固定</b></span>
			<div class="flow-visits">
				<button
					v-for="(block, i) in demoBlocks"
					:key="i"
					type="button"
					:class="{ visited: i < seen, selected: blockIndex === i }"
					:style="{ '--block-color': block.color }"
					:aria-pressed="blockIndex === i"
					@click.stop="seek(i === 0 ? 0 : (i - 1) * 5 + 2)"
				>
					{{ block.name }}
					<small>O⁽{{ i }}⁾ = w{{ sub[i] }}V{{ sub[i] }} / sum{{ sub[i] }}</small>
				</button>
			</div>
			<span class="flow-coverage" :class="{ complete: finished }">
				{{ finished ? "完整 O" : `部分 O · 已见 ${seen} / 3 块` }}
			</span>
		</div>

		<div class="flow-caption" aria-live="polite">
			<span>{{ step === 0 ? "起点" : `${phase} / 5` }}</span>
			<div>
				<strong>{{ message[0] }}</strong>
				<p>{{ message[1] }}</p>
			</div>
			<label class="flow-numbers">
				<input v-model="showNumbers" type="checkbox" />
				显示数字
			</label>
		</div>

		<div class="flow-stage-steps">
			<button
				v-for="(label, i) in labels"
				:key="label"
				type="button"
				:class="{ active: phase === i + 1 && step > 0 }"
				@click.stop="seek((Math.max(1, blockIndex) - 1) * 5 + i + 1)"
			>
				{{ i + 1 }}<span>{{ label }}</span>
			</button>
		</div>

		<div class="flow-viewport">
			<svg class="formula-stage" viewBox="0 0 1000 465" role="img" :aria-label="`${message[0]} ${message[1]}`">
				<defs>
					<pattern id="softmax-flow-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
						<circle cx="1" cy="1" r=".7" fill="#d4d4d4" />
					</pattern>
				</defs>
				<rect width="1000" height="465" fill="url(#softmax-flow-dots)" />
				<rect x="30" y="25" width="940" height="380" rx="14" fill="none" stroke="#ccc" stroke-dasharray="4 6" />
				<text x="52" y="50" class="stage-label">GPU 0 · 本地计算与合并</text>

				<g :style="{ opacity: 1 - pose.joined }">
					<text x="250" y="109" text-anchor="middle" class="block-heading">
						{{ phase === 3 ? "还原旧分子" : "旧的部分输出 O_partial" }}
					</text>
					<text x="750" y="109" text-anchor="middle" class="block-heading">
						{{
							step === 0
								? "下一个片段还没来"
								: phase === 1
									? `${current.block.name} 到来`
									: phase === 3
										? "还原新分子"
										: "新片段的 O_incoming"
						}}
					</text>
				</g>
				<g :style="{ opacity: pose.joined }">
					<text x="515" y="100" text-anchor="middle" class="joined-heading">分子相加 / sum 相加 → 新的 O</text>
				</g>
				<g v-if="step === 0" class="incoming-placeholder">
					<rect x="642" y="163" width="216" height="142" rx="9" fill="none" stroke="#ccc" stroke-dasharray="5 6" />
					<text x="750" y="221" text-anchor="middle">KV₁，接下来到达</text>
					<text x="750" y="247" text-anchor="middle" class="small-label">点击下一步</text>
				</g>

				<g :style="{ transform: `translate(${pose.nx1}px, ${pose.ny}px)` }">
					<rect x="-115" y="-24" width="230" height="48" rx="7" fill="#ececec" stroke="#888" />
					<text text-anchor="middle" dominant-baseline="central" class="numerator-symbol">{{ oldNumerator }}</text>
					<text v-if="showNumbers" y="-37" text-anchor="middle" class="numeric-label">
						{{ fmt(step === 0 ? trace[0].incomingNumerator : current.beforeNumerator) }}
					</text>
				</g>
				<g :style="{ opacity: pose.incoming, transform: `translate(${pose.nx2}px, ${pose.ny}px)` }">
					<rect
						x="-105"
						y="-24"
						width="210"
						height="48"
						rx="7"
						:fill="current.block.color + '22'"
						:stroke="current.block.color"
						stroke-width="1.6"
					/>
					<text text-anchor="middle" dominant-baseline="central" class="numerator-symbol">{{ incomingNumerator }}</text>
					<text v-if="showNumbers" y="-37" text-anchor="middle" class="numeric-label">{{ fmt(current.incomingNumerator) }}</text>
				</g>
				<line x1="125" y1="230" x2="375" y2="230" stroke="#888" stroke-width="2" :style="{ opacity: pose.oldLine }" />
				<line x1="635" y1="230" x2="865" y2="230" stroke="#888" stroke-width="2" :style="{ opacity: pose.newLine }" />

				<g :style="{ transform: `translate(${pose.dx1}px, ${pose.dy}px)` }">
					<rect x="-84" y="-22" width="168" height="44" rx="6" fill="#f4f4f4" stroke="#aaa" />
					<text text-anchor="middle" dominant-baseline="central" class="sum-symbol">{{ oldSum }}</text>
					<line x1="-73" y1="13" x2="73" y2="-13" stroke="#111" stroke-width="2.5" :style="{ opacity: cancellation }" />
					<text v-if="showNumbers" y="45" text-anchor="middle" class="numeric-label">
						{{ fmt(step === 0 ? trace[0].after.z : current.before.z) }}
					</text>
				</g>
				<g :style="{ opacity: pose.incoming, transform: `translate(${pose.dx2}px, ${pose.dy}px)` }">
					<rect
						x="-77"
						y="-22"
						width="154"
						height="44"
						rx="6"
						:fill="current.block.color + '18'"
						:stroke="current.block.color"
						stroke-width="1.6"
					/>
					<text text-anchor="middle" dominant-baseline="central" class="sum-symbol">{{ incomingSum }}</text>
					<line x1="-67" y1="13" x2="67" y2="-13" stroke="#111" stroke-width="2.5" :style="{ opacity: cancellation }" />
					<text v-if="showNumbers" y="45" text-anchor="middle" class="numeric-label">{{ fmt(current.local.z) }}</text>
				</g>

				<g :style="{ opacity: pose.factor, transform: `translate(${pose.fx1}px, ${pose.fy}px)` }">
					<rect x="-80" y="-19" width="160" height="38" rx="6" fill="#555" />
					<text text-anchor="middle" dominant-baseline="central" class="factor-symbol">× {{ partialBlocks > 1 ? `(${oldSum})` : oldSum }}</text>
					<line x1="-69" y1="12" x2="69" y2="-12" stroke="#111" stroke-width="2.5" :style="{ opacity: cancellation }" />
				</g>
				<g :style="{ opacity: pose.factor, transform: `translate(${pose.fx2}px, ${pose.fy}px)` }">
					<rect x="-67" y="-19" width="134" height="38" rx="6" :fill="current.block.color" />
					<text
						text-anchor="middle"
						dominant-baseline="central"
						class="factor-symbol"
						:fill="ink(current.block.color)"
					>
						× {{ incomingSum }}
					</text>
					<line x1="-58" y1="12" x2="58" y2="-12" stroke="#111" stroke-width="2.5" :style="{ opacity: cancellation }" />
				</g>

				<g :style="{ opacity: pose.joined }">
					<text x="145" y="253" text-anchor="middle" class="output-symbol">O_updated =</text>
					<line x1="263" y1="250" x2="768" y2="250" stroke="#666" stroke-width="2.4" />
					<text x="515" y="191" text-anchor="middle" dominant-baseline="central" class="plus-symbol">+</text>
					<text x="515" y="312" text-anchor="middle" dominant-baseline="central" class="plus-symbol">+</text>
					<text x="515" y="371" text-anchor="middle" class="small-label">sum_updated = {{ oldSum }} + {{ incomingSum }}</text>
				</g>
				<g :style="{ opacity: pose.result }">
					<rect x="348" y="391" width="334" height="41" rx="7" fill="#eee" stroke="#888" />
					<text x="515" y="417" text-anchor="middle" class="writeback-label">
						{{ moving ? "正在写回 O 与 sum…" : finished ? "O 完整了 · 全部 KV 已参与" : "写回 O · 等下一个 KV 进来" }}
					</text>
				</g>

				<g :style="{ opacity: pose.kvOpacity, transform: `translate(${pose.kvX}px, 218px)` }">
					<rect
						x="-101"
						y="-57"
						width="202"
						height="114"
						rx="10"
						fill="#f4f4f4"
						:stroke="current.block.color"
						stroke-width="2"
					/>
					<text y="-10" text-anchor="middle" class="kv-symbol">{{ current.block.name }}</text>
					<text y="21" text-anchor="middle" class="small-label">Q₀ × K → softmax → V</text>
				</g>
				<text v-if="pose.joined < 0.1 && phase !== 3" x="250" y="350" text-anchor="middle" class="small-label">
					O_partial = 分子 / 自己的 sum
				</text>
				<text v-if="phase === 3" x="500" y="377" text-anchor="middle" class="cancel-label">
					乘回自己的 sum → 分母与乘数消去 → 只剩分子
				</text>
			</svg>
		</div>

		<div class="flow-bottom">
			<div class="flow-memory">
				<span>GPU 0 保留</span>
				<b>{{ finished ? "完整 O" : `部分 O · ${seen} / 3 KV` }}</b>
				<template v-if="showNumbers">
					<span>O = <AnimatedValue :value="stored.o" :reduced-motion="reducedMotion" /></span>
					<span>sum = <AnimatedValue :value="stored.z" :reduced-motion="reducedMotion" /></span>
				</template>
				<span v-if="finished" class="flow-verified"><RingIcon name="check" :size="14" />与全量 attention 一致</span>
				<span v-if="finished && showNumbers" class="flow-verified">
					误差 {{ Math.abs(stored.o - reference.output).toExponential(1) }}
				</span>
			</div>
			<div class="flow-controls">
				<button type="button" class="play-button" @click.stop="togglePlay">
					<RingIcon :name="active ? 'pause' : 'play'" :size="16" />
					{{ active ? "暂停" : moving ? "继续" : finished ? "重播" : "自动播放" }}
				</button>
				<button type="button" class="secondary-button" :disabled="step === 0" @click.stop="previous">上一步</button>
				<button type="button" class="secondary-button" :disabled="moving || step >= finalStep" @click.stop="next">
					下一步 <RingIcon name="arrow" :size="15" />
				</button>
				<button type="button" class="icon-button" aria-label="重置公式动画" @click.stop="seek(0)">
					<RingIcon name="reset" :size="17" />
				</button>
				<button type="button" class="speed-button" aria-label="切换公式动画速度" @click.stop="changeSpeed">
					{{ speed }}×
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.softmax-demo {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	overflow: hidden;
	border: 1px solid #222;
	background: #fff;
	color: #111;
}

.softmax-demo :deep(*) {
	font-family: inherit !important;
	letter-spacing: normal;
	user-select: text;
}

.softmax-demo button {
	font: inherit;
	cursor: pointer;
}

.flow-topbar,
.flow-caption,
.flow-bottom {
	display: flex;
	align-items: center;
	gap: 12px;
	flex-shrink: 0;
}

.flow-topbar {
	justify-content: space-between;
	padding: 8px 12px;
	border-bottom: 1px solid #ddd;
}

.flow-gpu {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	white-space: nowrap;
}

.flow-gpu b {
	font-size: 10px;
	font-weight: 500;
	border-left: 1px solid #ccc;
	padding-left: 8px;
	margin-left: 2px;
	color: #666;
}

.flow-visits {
	display: flex;
	gap: 8px;
}

.flow-visits button {
	border: 1px solid #ccc;
	background: #fff;
	color: #888;
	padding: 5px 10px;
	font-size: 12px;
	line-height: 1.2;
}

.flow-visits small {
	display: block;
	font-size: 8px;
	margin-top: 3px;
	color: #999;
}

.flow-visits button.visited {
	color: var(--block-color);
}

.flow-visits button.selected {
	border-color: var(--block-color);
	background: color-mix(in srgb, var(--block-color) 8%, white);
	color: #111;
}

.flow-coverage {
	font-size: 11px;
	color: #666;
	white-space: nowrap;
}

.flow-coverage.complete {
	color: #111;
	font-weight: 600;
}

.flow-caption {
	align-items: flex-start;
	padding: 8px 12px;
	background: #f4f4f4;
	border-bottom: 1px solid #ddd;
}

.flow-caption > span {
	padding: 4px 7px;
	font-size: 10px;
	color: #111;
	background: #e8e8e8;
	border: 1px solid #ccc;
	white-space: nowrap;
}

.flow-caption strong {
	font-weight: 600;
	font-size: 14px;
	line-height: 1.4;
}

.flow-caption p {
	margin: 2px 0 0;
	color: #555;
	font-size: 11px;
	line-height: 1.45;
}

.flow-numbers {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-left: auto;
	font-size: 11px;
	color: #555;
	white-space: nowrap;
	cursor: pointer;
}

.flow-numbers input {
	accent-color: #111;
}

.flow-stage-steps {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 18px;
	padding: 4px 10px 2px;
	flex-shrink: 0;
}

.flow-stage-steps button {
	border: 0;
	border-bottom: 2px solid transparent;
	padding: 5px 2px;
	background: transparent;
	color: #888;
	font-size: 10px;
}

.flow-stage-steps button span {
	margin-left: 6px;
	font-size: 11px;
}

.flow-stage-steps button.active {
	color: #111;
	border-bottom-color: #111;
}

.flow-viewport {
	flex: 1;
	min-height: 0;
	overflow: hidden;
}

.formula-stage {
	display: block;
	width: 100%;
	height: 100%;
}

.formula-stage text {
	pointer-events: none;
}

.stage-label {
	fill: #888;
	font-size: 10px;
	letter-spacing: 0.4px;
}

.block-heading,
.joined-heading {
	fill: #333;
	font-size: 15px;
}

.numerator-symbol {
	fill: #111;
	font-size: 22px;
}

.sum-symbol {
	fill: #444;
	font-size: 18px;
}

.factor-symbol {
	fill: #fff;
	font-size: 14px;
}

.plus-symbol {
	fill: #555;
	font-size: 26px;
}

.output-symbol {
	fill: #111;
	font-size: 18px;
}

.kv-symbol {
	fill: #111;
	font-size: 32px;
}

.small-label {
	fill: #666;
	font-size: 11px;
}

.cancel-label {
	fill: #111;
	font-size: 13px;
}

.numeric-label {
	fill: #666;
	font-size: 12px;
}

.writeback-label {
	fill: #111;
	font-size: 13px;
}

.incoming-placeholder text {
	fill: #888;
	font-size: 14px;
}

.flow-bottom {
	justify-content: space-between;
	padding: 7px 12px;
	border-top: 1px solid #ddd;
}

.flow-memory {
	display: flex;
	align-items: center;
	gap: 12px;
	flex-wrap: wrap;
	font-size: 11px;
	color: #666;
}

.flow-memory b {
	font-weight: 600;
	color: #111;
}

.flow-verified {
	display: flex;
	gap: 4px;
	align-items: center;
	color: #111;
}

.flow-controls {
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
	font-size: 11px;
}

.play-button {
	min-width: 88px;
	padding: 7px 11px;
	color: #fff;
	background: #111;
	border: 1px solid #111;
}

.play-button :deep(svg) {
	fill: currentColor;
	stroke-width: 1;
}

.secondary-button,
.speed-button {
	padding: 7px 10px;
	color: #111;
	background: #fff;
	border: 1px solid #222;
}

.secondary-button:disabled {
	opacity: 0.4;
}

.icon-button {
	padding: 7px;
	color: #111;
	background: transparent;
	border: none;
}
</style>
