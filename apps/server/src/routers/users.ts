import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import type { z } from "zod";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { protectedProcedure } from "@/lib/orpc";
import { UpdateUserSchema } from "@hydro.sh/schemas/users";

export const usersRouter = {
	me: protectedProcedure.handler(async ({ context }) => {
		const user = await db.query.user.findFirst({
			where: eq(schema.user.id, context.session.user.id),
			// with: {
			//   session: {
			//     with: {
			//       activeWorkspace: {
			//         columns: {
			//           id: true,
			//           name: true,
			//           metadata: true,
			//         },
			//       },
			//     },
			//   },
			//   apiKeys: {
			//     columns: {
			//       id: true,
			//     },
			//   },
			//   requestLimits: {
			//     columns: {
			//       totalRequests: true,
			//       totalAllowedRequests: true,
			//       remainingRequests: true,
			//       plan: true,
			//     },
			//   },
			// },
		});

		if (!user) {
			throw new ORPCError("User not found");
		}

		// const userWorkspaces = await db
		//   .select({
		//     id: schema.workspace.id,
		//     name: schema.workspace.name,
		//   })
		//   .from(schema.workspaceMember)
		//   .innerJoin(
		//     schema.workspace,
		//     eq(schema.workspaceMember.workspaceId, schema.workspace.id)
		//   )
		//   .where(eq(schema.workspaceMember.userId, user.id));

		return {
			fullName: user.name || "John Doe",
			email: user.email || "user@example.com",
			imageUrl: "https://example.com/avatar.png",
			currentWorkspace: {
				id: `ws-${Math.random().toString(36).substring(2, 10)}`,
				name: "Primary Workspace",
				metadata: JSON.stringify({ createdAt: new Date().toISOString() }),
			},
			apiKeys: [
				{ id: `ak-${Math.random().toString(36).substring(2, 10)}` },
				{ id: `ak-${Math.random().toString(36).substring(2, 10)}` },
			],
			workspaces: [
				{
					id: `ws-${Math.random().toString(36).substring(2, 10)}`,
					name: "Personal Workspace",
					isCurrent: true,
				},
				{
					id: `ws-${Math.random().toString(36).substring(2, 10)}`,
					name: "Team Workspace",
					isCurrent: false,
				},
				{
					id: `ws-${Math.random().toString(36).substring(2, 10)}`,
					name: "Project Alpha",
					isCurrent: false,
				},
			],
			requestLimits: {
				totalRequests: Math.floor(Math.random() * 500),
				totalAllowedRequests: 1000,
				remainingRequests: Math.floor(Math.random() * 800),
				plan: ["free", "pro", "enterprise"][Math.floor(Math.random() * 3)],
			},
		};
	}),

	update: protectedProcedure
		.input(UpdateUserSchema)
		.handler(async ({ context, input }) => {
			const existingUser = await db.query.user.findFirst({
				where: (users, { and, eq, ne }) =>
					and(
						eq(users.email, input.email),
						ne(users.id, context.session.user.id),
					),
			});

			if (existingUser) {
				throw new ORPCError("Email already in use by another account");
			}

			const updateData: Partial<typeof schema.user.$inferInsert> = {
				name: input.name,
				email: input.email,
			};

			if (input.image && typeof input.image === "object") {
				// const imageUrl = await uploadFile(
				//   input.image,
				//   `avatars/${context.session.user.id}_${Date.now()}.png`,
				//   {
				//     type: input.image.type,
				//     acl: "public-read",
				//   }
				// );
				// updateData.imageUrl = imageUrl;
			}

			const user = await db
				.update(schema.user)
				.set(updateData)
				.where(eq(schema.user.id, context.session.user.id))
				.returning({
					id: schema.user.id,
				});

			return user;
		}),
};
