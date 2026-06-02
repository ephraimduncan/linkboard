import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";
import { fetchSession } from "@/lib/session-fn";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const session = await fetchSession();
    if (session) throw redirect({ to: "/dashboard" });
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <LoginForm />
      </div>
    </div>
  );
}
