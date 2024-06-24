import { relations } from "drizzle-orm";
import { sqliteTableCreator, index, text, integer, customType } from "drizzle-orm/sqlite-core";

export const sqliteTable = sqliteTableCreator((name) => `linkboard_${name}`);

const timestamp = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
};

export const users = sqliteTable(
  "users",
  {
    ...timestamp,
    id: text("id", { length: 21 }).primaryKey(),
    discordId: text("discord_id", { length: 255 }).unique(),
    email: text("email", { length: 255 }).unique().notNull(),
    emailVerified: integer("email_verified", { mode: "boolean" }).default(false).notNull(),
    hashedPassword: text("hashed_password", { length: 255 }),
    avatar: text("avatar", { length: 255 }),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    discordIdx: index("user_discord_idx").on(table.discordId),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id", { length: 255 }).notNull().primaryKey(),
    userId: text("user_id", { length: 21 }).notNull(),
    expiresAt: integer("expires_at").notNull(),
  },
  (table) => ({
    userIdx: index("session_user_idx").on(table.userId),
  })
);

export const emailVerificationCodes = sqliteTable(
  "email_verification_codes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id", { length: 21 }).unique().notNull(),
    email: text("email", { length: 255 }).notNull(),
    code: text("code", { length: 8 }).notNull(),
    expiresAt: integer("expires_at").notNull(),
  },
  (table) => ({
    userIdx: index("verification_code_user_idx").on(table.userId),
    emailIdx: index("verification_code_email_idx").on(table.email),
  })
);

export const passwordResetTokens = sqliteTable(
  "password_reset_tokens",
  {
    id: text("id", { length: 40 }).primaryKey(),
    userId: text("user_id", { length: 21 }).notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    userIdx: index("password_token_user_idx").on(table.userId),
  })
);

export const bookmarks = sqliteTable(
  "bookmarks",
  {
    ...timestamp,
    id: text("id", { length: 15 }).primaryKey(),
    userId: text("user_id", { length: 21 }).notNull(),
    url: text("url").notNull(),
    title: text("title", { length: 255 }).notNull(),
    description: text("description", { length: 1000 }),
    isPublic: integer("is_public", { mode: "boolean" }).default(false).notNull(),
  },
  (table) => ({
    userIdx: index("bookmark_user_idx").on(table.userId),
    createdAtIdx: index("bookmark_created_at_idx").on(table.createdAt),
    urlIdx: index("bookmark_url_idx").on(table.url),
  })
);

export const bookmarkRelations = relations(bookmarks, ({ one, many }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  tags: many(bookmarkTags),
  collections: many(bookmarkCollections),
}));

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;

export const tags = sqliteTable(
  "tags",
  {
    ...timestamp,
    id: text("id", { length: 15 }).primaryKey(),
    name: text("name", { length: 50 }).notNull().unique(),
  },
  (table) => ({
    nameIdx: index("tag_name_idx").on(table.name),
  })
);

export const tagRelations = relations(tags, ({ many }) => ({
  bookmarks: many(bookmarkTags),
}));

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export const bookmarkTags = sqliteTable(
  "bookmark_tags",
  {
    id: text("id", { length: 15 }).primaryKey(),
    bookmarkId: text("bookmark_id", { length: 15 }).notNull(),
    tagId: text("tag_id", { length: 15 }).notNull(),
  },
  (table) => ({
    bookmarkTagIdx: index("bookmark_tag_idx").on(table.bookmarkId, table.tagId),
  })
);

export const bookmarkTagRelations = relations(bookmarkTags, ({ one }) => ({
  bookmark: one(bookmarks, {
    fields: [bookmarkTags.bookmarkId],
    references: [bookmarks.id],
  }),
  tag: one(tags, {
    fields: [bookmarkTags.tagId],
    references: [tags.id],
  }),
}));

export const collections = sqliteTable(
  "collections",
  {
    ...timestamp,
    id: text("id", { length: 15 }).primaryKey(),
    userId: text("user_id", { length: 21 }).notNull(),
    name: text("name", { length: 255 }).notNull(),
    description: text("description", { length: 1000 }),
    isPublic: integer("is_public", { mode: "boolean" }).default(false).notNull(),
  },
  (table) => ({
    userIdx: index("collection_user_idx").on(table.userId),
    nameIdx: index("collection_name_idx").on(table.name),
  })
);

export const collectionRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
  bookmarks: many(bookmarkCollections),
}));

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export const bookmarkCollections = sqliteTable(
  "bookmark_collections",
  {
    id: text("id", { length: 15 }).primaryKey(),
    bookmarkId: text("bookmark_id", { length: 15 }).notNull(),
    collectionId: text("collection_id", { length: 15 }).notNull(),
  },
  (table) => ({
    bookmarkCollectionIdx: index("bookmark_collection_idx").on(table.bookmarkId, table.collectionId),
  })
);

export const bookmarkCollectionRelations = relations(bookmarkCollections, ({ one }) => ({
  bookmark: one(bookmarks, {
    fields: [bookmarkCollections.bookmarkId],
    references: [bookmarks.id],
  }),
  collection: one(collections, {
    fields: [bookmarkCollections.collectionId],
    references: [collections.id],
  }),
}));
