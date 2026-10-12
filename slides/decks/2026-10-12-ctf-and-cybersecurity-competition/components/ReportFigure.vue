<script setup>
defineProps({
	src: { type: String, default: "" },
	alt: { type: String, default: "" },
	caption: { type: String, default: "" },
	size: { type: String, default: "default" },
});
</script>

<template>
	<figure class="fig" :class="size">
		<img v-if="src" :src="src" :alt="alt || caption" />
		<div v-else class="fig-slot"><slot /></div>
		<figcaption v-if="caption">{{ caption }}</figcaption>
	</figure>
</template>

<style scoped>
.fig {
	max-width: 56em;
	margin: 0.45em 0 0;
}

.fig.wide {
	max-width: none;
}

.fig img,
.fig-slot :deep(img),
.fig-slot :deep(svg) {
	display: block;
	width: 100%;
	max-height: 13.6rem;
	object-fit: contain;
	object-position: center;
	border: 1px solid #222;
	background: #fff;
}

.fig.wide img,
.fig.wide .fig-slot :deep(img),
.fig.wide .fig-slot :deep(svg) {
	max-height: 19.25rem;
}

.fig.diagram {
	max-width: none;
	margin-top: 0.25em;
}

.fig.diagram img,
.fig.diagram .fig-slot :deep(img),
.fig.diagram .fig-slot :deep(svg) {
	width: 100%;
	height: auto;
	max-height: none;
	object-fit: contain;
	image-rendering: auto;
}

.fig.native img,
.fig.native .fig-slot :deep(img),
.fig.native .fig-slot :deep(svg) {
	width: 100%;
	height: auto;
	max-height: none;
	object-fit: contain;
}

.fig figcaption {
	margin-top: 6px;
	color: #555;
	font-size: 12px;
	line-height: 1.4;
}
</style>
