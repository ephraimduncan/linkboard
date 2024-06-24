import { drizzle } from "drizzle-orm/libsql";
import { env } from "~/env";
import * as schema from "./schema";
import { createClient } from "@libsql/client";

const connection = createClient({
  //   url: "DATABASE_URL",
  //   authToken: "DATABASE_AUTH_TOKEN",

  url: "file:local.sqlite",
});

export const db = drizzle(connection, { schema });
