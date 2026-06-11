"use client";

import { memo, startTransition, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconCopy,
  IconPencil,
  IconTrash,
  IconRefresh,
  IconChevronsRight,
  IconCheck,
  IconBookmark,
  IconSquaresSelected,
  IconWorld,
  IconWorldOff,
  IconDots,
  IconArrowLeft,
} from "@tabler/icons-react";
import { ContextMenuSeparator } from "@/components/ui/context-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Empty,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { cn, parseColor } from "@/lib/utils";
import { type BookmarkItem, type GroupItem } from "@/lib/schema";
import { FaviconImage } from "@/components/favicon-image";

const EMPTY_STATE = (
  <Empty className="border-none py-16 gap-2">
    <EmptyMedia className="mb-0">
      <IconBookmark className="size-8 text-muted-foreground fill-muted-foreground" />
    </EmptyMedia>
    <EmptyTitle>No bookmarks here</EmptyTitle>
    <EmptyDescription>Add some cool links to get started</EmptyDescription>
  </Empty>
);

const EMPTY_SET = new Set<string>();

const DRAWER_ITEM_CLASS =
  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-base active:bg-muted";

interface BookmarkListProps {
  bookmarks: BookmarkItem[];
  groups: GroupItem[];
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onMove: (id: string, groupId: string) => void;
  onRefetch: (id: string) => void;
  currentGroupId: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
  renamingId: string | null;
  onStartRename: (id: string) => void;
  onFinishRename: () => void;
  onHoverChange: (index: number) => void;
  hoveredIndex: number;
  selectionMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onEnterSelectionMode?: (initialId?: string) => void;
  onBulkMove?: (targetGroupId: string) => void;
  onBulkDelete?: () => void;
  readOnly?: boolean;
  onLinkClick?: (bookmark: BookmarkItem) => void;
  hasUsername?: boolean;
  publicGroupIds?: Set<string>;
  onToggleVisibility?: (id: string, currentIsPublic: boolean | null | undefined) => void;
}

