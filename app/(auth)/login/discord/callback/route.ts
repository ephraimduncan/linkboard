import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { discord, lucia } from "~/lib/auth";
import { Paths } from "~/lib/constants";
import { db } from "~/server/db";
import { oauthAccounts, users } from "~/server/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("discord_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
      headers: { Location: Paths.Login },
    });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);

    const discordUserRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const discordUser = (await discordUserRes.json()) as DiscordUser;
    const username = discordUser.username;
    const name = discordUser.global_name;

    if (!discordUser.email || !discordUser.verified) {
      return new Response(
        JSON.stringify({
          error: "Your Discord account must have a verified email address.",
        }),
        { status: 400, headers: { Location: Paths.Login } },
      );
    }

    const avatar = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp`
      : null;

    // Check if the OAuth account already exists
    const existingOAuthAccount = await db.query.oauthAccounts.findFirst({
      where: (table, { eq, and }) =>
        and(
          eq(table.provider, "discord"),
          eq(table.providerAccountId, discordUser.id),
        ),
      with: {
        user: true,
      },
    });

    if (existingOAuthAccount) {
      const updateData: Partial<typeof users.$inferInsert> = {};

      if (!existingOAuthAccount.user.avatar && avatar) {
        updateData.avatar = avatar;
      }

      if (!existingOAuthAccount.user.name && name) {
        updateData.name = name;
      }

      if (!existingOAuthAccount.user.username && username) {
        updateData.username = username;
      }

      if (Object.keys(updateData).length > 0) {
        await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, existingOAuthAccount.userId));
      }

      const session = await lucia.createSession(
        existingOAuthAccount.userId,
        {},
      );
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: { Location: Paths.Dashboard },
      });
    }

    const existingUser = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, discordUser.email!),
    });

    if (existingUser) {
      await db.insert(oauthAccounts).values({
        id: generateId(21),
        userId: existingUser.id,
        provider: "discord",
        providerAccountId: discordUser.id,
      });

      const updateData: Partial<typeof users.$inferInsert> = {
        emailVerified: true,
      };

      if (!existingUser.avatar && avatar) {
        updateData.avatar = avatar;
      }

      if (!existingUser.name && name) {
        updateData.name = name;
      }

      if (!existingUser.username && username) {
        updateData.username = username;
      }

      if (Object.keys(updateData).length > 0) {
        await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, existingUser.id));
      }

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: { Location: Paths.Dashboard },
      });
    }

    // New user, create user and OAuth account
    const userId = generateId(21);
    await db.insert(users).values({
      id: userId,
      email: discordUser.email,
      emailVerified: true,
      avatar,
      username,
      name,
    });

    await db.insert(oauthAccounts).values({
      id: generateId(21),
      userId: userId,
      provider: "discord",
      providerAccountId: discordUser.id,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: { Location: Paths.Dashboard },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(JSON.stringify({ message: "Invalid code" }), {
        status: 400,
      });
    }

    console.error(e);

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  banner: string | null;
  global_name: string | null;
  banner_color: string | null;
  mfa_enabled: boolean;
  locale: string;
  email: string | null;
  verified: boolean;
}
