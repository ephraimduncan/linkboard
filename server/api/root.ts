import { bookmarkRouter } from "./routers/bookmark/bookmark.procedure";
import { collectionRouter } from "./routers/collection/collection.procedure";
import { tagRouter } from "./routers/tag/tag.procedure";
import { userRouter } from "./routers/user/user.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  bookmark: bookmarkRouter,
  user: userRouter,
  tag: tagRouter,
  collection: collectionRouter,
});
export type AppRouter = typeof appRouter;
