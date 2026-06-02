import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";

const DashboardDemo = lazy(() =>
  import("@/components/dashboard-demo").then((m) => ({
    default: m.DashboardDemo,
  })),
);

const fallback = (
  <div className="-mx-4 sm:mx-0 sm:w-[80vw] lg:w-[50vw] sm:relative sm:left-1/2 sm:-translate-x-1/2 h-[540px] sm:rounded-xl border-y border-border sm:border bg-background" />
);

export function DashboardDemoLazy() {
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <DashboardDemo />
      </Suspense>
    </ClientOnly>
  );
}
