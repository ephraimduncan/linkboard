import { cookies } from "next/headers";
import { generateId } from "lucia";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { github, lucia } from "~/lib/auth";
import { db } from "~/server/db";
import { Paths } from "~/lib/constants";
import { users, oauthAccounts } from "~/server/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
      headers: { Location: Paths.Login },
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser = (await githubUserRes.json()) as GitHubUser;

    const githubEmailRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubEmails = (await githubEmailRes.json()) as GitHubEmail[];
    const primaryEmail = githubEmails.find((email) => email.primary);

    if (!primaryEmail || !primaryEmail.verified) {
      return new Response(
        JSON.stringify({
          error: "Your GitHub account must have a verified primary email address.",
        }),
        { status: 400, headers: { Location: Paths.Login } }
      );
    }

    const avatar = githubUser.avatar_url;
    const username = githubUser.login;
    const name = githubUser.name;
    const email = primaryEmail.email;

    const existingOAuthAccount = await db.query.oauthAccounts.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.provider, "github"), eq(table.providerAccountId, githubUser.id.toString())),
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
        await db.update(users).set(updateData).where(eq(users.id, existingOAuthAccount.userId));
      }

      const session = await lucia.createSession(existingOAuthAccount.userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return new Response(null, {
        status: 302,
        headers: { Location: Paths.Dashboard },
      });
    }

    const existingUser = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (existingUser) {
      await db.insert(oauthAccounts).values({
        id: generateId(21),
        userId: existingUser.id,
        provider: "github",
        providerAccountId: githubUser.id.toString(),
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
        await db.update(users).set(updateData).where(eq(users.id, existingUser.id));
      }

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return new Response(null, {
        status: 302,
        headers: { Location: Paths.Dashboard },
      });
    }

    const userId = generateId(21);
    await db.insert(users).values({
      id: userId,
      email,
      emailVerified: true,
      avatar,
      username,
      name,
    });

    await db.insert(oauthAccounts).values({
      id: generateId(21),
      userId: userId,
      provider: "github",
      providerAccountId: githubUser.id.toString(),
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
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

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}
