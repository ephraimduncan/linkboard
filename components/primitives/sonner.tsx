"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border group-[.toaster]:border-zinc-950/10 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:p-4 dark:group-[.toaster]:bg-zinc-900 dark:group-[.toaster]:text-white dark:group-[.toaster]:border-white/10",
          description: "group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-zinc-900 group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm/6 group-[.toast]:font-semibold hover:group-[.toast]:bg-zinc-700 dark:group-[.toast]:bg-white dark:group-[.toast]:text-zinc-900 dark:hover:group-[.toast]:bg-zinc-200",
          cancelButton:
            "group-[.toast]:bg-white group-[.toast]:text-zinc-950 group-[.toast]:border group-[.toast]:border-zinc-950/10 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm/6 group-[.toast]:font-semibold hover:group-[.toast]:bg-zinc-50 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-white dark:group-[.toast]:border-white/10 dark:hover:group-[.toast]:bg-zinc-700",
          title:
            "group-[.toast]:text-base/6 group-[.toast]:font-semibold group-[.toast]:text-zinc-950 dark:group-[.toast]:text-white sm:group-[.toast]:text-sm/6",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
