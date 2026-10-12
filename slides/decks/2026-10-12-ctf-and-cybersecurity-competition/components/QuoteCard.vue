<script setup>
import { computed, ref } from "vue";

const props = defineProps({
	kind: { type: String, default: "thought" },
	kicker: { type: String, default: "" },
	raw: { type: String, default: "" },
	plain: { type: String, default: "" },
	wide: { type: Boolean, default: false },
});

const labels = {
	thought: "Agent chain-of-thought",
	board: "Post sent to message board",
};

const rawTab = computed(() => (props.kind === "board" ? "Raw message" : "Raw CoT"));
const hasToggle = computed(() => Boolean(props.raw && props.plain && props.raw !== props.plain));
const tab = ref("plain");
const shown = computed(() => {
	if (!hasToggle.value)
		return props.plain || props.raw || "";
	return tab.value === "raw" ? props.raw : props.plain;
});
</script>

<template>
	<figure class="quote-card" :class="{ wide }" :data-kind="kind">
		<figcaption class="quote-kicker">
			<span class="quote-label">
				<QuoteIcon :name="kind" :size="15" />
				{{ kicker || labels[kind] || labels.thought }}
			</span>
			<div v-if="hasToggle" class="quote-tabs">
				<button type="button" :class="{ active: tab === 'raw' }" @click="tab = 'raw'">{{ rawTab }}</button>
				<button type="button" :class="{ active: tab === 'plain' }" @click="tab = 'plain'">Plain language</button>
			</div>
		</figcaption>
		<blockquote class="quote-body">
			<template v-if="raw || plain">{{ shown }}</template>
			<slot v-else />
		</blockquote>
	</figure>
</template>

<style scoped>
.quote-card {
	display: flex;
	flex-direction: column;
	max-width: 42em;
	margin: 0.7em 0 0;
	padding: 10px 14px 12px;
	border: 1px solid #222;
	background: #fff;
}

.quote-card.wide {
	max-width: none;
}

.quote-card[data-kind="board"] {
	border-left: 3px solid #0071e3;
}

.quote-card[data-kind="thought"] {
	border-left: 3px solid #86868b;
}

.quote-kicker {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	margin-bottom: 8px;
	font-size: 12px;
	color: #555;
}

.quote-label {
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
}

.quote-tabs {
	display: flex;
	gap: 2px;
	flex-shrink: 0;
}

.quote-tabs button {
	margin: 0;
	padding: 2px 8px;
	border: 1px solid #d2d2d7;
	background: #fff;
	color: #555;
	font: inherit;
	font-size: 11px;
	line-height: 1.4;
	cursor: pointer;
}

.quote-tabs button.active {
	border-color: #0071e3;
	background: #0071e3;
	color: #fff;
}

.quote-body {
	margin: 0;
	quotes: none;
	font-size: 15px;
	line-height: 1.45;
}

.quote-body::before,
.quote-body::after {
	content: none;
}

.quote-card[data-kind="thought"] .quote-body {
	color: #1d1d1f;
	font-style: italic;
}

.quote-card[data-kind="board"] .quote-body {
	color: #111;
	font-style: normal;
	font-size: 13px;
	line-height: 1.5;
	word-break: break-word;
}

.quote-body :deep(p) {
	margin: 0;
}
</style>
