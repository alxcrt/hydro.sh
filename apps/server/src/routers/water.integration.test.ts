import { beforeAll, describe, expect, test } from "bun:test";
import { call } from "@orpc/server";
import type { Context } from "../lib/context";

// Explicit opt-in: use only a disposable verification account, never real data.
describe.skipIf(!process.env.HYDRO_TEST_USER_ID)(
	"daily hydration summary",
	() => {
		let router: typeof import("./water").waterRouter;
		let context: Context;
		let startDate: Date;
		let endDate: Date;
		let expectedTotal: number;
		let expectedCount: number;

		beforeAll(async () => {
			const { db } = await import("../db");
			const { eq } = await import("drizzle-orm");
			const schema = await import("../db/schema");
			const id = process.env.HYDRO_TEST_USER_ID!;
			const user = await db.query.user.findFirst({
				where: eq(schema.user.id, id),
			});
			if (
				!user?.email.endsWith("@example.invalid") ||
				!user.name.startsWith("Hydro Verification")
			) {
				throw new Error("A disposable Hydro Verification account is required");
			}
			const rows = await db.query.waterIntake.findMany({
				where: eq(schema.waterIntake.userId, id),
			});
			if (rows.length < 6)
				throw new Error(
					"Create at least six test intakes to exercise pagination",
				);
			startDate = new Date(
				Math.min(...rows.map((x) => x.timestamp.getTime())) - 1,
			);
			endDate = new Date(
				Math.max(...rows.map((x) => x.timestamp.getTime())) + 1,
			);
			expectedTotal = rows.reduce((sum, x) => sum + Number(x.amount), 0);
			expectedCount = rows.length;
			context = { session: { user: { id } } } as unknown as Context;
			router = (await import("./water")).waterRouter;
		});

		test("the total includes entries beyond the five-row recent log", async () => {
			const recent = await call(
				router.list,
				{ startDate, endDate, limit: 5 },
				{ context },
			);
			const summary = await call(
				router.summary,
				{ startDate, endDate },
				{ context },
			);
			expect(recent).toHaveLength(5);
			expect(summary.entries).toBe(expectedCount);
			expect(summary.total).toBeCloseTo(expectedTotal, 8);
		});

		test("date filters exclude entries outside the requested range", async () => {
			const summary = await call(
				router.summary,
				{
					startDate: new Date(endDate.getTime() + 86400000),
					endDate: new Date(endDate.getTime() + 172800000),
				},
				{ context },
			);
			expect(summary).toEqual({ total: 0, entries: 0 });
		});

		test("a different user cannot receive this account's total", async () => {
			const emptyContext = {
				session: { user: { id: "hydro-verification-no-such-user" } },
			} as unknown as Context;
			expect(
				await call(
					router.summary,
					{ startDate, endDate },
					{ context: emptyContext },
				),
			).toEqual({ total: 0, entries: 0 });
		});

		test("an inverted date range is rejected", async () => {
			await expect(
				call(
					router.summary,
					{ startDate: endDate, endDate: startDate },
					{ context },
				),
			).rejects.toMatchObject({ code: "BAD_REQUEST" });
		});

		test("an unauthenticated summary is rejected", async () => {
			await expect(
				call(
					router.summary,
					{ startDate, endDate },
					{ context: { session: null } as Context },
				),
			).rejects.toMatchObject({ code: "UNAUTHORIZED" });
		});
	},
);
