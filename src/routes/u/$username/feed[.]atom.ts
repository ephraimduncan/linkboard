import { createFileRoute } from "@tanstack/react-router";
import { createDb } from "@/lib/db";
import { generateFeedResponse } from "@/lib/feed-response";

export const Route = createFileRoute("/u/$username/feed.atom")({
  server: {
    handlers: {
      GET: ({ request, params }) =>
        generateFeedResponse(createDb(), request, params.username, "atom"),
    },
  },
});
