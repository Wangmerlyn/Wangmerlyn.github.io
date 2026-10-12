<script setup>
const levels = [
	{
		tier: "顶层",
		title: "黑盒 Web 攻击",
		body: "只给一个 Web 应用，没有源码；在真实对外暴露面里自己找漏洞并完成利用。",
	},
	{
		tier: "中层",
		title: "源码 + CVE",
		body: "掌握源代码、服务版本与公开 CVE 时，能把信息与漏洞链组合起来打穿目标。",
	},
	{
		tier: "底层",
		title: "CTF 题目",
		body: "能解 CTF 赛题——题目环境清晰、目标明确，练的是基础漏洞与利用套路。",
	},
];
</script>

<template>
	<figure class="pyramid">
		<figcaption class="kicker">一种能力层级（个人理解）</figcaption>
		<div class="stack">
			<div
				v-for="(level, index) in levels"
				:key="level.tier"
				class="band"
				:class="['band-' + index, { top: index === 0 }]"
			>
				<div class="tier">{{ level.tier }}</div>
				<div class="title">{{ level.title }}</div>
				<p>{{ level.body }}</p>
			</div>
		</div>
		<p class="hint">越往上，信息越少、越接近真实场景，难度通常也越高。</p>
	</figure>
</template>

<style scoped>
.pyramid {
	margin: 0;
	max-width: none;
}

.kicker {
	margin: 0 0 10px;
	color: #555;
	font-size: 12px;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.stack {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
}

.band {
	box-sizing: border-box;
	width: calc(100% - 0px);
	padding: 10px 14px 11px;
	border: 1px solid #222;
	background: #fff;
	text-align: center;
}

.band-0 {
	width: 58%;
	background: #e8f2fc;
	border-color: #0071e3;
}

.band-1 {
	width: 76%;
	background: #f5f5f7;
}

.band-2 {
	width: 100%;
	background: #fff;
}

.tier {
	margin-bottom: 4px;
	color: #0071e3;
	font-size: 11px;
	font-weight: 650;
	letter-spacing: 0.06em;
}

.band-2 .tier {
	color: #555;
}

.title {
	margin-bottom: 4px;
	color: #1d1d1f;
	font-size: 15px;
	font-weight: 650;
	line-height: 1.3;
}

.band p {
	margin: 0;
	color: #555;
	font-size: 12px;
	line-height: 1.45;
}

.hint {
	margin: 10px 0 0;
	color: #86868b;
	font-size: 11px;
	line-height: 1.4;
	text-align: center;
}
</style>
