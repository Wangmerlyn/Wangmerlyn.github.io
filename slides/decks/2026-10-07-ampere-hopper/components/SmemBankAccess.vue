<script setup>
import { computed } from "vue";

const props = defineProps({
	stride: { type: [Number, String], required: true },
	naddr: { type: [Number, String], default: 32 },
	loadBytes: { type: [Number, String], default: 16 },
	maxLines: { type: [Number, String], default: 8 },
});

const BANKS = 32;
const BANK_B = 4;
const LINE_B = BANKS * BANK_B;

const stride = computed(() => Number(props.stride));
const naddr = computed(() => Number(props.naddr));
const words = computed(() => Number(props.loadBytes) / BANK_B);
const maxLines = computed(() => Number(props.maxLines));

const model = computed(() => {
	const counts = Array.from({ length: BANKS }, () => 0);
	const byLine = new Map();

	for (let t = 0; t < naddr.value; t++) {
		const matrix = Math.floor(t / 8);
		const row = (t % 8) + (matrix >= 2 ? 8 : 0);
		const col = (matrix % 2) * 16;
		const addr = row * stride.value + col;
		const bank0 = (addr / BANK_B) % BANKS;
		const line = Math.floor(addr / LINE_B);
		for (let w = 0; w < words.value; w++)
			counts[(bank0 + w) % BANKS] += 1;
		if (!byLine.has(line))
			byLine.set(line, []);
		byLine.get(line).push({ t, bank0, half: matrix % 2 });
	}

	const lineIds = [...byLine.keys()].sort((a, b) => a - b);
	const shown = lineIds.slice(0, maxLines.value);
	const max = Math.max(...counts);
	const used = counts.filter((c) => c > 0).length;
	const hidden = naddr.value - shown.reduce((n, id) => n + byLine.get(id).length, 0);
	const usedIds = counts.map((c, i) => (c > 0 ? i : -1)).filter((i) => i >= 0);

	return {
		counts,
		max,
		used,
		cycles: max,
		factor: max / 4,
		shown,
		byLine,
		hidden,
		totalLines: lineIds.length,
		bankRange: usedIds.length ? `${usedIds[0]}–${usedIds[usedIds.length - 1]}` : "",
	};
});

const bankIds = Array.from({ length: BANKS }, (_, i) => i);

function hit(line, bank) {
	return model.value.byLine.get(line)?.some(
		(a) => bank >= a.bank0 && bank < a.bank0 + words.value,
	);
}

function accessAt(line, bank) {
	return model.value.byLine.get(line)?.find((x) => x.bank0 === bank);
}

function threadAt(line, bank) {
	const a = accessAt(line, bank);
	return a ? `T${a.t}` : "";
}

function halfAt(line, bank) {
	return model.value.byLine.get(line)?.find(
		(a) => bank >= a.bank0 && bank < a.bank0 + words.value,
	)?.half;
}
</script>

<template>
	<div class="smem">
		<div class="smem-head">
			<span class="smem-kicker">ldmatrix.x4 · left 16 B + right 16 B = 32 B row (8 banks)</span>
			<span class="smem-stat">
				<strong>{{ model.cycles }}-way</strong>
				· {{ model.used }}/32 banks ·
				<strong>{{ model.cycles }} cycles</strong>
				<span v-if="model.cycles === 4" class="smem-vs">&nbsp;(optimal)</span>
				<span v-else class="smem-vs">&nbsp;({{ model.factor }}× vs 4)</span>
			</span>
		</div>

		<div class="smem-grid" :style="{ '--n': BANKS }">
			<div class="gutter" />
			<div
				v-for="b in bankIds"
				:key="'h' + b"
				class="lab"
			>
				{{ b % 8 === 0 || b === 31 ? b : "" }}
			</div>

			<template v-for="line in model.shown" :key="'l' + line">
				<div class="gutter">{{ line * LINE_B }}</div>
				<div
					v-for="b in bankIds"
					:key="line + '-' + b"
					class="cell"
					:class="{ hit: hit(line, b), right: halfAt(line, b) === 1 }"
				>
					{{ threadAt(line, b) }}
				</div>
			</template>

			<div class="gutter muted">req</div>
			<div
				v-for="(c, b) in model.counts"
				:key="'c' + b"
				class="req"
				:class="{ hot: c === model.max && c > 0, idle: c === 0 }"
			>
				{{ c || "" }}
			</div>
		</div>

		<p v-if="model.hidden" class="smem-note">
			{{ model.shown.length }} of {{ model.totalLines }} smem lines drawn; the remaining pointers still hit banks {{ model.bankRange }}.
		</p>
	</div>
</template>

<style scoped>
.smem {
	font-size: 11px;
	line-height: 1.2;
}

.smem-head {
	display: flex;
	justify-content: space-between;
	gap: 0.6rem;
	align-items: baseline;
	margin-bottom: 0.4rem;
}

.smem-kicker {
	color: #555;
}

.smem-stat strong {
	font-weight: 650;
}

.smem-vs {
	color: #555;
}

.smem-grid {
	display: grid;
	grid-template-columns: 2.2rem repeat(var(--n), minmax(0, 1fr));
	border-top: 1px solid #d2d2d7;
	border-left: 1px solid #d2d2d7;
}

.gutter,
.lab,
.cell,
.req {
	border-right: 1px solid #d2d2d7;
	border-bottom: 1px solid #d2d2d7;
	min-height: 1.2rem;
	text-align: center;
}

.gutter {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-right: 0.28rem;
	color: #555;
	font-size: 9px;
}

.gutter.muted {
	letter-spacing: -0.02em;
}

.lab {
	color: #555;
	font-size: 9px;
	min-height: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.cell {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 8px;
	color: transparent;
	background: #fff;
}

.cell.hit {
	background: #0071e3;
	color: #fff;
	font-weight: 650;
}

.cell.hit.right {
	background: #419cff;
}

.req {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 1.15rem;
	font-size: 8px;
	font-weight: 650;
	background: #fff;
}

.req.hot {
	background: #0071e3;
	color: #fff;
}

.req.idle {
	color: #86868b;
}

.smem-note {
	margin: 0.35rem 0 0;
	color: #555;
	font-size: 11px;
}
</style>
