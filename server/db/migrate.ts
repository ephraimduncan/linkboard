import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";

import * as schema from "./schema";

export async function runMigrate() {
  const connection = createClient({
    //   url: "DATABASE_URL",
    //   authToken: "DATABASE_AUTH_TOKEN",
    url: "file:local.sqlite",
  });

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
