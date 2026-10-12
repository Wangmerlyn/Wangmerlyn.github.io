/** HSCTF 10 mogodb — client-side replica of vulnerable find_one($where). */

export const MOGODB_FLAG = "flag{easier_than_picture_lab_at_least}";

/** Walkthrough slide pre-fill (password field). */
export const MOGODB_DEMO_PASSWORD = "'||'a";

const ADMIN_PASSWORD = "hsctf-admin-not-in-source";

/** @typedef {{ user: string, password: string, admin: boolean }} MogodbUser */

/** @returns {MogodbUser[]} */
export function seedUsers() {
	return [
		{ user: "admin", password: ADMIN_PASSWORD, admin: true },
	];
}

/**
 * Same string shape as main.py f-string (intentionally unsafe).
 * @param {string} user
 * @param {string} password
 */
export function buildWhereExpression(user, password) {
	return `this.user === '${user}' && this.password === '${password}'`;
}

/**
 * @param {MogodbUser[]} users
 * @param {string} user
 * @param {string} password
 * @returns {MogodbUser | null}
 */
export function findOneVulnerable(users, user, password) {
	const source = buildWhereExpression(user, password);
	for (const doc of users) {
		let ok = false;
		try {
			// MongoDB $where: `this` is the document.
			const fn = new Function(`return ${source}`);
			ok = Boolean(fn.call(doc));
		}
		catch {
			const err = new Error("database error");
			err.code = "PyMongoError";
			throw err;
		}
		if (ok)
			return doc;
	}
	return null;
}

/**
 * @param {MogodbUser[]} users
 * @param {string} user
 * @param {string} password
 */
export function registerUser(users, user, password) {
	if (!user || !password)
		return { ok: false, error: "user and password required" };
	if (users.some((u) => u.user === user))
		return { ok: false, error: "user already exists" };
	users.push({ user, password, admin: false });
	return { ok: true, user };
}
