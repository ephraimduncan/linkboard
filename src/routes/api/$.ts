import { createFileRoute } from "@tanstack/react-router";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { onError } from "@orpc/server";
import { env } from "cloudflare:workers";
import { apiRouter } from "@/server/api-router";

const WRITE_METHODS = new Set(["POST", "PATCH", "DELETE", "PUT"]);

async function normalizeErrorResponse(
  response: Response,
  extraHeaders?: Record<string, string>,
): Promise<Response> {
  if (response.status < 400) return response;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  try {
    const body = (await response.clone().json()) as Record<
      string,
      unknown
    > | null;

    if (body && typeof body === "object" && "success" in body) {
      return response;
    }

    const message =
      typeof body?.message === "string"
        ? body.message
        : "Internal server error";

    const headers = new Headers(response.headers);
    if (extraHeaders) {
      for (const [key, value] of Object.entries(extraHeaders)) {
        headers.set(key, value);
      }
    }

    return new Response(JSON.stringify({ success: false, error: message }), {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch {
    return response;
  }
}

const handler = new OpenAPIHandler(apiRouter, {
  plugins: [
    new CORSPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specPath: "/openapi.json",
      specGenerateOptions: {
        info: {
          title: "bmrks API",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            BearerAuth: {
              type: "http",
              scheme: "bearer",
              description:
                "API key authentication. Generate a key in Settings → API. Use the raw key as the Bearer token.",
            },
          },
        },
        security: [{ BearerAuth: [] }],
      },
    }),
  ],
  interceptors: [
    onError((error: unknown) => {
      console.error("[API Error]", error);
    }),
  ],
  adapterInterceptors: [
    async (interceptorOptions) => {
      const { request, next } = interceptorOptions;

      const url = new URL(request.url);
      if (url.pathname === "/api/openapi.json") {
        const handlerResult = await next();
        if (
          handlerResult.matched &&
          handlerResult.response?.ok &&
          handlerResult.response.headers
            .get("content-type")
            ?.includes("application/json")
        ) {
          const spec = (await handlerResult.response.json()) as {
            paths?: Record<string, { get?: { security?: unknown[] } }>;
          };
          if (spec.paths?.["/health"]?.get) {
            spec.paths["/health"].get.security = [];
          }
          const headers = new Headers(handlerResult.response.headers);
          headers.set("Content-Type", "application/json");
          return {
            matched: true as const,
            response: new Response(JSON.stringify(spec), {
              status: 200,
              headers,
            }),
          };
        }
        return handlerResult;
      }

      const authHeader = request.headers.get("authorization");
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7).trim() || null
        : null;

      if (!token) {
        const handlerResult = await next();

        if (handlerResult.matched && handlerResult.response) {
          return {
            matched: true as const,
            response: await normalizeErrorResponse(handlerResult.response),
          };
        }

        return handlerResult;
      }

      const isWrite = WRITE_METHODS.has(request.method.toUpperCase());
      const general = await env.API_RATELIMIT.limit({ key: token });
      const write = isWrite
        ? await env.WRITE_RATELIMIT.limit({ key: token })
        : { success: true };

      if (!general.success || !write.success) {
        return {
          matched: true as const,
          response: new Response(
            JSON.stringify({
              success: false,
              error: "Rate limit exceeded",
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": "60",
              },
            },
          ),
        };
      }

      const handlerResult = await next();

      if (handlerResult.matched && handlerResult.response) {
        return {
          matched: true as const,
          response: await normalizeErrorResponse(handlerResult.response),
        };
      }

      return handlerResult;
    },
  ],
});

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api",
    context: { headers: request.headers },
  });

  return (
    response ??
    new Response(JSON.stringify({ success: false, error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  );
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleRequest(request),
      POST: ({ request }) => handleRequest(request),
      PUT: ({ request }) => handleRequest(request),
      PATCH: ({ request }) => handleRequest(request),
      DELETE: ({ request }) => handleRequest(request),
      OPTIONS: ({ request }) => handleRequest(request),
    },
  },
});
