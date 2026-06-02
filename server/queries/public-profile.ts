import { and, asc, desc, eq, or } from "drizzle-orm";
import type { DB } from "@/lib/db";
import { bookmark, group, user } from "@/lib/db/schema";

export async function getPublicProfileData(db: DB, username: string) {
  const [profile] = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
      username: user.username,
      bio: user.bio,
      github: user.github,
      twitter: user.twitter,
      website: user.website,
      isProfilePublic: user.isProfilePublic,
    })
    .from(user)
    .where(eq(user.username, username.toLowerCase()))
    .limit(1);

  if (!profile || !profile.isProfilePublic) return null;

  const [groups, bookmarks] = await Promise.all([
    db
      .select({ id: group.id, name: group.name, color: group.color })
      .from(group)
      .where(and(eq(group.userId, profile.id), eq(group.isPublic, true)))
      .orderBy(asc(group.createdAt)),
    db
      .select({
        title: bookmark.title,
        url: bookmark.url,
        favicon: bookmark.favicon,
        type: bookmark.type,
        color: bookmark.color,
        groupId: bookmark.groupId,
        updatedAt: bookmark.updatedAt,
      })
      .from(bookmark)
      .innerJoin(group, eq(bookmark.groupId, group.id))
      .where(
        and(
          eq(bookmark.userId, profile.id),
          or(eq(group.isPublic, true), eq(bookmark.isPublic, true)),
        ),
      )
      .orderBy(desc(bookmark.updatedAt)),
  ]);

  const groupNameById = new Map(groups.map((g) => [g.id, g.name]));

  return {
    user: profile,
    groups: groups.map(({ id: _, ...rest }) => rest),
    bookmarks: bookmarks.map(({ groupId, ...rest }) => ({
      ...rest,
      groupName: groupNameById.get(groupId) ?? null,
    })),
  };
}
