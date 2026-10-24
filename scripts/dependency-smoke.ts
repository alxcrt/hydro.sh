import assert from "node:assert/strict";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

// This script may write only to the disposable deployment fixture.
const database = new URL(process.env.DATABASE_URL || "");
assert.equal(database.pathname, "/hydro_update_test");
assert.ok(
	["dependency-db", "127.0.0.1", "localhost"].includes(database.hostname),
);
const api = "http://127.0.0.1:3001";
const origin = "http://127.0.0.1:3000";
const email = `update-${crypto.randomUUID()}@example.invalid`;
const password = `Fixture-${crypto.randomUUID()}`;
const response = await fetch(`${api}/api/auth/sign-up/email`, {
	method: "POST",
	headers: { "Content-Type": "application/json", Origin: origin },
	body: JSON.stringify({ name: "Hydro Verification Update", email, password }),
});
assert.equal(
	response.status,
	200,
	`Fixture signup failed (${response.status})`,
);
const signup = (await response.json()) as { user: { id: string } };
const cookies = response.headers
	.getSetCookie()
	.map((value) => value.split(";", 1)[0])
	.join("; ");
assert.ok(cookies.includes("session_token"));
const session = await fetch(`${api}/api/auth/get-session`, {
	headers: { Cookie: cookies },
});
assert.equal(
	((await session.json()) as { user: { id: string } }).user.id,
	signup.user.id,
);
const client: any = createORPCClient(
	new RPCLink({
		url: `${api}/rpc`,
		fetch: (url, options) =>
			fetch(url, {
				...options,
				headers: {
					...Object.fromEntries(new Headers(options?.headers)),
					Cookie: cookies,
					Origin: origin,
				},
			}),
	}),
);
const now = Date.now();
for (let i = 0; i < 7; i++)
	await client.water.create({
		amount: 100 + i * 10,
		timestamp: new Date(now - i * 60_000),
		bottleBrand: "Fixture",
		source: "manual",
	});
const range = {
	startDate: new Date(now - 24 * 60 * 60_000),
	endDate: new Date(now + 60_000),
};
assert.equal((await client.water.list({ ...range, limit: 5 })).length, 5);
assert.deepEqual(await client.water.summary(range), { total: 910, entries: 7 });
const device = await client.devices.create({
	name: "Fixture Bottle",
	bluetoothName: "Fixture",
	deviceIdentifier: crypto.randomUUID(),
});
assert.ok(
	(await client.devices.list()).some(
		(item: { id: string }) => item.id === device.id,
	),
);
await client.devices.update({ id: device.id, name: "Renamed Fixture" });
await client.devices.delete({ id: device.id });
assert.ok(
	!(await client.devices.list()).some(
		(item: { id: string }) => item.id === device.id,
	),
);
const anonymous: any = createORPCClient(new RPCLink({ url: `${api}/rpc` }));
await assert.rejects(() => anonymous.water.summary(range));
const denied = await fetch(`${api}/api/auth/sign-in/email`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Origin: "https://untrusted.invalid",
	},
	body: JSON.stringify({ email, password }),
});
assert.equal(denied.status, 403);
// Run the other chat's actual data/pagination/isolation regressions too.
const tests = Bun.spawn(
	["bun", "test", "src/routers/water.integration.test.ts"],
	{
		cwd: "apps/server",
		env: { ...process.env, HYDRO_TEST_USER_ID: signup.user.id },
		stdout: "inherit",
		stderr: "inherit",
	},
);
assert.equal(await tests.exited, 0);
assert.equal((await fetch(origin)).status, 200);
console.log(
	"Production fixture passed: auth/session, total beyond pagination, device CRUD, origin rejection, isolated access and five DB regressions.",
);
