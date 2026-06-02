import { HeaderSkeleton } from "@/components/header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DashboardSkeleton() {
  return (
    <div className="min-h-dvh bg-background">
      <HeaderSkeleton />
      <main className="mx-auto w-full max-w-2xl px-5 py-20">
        <Skeleton className="h-8 w-full mb-8 rounded-lg" />
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[46px] w-full rounded-xl" />
          ))}
        </div>
      </main>
    </div>
  );
}

const SKELETON_ROWS = [
  { title: "w-44", date: "w-10" },
  { title: "w-32", date: "w-16" },
  { title: "w-56", date: "w-10" },
  { title: "w-36", date: "w-12" },
  { title: "w-48", date: "w-10" },
  { title: "w-28", date: "w-14" },
  { title: "w-52", date: "w-10" },
  { title: "w-40", date: "w-12" },
];

export function BookmarkListSkeleton() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between border-b border-border px-1 pb-2 text-sm text-muted-foreground">
        <span>Title</span>
        <span>Created At</span>
      </div>
      <div className="-mx-3 flex flex-col gap-0.5">
        {SKELETON_ROWS.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl px-4 py-3"
          >
            <div className="mr-4 flex min-w-0 flex-1 items-center gap-2">
              <Skeleton className="size-5 shrink-0 rounded" />
              <Skeleton className={cn("h-4 rounded", row.title)} />
            </div>
            <Skeleton className={cn("h-3.5 rounded", row.date)} />
          </div>
        ))}
      </div>
    </div>
  );
}
