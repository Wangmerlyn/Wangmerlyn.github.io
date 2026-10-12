<script setup>
defineProps({
	href: { type: String, required: true },
	title: { type: String, required: true },
	kicker: { type: String, default: "YouTube" },
});
</script>

<template>
	<a class="yt-card" :href="href" target="_blank" rel="noreferrer">
		<div class="yt-kicker">
			<span class="play" aria-hidden="true">
				<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
					<path d="M8 5v14l11-7z" />
				</svg>
			</span>
			<span>{{ kicker }}</span>
		</div>
		<div class="yt-title">{{ title }}</div>
		<p v-if="$slots.default" class="yt-body"><slot /></p>
	</a>
</template>

<style scoped>
.yt-card {
	display: block;
	max-width: none;
	margin-top: 0;
	padding: 12px 14px;
	color: inherit;
	text-decoration: none;
	border: 1px solid #222;
	border-left: 3px solid #ff0033;
	background: #fff;
	transition:
		transform 120ms ease,
		border-color 120ms ease;
}

.yt-card:hover {
	border-color: #ff0033;
	transform: translateY(-1px);
}

.yt-kicker {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 6px;
	font-size: 12px;
	color: #555;
}

.play {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 22px;
	height: 22px;
	border-radius: 4px;
	background: #ff0033;
	color: #fff;
}

.yt-title {
	font-size: 16px;
	font-weight: 650;
	line-height: 1.35;
}

.yt-body {
	margin: 5px 0 0;
	font-size: 13px;
	line-height: 1.45;
	color: #555;
}
</style>
