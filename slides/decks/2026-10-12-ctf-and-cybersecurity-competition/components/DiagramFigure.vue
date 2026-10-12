<script setup>
defineProps({
	src: { type: String, required: true },
	alt: { type: String, default: "" },
	compact: { type: Boolean, default: false },
	dense: { type: Boolean, default: false },
});
</script>

<template>
	<figure class="diagram" :class="{ compact, dense }">
		<object class="media" :data="src" type="image/svg+xml" :aria-label="alt" />
	</figure>
</template>

<style scoped>
.diagram {
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: none;
	margin: 0.2em 0 0;
}

.media {
	display: block;
	width: 100%;
	height: auto;
	min-height: 12rem;
	max-height: min(82vh, 56rem);
	border: 1px solid #222;
	background: #fff;
}

.diagram.compact {
	margin-top: 0.35em;
}

.diagram.compact .media {
	min-height: 0;
	max-height: min(42vh, 30rem);
}

.diagram.dense {
	margin-top: 0.25em;
}

.diagram.dense .media {
	width: 94%;
	height: min(28vh, 20rem);
	margin-inline: auto;
	max-height: min(28vh, 20rem);
}
</style>
