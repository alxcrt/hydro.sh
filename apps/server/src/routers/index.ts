import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { devicesRouter } from "./devices";
import { usersRouter } from "./users";
import { waterRouter } from "./water";

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
	devices: devicesRouter,
	silviu: publicProcedure.handler(() => {
		return "SAMSON";
	}),
	waterIntake: waterRouter,
};

export type AppRouter = typeof appRouter;
