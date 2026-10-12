<template>
	<div class="term">
		<slot />
	</div>
</template>

<style scoped>
.term {
	max-width: none;
	margin: 0.5em 0 0;
	padding: 10px 12px;
	overflow: auto;
	border: 1px solid #222;
	background: #fafafa;
	color: #1d1d1f;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 11px;
	line-height: 1.55;
}

/* MDC turns each blank-line-separated block into <p>; stack them like terminal lines. */
.term :deep(p) {
	margin: 0;
}

.term :deep(p + p) {
	margin-top: 0.15em;
}
</style>
