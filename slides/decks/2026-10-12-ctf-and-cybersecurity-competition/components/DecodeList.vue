<script setup>
defineProps({
	compact: { type: Boolean, default: false },
});
</script>

<template>
	<div class="decode" :class="{ compact }">
		<slot />
	</div>
</template>

<style scoped>
.decode {
	margin-top: 0.7em;
	max-width: 42em;
}

.decode :deep(ul) {
	list-style: none;
	margin: 0;
	padding: 0;
	border-top: 1px solid #d2d2d7;
}

.decode :deep(li) {
	display: grid;
	grid-template-columns: 16.5rem minmax(0, 1fr);
	gap: 0.85rem;
	align-items: baseline;
	padding: 0.45rem 0;
	margin: 0;
	border-bottom: 1px solid #d2d2d7;
	color: #1d1d1f;
	font-size: 0.88rem;
	line-height: 1.4;
}

.decode :deep(strong) {
	font-weight: 650;
	letter-spacing: -0.02em;
	word-break: break-word;
}

.decode :deep(p) {
	margin: 0;
}

.decode :deep(code) {
	padding: 0;
	font-size: inherit;
	font-weight: 650;
	background: transparent;
	border-radius: 0;
}

.decode.compact :deep(li) {
	grid-template-columns: 1fr;
	gap: 2px;
	padding: 0.55rem 0;
}
</style>
