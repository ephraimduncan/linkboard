import { useState, useTransition } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { type BillingCycle, startCheckout } from "@/lib/checkout";

const FREE_FEATURES = [
  "Unlimited bookmarks",
  "Unlimited collections",
  "Export your data anytime",
  "Search & keyboard shortcuts",
  "Public profile",
  "Shared collections",
];

const PRO_FEATURES: { label: string; soon?: boolean }[] = [
  { label: "Everything in Free" },
  { label: "Tags, colors, and notes", soon: true },
  { label: "Import from browser" },
  { label: "API access with rate limits" },
  { label: "Advanced search and filtering", soon: true },
  { label: "Priority support" },
];

const PRO_PRICING: Record<BillingCycle, string> = {
  monthly: "$5/mo",
  yearly: "$50/yr",
};

export function LandingPricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const [isCheckoutPending, startCheckoutTransition] = useTransition();
  const { data: session } = useSession();
  const isSignedIn = Boolean(session?.user);

  let proActionLabel = "Sign up";
  if (isCheckoutPending) {
    proActionLabel = "Starting checkout...";
  } else if (isSignedIn) {
    proActionLabel = "Upgrade";
  }

  const handleFreeAction = () => {
    if (isSignedIn) {
      navigate({ to: "/dashboard" });
      return;
    }
    navigate({ to: "/signup", search: { plan: "free", billingCycle } });
  };

  const handleProAction = () => {
    if (!isSignedIn) {
      navigate({ to: "/signup", search: { plan: "pro", billingCycle } });
      return;
    }
    const currentUser = session?.user;
    if (!currentUser) {
      navigate({ to: "/signup", search: { plan: "pro", billingCycle } });
      return;
    }
    const discountId = import.meta.env.VITE_POLAR_DISCOUNT_ID?.trim();
    startCheckoutTransition(async () => {
      await startCheckout({
        billingCycle,
        source: "landing_pricing",
        userId: currentUser.id,
        discountId: discountId || undefined,
      });
    });
  };

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          Pricing
        </h2>
        <div className="flex gap-1 text-sm">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-full px-3 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 ${
              billingCycle === "monthly"
                ? "bg-zinc-100 font-medium text-black dark:bg-zinc-800 dark:text-white"
                : "text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={`rounded-full px-3 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 ${
              billingCycle === "yearly"
                ? "bg-zinc-100 font-medium text-black dark:bg-zinc-800 dark:text-white"
                : "text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8">
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-xl font-semibold">Free</h3>
              <span className="text-xl tabular-nums text-zinc-400 dark:text-zinc-500">
                $0
              </span>
            </div>
            <ul role="list" className="mt-6 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              {FREE_FEATURES.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={handleFreeAction}
            className="mt-8 w-full rounded-full border border-zinc-200 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800/50"
          >
            {isSignedIn ? "Go to dashboard" : "Get started"}
          </button>
        </div>

        <div className="flex flex-col justify-between border-t border-zinc-100 pt-12 sm:border-t-0 sm:border-l sm:border-zinc-100 sm:pt-0 sm:pl-8 dark:border-zinc-800 sm:dark:border-zinc-800">
          <div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-xl font-semibold">Pro</h3>
              <span className="text-xl tabular-nums text-zinc-400 dark:text-zinc-500">
                {PRO_PRICING[billingCycle]}
              </span>
            </div>
            <ul role="list" className="mt-6 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              {PRO_FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2">
                  {feature.label}
                  {feature.soon && (
                    <span className="rounded-full border border-zinc-200 px-1.5 py-0.5 text-[0.625rem] text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                      Soon
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={handleProAction}
            disabled={isCheckoutPending}
            className="mt-8 w-full rounded-full bg-black py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {proActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
