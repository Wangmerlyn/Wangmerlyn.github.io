<script setup>
import { computed, useSlots } from "vue";

const slots = useSlots();

function textFromVnodes(nodes) {
	if (!nodes?.length)
		return "";
	return nodes
		.map((node) => {
			if (typeof node.children === "string")
				return node.children;
			if (Array.isArray(node.children))
				return textFromVnodes(node.children);
			if (node.children && typeof node.children === "object")
				return textFromVnodes([node.children]);
			return "";
		})
		.filter(Boolean)
		.join("\n");
}

const rows = computed(() => {
	const text = textFromVnodes(slots.default?.() ?? []);
	return text
		.split("\n")
		.map((line) => line.trim().replace(/\\([{}])/g, "$1"))
		.filter(Boolean);
});
</script>

<template>
	<div v-if="rows.length" class="puzzle">
		<div
			v-for="(row, index) in rows"
			:key="index"
			class="row"
			:class="{ highlight: index === 0 }"
		>
			{{ row }}
		</div>
	</div>
</template>

<style scoped>
.puzzle {
	margin-top: 0.45em;
	border: 1px solid #222;
	background: #fafafa;
}

.row {
	padding: 9px 12px;
	border-bottom: 1px solid #d2d2d7;
	color: #1d1d1f;
	font-family: inherit;
	font-size: 12px;
	line-height: 1.45;
	white-space: pre-wrap;
}

.row:last-child {
	border-bottom: 0;
}

.row.highlight {
	background: #e8f2fc;
	font-weight: 650;
}
</style>
