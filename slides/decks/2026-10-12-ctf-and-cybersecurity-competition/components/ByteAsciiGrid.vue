<script setup>
defineProps({
	hex: { type: String, default: "" },
	ascii: { type: String, default: "" },
});
</script>

<template>
	<div class="grid-wrap">
		<div class="bytes" aria-label="hex 与 ASCII 对照">
			<div v-if="hex" class="line">{{ hex }}</div>
			<div v-if="ascii" class="line">{{ ascii }}</div>
			<div v-if="!hex && !ascii" class="fallback">
				<slot />
			</div>
		</div>
		<div v-if="$slots.footer" class="arrow">
			<div class="footer">
				<slot name="footer" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.grid-wrap {
	margin-top: 0.35em;
	padding: 10px 12px;
	border: 1px solid #222;
	border-left: 3px solid #0071e3;
	background: #fff;
}

.bytes {
	margin: 0;
	color: #1d1d1f;
	font-family: inherit;
	font-size: 12px;
	line-height: 1.55;
}

.line {
	margin: 0;
	white-space: pre;
}

.fallback :deep(p) {
	margin: 0;
	white-space: pre;
}

.arrow {
	margin-top: 10px;
	padding-top: 8px;
	border-top: 1px dashed #d2d2d7;
	color: #555;
	font-size: 11px;
}

.footer :deep(p) {
	margin: 0;
	line-height: 1.45;
}

.footer :deep(strong) {
	color: #0071e3;
	font-weight: 650;
}
</style>
