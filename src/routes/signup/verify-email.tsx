import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailClient } from "@/components/verify-email-client";

export const Route = createFileRoute("/signup/verify-email")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { email?: string; plan?: string; billingCycle?: string } => ({
    email: typeof search.email === "string" ? search.email : undefined,
    plan: typeof search.plan === "string" ? search.plan : undefined,
    billingCycle:
      typeof search.billingCycle === "string"
        ? search.billingCycle
        : undefined,
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <VerifyEmailClient />
      </div>
    </div>
  );
}
