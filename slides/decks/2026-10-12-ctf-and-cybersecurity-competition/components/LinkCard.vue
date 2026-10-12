<script setup>
defineProps({
	href: { type: String, required: true },
	kicker: { type: String, required: true },
	title: { type: String, required: true },
});
</script>

<template>
	<a class="link-card" :href="href" target="_blank" rel="noreferrer">
		<div class="link-kicker">
			<ExternalIcon :size="15" />
			{{ kicker }}
		</div>
		<div class="link-title">{{ title }}</div>
		<p v-if="$slots.default" class="link-body"><slot /></p>
	</a>
</template>

<style scoped>
.link-card {
	display: block;
	max-width: 42em;
	margin-top: 0.55em;
	padding: 10px 14px;
	color: inherit;
	text-decoration: none;
	border: 1px solid #222;
	background: #fff;
	transition:
		transform 120ms ease,
		border-color 120ms ease;
}

.link-card:hover {
	border-color: #0071e3;
	transform: translateY(-1px);
}

.link-kicker {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 6px;
	font-size: 12px;
	color: #555;
}

.link-title {
	font-size: 16px;
	font-weight: 650;
	line-height: 1.35;
}

.link-body {
	margin: 5px 0 0;
	font-size: 13px;
	line-height: 1.45;
	color: #555;
}
</style>
