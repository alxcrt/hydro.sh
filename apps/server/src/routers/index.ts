import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { usersRouter } from "./users";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	users: usersRouter,
};

export type AppRouter = typeof appRouter;
