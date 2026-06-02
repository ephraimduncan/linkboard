import { useEffect, useRef } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { type BillingCycle, startCheckout } from "@/lib/checkout";

export function SignupCompleteClient() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { data: session, isPending } = useSession();
  const startedCheckoutRef = useRef(false);

  useEffect(() => {
    if (startedCheckoutRef.current) {
      return;
    }

    if (isPending) {
      return;
    }

    if (!session?.user) {
      navigate({ to: "/signup", replace: true });
      return;
    }

    const plan = search.plan;
    const billingCycleParam = search.billingCycle;
    const billingCycle: BillingCycle =
      billingCycleParam === "monthly" ? "monthly" : "yearly";

    if (plan !== "pro") {
      navigate({ to: "/dashboard", replace: true });
      return;
    }

    startedCheckoutRef.current = true;

    void startCheckout({
      billingCycle,
      source: "signup_oauth",
      userId: session.user.id,
    }).then((ok) => {
      if (!ok) navigate({ to: "/dashboard", replace: true });
    });
  }, [isPending, navigate, search, session?.user, session?.user?.id]);

  return (
    <div className="w-full max-w-xs text-center text-sm text-muted-foreground">
      Preparing your checkout...
    </div>
  );
}
