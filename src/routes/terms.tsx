import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service - Minimal" },
      {
        name: "description",
        content: "Terms of Service for Minimal bookmark manager",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
            Effective date: January 10, 2025
          </p>
        </header>

        <div className="space-y-10 text-zinc-500 dark:text-zinc-400">
          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Agreement to Terms
            </h2>
            <p className="text-pretty">
              By accessing or using Minimal (&quot;the Service&quot;), you agree
              to be bound by these Terms of Service. If you do not agree to these
              terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Description of Service
            </h2>
            <p className="text-pretty">
              Minimal is a bookmark manager that allows you to save, organize, and
              access your bookmarks. The Service is provided &quot;as is&quot; and
              may be modified, updated, or discontinued at any time without prior
              notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              User Accounts
            </h2>
            <p className="mb-3 text-pretty">
              To use the Service, you must create an account. You are responsible
              for:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              User Content
            </h2>
            <p className="mb-3 text-pretty">
              You retain ownership of the bookmarks and content you save to
              Minimal. By using the Service, you grant us a limited license to
              store and display your content solely for the purpose of providing
              the Service.
            </p>
            <p className="text-pretty">
              You are solely responsible for the content you save and must ensure
              you have the right to store and access such content.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Acceptable Use
            </h2>
            <p className="mb-3 text-pretty">You agree not to:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code</li>
              <li>Use automated means to access the Service without permission</li>
              <li>Violate the rights of others</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Intellectual Property
            </h2>
            <p className="text-pretty">
              The Service, including its design, code, and branding, is owned by
              Minimal and protected by intellectual property laws. This project is
              open source, and the source code is available under its respective
              license.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Disclaimer of Warranties
            </h2>
            <p className="text-pretty">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY
              KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE
              UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Limitation of Liability
            </h2>
            <p className="text-pretty">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MINIMAL SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Termination
            </h2>
            <p className="text-pretty">
              We may suspend or terminate your access to the Service at any time,
              with or without cause. Upon termination, your right to use the
              Service will cease immediately. You may also delete your account at
              any time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Changes to Terms
            </h2>
            <p className="text-pretty">
              We reserve the right to modify these Terms at any time. We will
              notify users of significant changes by posting the updated terms on
              this page. Your continued use of the Service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black dark:text-white">
              Contact Us
            </h2>
            <p className="text-pretty">
              If you have any questions about these Terms of Service, please
              contact us at{" "}
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
