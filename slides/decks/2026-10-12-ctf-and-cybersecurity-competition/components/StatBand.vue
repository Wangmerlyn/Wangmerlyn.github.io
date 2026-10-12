<template>
	<section class="band">
		<slot />
	</section>
</template>

<style scoped>
.band {
	max-width: 56em;
	margin-top: 0.55em;
	border: 1px solid #222;
	background: #fff;
}

.band :deep(ul) {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	list-style: none;
	margin: 0;
	padding: 0;
}

.band :deep(li) {
	min-width: 0;
	margin: 0;
	padding: 14px 16px 16px;
	color: #555;
	font-size: 13px;
	line-height: 1.4;
	border-right: 1px solid #222;
}

.band :deep(li:last-child) {
	border-right: 0;
}

.band :deep(strong) {
	display: block;
	margin-bottom: 8px;
	color: #1d1d1f;
	font-size: 26px;
	font-weight: 650;
	letter-spacing: -0.04em;
	line-height: 1.1;
}

.band :deep(p) {
	margin: 0;
}
</style>
