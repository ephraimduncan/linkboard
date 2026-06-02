import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/lib/auth-server";

export const fetchSession = createServerFn({ method: "GET" }).handler(
  async () => getSession(),
);
