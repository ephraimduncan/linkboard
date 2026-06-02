import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

async function handleGet(params: { _splat?: string }): Promise<Response> {
  const key = params._splat;
  if (!key) return new Response("Not found", { status: 404 });

  const object = await env.AVATARS.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
}

export const Route = createFileRoute("/avatars/$")({
  server: {
    handlers: {
      GET: ({ params }) => handleGet(params),
    },
  },
});
