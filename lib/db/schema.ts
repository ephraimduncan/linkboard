import { relations } from "drizzle-orm";
import {
  customType,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamp = customType<{ data: Date; driverData: string }>({
  dataType() {
    return "datetime";
  },
  toDriver(value) {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().replace("Z", "+00:00");
  },
  fromDriver(value) {
    return new Date(value);
  },
});

const createdAt = () =>
  timestamp("createdAt")
    .notNull()
    .$defaultFn(() => new Date());

const updatedAt = () =>
  timestamp("updatedAt")
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date());

export const user = sqliteTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: integer("emailVerified", { mode: "boolean" })
      .notNull()
      .default(false),
    image: text("image"),
    username: text("username"),
    bio: text("bio"),
    github: text("github"),
    twitter: text("twitter"),
    website: text("website"),
    isProfilePublic: integer("isProfilePublic", { mode: "boolean" })
      .notNull()
      .default(false),
    plan: text("plan").notNull().default("free"),
    subscriptionStatus: text("subscriptionStatus"),
    polarCustomerId: text("polarCustomerId"),
    polarCustomerExternalId: text("polarCustomerExternalId"),
    polarSubscriptionId: text("polarSubscriptionId"),
    polarProductId: text("polarProductId"),
    polarCheckoutId: text("polarCheckoutId"),
    subscriptionCurrentPeriodEnd: timestamp("subscriptionCurrentPeriodEnd"),
    subscriptionCancelAtPeriodEnd: integer("subscriptionCancelAtPeriodEnd", {
      mode: "boolean",
    })
      .notNull()
      .default(false),
    subscriptionCanceledAt: timestamp("subscriptionCanceledAt"),
    planUpdatedAt: timestamp("planUpdatedAt"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("user_email_key").on(table.email),
    uniqueIndex("user_username_key").on(table.username),
    uniqueIndex("user_polarCustomerId_key").on(table.polarCustomerId),
    uniqueIndex("user_polarSubscriptionId_key").on(table.polarSubscriptionId),
    index("user_createdAt_idx").on(table.createdAt),
  ],
);

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("session_token_key").on(table.token)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("account_providerId_accountId_key").on(
      table.providerId,
      table.accountId,
    ),
  ],
);

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const group = sqliteTable(
  "group",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    color: text("color").notNull(),
    isPublic: integer("isPublic", { mode: "boolean" })
      .notNull()
      .default(false),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("group_userId_idx").on(table.userId),
    index("group_userId_isPublic_idx").on(table.userId, table.isPublic),
  ],
);

export const bookmark = sqliteTable(
  "bookmark",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    url: text("url"),
    normalizedUrl: text("normalizedUrl"),
    favicon: text("favicon"),
    type: text("type").notNull().default("link"),
    color: text("color"),
    isPublic: integer("isPublic", { mode: "boolean" }),
    primarySource: text("primarySource"),
    sourceHistory: text("sourceHistory"),
    lastCapturedAt: timestamp("lastCapturedAt"),
    groupId: text("groupId")
      .notNull()
      .references(() => group.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("bookmark_userId_idx").on(table.userId),
    index("bookmark_userId_isPublic_idx").on(table.userId, table.isPublic),
    index("bookmark_groupId_idx").on(table.groupId),
    index("bookmark_createdAt_idx").on(table.createdAt),
    index("bookmark_userId_normalizedUrl_idx").on(
      table.userId,
      table.normalizedUrl,
    ),
  ],
);

export const apiKey = sqliteTable(
  "apiKey",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull().default("Default"),
    keyHash: text("keyHash").notNull(),
    keyPrefix: text("keyPrefix").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lastUsedAt: timestamp("lastUsedAt"),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("apiKey_keyHash_key").on(table.keyHash),
    uniqueIndex("apiKey_userId_key").on(table.userId),
  ],
);

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  groups: many(group),
  bookmarks: many(bookmark),
  apiKey: one(apiKey, {
    fields: [user.id],
    references: [apiKey.userId],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const groupRelations = relations(group, ({ one, many }) => ({
  user: one(user, { fields: [group.userId], references: [user.id] }),
  bookmarks: many(bookmark),
}));

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  group: one(group, { fields: [bookmark.groupId], references: [group.id] }),
  user: one(user, { fields: [bookmark.userId], references: [user.id] }),
}));

export const apiKeyRelations = relations(apiKey, ({ one }) => ({
  user: one(user, { fields: [apiKey.userId], references: [user.id] }),
}));
