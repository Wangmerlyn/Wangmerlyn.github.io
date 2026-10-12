const FLAG = "flag{easier_than_picture_lab_at_least}";

/** @type {{ user: string, password: string, admin: boolean }[]} */
let users = [{ user: "admin", password: "hsctf-admin-not-in-source", admin: true }];
let session = null;
let lastQuery = "";

const root = document.getElementById("app");

function buildWhere(user, password) {
	return `this.user === '${user}' && this.password === '${password}'`;
}

function findOne(user, password) {
	const source = buildWhere(user, password);
	for (const doc of users) {
		try {
			const fn = new Function(`return ${source}`);
			if (fn.call(doc))
				return doc;
		}
		catch {
			throw new Error("database error");
		}
	}
	return null;
}

function render() {
	if (!root)
		return;
	if (session) {
		root.innerHTML = `
			<h2>mogodb</h2>
			<p class="welcome">Welcome, ${escapeHtml(session.user)}</p>
			${session.admin ? `<p class="flag">The flag is ${FLAG}</p>` : ""}
			<p style="text-align:center"><button type="button" id="logout">Log out</button></p>
			<p class="foot">Standalone HSCTF 10 mogodb replica</p>
		`;
		root.querySelector("#logout")?.addEventListener("click", () => {
			session = null;
			render();
		});
		return;
	}

	root.innerHTML = `
		<h1>mogodb</h1>
		<p class="tagline">The web-scale DB of the future!</p>
		<div id="err" class="error hidden"></div>
		<form id="login">
			<h3>Login</h3>
			<label>Username<input name="user" required /></label>
			<label>Password<input name="password" required /></label>
			<button type="submit">Login</button>
		</form>
		<form id="register" class="secondary">
			<h3>Register</h3>
			<label>Username<input name="user" required /></label>
			<label>Password<input name="password" required /></label>
			<button type="submit">Register</button>
		</form>
		${lastQuery ? `<div class="query"><strong>$where</strong><br /><code>${escapeHtml(lastQuery)}</code></div>` : ""}
		<p class="foot">Standalone HSCTF 10 mogodb replica</p>
	`;

	const err = root.querySelector("#err");
	const showErr = (msg) => {
		if (!err)
			return;
		err.textContent = msg;
		err.classList.toggle("hidden", !msg);
	};

	root.querySelector("#register")?.addEventListener("submit", (e) => {
		e.preventDefault();
		showErr("");
		const fd = new FormData(e.target);
		const user = String(fd.get("user") || "").trim();
		const password = String(fd.get("password") || "");
		if (users.some((u) => u.user === user))
			return showErr("user already exists");
		users.push({ user, password, admin: false });
		e.target.reset();
	});

	root.querySelector("#login")?.addEventListener("submit", (e) => {
		e.preventDefault();
		showErr("");
		const fd = new FormData(e.target);
		const user = String(fd.get("user") || "");
		const password = String(fd.get("password") || "");
		if (!user)
			return showErr("user not provided");
		if (!password)
			return showErr("password not provided");
		lastQuery = buildWhere(user, password);
		try {
			const doc = findOne(user, password);
			if (!doc)
				return showErr("invalid credentials");
			session = { user: doc.user, admin: doc.admin };
			render();
		}
		catch {
			showErr("database error");
		}
	});
}

function escapeHtml(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

render();
