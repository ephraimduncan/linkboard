import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignupForm } from "@/components/signup-form";
import { fetchSession } from "@/lib/session-fn";

export const Route = createFileRoute("/signup/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { plan?: string; billingCycle?: string } => ({
    plan: typeof search.plan === "string" ? search.plan : undefined,
    billingCycle:
      typeof search.billingCycle === "string"
        ? search.billingCycle
        : undefined,
  }),
  beforeLoad: async () => {
    const session = await fetchSession();
    if (session) throw redirect({ to: "/dashboard" });
  },
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <SignupForm />
      </div>
    </div>
  );
}
