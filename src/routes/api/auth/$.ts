import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "@/lib/auth";
import { createDb } from "@/lib/db";

function handle(request: Request) {
  const auth = createAuth(createDb());
  return auth.handler(request);
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
