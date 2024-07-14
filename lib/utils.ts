import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";
import { BookmarkWithTags } from "~/server/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
  }).format(new Date(date));
}

export function absoluteUrl(path: string) {
  return new URL(path, env.NEXT_PUBLIC_APP_URL).href;
}

export function truncateText(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title;

  const lastSpace = title.lastIndexOf(" ", maxLength);
  if (lastSpace === -1) return title.slice(0, maxLength) + "...";

  return title.slice(0, lastSpace) + "...";
}

export const getUrlWithPath = ({
  bookmark,
}: { bookmark: BookmarkWithTags }) => {
  const url = new URL(bookmark.url);
  const hostname = url.hostname;

  const urlHasPath = url.pathname !== "/";

  if (urlHasPath) {
    return `${hostname}${url.pathname}`;
  } else {
    return hostname;
  }
};
