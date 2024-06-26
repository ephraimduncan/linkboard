import { clsx } from "clsx";
import { Link } from "./link";

export function Text({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      data-slot="text"
      {...props}
      className={clsx(className, "text-base/6 text-stone-500 sm:text-sm/6 dark:text-stone-400")}
    />
  );
}

export function TextLink({ className, ...props }: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      {...props}
      className={clsx(
        className,
        "text-stone-950 underline decoration-stone-950/50 data-[hover]:decoration-stone-950 dark:text-white dark:decoration-white/50 dark:data-[hover]:decoration-white"
      )}
    />
  );
}

export function Strong({ className, ...props }: React.ComponentPropsWithoutRef<"strong">) {
  return <strong {...props} className={clsx(className, "font-medium text-stone-950 dark:text-white")} />;
}

export function Code({ className, ...props }: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code
      {...props}
      className={clsx(
        className,
        "rounded border border-stone-950/10 bg-stone-950/[2.5%] px-0.5 text-sm font-medium text-stone-950 sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white"
      )}
    />
  );
}
