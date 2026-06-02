import { ORPCError, os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { createDb } from "@/lib/db";
import { apiKey } from "@/lib/db/schema";
import { hasActiveProAccess } from "@/lib/plan-limits";
import { hashApiKey } from "@/lib/api-key-hash";

export interface ApiInitialContext {
  headers: Headers;
}

export const apiBase = os
  .$context<ApiInitialContext>()
  .use(async ({ context, next }) => {
    const authorization = context.headers.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Invalid API key",
      });
    }

    const token = authorization.slice(7);
    const keyHash = hashApiKey(token);

    const db = createDb();
    const found = await db.query.apiKey.findFirst({
      where: eq(apiKey.keyHash, keyHash),
      with: { user: true },
    });

    if (!found) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Invalid API key",
      });
    }

    await db
      .update(apiKey)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKey.id, found.id));

    if (
      !hasActiveProAccess(
        found.user.plan,
        found.user.subscriptionStatus,
        found.user.subscriptionCurrentPeriodEnd,
      )
    ) {
      throw new ORPCError("FORBIDDEN", {
        message: "API access requires an active Pro subscription",
      });
    }

    return next({
      context: {
        db,
        user: found.user,
        apiKeyId: found.id,
      },
    });
  });

export const apiAuthed = apiBase;
