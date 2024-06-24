import { bookmarkRouter } from "./routers/bookmark/bookmark.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  bookmark: bookmarkRouter,
});
export type AppRouter = typeof appRouter;
