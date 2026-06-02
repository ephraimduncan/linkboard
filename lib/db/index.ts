import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export * from "./schema";

export function createDb() {
  const url = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not configured");
  }

  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
}

export type DB = ReturnType<typeof createDb>;
