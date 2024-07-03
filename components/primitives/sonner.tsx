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
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-stone-950 group-[.toaster]:border group-[.toaster]:border-stone-950/10 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:p-4 dark:group-[.toaster]:bg-stone-900 dark:group-[.toaster]:text-white dark:group-[.toaster]:border-white/10",
          description:
            "group-[.toast]:text-stone-500 dark:group-[.toast]:text-stone-400",
          actionButton:
            "group-[.toast]:bg-stone-900 group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm/6 group-[.toast]:font-semibold hover:group-[.toast]:bg-stone-700 dark:group-[.toast]:bg-white dark:group-[.toast]:text-stone-900 dark:hover:group-[.toast]:bg-stone-200",
          cancelButton:
            "group-[.toast]:bg-white group-[.toast]:text-stone-950 group-[.toast]:border group-[.toast]:border-stone-950/10 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm/6 group-[.toast]:font-semibold hover:group-[.toast]:bg-stone-50 dark:group-[.toast]:bg-stone-800 dark:group-[.toast]:text-white dark:group-[.toast]:border-white/10 dark:hover:group-[.toast]:bg-stone-700",
          title:
            "group-[.toast]:text-base/6 group-[.toast]:font-semibold group-[.toast]:text-stone-950 dark:group-[.toast]:text-white sm:group-[.toast]:text-sm/6",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
