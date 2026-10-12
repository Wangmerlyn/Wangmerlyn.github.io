<script setup>
defineProps({
	href: { type: String, required: true },
	number: { type: [String, Number], required: true },
	title: { type: String, required: true },
	tagline: { type: String, default: "" },
	image: { type: String, required: true },
	imageAlt: { type: String, default: "" },
	badge: { type: String, default: "" },
	series: { type: String, default: "" },
	credit: { type: String, default: "" },
});
</script>

<template>
	<article class="preview">
		<header class="head">
			<div class="head-top">
				<span v-if="badge" class="badge">{{ badge }}</span>
				<a class="source" :href="href" target="_blank" rel="noreferrer">Bellingcat Challenge</a>
			</div>
			<h3 class="title">{{ number }}. {{ title }}</h3>
			<p v-if="tagline" class="tagline">{{ tagline }}</p>
		</header>

		<div class="panel">
			<a class="media" :href="href" target="_blank" rel="noreferrer">
				<img :src="image" :alt="imageAlt || title" loading="lazy" />
			</a>
			<div class="copy">
				<div v-if="$slots.default" class="body">
					<slot />
				</div>
				<p v-if="$slots.prompt" class="prompt">
					<slot name="prompt" />
				</p>
				<p v-if="credit || series" class="meta">
					<span v-if="credit">{{ credit }}</span>
					<span v-if="series"> · {{ series }}</span>
				</p>
			</div>
		</div>
	</article>
</template>

<style scoped>
.preview {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: 0;
}

.head {
	margin-bottom: 10px;
}

.head-top {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	align-items: center;
	margin-bottom: 6px;
}

.badge {
	padding: 2px 8px;
	border: 1px solid #0071e3;
	color: #0071e3;
	font-size: 11px;
	font-weight: 650;
	line-height: 1.35;
}

.source {
	color: #555;
	font-size: 11px;
	text-decoration: none;
}

.source:hover {
	color: #0071e3;
	text-decoration: underline;
}

.title {
	margin: 0;
	color: #1d1d1f;
	font-size: 17px;
	font-weight: 650;
	line-height: 1.25;
	letter-spacing: -0.02em;
}

.tagline {
	margin: 4px 0 0;
	color: #555;
	font-size: 13px;
	line-height: 1.35;
}

.panel {
	display: grid;
	grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
	gap: 12px;
	flex: 1;
	min-height: 0;
}

.media {
	display: block;
	min-width: 0;
}

.media img {
	display: block;
	width: 100%;
	max-height: 11.5rem;
	object-fit: contain;
	object-position: center top;
	border: 1px solid #222;
	background: #f5f5f7;
}

.copy {
	display: flex;
	flex-direction: column;
	min-width: 0;
}

.body {
	color: #1d1d1f;
	font-size: 12px;
	line-height: 1.45;
}

.body :deep(p) {
	margin: 0 0 0.65em;
}

.body :deep(p:last-child) {
	margin-bottom: 0;
}

.prompt {
	margin: 10px 0 0;
	padding-top: 8px;
	border-top: 1px solid #d2d2d7;
	color: #1d1d1f;
	font-size: 12px;
	font-weight: 650;
	line-height: 1.4;
}

.meta {
	margin: 8px 0 0;
	color: #555;
	font-size: 10px;
	line-height: 1.35;
}
</style>
