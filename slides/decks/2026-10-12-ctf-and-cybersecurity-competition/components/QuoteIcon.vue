<script setup>
defineProps({
	name: { type: String, default: "thought" },
	size: { type: Number, default: 15 },
});

const paths = {
	thought: "M8 9h8M8 13h5M6 4h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H13l-4 4v-4H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z",
	board: "M4 7h16M7 7V5h10v2M6 7v12h12V7",
};
</script>

<template>
	<svg
		:width="size"
		:height="size"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.6"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path :d="paths[name] || paths.thought" />
	</svg>
</template>
