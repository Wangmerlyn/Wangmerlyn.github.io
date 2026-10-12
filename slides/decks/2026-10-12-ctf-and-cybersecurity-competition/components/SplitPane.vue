<script setup>
defineProps({
	columns: { type: String, default: "1fr 1fr" },
	feature: { type: String, default: "" },
	wide: { type: Boolean, default: false },
});
</script>

<template>
	<div class="split" :class="[feature && `feature-${feature}`, { wide }]" :style="{ '--cols': columns }">
		<div class="pane">
			<slot />
		</div>
		<div class="pane">
			<slot name="right" />
		</div>
	</div>
</template>

<style scoped>
.split {
	display: grid;
	grid-template-columns: var(--cols);
	gap: 14px;
	align-items: stretch;
	max-width: 56em;
	margin-top: 0.55em;
}

.split.wide {
	max-width: none;
}

.pane {
	min-width: 0;
}

.feature-left > .pane:first-child,
.feature-right > .pane:last-child {
	padding: 14px 16px;
	border: 1px solid #222;
	background: #fff;
}

.split :deep(.quote-card),
.split :deep(.facts),
.split :deep(.decode),
.split :deep(.link-card),
.split :deep(.preview),
.split :deep(.record) {
	max-width: none;
	height: 100%;
	margin-top: 0;
}

.feature-left > .pane:first-child :deep(strong:first-child) {
	display: block;
	margin-bottom: 8px;
	font-size: 18px;
	font-weight: 650;
	line-height: 1.25;
}

.feature-left > .pane:first-child :deep(p),
.feature-right > .pane:last-child :deep(p) {
	margin: 0;
	color: #555;
	font-size: 14px;
	line-height: 1.45;
}

.feature-right > .pane:last-child :deep(strong:first-child) {
	display: block;
	margin-bottom: 8px;
	font-size: 16px;
	font-weight: 650;
	line-height: 1.3;
}

.feature-right > .pane:last-child :deep(p + p) {
	margin-top: 12px;
	padding-top: 12px;
	border-top: 1px solid #d2d2d7;
}
</style>
