import { ORPCError, os } from "@orpc/server";
import { createAuth, type Session } from "@/lib/auth";
import { createDb } from "@/lib/db";

export interface InitialContext {
  headers: Headers;
}

export const base = os
  .$context<InitialContext>()
  .use(async ({ context, next }) => {
    const db = createDb();
    const auth = createAuth(db);
    const session: Session | null = await auth.api.getSession({
      headers: context.headers,
    });

    return next({
      context: {
        db,
        session,
        user: session?.user ?? null,
      },
    });
  });

export const authed = base.use(({ context, next }) => {
  if (!context.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      ...context,
      user: context.user,
    },
  });
});
