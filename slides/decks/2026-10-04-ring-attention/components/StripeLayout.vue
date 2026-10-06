<script setup>
const colors = ["#171717", "#454545", "#6e6e6e", "#a8a8a8"];
const devices = 4;
const tokens = 8;
const perGpu = tokens / devices;
const contigGroups = Array.from({ length: devices }, (_, gpu) =>
	Array.from({ length: perGpu }, (_, j) => gpu * perGpu + j),
);
const stripedGroups = Array.from({ length: devices }, (_, gpu) =>
	Array.from({ length: perGpu }, (_, k) => gpu + k * devices),
);

function ink(gpu) {
	return gpu === 3 ? "#111" : "#fff";
}
function tone(gpu) {
	return { background: colors[gpu], color: ink(gpu), borderColor: gpu === 3 ? "#222" : colors[gpu] };
}
</script>

<template>
	<div class="stripe-ex">
		<div class="stripe-case">
			<p>连续切分</p>
			<div class="stripe-row contig">
				<span v-for="(group, gpu) in contigGroups" :key="gpu" class="pair">
					<span v-for="token in group" :key="token" class="tok" :style="tone(gpu)">{{ token }}</span>
				</span>
			</div>
			<div class="stripe-gpus">
				<span v-for="gpu in devices" :key="gpu" :style="tone(gpu - 1)">GPU {{ gpu - 1 }}</span>
			</div>
			<small>Q₀ 几乎只看 {0,1}，Q₃ 要看全部 → GPU 0 吃空饷</small>
		</div>
		<div class="stripe-case">
			<p>Striped</p>
			<div class="stripe-row contig">
				<span v-for="(group, gpu) in stripedGroups" :key="gpu" class="pair">
					<span v-for="token in group" :key="token" class="tok" :style="tone(gpu)">{{ token }}</span>
				</span>
			</div>
			<div class="stripe-gpus">
				<span v-for="gpu in devices" :key="gpu" :style="tone(gpu - 1)">GPU {{ gpu - 1 }}</span>
			</div>
			<small>GPU i 拿 i, i+N, i+2N, … 每张卡都有靠前和靠后的 token</small>
		</div>
	</div>
</template>

<style scoped>
.stripe-ex {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.2em;
	margin-top: 0.4em;
	font-size: 0.82em;
}
.stripe-case p {
	margin: 0 0 0.4em;
	font-weight: 650;
}
.stripe-row {
	display: grid;
	grid-template-columns: repeat(8, minmax(0, 1fr));
	gap: 4px;
}
.stripe-row.contig {
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 8px;
}
.pair {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 4px;
}
.tok {
	display: flex;
	align-items: center;
	justify-content: center;
	aspect-ratio: 1.15;
	border: 1px solid #222;
	font-weight: 650;
}
.stripe-gpus {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 8px;
	margin-top: 6px;
	font-size: 0.85em;
	text-align: center;
}
.stripe-gpus span {
	padding: 2px 0;
	border: 1px solid #222;
}
.stripe-case small {
	display: block;
	margin-top: 8px;
	color: #666;
	line-height: 1.45;
}
</style>
