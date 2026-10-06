<template>
	<div class="ptx">
		<slot />
	</div>
</template>

<style scoped>
.ptx {
	margin-top: 0.6rem;
}

.ptx :deep(ul) {
	list-style: none;
	margin: 0;
	padding: 0;
	border-top: 1px solid #d2d2d7;
}

.ptx :deep(li) {
	display: grid;
	grid-template-columns: 11rem minmax(0, 1fr);
	gap: 1rem;
	align-items: baseline;
	padding: 0.55rem 0;
	margin: 0;
	border-bottom: 1px solid #d2d2d7;
	color: #1d1d1f;
	font-size: 0.92rem;
	line-height: 1.45;
}

.ptx :deep(strong) {
	font-weight: 650;
	letter-spacing: -0.02em;
}

.ptx :deep(p) {
	margin: 0;
}
</style>
