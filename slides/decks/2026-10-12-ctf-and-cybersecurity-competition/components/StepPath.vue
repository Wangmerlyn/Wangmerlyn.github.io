<template>
	<section class="path">
		<slot />
	</section>
</template>

<style scoped>
.path {
	max-width: 56em;
	margin-top: 0.65em;
	padding: 4px 0 2px;
	border-top: 1px solid #222;
	border-bottom: 1px solid #222;
}

.path :deep(ul) {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 22px;
	list-style: none;
	margin: 0;
	padding: 14px 0 12px;
	counter-reset: step;
}

.path :deep(li) {
	min-width: 0;
	margin: 0;
	color: #555;
	font-size: 13px;
	line-height: 1.45;
}

.path :deep(li)::before {
	counter-increment: step;
	content: counter(step, decimal-leading-zero);
	display: block;
	margin-bottom: 8px;
	color: #0071e3;
	font-size: 18px;
	font-weight: 650;
	letter-spacing: -0.03em;
	line-height: 1;
}

.path :deep(strong) {
	display: block;
	margin-bottom: 6px;
	color: #1d1d1f;
	font-size: 16px;
	font-weight: 650;
	line-height: 1.3;
}

.path :deep(p) {
	margin: 0;
}
</style>
