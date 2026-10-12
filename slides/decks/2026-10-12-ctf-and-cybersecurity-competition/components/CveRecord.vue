<template>
	<section class="record">
		<p v-if="$slots.meta" class="meta">
			<slot name="meta" />
		</p>
		<div v-if="$slots.default" class="body">
			<slot />
		</div>
	</section>
</template>

<style scoped>
.record {
	margin-top: 0.45em;
	padding: 12px 14px;
	border: 1px solid #222;
	border-left: 3px solid #0071e3;
	background: #fafafa;
}

.meta {
	margin: 0 0 10px;
	color: #555;
	font-size: 11px;
	line-height: 1.5;
}

.meta :deep(p) {
	margin: 0 0 0.35em;
}

.meta :deep(p:last-child) {
	margin-bottom: 0;
}

.meta :deep(strong) {
	color: #1d1d1f;
	font-weight: 650;
}

.body {
	color: #1d1d1f;
	font-size: 11px;
	line-height: 1.55;
}

.body :deep(p) {
	margin: 0 0 0.65em;
}

.body :deep(p:last-child) {
	margin-bottom: 0;
}

.body :deep(strong) {
	font-weight: 650;
}
</style>
