import { createRouterClient } from "@orpc/server";
import { getRequest } from "@tanstack/react-start/server";
import { router } from "@/server";

export const serverClient = createRouterClient(router, {
  context: () => ({ headers: getRequest().headers }),
});
