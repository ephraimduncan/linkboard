import { createFileRoute, redirect } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { fetchSession } from "@/lib/session-fn";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: async () => {
    const session = await fetchSession();
    if (session) throw redirect({ to: "/dashboard" });
  },
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
