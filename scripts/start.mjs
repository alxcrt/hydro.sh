import { spawn } from "node:child_process";

const children = [
	spawn("bun", ["run", "start"], {
		cwd: "apps/server",
		stdio: "inherit",
		env: process.env,
	}),
	spawn("node", [".output/server/index.mjs"], {
		cwd: "apps/web",
		stdio: "inherit",
		env: {
			...process.env,
			HOST: "0.0.0.0",
			PORT: "3000",
			NITRO_HOST: "0.0.0.0",
			NITRO_PORT: "3000",
		},
	}),
];
let stopping = false;
function stop(code) {
	if (stopping) return;
	stopping = true;
	for (const child of children) child.kill("SIGTERM");
	process.exitCode = code;
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => stop(0));
for (const child of children) {
	child.on("error", () => stop(1));
	child.on("exit", (code) => stop(code || 1));
}
