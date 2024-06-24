import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./server/db/schema.ts",
  out: "./server/db/drizzle",
  dbCredentials: {
    url: "file:local.sqlite",
  },
});