export function BookmarkList({
  bookmarks,
  groups,
  onDelete,
  onRename,
  onMove,
  onRefetch,
  currentGroupId,
  selectedIndex,
  onSelect,
  renamingId,
  onStartRename,
  onFinishRename,
  onHoverChange,
  hoveredIndex,
  selectionMode = false,
  selectedIds = EMPTY_SET,
  onToggleSelection,
  onEnterSelectionMode,
  onBulkMove,
  onBulkDelete,
  readOnly = false,
  onLinkClick,
  hasUsername = false,
  publicGroupIds,
  onToggleVisibility,
}: BookmarkListProps) {
  const [editValue, setEditValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [contextMenuOpenId, setContextMenuOpenId] = useState<string | null>(
    null,
  );
  const [drawerBookmark, setDrawerBookmark] = useState<BookmarkItem | null>(
    null,
  );
  const [drawerMoveView, setDrawerMoveView] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  const closeDrawer = () => {
    setDrawerBookmark(null);
    setDrawerMoveView(false);
  };

  useEffect(() => {
    startTransition(() => {
      setCurrentYear(new Date().getFullYear());
    });
  }, []);

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;

    // During SSR, currentYear is null - always show year to avoid new Date()
    if (currentYear === null) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    const isCurrentYear = d.getFullYear() === currentYear;

    if (isCurrentYear) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleClick = (bookmark: BookmarkItem) => {
    if (renamingId) return;

    if (selectionMode && onToggleSelection) {
      onToggleSelection(bookmark.id);
      return;
    }

    onSelect(-1);

    if (bookmark.url) {
      window.open(bookmark.url, "_blank");
    } else {
      const textToCopy = bookmark.color || bookmark.title;
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(bookmark.id);
      setTimeout(() => setCopiedId(null), 1000);
    }
  };

  const handleRowClick = (bookmark: BookmarkItem, index: number) => {
    if (onLinkClick && bookmark.url) {
      onLinkClick(bookmark);
      return;
    }
    if (readOnly) {
      onSelect(index);
      return;
    }
    handleClick(bookmark);
  };

  const handleCopy = (bookmark: BookmarkItem) => {
    const textToCopy = bookmark.url || bookmark.color || bookmark.title;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(bookmark.id);
    setTimeout(() => setCopiedId(null), 1000);
  };

  const handleStartRename = (bookmark: BookmarkItem) => {
    onStartRename(bookmark.id);
    setEditValue(bookmark.title);
  };

  const handleFinishRename = (id: string) => {
    if (editValue.trim()) {
      onRename(id, editValue.trim());
    }
    onFinishRename();
    setEditValue("");
  };

  if (bookmarks.length === 0) {
    return EMPTY_STATE;
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between border-b border-border px-1 pb-2 text-sm text-muted-foreground">
        <span>Title</span>
        <span className="max-sm:hidden">Created At</span>
      </div>
      <div className="flex flex-col gap-0.5 -mx-3">
        {bookmarks.map((bookmark, index) => (
          <ContextMenu
            key={bookmark.id}
            onOpenChange={(open) =>
              setContextMenuOpenId(open ? bookmark.id : null)
            }
          >
            <ContextMenuTrigger
              render={
                <Button
                  variant="ghost"
                  onClick={() => handleRowClick(bookmark, index)}
                  onMouseEnter={() => onHoverChange(index)}
                  onMouseLeave={() => onHoverChange(-1)}
                  style={{ contentVisibility: "auto", containIntrinsicSize: "auto 52px" }}
                  className={cn(
                    "group flex h-auto items-center justify-between rounded-xl px-4 py-3 text-left",
                    selectedIndex === index || contextMenuOpenId === bookmark.id
                      ? "bg-muted"
                      : "hover:bg-muted/50",
                    renamingId &&
                      renamingId !== bookmark.id &&
                      "opacity-30 pointer-events-none",
                  )}
                />
              }
            >
              <div className="flex flex-1 items-center gap-2 min-w-0 mr-4">
                {selectionMode ? (
                  <Checkbox
                    checked={selectedIds.has(bookmark.id)}
                    onCheckedChange={() => onToggleSelection?.(bookmark.id)}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                ) : (
                  <BookmarkIcon
                    bookmark={bookmark}
                    isCopied={copiedId === bookmark.id}
                  />
                )}
                {renamingId === bookmark.id ? (
                  <Input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleFinishRename(bookmark.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishRename(bookmark.id);
                      if (e.key === "Escape") {
                        onFinishRename();
                        setEditValue("");
                      }
                    }}
                    autoFocus
                    className="h-auto flex-1 max-w-[60%] border-none bg-transparent px-0 py-0 text-sm font-normal shadow-none selection:bg-primary/20 focus-visible:ring-0"
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.target.select()}
                  />
                ) : (
                  <div className="flex min-w-0 flex-col sm:contents">
                    <div className="flex min-w-0 items-center gap-2 sm:contents">
                      <span className="text-sm font-normal truncate">
                        {copiedId === bookmark.id ? "Copied" : bookmark.title}
                      </span>
                      {bookmark.url && !renamingId && copiedId !== bookmark.id ? (
                        <span className="text-[13px] text-muted-foreground">
                          {new URL(bookmark.url).hostname.replace("www.", "")}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground sm:hidden">
                      {formatDate(bookmark.createdAt)}
                    </span>
                  </div>
                )}
              </div>
              <div className="relative h-5 flex items-center justify-end gap-1.5 sm:w-[100px]">
                {(selectedIndex === index || hoveredIndex === index) &&
                !renamingId ? (
                  <KbdGroup className="pointer-coarse:hidden">
                    <Kbd>⌘</Kbd>
                    <Kbd>Enter</Kbd>
                  </KbdGroup>
                ) : (
                  <>
                    {hasUsername && !renamingId && bookmark.isPublic === true && (
                      <IconWorld className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="text-[13px] tabular-nums text-muted-foreground whitespace-nowrap max-sm:hidden">
                      {formatDate(bookmark.createdAt)}
                    </span>
                  </>
                )}
                {!renamingId && (
                  <span
                    role="button"
                    aria-label="Bookmark actions"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDrawerBookmark(bookmark);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="hidden pointer-coarse:flex size-9 -my-2 -me-2 shrink-0 items-center justify-center rounded-lg text-muted-foreground"
                  >
                    <IconDots className="size-4.5" />
                  </span>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuItem onClick={() => handleCopy(bookmark)}>
                <IconCopy className="mr-2 h-4 w-4" />
                <span>Copy</span>
                <KbdGroup className="ml-auto">
                  <Kbd>⌘</Kbd>
                  <Kbd>C</Kbd>
                </KbdGroup>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleStartRename(bookmark)}>
                <IconPencil className="mr-2 h-4 w-4" />
                <span>Rename</span>
                <KbdGroup className="ml-auto">
                  <Kbd>⌘</Kbd>
                  <Kbd>E</Kbd>
                </KbdGroup>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  if (
                    selectionMode &&
                    selectedIds.has(bookmark.id) &&
                    onBulkDelete
                  ) {
                    onBulkDelete();
                  } else {
                    onDelete(bookmark.id);
                  }
                }}
                variant="destructive"
              >
                <IconTrash className="mr-2 h-4 w-4" />
                <span>Delete</span>
                <KbdGroup className="ml-auto">
                  <Kbd>⌘</Kbd>
                  <Kbd>⌫</Kbd>
                </KbdGroup>
              </ContextMenuItem>
              {bookmark.url ? (
                <ContextMenuItem onClick={() => onRefetch(bookmark.id)}>
                  <IconRefresh className="mr-2 h-4 w-4" />
                  <span>Refetch</span>
                </ContextMenuItem>
              ) : null}
              {hasUsername && onToggleVisibility && (
                <ContextMenuItem
                  onClick={() => onToggleVisibility(bookmark.id, bookmark.isPublic)}
                >
                  {isBookmarkPublic(bookmark, currentGroupId, publicGroupIds) ? (
                    <>
                      <IconWorldOff className="mr-2 h-4 w-4" />
                      <span>Make Private</span>
                    </>
                  ) : (
                    <>
                      <IconWorld className="mr-2 h-4 w-4" />
                      <span>Make Public</span>
                    </>
                  )}
                </ContextMenuItem>
              )}
              {groups.length > 1 ? (
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <IconChevronsRight className="mr-2 h-4 w-4" />
                    <span>Move To...</span>
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-40">
                    {groups
                      .filter((g) => g.id !== currentGroupId)
                      .map((group) => (
                        <ContextMenuItem
                          key={group.id}
                          onClick={() => {
                            if (
                              selectionMode &&
                              selectedIds.has(bookmark.id) &&
                              onBulkMove
                            ) {
                              onBulkMove(group.id);
                            } else {
                              onMove(bookmark.id, group.id);
                            }
                          }}
                        >
                          <span
                            className="mr-2 h-2 w-2 rounded-full"
                            style={{ backgroundColor: group.color }}
                          />
                          {group.name}
                        </ContextMenuItem>
                      ))}
                  </ContextMenuSubContent>
                </ContextMenuSub>
              ) : null}
              {!selectionMode && onEnterSelectionMode && (
                <>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={() => onEnterSelectionMode(bookmark.id)}
                  >
                    <IconSquaresSelected className="mr-2 h-4 w-4" />
                    <span>Select Multiple</span>
                  </ContextMenuItem>
                </>
              )}
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
      <Drawer
        open={drawerBookmark !== null}
        onOpenChange={(open) => {
          if (!open) closeDrawer();
        }}
      >
        <DrawerContent
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader className="pb-2">
            <DrawerTitle className="truncate">
              {drawerMoveView ? "Move To..." : drawerBookmark?.title}
            </DrawerTitle>
          </DrawerHeader>
          {drawerBookmark ? (
            <div className="flex flex-col gap-0.5 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {drawerMoveView ? (
                <>
                  <button
                    type="button"
                    onClick={() => setDrawerMoveView(false)}
                    className={DRAWER_ITEM_CLASS}
                  >
                    <IconArrowLeft className="size-5 text-muted-foreground" />
                    <span>Back</span>
                  </button>
                  {groups
                    .filter((g) => g.id !== currentGroupId)
                    .map((group) => (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => {
                          if (
                            selectionMode &&
                            selectedIds.has(drawerBookmark.id) &&
                            onBulkMove
                          ) {
                            onBulkMove(group.id);
                          } else {
                            onMove(drawerBookmark.id, group.id);
                          }
                          closeDrawer();
                        }}
                        className={DRAWER_ITEM_CLASS}
                      >
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: group.color }}
                        />
                        <span className="truncate">{group.name}</span>
                      </button>
                    ))}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleCopy(drawerBookmark);
                      closeDrawer();
                    }}
                    className={DRAWER_ITEM_CLASS}
                  >
                    <IconCopy className="size-5 text-muted-foreground" />
                    <span>Copy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleStartRename(drawerBookmark);
                      closeDrawer();
                    }}
                    className={DRAWER_ITEM_CLASS}
                  >
                    <IconPencil className="size-5 text-muted-foreground" />
                    <span>Rename</span>
                  </button>
                  {drawerBookmark.url ? (
                    <button
                      type="button"
                      onClick={() => {
                        onRefetch(drawerBookmark.id);
                        closeDrawer();
                      }}
                      className={DRAWER_ITEM_CLASS}
                    >
                      <IconRefresh className="size-5 text-muted-foreground" />
                      <span>Refetch</span>
                    </button>
                  ) : null}
                  {hasUsername && onToggleVisibility && (
                    <button
                      type="button"
                      onClick={() => {
                        onToggleVisibility(
                          drawerBookmark.id,
                          drawerBookmark.isPublic,
                        );
                        closeDrawer();
                      }}
                      className={DRAWER_ITEM_CLASS}
                    >
                      {isBookmarkPublic(
                        drawerBookmark,
                        currentGroupId,
                        publicGroupIds,
                      ) ? (
                        <>
                          <IconWorldOff className="size-5 text-muted-foreground" />
                          <span>Make Private</span>
                        </>
                      ) : (
                        <>
                          <IconWorld className="size-5 text-muted-foreground" />
                          <span>Make Public</span>
                        </>
                      )}
                    </button>
                  )}
                  {groups.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setDrawerMoveView(true)}
                      className={DRAWER_ITEM_CLASS}
                    >
                      <IconChevronsRight className="size-5 text-muted-foreground" />
                      <span>Move To...</span>
                    </button>
                  ) : null}
                  {!selectionMode && onEnterSelectionMode && (
                    <button
                      type="button"
                      onClick={() => {
                        onEnterSelectionMode(drawerBookmark.id);
                        closeDrawer();
                      }}
                      className={DRAWER_ITEM_CLASS}
                    >
                      <IconSquaresSelected className="size-5 text-muted-foreground" />
                      <span>Select Multiple</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        selectionMode &&
                        selectedIds.has(drawerBookmark.id) &&
                        onBulkDelete
                      ) {
                        onBulkDelete();
                      } else {
                        onDelete(drawerBookmark.id);
                      }
                      closeDrawer();
                    }}
                    className={cn(DRAWER_ITEM_CLASS, "text-destructive")}
                  >
                    <IconTrash className="size-5" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function isBookmarkPublic(
  bookmark: BookmarkItem,
  currentGroupId: string,
  publicGroupIds?: Set<string>,
): boolean {
  const groupIsPublic = publicGroupIds?.has(currentGroupId) ?? false;
  return bookmark.isPublic === true || groupIsPublic;
}

const BookmarkIcon = memo(function BookmarkIcon({
  bookmark,
  isCopied,
}: {
  bookmark: BookmarkItem;
  isCopied?: boolean;
}) {
  if (bookmark.type === "color" && bookmark.color) {
    return (
      <div
        className="h-5 w-5 rounded border border-border"
        style={{ backgroundColor: bookmark.color }}
      />
    );
  }

  if (bookmark.type === "text") {
    const colorResult = parseColor(bookmark.title);
    if (colorResult.isColor && colorResult.hex) {
      return (
        <div
          className="h-5 w-5 rounded border border-border"
          style={{ backgroundColor: colorResult.hex }}
        />
      );
    }
  }

  return (
    <div className="relative flex h-5 w-5 items-center justify-center">
      <AnimatePresence initial={false} mode="popLayout">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="flex items-center justify-center"
          >
            <IconCheck className="h-4 w-4 text-foreground" />
          </motion.div>
        ) : (
          <motion.div
            key="favicon"
            initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            <FaviconImage url={bookmark.url} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
