<script setup>
const rounds = [
	{ title: "第 1 轮", compute: "Attn(Q₀, K₀, V₀)", send: "K₀V₀", recv: "K₃V₃" },
	{ title: "第 2 轮", compute: "Attn(Q₀, K₃, V₃)", send: "K₃V₃", recv: "K₂V₂" },
	{ title: "第 3 轮", compute: "Attn(Q₀, K₂, V₂)", send: "K₂V₂", recv: "K₁V₁" },
	{ title: "第 4 轮", compute: "Attn(Q₀, K₁, V₁)" },
];
</script>

<template>
	<div class="ov">
		<div class="ov-head">
			<span></span>
			<span v-for="round in rounds" :key="round.title">{{ round.title }}</span>
		</div>
		<div class="ov-lane">
			<b>Compute</b>
			<div v-for="round in rounds" :key="`c-${round.title}`" class="ov-box">{{ round.compute }}</div>
		</div>
		<div class="ov-lane">
			<b>Comm</b>
			<div v-for="round in rounds" :key="`m-${round.title}`" class="ov-box" :class="round.send ? 'ov-comm' : 'ov-idle'">
				<template v-if="round.send">发 {{ round.send }}<br />收 {{ round.recv }}</template>
				<template v-else>最后一轮<br />不再发送</template>
			</div>
		</div>
	</div>
</template>

<style scoped>
.ov {
	margin: 0.4em 0 0.55em;
	font-size: 0.82em;
}
.ov-head,
.ov-lane {
	display: grid;
	grid-template-columns: 6.2em repeat(4, minmax(0, 1fr));
	gap: 0.45em;
	align-items: stretch;
}
.ov-head {
	margin-bottom: 0.35em;
	color: #888;
	text-align: center;
	font-size: 0.92em;
}
.ov-lane {
	margin-bottom: 0.45em;
}
.ov-lane b {
	display: flex;
	align-items: center;
	font-weight: 650;
}
.ov-box {
	padding: 0.55em 0.35em;
	border: 1px solid #222;
	text-align: center;
	line-height: 1.35;
	white-space: nowrap;
}
.ov-comm {
	border-style: dashed;
}
.ov-idle {
	border-style: dashed;
	color: #888;
}
</style>
