<script setup>
import { onUnmounted, ref, watch } from "vue";

const props = defineProps({
	value: Number,
	digits: { type: Number, default: 3 },
	reducedMotion: Boolean,
});
const displayed = ref(props.value);
let frame;

watch(
	() => [props.value, props.reducedMotion],
	() => {
		cancelAnimationFrame(frame);
		const start = displayed.value;
		const target = props.value;
		if (props.reducedMotion || !Number.isFinite(start) || !Number.isFinite(target)) {
			displayed.value = target;
			return;
		}
		const began = performance.now();
		function animate(time) {
			const t = Math.min(1, (time - began) / 650);
			displayed.value = start + (target - start) * (1 - (1 - t) ** 3);
			if (t < 1) frame = requestAnimationFrame(animate);
		}
		frame = requestAnimationFrame(animate);
	},
);
onUnmounted(() => cancelAnimationFrame(frame));
</script>

<template>
	<span class="animated-value">{{ displayed === -Infinity ? "−∞" : displayed.toFixed(digits) }}</span>
</template>
