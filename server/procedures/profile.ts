import { authed } from "../context";
import { updateProfileSchema, usernameSchema } from "@/lib/schema";
import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { user } from "@/lib/db/schema";

const profileColumns = {
  image: user.image,
  username: user.username,
  bio: user.bio,
  github: user.github,
  twitter: user.twitter,
  website: user.website,
  isProfilePublic: user.isProfilePublic,
};

export const getProfile = authed.handler(async ({ context }) => {
  const [profile] = await context.db
    .select(profileColumns)
    .from(user)
    .where(eq(user.id, context.user.id))
    .limit(1);

  if (!profile) {
    throw new ORPCError("NOT_FOUND", { message: "User not found" });
  }

  return profile;
});

export const updateProfile = authed
  .input(updateProfileSchema)
  .handler(async ({ context, input }) => {
    const { db } = context;
    const username = input.username?.toLowerCase() ?? null;

    if (username) {
      const [existing] = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.username, username))
        .limit(1);

      if (existing && existing.id !== context.user.id) {
        throw new ORPCError("CONFLICT", {
          message: "Username is already taken",
        });
      }
    }

    const [updated] = await db
      .update(user)
      .set({
        username,
        bio: input.bio,
        github: input.github,
        twitter: input.twitter,
        website: input.website || null,
        isProfilePublic: input.isProfilePublic,
      })
      .where(eq(user.id, context.user.id))
      .returning(profileColumns);

    return updated;
  });

export const checkUsername = authed
  .input(z.object({ username: usernameSchema }))
  .handler(async ({ context, input }) => {
    const username = input.username.toLowerCase();
    const [existing] = await context.db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.username, username))
      .limit(1);

    return { available: !existing || existing.id === context.user.id };
  });
