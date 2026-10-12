<script setup>
const before = {
	label: "注入前",
	user: "admin",
	pass: "错误密码",
	sql: `SELECT * FROM users
WHERE username = 'admin'
AND password = '错误密码';`,
	effect: "校验用户名与密码",
	result: "登录失败",
	ok: false,
};

const after = {
	label: "注入后",
	user: "admin' --",
	pass: "随便输入",
	sql: `SELECT * FROM users
WHERE username = 'admin' -- '
AND password = '随便输入';`,
	effective: `SELECT * FROM users
WHERE username = 'admin';`,
	effect: "密码条件被 -- 注释掉",
	result: "以 admin 身份登录",
	ok: true,
};
</script>

<template>
	<div class="sqli">
		<p class="lead">
			攻击者<strong>不知道管理员密码</strong>，但若登录页把输入拼进 SQL，用户名填
			<code>admin' --</code> 可能骗过后台校验。
		</p>

		<div class="cols">
			<section class="panel" :class="{ fail: !before.ok }">
				<div class="tag">{{ before.label }}</div>
				<dl class="fields">
					<div><dt>用户名</dt><dd><code>{{ before.user }}</code></dd></div>
					<div><dt>密码</dt><dd>{{ before.pass }}</dd></div>
				</dl>
				<pre class="code" aria-label="注入前执行的 SQL"><code>{{ before.sql }}</code></pre>
				<div class="foot">
					<span class="hint">{{ before.effect }}</span>
					<span class="pill">{{ before.result }}</span>
				</div>
			</section>

			<div class="arrow" aria-hidden="true">→</div>

			<section class="panel" :class="{ ok: after.ok }">
				<div class="tag">{{ after.label }}</div>
				<dl class="fields">
					<div><dt>用户名</dt><dd><code>{{ after.user }}</code></dd></div>
					<div><dt>密码</dt><dd>{{ after.pass }}</dd></div>
				</dl>
				<div class="code-stack" aria-label="拼接后的 SQL 与等价执行">
					<pre class="code"><code><span class="kw">SELECT</span> * <span class="kw">FROM</span> users
<span class="kw">WHERE</span> username = <span class="str">'admin'</span> <span class="cmt">-- '</span>
<span class="dead">AND password = '随便输入';</span></code></pre>
					<div class="equiv-bar">等价执行</div>
					<pre class="code code-equiv"><code><span class="kw">SELECT</span> * <span class="kw">FROM</span> users
<span class="kw">WHERE</span> username = <span class="str">'admin'</span>;</code></pre>
				</div>
				<div class="foot">
					<span class="hint">{{ after.effect }}</span>
					<span class="pill ok">{{ after.result }}</span>
				</div>
			</section>
		</div>

		<p class="note">
			仅对<strong>字符串拼接 SQL</strong>且未过滤的站点成立；<strong>参数化查询</strong>会把输入当数据而非语句片段。
		</p>
	</div>
</template>

<style scoped>
.sqli {
	max-width: 56em;
	margin-top: 0.35em;
}

.lead {
	margin: 0 0 0.65em;
	color: #555;
	font-size: 14px;
	line-height: 1.5;
}

.lead strong {
	color: #1d1d1f;
	font-weight: 650;
}

.lead code {
	padding: 0.1em 0.35em;
	border: 1px solid #d2d2d7;
	background: #f5f5f7;
	font-size: 0.92em;
}

.cols {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
	gap: 10px;
	align-items: start;
}

.arrow {
	align-self: center;
	color: #0071e3;
	font-size: 22px;
	font-weight: 650;
	line-height: 1;
}

.panel {
	display: flex;
	flex-direction: column;
	min-width: 0;
	padding: 10px 12px 12px;
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
	margin-bottom: 8px;
	color: #555;
	font-size: 11px;
	letter-spacing: 0.06em;
	text-transform: uppercase;
}

.fields {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 8px;
	margin: 0 0 8px;
}

.fields > div {
	min-width: 0;
}

.fields dt {
	margin: 0 0 2px;
	color: #86868b;
	font-size: 11px;
}

.fields dd {
	margin: 0;
	color: #1d1d1f;
	font-size: 13px;
	line-height: 1.35;
}

.fields code {
	font-size: 12px;
}

.code-stack {
	border: 1px solid #d2d2d7;
	background: #fafafa;
}

.code {
	margin: 0;
	padding: 8px 10px;
	border: 0;
	background: transparent;
	color: #1d1d1f;
	font-family: inherit;
	font-size: 11px;
	line-height: 1.45;
	white-space: pre;
	overflow: visible;
}

.panel > .code {
	border: 1px solid #d2d2d7;
	background: #fafafa;
}

.equiv-bar {
	padding: 4px 10px;
	border-top: 1px dashed #0071e3;
	border-bottom: 1px solid #0071e3;
	background: #e8f2fc;
	color: #0071e3;
	font-size: 10px;
	font-weight: 650;
	letter-spacing: 0.04em;
}

.code-equiv {
	background: #f0f7ff;
}

.kw {
	color: #0071e3;
	font-weight: 600;
}

.str {
	color: #b45309;
}

.cmt {
	color: #0071e3;
	font-weight: 650;
}

.dead {
	color: #86868b;
	text-decoration: line-through;
	text-decoration-color: #c7c7cc;
}

.foot {
	display: flex;
	flex-wrap: wrap;
	gap: 6px 10px;
	align-items: center;
	justify-content: space-between;
	margin-top: 8px;
}

.hint {
	color: #555;
	font-size: 11px;
	line-height: 1.35;
}

.pill {
	padding: 3px 8px;
	border: 1px solid #222;
	background: #f5f5f7;
	color: #1d1d1f;
	font-size: 12px;
	font-weight: 650;
	white-space: nowrap;
}

.pill.ok {
	border-color: #0071e3;
	background: #e8f2fc;
	color: #0071e3;
}

.note {
	margin: 0.55em 0 0;
	color: #86868b;
	font-size: 11px;
	line-height: 1.45;
}

.note strong {
	color: #555;
	font-weight: 650;
}
</style>
