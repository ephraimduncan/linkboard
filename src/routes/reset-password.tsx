import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { token?: string; error?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
