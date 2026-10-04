<script setup>
const colors = ["#171717", "#454545", "#6e6e6e", "#a8a8a8"];
const devices = 4;
const tokens = 24;
const chunks = devices * 2;
const chunkSize = tokens / chunks;
const indices = Array.from({ length: tokens }, (_, token) => token);

function stripedGpu(token) {
	return token % devices;
}
function zigzagGpu(token) {
	const chunk = Math.floor(token / chunkSize);
	return chunk < devices ? chunk : chunks - 1 - chunk;
}
function ink(gpu) {
	return gpu === 3 ? "#111" : "#fff";
}
function tone(gpu) {
	return { background: colors[gpu], color: ink(gpu), borderColor: gpu === 3 ? "#222" : colors[gpu] };
}
function work(assign) {
	return Array.from({ length: devices }, (_, gpu) => {
		let sum = 0;
		for (let token = 0; token < tokens; token++) {
			if (assign(token) === gpu) sum += token + 1;
		}
		return sum;
	});
}

const rows = [
	{
		name: "Striped",
		assign: stripedGpu,
		loads: work(stripedGpu),
		note: "周期重复 G0–G3，靠后的 query 仍然更重",
	},
	{
		name: "ZigZag",
		assign: zigzagGpu,
		loads: work(zigzagGpu),
		note: "走到最浅再折返，两头配在同一张卡上，计算量相同",
	},
];
</script>

<template>
	<div class="zz">
		<div class="legend">
			<span v-for="gpu in devices" :key="gpu" :style="tone(gpu - 1)">GPU {{ gpu - 1 }}</span>
		</div>
		<div v-for="row in rows" :key="row.name" class="zz-row">
			<div class="zz-head">
				<p>{{ row.name }}</p>
				<small>{{ row.note }}</small>
			</div>
			<div class="zz-seq">
				<span v-for="token in indices" :key="token" class="tok" :style="tone(row.assign(token))">{{ token }}</span>
			</div>
			<div class="zz-load">
				<span class="zz-load-label">计算量</span>
				<span v-for="(load, gpu) in row.loads" :key="gpu" :style="tone(gpu)">GPU {{ gpu }} · {{ load }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.zz {
	display: flex;
	flex-direction: column;
	gap: 14px;
	margin-top: 0.45em;
	font-size: 0.8em;
}
.legend {
	display: flex;
	gap: 8px;
}
.legend span {
	padding: 2px 8px;
	border: 1px solid #222;
	font-size: 11px;
}
.zz-row {
	display: flex;
	flex-direction: column;
	gap: 6px;
}
.zz-head {
	display: flex;
	align-items: baseline;
	gap: 12px;
}
.zz-head p {
	margin: 0;
	font-weight: 650;
}
.zz-head small {
	color: #666;
}
.zz-seq {
	display: grid;
	grid-template-columns: repeat(24, minmax(0, 1fr));
	gap: 3px;
}
.tok {
	display: flex;
	align-items: center;
	justify-content: center;
	aspect-ratio: 1;
	border: 1px solid #222;
	font-size: 10px;
	font-weight: 650;
}
.zz-load {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	align-items: center;
}
.zz-load-label {
	color: #888;
	font-size: 10px;
	padding: 0;
	border: none;
}
.zz-load span:not(.zz-load-label) {
	padding: 1px 7px;
	border: 1px solid #222;
	font-size: 10px;
	font-variant-numeric: tabular-nums;
}
</style>
