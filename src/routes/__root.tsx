import { type ReactNode } from "react";
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
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

  return (
    <RootDocument>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
        <ToasterProvider />
      </ThemeProvider>
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
