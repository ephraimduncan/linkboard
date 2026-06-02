import { createFileRoute } from "@tanstack/react-router";

const STORE_URL =
  "https://chromewebstore.google.com/detail/minimal-save-bookmarks/mldibjljgpjeincabnhhmcgomohffijf";

export const Route = createFileRoute("/extension")({
  server: {
    handlers: {
      GET: () =>
        new Response(null, { status: 307, headers: { Location: STORE_URL } }),
    },
  },
});
