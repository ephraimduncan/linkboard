import Link from "next/link";
import { DashboardDemoLazy as DashboardDemo } from "@/components/dashboard-demo-lazy";
import { LandingPricing } from "@/components/landing-pricing";

const CURRENT_YEAR = new Date().getFullYear();

const FEATURES = [
  { name: "Auto metadata", description: "Paste a URL — titles, descriptions, and favicons are fetched automatically." },
  { name: "Collections", description: "Organize into color-coded groups you can share or keep private." },
  { name: "Instant search", description: "Find anything by title, URL, or collection." },
  { name: "Keyboard-first", description: "Navigate, select, and manage bookmarks without touching the mouse." },
  { name: "Public profiles", description: "Share collections publicly with built-in RSS feeds." },
  { name: "Private by default", description: "No ads, no tracking. Export your data anytime." },
];

export function Landing() {
  return (
    <main className="min-h-dvh bg-white text-black dark:bg-zinc-950 dark:text-white">
      <nav
        className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6"
        aria-label="Primary"
      >
        <Link href="/" className="text-base font-semibold" aria-label="Homepage">
          minimal
        </Link>
        <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <a
            href="#pricing"
            className="transition-colors hover:text-black dark:hover:text-white max-sm:hidden"
          >
            Pricing
          </a>
          <Link
            href="/changelog"
            className="transition-colors hover:text-black dark:hover:text-white max-sm:hidden"
          >
            Changelog
          </Link>
          <Link
            href="/login"
            className="transition-colors hover:text-black dark:hover:text-white"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 pt-16 sm:pt-24">
        <h1 className="animate-stagger-in max-w-[20ch] text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Save your bookmarks. Without the noise.
        </h1>
        <p
          className="animate-stagger-in mt-4 max-w-[52ch] text-zinc-500 text-pretty dark:text-zinc-400"
          style={{ animationDelay: "100ms" }}
        >
          A fast bookmark manager that does one thing well. Paste a URL, press
          enter — that&apos;s it.
        </p>
        <div
          className="animate-stagger-in mt-8 flex items-center gap-5"
          style={{ animationDelay: "200ms" }}
        >
          <Link
            href="/signup"
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Get started
          </Link>
          <a
            href="/chrome"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Chrome extension &rarr;
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pt-16 pb-20 sm:pt-20 sm:pb-28">
        <DashboardDemo />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 sm:pb-28">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.name}>
              <dt className="text-sm font-medium text-black dark:text-white">
                {feature.name}
              </dt>
              <dd className="mt-1 text-sm text-zinc-500 text-pretty dark:text-zinc-400">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        id="pricing"
        className="mx-auto max-w-3xl scroll-mt-16 px-6 pb-20 sm:pb-28"
      >
        <LandingPricing />
      </section>

      <footer className="mx-auto flex max-w-3xl items-center justify-between border-t border-zinc-100 px-6 py-8 text-sm text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        <p>© {CURRENT_YEAR} minimal.so</p>
        <nav className="flex gap-6" aria-label="Footer">
          <Link
            href="/terms"
            className="transition-colors hover:text-black dark:hover:text-white"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-black dark:hover:text-white"
          >
            Privacy
          </Link>
          <Link
            href="/changelog"
            className="transition-colors hover:text-black dark:hover:text-white"
          >
            Changelog
          </Link>
        </nav>
      </footer>
    </main>
  );
}
