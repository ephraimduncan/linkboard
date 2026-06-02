import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - Minimal" },
      {
        name: "description",
        content: "Privacy Policy for Minimal bookmark manager",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-white text-black dark:bg-zinc-950 dark:text-white">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-base font-semibold" aria-label="Homepage">
          minimal
        </Link>
        <Link
          to="/"
          className="text-sm text-zinc-400 transition-colors hover:text-black dark:text-zinc-500 dark:hover:text-white"
        >
          &larr; Back
        </Link>
      </nav>

      <article className="mx-auto max-w-3xl px-6 pb-20 pt-8 sm:pt-12">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
            Effective date: January 10, 2025
          </p>
        </header>

        <div className="space-y-10 text-zinc-500 dark:text-zinc-400">
          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Introduction
            </h2>
            <p className="mb-3 text-pretty">
              Minimal (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, and share information when you use our bookmark
              manager service.
            </p>
            <p className="text-pretty">
              By using Minimal, you agree to the collection and use of information
              in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Information We Collect
            </h2>

            <h3 className="mb-2 mt-4 text-sm font-medium text-black dark:text-white">
              Information You Provide
            </h3>
            <ul className="mb-6 list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-black dark:text-white">Account Information:</strong>{" "}
                When you create an account, we collect your name, email address,
                and profile photo (if provided through a third-party
                authentication provider).
              </li>
              <li>
                <strong className="text-black dark:text-white">Bookmarks:</strong>{" "}
                The URLs, titles, descriptions, and any tags or categories you
                create to organize your bookmarks.
              </li>
            </ul>

            <h3 className="mb-2 text-sm font-medium text-black dark:text-white">
              Information Collected Automatically
            </h3>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-black dark:text-white">Usage Data:</strong>{" "}
                We collect analytics data about how you interact with our service,
                including pages visited, features used, and time spent on the
                platform.
              </li>
              <li>
                <strong className="text-black dark:text-white">Device Information:</strong>{" "}
                Browser type, operating system, and device identifiers.
              </li>
              <li>
                <strong className="text-black dark:text-white">Log Data:</strong>{" "}
                IP address, access times, and referring URLs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              How We Use Your Information
            </h2>
            <p className="mb-3 text-pretty">We use the information we collect to:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Provide, maintain, and improve our service</li>
              <li>Process and store your bookmarks</li>
              <li>Send you service-related communications</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Information Sharing
            </h2>
            <p className="mb-3 text-pretty">
              We do not sell your personal information. We may share your
              information in the following circumstances:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-black dark:text-white">Service Providers:</strong>{" "}
                With third-party services that help us operate our platform (e.g.,
                hosting, analytics).
              </li>
              <li>
                <strong className="text-black dark:text-white">Legal Requirements:</strong>{" "}
                When required by law or to protect our rights and safety.
              </li>
              <li>
                <strong className="text-black dark:text-white">Business Transfers:</strong>{" "}
                In connection with a merger, acquisition, or sale of assets.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Data Security
            </h2>
            <p className="text-pretty">
              We implement reasonable security measures to protect your
              information. However, no method of transmission over the Internet or
              electronic storage is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Your Rights
            </h2>
            <p className="mb-3 text-pretty">You have the right to:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your bookmarks</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Changes to This Policy
            </h2>
            <p className="text-pretty">
              We may update this Privacy Policy from time to time. We will notify
              you of any changes by posting the new policy on this page and
              updating the effective date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Contact Us
            </h2>
            <p className="text-pretty">
              If you have any questions about this Privacy Policy, please contact
              us at{" "}
              <a
                href="mailto:ephraimduncan68@gmail.com"
                className="text-black underline hover:no-underline dark:text-white"
              >
                ephraimduncan68@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
