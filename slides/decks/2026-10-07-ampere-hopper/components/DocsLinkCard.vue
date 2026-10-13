<script setup>
defineProps({
	href: { type: String, required: true },
	kicker: { type: String, default: "" },
	title: { type: String, required: true },
	image: { type: String, default: "" },
	imageAlt: { type: String, default: "" },
});
</script>

<template>
	<a class="docs-card" :href="href" target="_blank" rel="noreferrer">
		<div class="docs-kicker">
			<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
			</svg>
			{{ kicker }}
		</div>
		<div class="docs-title">{{ title }}</div>
		<div v-if="$slots.default" class="docs-body"><slot /></div>
		<img v-if="image" class="docs-img" :src="image" :alt="imageAlt || title" />
	</a>
</template>

<style scoped>
.docs-card {
	display: block;
	max-width: 42em;
	margin-top: 0.85em;
	padding: 12px 14px;
	color: inherit;
	text-decoration: none;
	border: 1px solid #222;
	background: #fff;
}

.docs-kicker {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 6px;
	font-size: 12px;
	color: #555;
}

.docs-title {
	font-size: 16px;
	font-weight: 650;
	line-height: 1.35;
}

.docs-body :deep(p) {
	margin: 5px 0 0;
	font-size: 13px;
	line-height: 1.45;
	color: #555;
}

.docs-body :deep(img),
.docs-img {
	display: block;
	width: 100%;
	max-height: 13.2rem;
	margin-top: 8px;
	object-fit: contain;
	object-position: left center;
	background: #fff;
}
</style>
