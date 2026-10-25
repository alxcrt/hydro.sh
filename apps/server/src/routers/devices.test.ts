import { describe, expect, mock, test } from "bun:test";
import { call } from "@orpc/server";
import type { SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import type { Context } from "../lib/context";

const deleteConditions: SQL[] = [];
const dialect = new PgDialect();

mock.module("@/db", () => ({
	db: {
		delete: () => ({
			where: async (condition: SQL) => {
				deleteConditions.push(condition);
				const query = dialect.sqlToQuery(condition);
				return {
					rowCount:
						query.params[0] === "device-id" && query.params[1] === "owner"
							? 1
							: 0,
				};
			},
		}),
	},
}));

const { devicesRouter } = await import("./devices");

describe("device deletion", () => {
	test.each(["owner", "another-user"])(
		"scopes the delete query to %s",
		async (userId) => {
			deleteConditions.length = 0;
			const context = { session: { user: { id: userId } } } as Context;

			expect(
				await call(devicesRouter.delete, { id: "device-id" }, { context }),
			).toMatchObject({ rowCount: userId === "owner" ? 1 : 0 });
			expect(deleteConditions).toHaveLength(1);
			const [condition] = deleteConditions;
			if (!condition) throw new Error("delete query was not issued");
			const query = dialect.sqlToQuery(condition);
			expect(query.sql).toBe(
				'("device"."id" = $1 and "device"."user_id" = $2)',
			);
			expect(query.params).toEqual(["device-id", userId]);
		},
	);

	test("rejects an unauthenticated delete before querying", async () => {
		deleteConditions.length = 0;
		await expect(
			call(
				devicesRouter.delete,
				{ id: "device-id" },
				{ context: { session: null } as Context },
			),
		).rejects.toMatchObject({ code: "UNAUTHORIZED" });
		expect(deleteConditions).toHaveLength(0);
	});
});
