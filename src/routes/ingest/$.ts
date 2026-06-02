import { createFileRoute } from "@tanstack/react-router";

const ASSET_HOST = "https://us-assets.i.posthog.com";
const INGEST_HOST = "https://us.i.posthog.com";

async function proxy(
  request: Request,
  params: { _splat?: string },
): Promise<Response> {
  const path = params._splat ?? "";
  const host = path.startsWith("static/") ? ASSET_HOST : INGEST_HOST;
  const search = new URL(request.url).search;
  const target = `${host}/${path}${search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  return fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  });
}

export const Route = createFileRoute("/ingest/$")({
  server: {
    handlers: {
      GET: ({ request, params }) => proxy(request, params),
      POST: ({ request, params }) => proxy(request, params),
      OPTIONS: ({ request, params }) => proxy(request, params),
    },
  },
});
