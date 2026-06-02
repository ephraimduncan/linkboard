// Resolve from the build *mode*, not VITE_APP_URL alone: `bun run deploy` builds
// locally, so a stray `VITE_APP_URL=http://localhost:3000` in `.env` would
// otherwise get inlined into the production Worker (breaking OAuth callbacks,
// OG URLs, CORS). A production build is always the canonical origin.
export const APP_URL = import.meta.env.PROD
  ? "https://minimal.so"
  : (import.meta.env.VITE_APP_URL ?? "http://localhost:3000");
