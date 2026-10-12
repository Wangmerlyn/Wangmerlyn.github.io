<script setup>
import { MOGODB_DEMO_PASSWORD } from "../lib/mogodbChallenge.js";

defineProps({
	user: { type: String, default: "admin" },
	password: { type: String, default: MOGODB_DEMO_PASSWORD },
});
</script>

<template>
	<div class="where-demo">
		<p class="lead">
			输入被拼进 MongoDB <code>$where</code> 里的 JavaScript —— 和 SQL 注入同一思想，只是语法换成 JS。
		</p>
		<div class="cols">
			<section class="panel fail">
				<div class="tag">正常 admin 校验（猜不到密码）</div>
				<pre class="code"><code>this.user === 'admin'
  && this.password === '???'</code></pre>
				<span class="pill">无匹配 → 登录失败</span>
			</section>
			<div class="arrow" aria-hidden="true">→</div>
			<section class="panel ok">
				<div class="tag">密码填 <code>{{ password }}</code></div>
				<pre class="code"><code>this.user === '{{ user }}'
  && this.password === '{{ password }}'</code></pre>
				<pre class="code equiv"><code>(this.user === 'admin'
  && this.password === '')
  || 'a'   ← truthy，恒真</code></pre>
				<span class="pill ok">匹配 admin 文档 → 登录成功</span>
			</section>
		</div>
	</div>
</template>

<style scoped>
.where-demo {
	max-width: none;
	margin-top: 0.35em;
}

.lead {
	margin: 0 0 0.55em;
	color: #555;
	font-size: 12px;
	line-height: 1.45;
}

.lead code {
	font-size: 0.95em;
}

.cols {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 10px;
	align-items: stretch;
}

.panel {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 10px 12px;
	border: 1px solid #222;
	background: #fff;
}

.panel.fail {
	border-left: 3px solid #86868b;
}

.panel.ok {
	border-left: 3px solid #0071e3;
}

.tag {
	font-size: 11px;
	font-weight: 650;
	line-height: 1.35;
}

.code {
	margin: 0;
	padding: 8px 9px;
	overflow: auto;
	border: 1px solid #d2d2d7;
	background: #fafafa;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 10px;
	line-height: 1.45;
	white-space: pre-wrap;
}

.code.equiv {
	border-color: #0071e3;
	background: #f7fbff;
}

.arrow {
	align-self: center;
	color: #888;
	font-size: 14px;
}

.pill {
	align-self: flex-start;
	padding: 2px 8px;
	border: 1px solid #222;
	font-size: 10px;
	font-weight: 650;
}

.pill.ok {
	border-color: #0071e3;
	background: #e8f2fc;
}
</style>
