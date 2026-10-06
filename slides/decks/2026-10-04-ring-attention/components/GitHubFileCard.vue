<script setup lang="ts">
const href =
	"https://github.com/NVIDIA/Megatron-LM/blob/main/megatron/core/utils.py#L2630-L2640";
</script>

<template>
	<a class="gh-card" :href="href" target="_blank" rel="noreferrer">
		<div class="gh-kicker">
			<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
				<path
					fill="currentColor"
					d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 4.84c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
				/>
			</svg>
			NVIDIA/Megatron-LM · megatron/core/utils.py
		</div>
		<pre class="gh-code"><code>"""Partition a batch across CP ranks with per-sequence zigzag load balancing.

The sequence is split into 2 * cp_size equal chunks and assigned
in a zigzag pattern: for CP=2, the 4 chunks are assigned as
(chunk_0, chunk_3) → GPU 0 and (chunk_1, chunk_2) → GPU 1
"""</code></pre>
	</a>
</template>

<style scoped>
.gh-card {
	display: block;
	margin-top: 0.7em;
	padding: 10px 12px;
	color: inherit;
	text-decoration: none;
	border: 1px solid #222;
	background: #fff;
}
.gh-kicker {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 8px;
	font-size: 12px;
	font-weight: 650;
}
.gh-code {
	margin: 0;
	padding: 0;
	font-size: 12px;
	line-height: 1.45;
	white-space: pre-wrap;
	overflow: hidden;
}
.gh-code code {
	font-family: inherit;
}
</style>
