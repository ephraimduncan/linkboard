import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.TURSO_DATABASE_URL ??
      process.env.LOCAL_DATABASE_URL ??
      "file:./dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
