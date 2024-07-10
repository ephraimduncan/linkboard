"use server";

import { and, eq } from "drizzle-orm";
import { Scrypt, generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "~/lib/auth";
import { validateRequest } from "~/lib/auth/validate-request";
import { db } from "~/server/db";
import { oauthAccounts } from "~/server/db/schema";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
}

export async function logout(): Promise<{ error: string } | void> {
  "use server";
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "No session found",
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

export async function linkOAuthAccount(
  provider: string,
  providerAccountId: string,
): Promise<{ error?: string; success?: boolean }> {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "User not authenticated" };
  }

  try {
    const existingAccount = await db.query.oauthAccounts.findFirst({
      where: (table, { eq, and }) =>
        and(
          eq(table.provider, provider),
          eq(table.providerAccountId, providerAccountId),
        ),
    });

    if (existingAccount) {
      if (existingAccount.userId !== user.id) {
        return {
          error: "This OAuth account is already linked to another user",
        };
      }
      return { error: "This OAuth account is already linked to your account" };
    }

    await db.insert(oauthAccounts).values({
      id: generateId(21),
      userId: user.id,
      provider,
      providerAccountId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error linking OAuth account:", error);
    return { error: "Failed to link OAuth account" };
  }
}

export async function unlinkOAuthAccount(
  provider: string,
): Promise<{ error?: string; success?: boolean }> {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "User not authenticated" };
  }

  try {
    const result = await db
      .delete(oauthAccounts)
      .where(
        and(
          eq(oauthAccounts.userId, user.id),
          eq(oauthAccounts.provider, provider),
        ),
      );

    if (result.rowsAffected === 0) {
      return { error: "OAuth account not found or already unlinked" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error unlinking OAuth account:", error);
    return { error: "Failed to unlink OAuth account" };
  }
}

export async function getLinkedAccounts(): Promise<{
  accounts: Array<{ provider: string }>;
  error?: string;
}> {
  const { user } = await validateRequest();
  if (!user) {
    return { accounts: [], error: "User not authenticated" };
  }

  try {
    const accounts = await db.query.oauthAccounts.findMany({
      where: (table, { eq }) => eq(table.userId, user.id),
      columns: { provider: true },
    });

    return { accounts };
  } catch (error) {
    console.error("Error fetching linked accounts:", error);
    return { accounts: [], error: "Failed to fetch linked accounts" };
  }
}
