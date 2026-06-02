import { PostHog } from "posthog-node";

export function getPosthogServer(): PostHog | null {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key) return null;

  return new PostHog(key, {
    host: "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
}
