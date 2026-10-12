<script setup>
import { computed, ref } from "vue";
import {
	buildWhereExpression,
	findOneVulnerable,
	MOGODB_FLAG,
	registerUser,
	seedUsers,
} from "../lib/mogodbChallenge.js";

const props = defineProps({
	showQuery: { type: Boolean, default: false },
	initialUser: { type: String, default: "" },
	initialPassword: { type: String, default: "" },
	compact: { type: Boolean, default: false },
});

const view = ref("main");
const users = ref(seedUsers());
const session = ref(null);
const error = ref("");
const loginUser = ref(props.initialUser);
const loginPassword = ref(props.initialPassword);
const regUser = ref("");
const regPassword = ref("");
const lastQuery = ref("");

const path = computed(() => (view.value === "home" ? "/home" : "/"));

function clearError() {
	error.value = "";
}

function goMain() {
	view.value = "main";
	session.value = null;
	clearError();
}

function onRegister() {
	clearError();
	const name = regUser.value.trim();
	const result = registerUser(users.value, name, regPassword.value);
	if (!result.ok) {
		error.value = result.error;
		return;
	}
	regUser.value = "";
	regPassword.value = "";
	error.value = "";
	if (result.user)
		loginUser.value = result.user;
}

function onLogin() {
	clearError();
	const user = loginUser.value;
	const password = loginPassword.value;
	if (!user)
		return (error.value = "user not provided");
	if (!password)
		return (error.value = "password not provided");

	lastQuery.value = buildWhereExpression(user, password);
	try {
		const doc = findOneVulnerable(users.value, user, password);
		if (!doc)
			return (error.value = "invalid credentials");
		session.value = { user: doc.user, admin: doc.admin };
		view.value = "home";
	}
	catch {
		error.value = "database error";
	}
}
</script>

<template>
	<div class="app" :class="{ compact }">
		<header v-if="view === 'main'" class="hero">
			<h1>mogodb</h1>
			<p class="tagline">The web-scale DB of the future!</p>
		</header>
		<header v-else class="hero compact-head">
			<h2>mogodb</h2>
		</header>

		<p v-if="error" class="error" role="alert">{{ error }}</p>

		<template v-if="view === 'main'">
			<form class="block" @submit.prevent="onLogin">
				<h3>Login</h3>
				<label>
					<span>Username</span>
					<input v-model="loginUser" type="text" autocomplete="username" />
				</label>
				<label>
					<span>Password</span>
					<input v-model="loginPassword" type="text" autocomplete="current-password" />
				</label>
				<button type="submit">Login</button>
			</form>

			<form class="block secondary" @submit.prevent="onRegister">
				<h3>Register</h3>
				<label>
					<span>Username</span>
					<input v-model="regUser" type="text" autocomplete="off" />
				</label>
				<label>
					<span>Password</span>
					<input v-model="regPassword" type="text" autocomplete="new-password" />
				</label>
				<button type="submit">Register</button>
			</form>

			<p v-if="showQuery && lastQuery" class="query">
				<span class="query-kicker">$where</span>
				<code>{{ lastQuery }}</code>
			</p>
		</template>

		<template v-else>
			<p class="welcome">Welcome, {{ session?.user }}</p>
			<p v-if="session?.admin" class="flag">The flag is {{ MOGODB_FLAG }}</p>
			<button type="button" class="linkish" @click="goMain">Log out</button>
		</template>

		<p class="foot">本地还原 · HSCTF 10 mogodb · 路径 {{ path }}</p>
	</div>
</template>

<style scoped>
.app {
	max-width: 22em;
	margin: 0 auto;
	text-align: center;
	color: #1d1d1f;
}

.app.compact .block {
	padding: 8px 0 0;
}

.hero h1,
.hero h2 {
	margin: 0;
	font-size: 1.45em;
	font-weight: 700;
}

.compact-head h2 {
	font-size: 1.2em;
}

.tagline {
	margin: 4px 0 10px;
	color: #555;
	font-size: 0.92em;
}

.error {
	margin: 0 0 8px;
	padding: 6px 8px;
	border: 1px solid #b42318;
	background: #fef3f2;
	color: #b42318;
	font-size: 0.85em;
	text-align: left;
}

.block {
	display: grid;
	gap: 6px;
	margin: 0 0 10px;
	padding: 10px 0 0;
	border-top: 1px solid #e8e8ed;
	text-align: left;
}

.block.secondary {
	border-top-style: dashed;
}

.block h3 {
	margin: 0 0 4px;
	font-size: 0.95em;
	font-weight: 650;
}

.block label {
	display: grid;
	gap: 2px;
	font-size: 0.82em;
	color: #555;
}

.block input {
	padding: 5px 7px;
	border: 1px solid #86868b;
	border-radius: 4px;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 0.85em;
}

.block button {
	justify-self: start;
	margin-top: 2px;
	padding: 5px 10px;
	border: 1px solid #222;
	border-radius: 4px;
	background: #f5f5f7;
	font: inherit;
	font-size: 0.88em;
	font-weight: 650;
	cursor: pointer;
}

.block button:hover {
	background: #ebebef;
}

.query {
	margin: 8px 0 0;
	padding: 8px 9px;
	border: 1px solid #0071e3;
	background: #f7fbff;
	text-align: left;
	font-size: 0.78em;
	line-height: 1.4;
}

.query-kicker {
	display: block;
	margin-bottom: 4px;
	color: #004a99;
	font-weight: 650;
	text-transform: uppercase;
	letter-spacing: 0.04em;
}

.query code {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	word-break: break-all;
}

.welcome {
	margin: 0.35em 0 0;
	font-size: 1.05em;
	font-weight: 650;
}

.flag {
	margin: 0.65em 0 0;
	padding: 8px 10px;
	border: 1px solid #0071e3;
	border-radius: 4px;
	background: #e8f2fc;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 0.88em;
	font-weight: 650;
	word-break: break-all;
}

.linkish {
	margin-top: 10px;
	padding: 0;
	border: none;
	background: none;
	color: #0071e3;
	font: inherit;
	font-size: 0.85em;
	cursor: pointer;
	text-decoration: underline;
}

.foot {
	margin: 10px 0 0;
	color: #86868b;
	font-size: 0.68em;
	line-height: 1.35;
}
</style>
