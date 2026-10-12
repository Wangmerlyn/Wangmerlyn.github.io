<script setup>
defineProps({
	src: { type: String, required: true },
	step: { type: String, default: "" },
	title: { type: String, default: "" },
	alt: { type: String, default: "" },
});
</script>

<template>
	<article class="step">
		<div v-if="step" class="num">{{ step }}</div>
		<img class="shot" :src="src" :alt="alt || title" loading="lazy" />
		<h3 v-if="title" class="title">{{ title }}</h3>
		<div v-if="$slots.default" class="body">
			<slot />
		</div>
	</article>
</template>

<style scoped>
.step {
	display: flex;
	flex-direction: column;
	min-width: 0;
	margin: 0;
	padding: 0;
}

.num {
	margin-bottom: 6px;
	color: #0071e3;
	font-size: 15px;
	font-weight: 650;
	letter-spacing: -0.03em;
	line-height: 1;
}

.shot {
	display: block;
	width: 100%;
	aspect-ratio: 16 / 10;
	object-fit: cover;
	object-position: center;
	border: 1px solid #222;
	background: #f5f5f7;
}

.title {
	margin: 8px 0 0;
	color: #1d1d1f;
	font-size: 13px;
	font-weight: 650;
	line-height: 1.3;
}

.body {
	margin-top: 4px;
	color: #555;
	font-size: 11px;
	line-height: 1.4;
}

.body :deep(p) {
	margin: 0;
}
</style>
