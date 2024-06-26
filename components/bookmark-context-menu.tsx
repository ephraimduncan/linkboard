"use client";

import React, { useState } from "react";
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
import { Alert, AlertActions, AlertDescription, AlertTitle } from "./primitives/alert";
import { Button } from "./primitives/button";
import { Loader } from "lucide-react";

export function BookmarkContextMenu({ bookmark }: { bookmark: BookmarkWithTags }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isToggleBookmarkDialogOpen, setIsToggleBookmarkDialogOpen] = useState(false);

  const { mutateAsync: refetchBookmark, isLoading: isRefreshingBookmark } = api.bookmark.refetch.useMutation({
    onSuccess: () => {
      revalidateFromClient("/dashboard");
      toast.success("Bookmark refreshed");
    },
  });
  const { mutateAsync: deleteBookmark, isLoading: isDeletingBookmark } = api.bookmark.delete.useMutation({
    onSuccess: () => {
      revalidateFromClient("/dashboard");
      toast.success("Bookmark deleted");
    },
  });
  const { mutateAsync: toggleBookmarkVisibility, isLoading: isTogglingVisibility } =
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
      onClick: () => setIsDeleteDialogOpen(true),
    },
    {
      icon: Refresh,
      label: "Refresh",
      onClick: async (bookmark: BookmarkWithTags) => refetchBookmark({ id: bookmark.id }),
    },
    {
      icon: bookmark.isPublic ? LockClose : LockOpen,
      label: bookmark.isPublic ? "Make private" : "Make public",
      onClick: bookmark.isPublic
        ? async (bookmark: BookmarkWithTags) => toggleBookmarkVisibility({ id: bookmark.id })
        : () => setIsToggleBookmarkDialogOpen(true),
    },
  ];

  return (
    <>
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

      <Alert open={isDeleteDialogOpen} onClose={setIsDeleteDialogOpen}>
        <AlertTitle>Are you sure you want to delete this bookmark?</AlertTitle>
        <AlertDescription>This action cannot be undone. </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={isDeletingBookmark}
            onClick={async () => {
              await deleteBookmark({ id: bookmark.id });
              setIsDeleteDialogOpen(false);
            }}
          >
            {isDeletingBookmark && <Loader className="animate-spin size-4" />}
            Delete
          </Button>
        </AlertActions>
      </Alert>

      <Alert open={isToggleBookmarkDialogOpen} onClose={setIsToggleBookmarkDialogOpen}>
        <AlertTitle>Are you sure you want to make this bookmark public?</AlertTitle>
        <AlertDescription>It will be visible to others on the discover page.</AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsToggleBookmarkDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={isDeletingBookmark}
            onClick={async () => {
              await toggleBookmarkVisibility({ id: bookmark.id });
              setIsToggleBookmarkDialogOpen(false);
            }}
          >
            {isDeletingBookmark && <Loader className="animate-spin size-4" />}
            make public
          </Button>
        </AlertActions>
      </Alert>
    </>
  );
}
