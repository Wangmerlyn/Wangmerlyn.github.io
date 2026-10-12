<script setup>
import { onMounted, onUnmounted } from "vue";

function onWheel(e) {
	const t = e.target;
	if (!(t instanceof Element))
		return;
	if (t.closest(".track, .timeline-carousel, .where-demo, .browser .viewport"))
		return;
	const layout = t.closest(".slidev-layout");
	if (!(layout instanceof HTMLElement))
		return;
	const max = layout.scrollHeight - layout.clientHeight;
	if (max <= 1)
		return;
	const dy = e.deltaY;
	if (!dy)
		return;
	const top = layout.scrollTop;
	const atTop = top <= 0;
	const atBottom = top + layout.clientHeight >= layout.scrollHeight - 1;
	if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) {
		e.preventDefault();
		e.stopPropagation();
		layout.scrollTop = Math.max(0, Math.min(top + dy, max));
	}
}

onMounted(() => {
	document.addEventListener("wheel", onWheel, { passive: false, capture: true });
});

onUnmounted(() => {
	document.removeEventListener("wheel", onWheel, { capture: true });
});
</script>

<template>
	<span class="sr-only" aria-hidden="true" />
</template>

<style scoped>
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
}
</style>
