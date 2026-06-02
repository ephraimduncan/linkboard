import { getRequest } from "@tanstack/react-start/server";
import { createDb } from "./db";
import { createAuth, type Session } from "./auth";

export async function getSession(): Promise<Session | null> {
  const auth = createAuth(createDb());
  return auth.api.getSession({ headers: getRequest().headers });
}
