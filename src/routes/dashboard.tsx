import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, count, desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth-server";
import { createDb } from "@/lib/db";
import { bookmark, group, user } from "@/lib/db/schema";
import { DashboardContent } from "@/components/dashboard-content";
import type { GroupItem, BookmarkItem } from "@/lib/schema";

const getDashboardData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSession();
  if (!session) throw redirect({ to: "/login" });

  const db = createDb();
  const userId = session.user.id;

  const [groupRows, profileRow, firstGroup] = await Promise.all([
    db
      .select({
        id: group.id,
        name: group.name,
        color: group.color,
        isPublic: group.isPublic,
        bookmarkCount: count(bookmark.id),
      })
      .from(group)
      .leftJoin(bookmark, eq(bookmark.groupId, group.id))
      .where(eq(group.userId, userId))
      .groupBy(group.id)
      .orderBy(asc(group.createdAt)),
    db
      .select({
        image: user.image,
        username: user.username,
        bio: user.bio,
        github: user.github,
        twitter: user.twitter,
        website: user.website,
        isProfilePublic: user.isProfilePublic,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd,
        subscriptionCancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd,
        polarCustomerId: user.polarCustomerId,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)
      .then((rows) => rows[0]),
    db
      .select({ id: group.id })
      .from(group)
      .where(eq(group.userId, userId))
      .orderBy(asc(group.createdAt))
      .limit(1)
      .then((rows) => rows[0]),
  ]);

  const initialGroups: GroupItem[] = groupRows.map((g) => ({
    id: g.id,
    name: g.name,
    color: g.color,
    isPublic: g.isPublic,
    bookmarkCount: g.bookmarkCount,
  }));

  const firstGroupBookmarks = firstGroup
    ? await db
        .select()
        .from(bookmark)
        .where(eq(bookmark.groupId, firstGroup.id))
        .orderBy(desc(bookmark.createdAt))
    : [];

  const initialBookmarks: BookmarkItem[] = firstGroupBookmarks.map((b) => ({
    id: b.id,
    title: b.title,
    url: b.url,
    favicon: b.favicon,
    type: b.type,
    color: b.color,
    isPublic: b.isPublic,
    groupId: b.groupId,
    createdAt: b.createdAt,
  }));

  const profile = profileRow ?? {
    image: session.user.image ?? null,
    username: null,
    bio: null,
    github: null,
    twitter: null,
    website: null,
    isProfilePublic: false,
    plan: "free",
    subscriptionStatus: null,
    subscriptionCurrentPeriodEnd: null,
    subscriptionCancelAtPeriodEnd: false,
    polarCustomerId: null,
  };

  return { session, initialGroups, initialBookmarks, profile };
});

export const Route = createFileRoute("/dashboard")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { group?: string; checkout?: string; checkout_id?: string } => ({
    group: typeof search.group === "string" ? search.group : undefined,
    checkout: typeof search.checkout === "string" ? search.checkout : undefined,
    checkout_id:
      typeof search.checkout_id === "string" ? search.checkout_id : undefined,
  }),
  loader: () => getDashboardData(),
  component: DashboardPage,
});

function DashboardPage() {
  const { session, initialGroups, initialBookmarks, profile } =
    Route.useLoaderData();
  return (
    <DashboardContent
      session={session}
      initialGroups={initialGroups}
      initialBookmarks={initialBookmarks}
      profile={profile}
    />
  );
}
