import { useEffect, type ReactNode } from "react";
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import posthog from "posthog-js";
import { Agentation } from "agentation";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import { ThemeProvider } from "@/components/theme-provider";
import { ToasterProvider } from "@/components/toaster-provider";
import { APP_URL } from "@/lib/config";
import appCss from "../styles.css?url";

const title = "minimal — simple bookmarking for everyone";
const description =
  "A clean, minimal bookmark manager. Save, organize, and share your bookmarks with ease.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: APP_URL },
      { property: "og:site_name", content: "minimal.so" },
      { property: "og:image", content: `${APP_URL}/api/og` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: `${APP_URL}/api/og` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const key = import.meta.env.VITE_POSTHOG_KEY;
    if (!key || (posthog as { __loaded?: boolean }).__loaded) return;
    posthog.init(key, {
      api_host: import.meta.env.VITE_POSTHOG_HOST ?? "/ingest",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
    });
    posthog.register({
      app_version: "0.1.0",
      runtime: "web",
      environment: import.meta.env.DEV ? "development" : "production",
    });
  }, []);

  return (
    <RootDocument>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </ThemeProvider>
      <ToasterProvider />
      {import.meta.env.DEV ? <Agentation /> : null}
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className="font-sans antialiased"
        style={{
          fontFamily: "var(--font-geist-sans)",
        }}
      >
        {children}
        <script
          defer
          src="https://analytics.duncan.land/script.js"
          data-website-id="9c4de642-a2b5-4747-ae7b-38096c43b993"
        />
        <Scripts />
      </body>
    </html>
  );
}
