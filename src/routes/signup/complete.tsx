import { createFileRoute } from "@tanstack/react-router";
import { SignupCompleteClient } from "@/components/signup-complete-client";

export const Route = createFileRoute("/signup/complete")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { plan?: string; billingCycle?: string } => ({
    plan: typeof search.plan === "string" ? search.plan : undefined,
    billingCycle:
      typeof search.billingCycle === "string"
        ? search.billingCycle
        : undefined,
  }),
  component: SignupCompletePage,
});

function SignupCompletePage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <SignupCompleteClient />
    </div>
  );
}
