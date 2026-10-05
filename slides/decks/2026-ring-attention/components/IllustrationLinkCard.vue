<script setup lang="ts">
import RingIcon from "./RingIcon.vue";

const href = "https://wangmerlyn.github.io/ring-attention-illustration/";
</script>

<template>
	<a class="illust-card" :href="href" target="_blank" rel="noreferrer">
		<div class="illust-kicker">
			<RingIcon name="external" :size="15" />
			wangmerlyn.github.io/ring-attention-illustration
		</div>
		<div class="illust-title">Ring Attention · 看见计算的流动</div>
		<p>分片、环形 KV 传递、online softmax 合并，可以自己改 GPU 数、点着玩。</p>
	</a>
</template>

<style scoped>
.illust-card {
	display: block;
	max-width: 42em;
	margin-top: 1.1em;
	padding: 14px 16px;
	color: inherit;
	text-decoration: none;
	border: 1px solid #222;
	background: #fff;
}
.illust-kicker {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 8px;
	font-size: 12px;
	color: #555;
}
.illust-title {
	font-size: 18px;
	font-weight: 650;
	line-height: 1.35;
}
.illust-card p {
	margin: 6px 0 0;
	font-size: 13px;
	line-height: 1.5;
	color: #555;
}
</style>
