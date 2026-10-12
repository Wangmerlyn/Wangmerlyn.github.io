<script setup>
import { MOGODB_DEMO_PASSWORD } from "../lib/mogodbChallenge.js";

const props = defineProps({
	url: { type: String, default: "http://mogodb.hsctf.com/" },
	showQuery: { type: Boolean, default: false },
	initialUser: { type: String, default: "" },
	initialPassword: { type: String, default: "" },
	/** Pre-fill HSCTF solve: admin / '||'a */
	demoPayload: { type: Boolean, default: false },
	compact: { type: Boolean, default: true },
	/** Open bundled static replica in new tab (same logic as MogodbApp). */
	/** Dev: `slides/public/mogodb` → deck copy; production: copy `mogodb/` beside built `index.html`. */
	standaloneHref: { type: String, default: "./mogodb/" },
});
</script>

<template>
	<div class="wrap">
		<BrowserMock :url="url" :compact="compact">
			<MogodbApp
				:show-query="props.showQuery"
				:initial-user="props.demoPayload ? 'admin' : props.initialUser"
				:initial-password="props.demoPayload ? MOGODB_DEMO_PASSWORD : props.initialPassword"
				:compact="props.compact"
			/>
		</BrowserMock>
		<a
			v-if="standaloneHref"
			class="open-tab"
			:href="standaloneHref"
			target="_blank"
			rel="noreferrer"
		>在新标签页打开还原实例 ↗</a>
	</div>
</template>

<style scoped>
.wrap {
	max-width: none;
}

.open-tab {
	display: inline-block;
	margin-top: 0.35em;
	color: #0071e3;
	font-size: 10px;
	font-weight: 650;
	text-decoration: none;
}

.open-tab:hover {
	text-decoration: underline;
}
</style>
