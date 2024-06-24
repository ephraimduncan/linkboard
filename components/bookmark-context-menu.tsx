"use client";

import React from "react";
import { Copy } from "./icons/copy";
import { Pencil } from "./icons/pencil";
import { Trash } from "./icons/trash";
import { Refresh } from "./icons/refresh";
import { ContextMenuContent, ContextMenuItem } from "./primitives/context-menu";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { revalidateFromClient } from "~/app/revalidate-on-client";
import { LockClose } from "./icons/lock-close";
import { LockOpen } from "./icons/lock-open";
import { BookmarkWithTags } from "~/server/db/schema";

export function BookmarkContextMenu({ bookmark }: { bookmark: BookmarkWithTags }) {
  const { mutate: refetchBookmark, isLoading: isRefreshingBookmark } = api.bookmark.refetch.useMutation({
    onSuccess: () => {
      revalidateFromClient("/dashboard");
      toast.success("Bookmark refreshed");
    },
  });
  const { mutate: deleteBookmark, isLoading: isDeletingBookmark } = api.bookmark.delete.useMutation({
    onSuccess: () => {
      revalidateFromClient("/dashboard");
      toast.success("Bookmark deleted");
    },
  });
  const { mutate: toggleBookmarkVisibility, isLoading: isTogglingVisibility } =
    api.bookmark.toggleVisibility.useMutation({
      onSuccess: () => {
        revalidateFromClient("/dashboard");
        toast.success(bookmark.isPublic ? "Bookmark is now private" : "Bookmark is now public");
      },
    });

  const ContextMenuItems = [
    {
      icon: Copy,
      label: "Copy",
      onClick: async (bookmark: BookmarkWithTags) => {
        await navigator.clipboard.writeText(bookmark.url);
        toast.success("Copied to clipboard");
      },
    },
    { icon: Pencil, label: "Edit", onClick: (bookmark: BookmarkWithTags) => console.log("Edit", bookmark) },
    {
      icon: Trash,
      label: "Delete",
      onClick: (bookmark: BookmarkWithTags) => deleteBookmark({ id: bookmark.id }),
    },
    {
      icon: Refresh,
      label: "Refresh",
      onClick: async (bookmark: BookmarkWithTags) => refetchBookmark({ id: bookmark.id }),
    },
    {
      icon: bookmark.isPublic ? LockClose : LockOpen,
      label: bookmark.isPublic ? "Make private" : "Make public",
      onClick: async (bookmark: BookmarkWithTags) => toggleBookmarkVisibility({ id: bookmark.id }),
    },
  ];

  return (
    <ContextMenuContent>
      {ContextMenuItems.map((item, index) => (
        <ContextMenuItem disabled={isRefreshingBookmark} key={index} onClick={() => item.onClick(bookmark)}>
          <div className="flex items-center gap-1.5">
            <item.icon
              className={cn("size-4", {
                "animate-spin": isRefreshingBookmark && item.label === "Refresh",
                "animate-pulse": isDeletingBookmark && item.label === "Delete",
              })}
            />
            {item.label}
          </div>
        </ContextMenuItem>
      ))}
    </ContextMenuContent>
  );
}
