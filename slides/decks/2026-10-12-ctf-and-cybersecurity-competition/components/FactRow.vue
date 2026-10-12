<script setup>
defineProps({
	cols: { type: Number, default: 3 },
	kicker: { type: String, default: "" },
	variant: { type: String, default: "cards" },
});
</script>

<template>
	<section class="facts" :class="[variant, { framed: Boolean(kicker) }]" :style="{ '--cols': cols }">
		<div v-if="kicker" class="kicker">{{ kicker }}</div>
		<div class="grid">
			<slot />
		</div>
	</section>
</template>

<style scoped>
.facts {
	max-width: 56em;
	margin-top: 0.7em;
}

.facts.framed {
	padding: 10px 14px 12px;
	border: 1px solid #222;
	border-left: 3px solid #0071e3;
	background: #fff;
}

.kicker {
	margin-bottom: 8px;
	color: #555;
	font-size: 12px;
}

.grid :deep(ul) {
	display: grid;
	grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
	gap: 10px;
	list-style: none;
	margin: 0;
	padding: 0;
	counter-reset: fact;
}

.grid :deep(li) {
	min-width: 0;
	margin: 0;
	color: #555;
	font-size: 13px;
	line-height: 1.45;
}

.facts:not(.framed) .grid :deep(li) {
	padding: 10px 12px;
	border: 1px solid #222;
	background: #fff;
}

.facts:not(.framed) .grid :deep(li)::before {
	counter-increment: fact;
	content: counter(fact, decimal-leading-zero);
	display: block;
	margin-bottom: 5px;
	color: #555;
	font-size: 12px;
}

.facts.framed .grid :deep(li) {
	padding: 0 12px 0 0;
	border-right: 1px solid #d2d2d7;
}

.facts.framed .grid :deep(li:last-child) {
	padding: 0 0 0 12px;
	border-right: 0;
}

.grid :deep(strong) {
	display: block;
	margin-bottom: 5px;
	color: #1d1d1f;
	font-size: 14px;
	font-weight: 650;
	line-height: 1.3;
}

.grid :deep(p) {
	margin: 0;
}

.facts.stack .grid :deep(ul) {
	grid-template-columns: 1fr;
	gap: 0;
}

.facts.stack .grid :deep(li) {
	position: relative;
	display: block;
	padding: 10px 0 10px 2.4rem;
	border: 0;
	border-bottom: 1px solid #d2d2d7;
	background: transparent;
	font-size: 14px;
}

.facts.stack .grid :deep(li:last-child) {
	border-bottom: 0;
	padding-bottom: 2px;
}

.facts.stack .grid :deep(li)::before {
	position: absolute;
	top: 12px;
	left: 0;
	margin-bottom: 0;
	color: #0071e3;
	font-size: 14px;
	font-weight: 650;
}

.facts.stack .grid :deep(strong) {
	display: block;
	margin-bottom: 3px;
	font-size: 16px;
}
</style>
