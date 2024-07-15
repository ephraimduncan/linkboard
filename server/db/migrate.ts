import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

import { createClient } from "@libsql/client";
import * as schema from "./schema";

export const connection = createClient({
  url: process.env.SQLITE_URL || "file:local.sqlite",
  authToken: process.env.SQLITE_AUTH_TOKEN,
});

export async function runMigrate() {
  const db = drizzle(connection, { schema });

  console.log("⏳ Running migrations...");
  const start = Date.now();
  await migrate(db, { migrationsFolder: "./server/db/drizzle" });
  await connection.close();
  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);
  process.exit(0);
}

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
