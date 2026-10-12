<script setup>
defineProps({
	columns: { type: Number, default: 5 },
});
</script>

<template>
	<section class="strip" :style="{ '--cols': columns }">
		<slot />
	</section>
</template>

<style scoped>
.strip {
	display: grid;
	grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
	gap: 10px;
	align-items: start;
	max-width: none;
	margin-top: 0.55em;
	padding: 12px 14px 14px;
	border: 1px solid #222;
	border-left: 3px solid #0071e3;
	background: #fff;
}

.strip :deep(.step) {
	position: relative;
}

.strip :deep(.step:not(:last-child)::after) {
	content: "→";
	position: absolute;
	top: 42%;
	right: -9px;
	z-index: 1;
	color: #888;
	font-size: 12px;
	pointer-events: none;
}

@media (max-width: 900px) {
	.strip {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.strip :deep(.step::after) {
		content: none !important;
	}
}
</style>
