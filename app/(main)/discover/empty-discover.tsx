import { Sparkle } from "~/components/icons/sparkle";

export function EmptyDiscover() {
  return (
    <div className="mt-8 h-[calc(100vh-180px)] flex flex-1 items-center justify-center rounded-lg border border-dashed shadow">
      <div className="flex flex-col items-center gap-1 text-center">
        <Sparkle className="size-16 mb-4 stroke-1" strokeWidth={1.5} />
        <h3 className="text-xl font-medium tracking-tight">
          Discover your next favorite thing
        </h3>
        <p className="text-sm text-muted-foreground">
          It&apos;s a little quiet here. Add a bookmark and make it public for
          others to view it.
        </p>
      </div>
    </div>
  );
}
