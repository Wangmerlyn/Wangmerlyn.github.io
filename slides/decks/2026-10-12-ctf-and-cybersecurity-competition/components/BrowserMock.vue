<script setup>
defineProps({
	url: { type: String, default: "example.com" },
	compact: { type: Boolean, default: false },
});
</script>

<template>
	<div class="browser" :class="{ compact }">
		<div class="chrome">
			<span class="dots" aria-hidden="true"><i /><i /><i /></span>
			<span class="url">{{ url }}</span>
		</div>
		<div class="viewport">
			<slot />
		</div>
	</div>
</template>

<style scoped>
.browser {
	max-width: none;
	border: 1px solid #222;
	background: #fff;
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.browser.compact .viewport {
	min-height: 0;
	padding: 10px 12px 12px;
}

.chrome {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 7px 10px;
	border-bottom: 1px solid #d2d2d7;
	background: #f5f5f7;
}

.dots {
	display: inline-flex;
	gap: 5px;
}

.dots i {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #c7c7cc;
}

.dots i:first-child {
	background: #ff5f57;
}

.dots i:nth-child(2) {
	background: #febc2e;
}

.dots i:nth-child(3) {
	background: #28c840;
}

.url {
	flex: 1;
	min-width: 0;
	padding: 4px 10px;
	border: 1px solid #d2d2d7;
	border-radius: 6px;
	background: #fff;
	color: #555;
	font-size: 10px;
	line-height: 1.3;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.viewport {
	min-height: 8.5rem;
	padding: 14px 16px 16px;
	color: #1d1d1f;
	font-size: 12px;
	line-height: 1.45;
}
</style>
