<script setup>
import { computed } from "vue";

const props = defineProps({
	label: String,
	color: String,
	reducedMotion: Boolean,
});

const ink = computed(() => {
	const n = Number.parseInt((props.color || "#111").slice(1), 16);
	const r = (n >> 16) & 255;
	const g = (n >> 8) & 255;
	const b = n & 255;
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.54 ? "#111" : "#fff";
});
</script>

<template>
	<span class="kv-block" :style="{ '--kv-color': color, '--label-color': ink }">
		<Transition name="kv-swap" :css="!reducedMotion">
			<span :key="label" class="kv-label">{{ label }}</span>
		</Transition>
	</span>
</template>

<style scoped>
.kv-block {
	position: relative;
	overflow: hidden;
	background: var(--kv-color);
}

.kv-label {
	display: block;
	color: var(--label-color);
}

.kv-swap-enter-active {
	transition:
		transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
		opacity 320ms ease-out;
}

.kv-swap-leave-active {
	position: absolute;
	top: 50%;
	left: 0;
	width: 100%;
	pointer-events: none;
	transition:
		transform 320ms cubic-bezier(0.4, 0, 0.2, 1),
		opacity 220ms ease-in;
}

.kv-swap-enter-from {
	opacity: 0;
	transform: translateY(90%) scale(0.96);
}

.kv-swap-enter-to {
	opacity: 1;
	transform: translateY(0) scale(1);
}

.kv-swap-leave-from {
	opacity: 1;
	transform: translateY(-50%);
}

.kv-swap-leave-to {
	opacity: 0;
	transform: translateY(-150%) scale(0.96);
}
</style>
