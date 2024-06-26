import { bookmarkRouter } from "./routers/bookmark/bookmark.procedure";
import { userRouter } from "./routers/user/user.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  bookmark: bookmarkRouter,
  user: userRouter,
});
export type AppRouter = typeof appRouter;
