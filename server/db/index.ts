import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { Logger } from "drizzle-orm/logger";
import { env } from "~/env";
import * as schema from "./schema";

class QueryLogger implements Logger {
  private readonly reset = "\x1b[0m";
  private readonly bold = "\x1b[1m";
  private readonly green = "\x1b[32m";
  private readonly yellow = "\x1b[33m";
  private readonly dim = "\x1b[2m";

  private style(text: string, ...styles: string[]): string {
    if (process.stdout.isTTY) {
      return `${styles.join("")}${text}${this.reset}`;
    }
    return text;
  }

  logQuery(query: string, params: unknown[]): void {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    console.log(this.style("Query:", this.bold, this.yellow));
    console.log(this.style(query, this.green));

    if (params.length > 0) {
      console.log(this.style("Params:", this.bold, this.yellow), params);
    }

    console.log(this.style("---", this.dim));
  }
}

export const connection = createClient({
  url: env.SQLITE_URL,
  authToken: env.SQLITE_AUTH_TOKEN,
});

export const db = drizzle(connection, { schema });
