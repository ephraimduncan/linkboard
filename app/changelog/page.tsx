import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog - Minimal",
  description: "Changelog for Minimal bookmark manager",
};

type ChangelogEntry = {
  text: string;
  pr?: number;
};

type ChangelogVersion = {
  version: string;
  date: string;
  added: ChangelogEntry[];
  changed: ChangelogEntry[];
  fixed: ChangelogEntry[];
};

const GITHUB_REPO = "https://github.com/ephraimduncan/minimal.so";

const changelog: ChangelogVersion[] = [
  {
    version: "0.2.0",
    date: "February 18, 2026",
    added: [
      { text: "Multi-source bookmark capture with dedupe and source routing", pr: 57 },
      { text: "Browser bookmark import via Chrome extension", pr: 58 },
      { text: "UI updates for export count, dropdown grouping, keyboard shortcuts, and help link" },
      { text: "Changelog page redesign with a cleaner grid layout" },
    ],
    changed: [
      { text: "Replaced useEffect anti-patterns with idiomatic React patterns" },
      { text: "Improved bookmark creation performance with parallelized create flows" },
      { text: "Stabilized refresh callbacks and added content-visibility/preloading optimizations" },
    ],
    fixed: [
      { text: "Slash redirect behavior for ingest events" },
      { text: "Resolved project-wide ESLint errors and warnings", pr: 56 },
    ],
  },
  {
    version: "0.1.0",
    date: "February 11, 2026",
    added: [
      { text: "RSS/Atom feeds for public profiles", pr: 49 },
      { text: "Avatar uploads", pr: 51 },
      { text: "Transactional emails via Autosend", pr: 50 },
      { text: "ArXiv metadata improvements", pr: 54 },
      { text: "Private visibility confirmation for bookmarks" },
      { text: "Slugified group URL params", pr: 52 },
    ],
    changed: [
      { text: "Simplified email call sites and settings dialog" },
    ],
    fixed: [
      { text: "Twitter profile pictures showing generic X favicon instead of actual avatars", pr: 50 },
      { text: "Consistent paragraph spacing in email templates", pr: 50 },
      { text: "Dashboard UI spacing, empty state, and dialog close buttons", pr: 50 },
      { text: "Sign-out dialog closing before async work completes", pr: 50 },
      { text: "Broken favicons, missing referrer, and public profile auto-enable" },
    ],
  },
  {
    version: "0.0.1",
    date: "January 27, 2026",
    added: [
      { text: "Multi-select functionality with keyboard and mouse support for bulk operations", pr: 41 },
      { text: "Bulk move and delete dialogs with server-side endpoints" },
      { text: "Multi-select toolbar with Select All, Move, Copy URLs, and Delete actions" },
      { text: "Context menu integration - actions on selected items apply to all selected bookmarks" },
      { text: "Keyboard shortcuts for multi-select (Cmd+A for select all, Space for toggle)" },
      { text: "Settings dialog with profile management and name editing", pr: 35 },
      { text: "Claude Code GitHub workflows for automated PR assistance and code review", pr: 40 },
      { text: "Split dashboard into separate route with cached landing page for better performance", pr: 36 },
      { text: "Changelog page to track product updates", pr: 34 },
    ],
    changed: [
      { text: "Migrated all dialogs to Base UI API for better compatibility and performance" },
      { text: "Increased bulk move dialog dropdown width to 16rem for better readability" },
      { text: "Replaced width animations with GPU-accelerated transform: scaleX() for smoother performance" },
      { text: "Improved mobile browser support with proper dynamic viewport height (min-h-dvh)" },
      { text: "Enhanced toolbar design to match context menu aesthetics" },
      { text: "Added prefers-reduced-motion support for accessibility" },
      { text: "Optimized animations by removing expensive blur filters" },
      { text: "Improved dropdown spacing and visual balance" },
    ],
    fixed: [
      { text: "Dropdown selection reset issue in bulk move dialog - selections now persist correctly" },
      { text: "Hydration errors from nested button elements in dialogs and dropdowns" },
      { text: "Invalid HTML structure where buttons were nested inside other buttons" },
      { text: "Tab visibility state issues where favicons would show as fallback icons after returning to tab" },
      { text: "Keyboard selection state misalignment when bookmarks data changed" },
      { text: "Favicon loading failures during tab-hidden periods" },
    ],
  },
  {
    version: "0.0.0",
    date: "January 20, 2026",
    added: [
      { text: "Initial release of Minimal bookmark manager" },
      { text: "User authentication with email and OAuth providers", pr: 1 },
      { text: "Bookmark creation, editing, and deletion" },
      { text: "Folder organization for bookmarks" },
      { text: "Browser extension for quick bookmark saving" },
    ],
    changed: [],
    fixed: [],
  },
];

type Category = "Added" | "Changed" | "Fixed";

function toISODate(dateStr: string): string {
  return new Date(dateStr).toISOString().split("T")[0];
}

function PrLink({ number }: { number: number }) {
  return (
    <a
      href={`${GITHUB_REPO}/pull/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs text-zinc-400 transition-colors hover:text-black hover:underline dark:text-zinc-500 dark:hover:text-white"
    >
      #{number}
    </a>
  );
}

function ChangelogSection({
  category,
  entries,
}: {
  category: Category;
  entries: ChangelogEntry[];
}) {
  if (entries.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-black dark:text-white">
        {category}
      </h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-500 dark:text-zinc-400">
        {entries.map((entry) => (
          <li key={`${entry.text}-${entry.pr ?? "no-pr"}`}>
            {entry.text}
            {entry.pr && (
              <>
                {" "}
                <PrLink number={entry.pr} />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChangelogPage() {
  return (
    <div className="min-h-dvh bg-white text-black dark:bg-zinc-950 dark:text-white">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-base font-semibold" aria-label="Homepage">
          minimal
        </Link>
        <Link
          href="/"
          className="text-sm text-zinc-400 transition-colors hover:text-black dark:text-zinc-500 dark:hover:text-white"
        >
          &larr; Back
        </Link>
      </nav>

      <article className="mx-auto max-w-3xl px-6 pb-20 pt-8 sm:pt-12">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            Changelog
          </h1>
          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
            All notable changes to Minimal.
          </p>
        </header>

        <div className="space-y-0">
          {changelog.map((version, i) => (
            <Fragment key={version.version}>
              <section
                id={`v${version.version}`}
                className={`grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr] sm:gap-8 ${
                  i < changelog.length - 1
                    ? "border-b border-zinc-100 pb-10 mb-10 dark:border-zinc-800"
                    : ""
                }`}
              >
                <div className="sm:pt-0.5">
                  <time
                    dateTime={toISODate(version.date)}
                    className="text-sm text-zinc-400 dark:text-zinc-500"
                  >
                    {version.date}
                  </time>
                </div>
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">
                    <a href={`#v${version.version}`} className="hover:underline">
                      v{version.version}
                    </a>
                  </h2>
                  <ChangelogSection category="Added" entries={version.added} />
                  <ChangelogSection
                    category="Changed"
                    entries={version.changed}
                  />
                  <ChangelogSection category="Fixed" entries={version.fixed} />
                </div>
              </section>
            </Fragment>
          ))}
        </div>
      </article>
    </div>
  );
}
