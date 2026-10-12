<template>
	<p class="flag-line">
		<slot />
	</p>
</template>

<style scoped>
.flag-line {
	margin: 0.85em 0 0;
	text-align: center;
	font-size: 1.05em;
	line-height: 1.35;
}

.flag-line :deep(code) {
	padding: 0.12em 0.45em;
	border: 1px solid #222;
	background: #e8f2fc;
	color: #1d1d1f;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 1.08em;
	font-weight: 650;
	letter-spacing: 0.01em;
}

.flag-line :deep(strong) {
	font-weight: 650;
}
</style>
