"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconListCheck,
  IconX,
  IconDragDrop,
  IconCopyCheckFilled,
  IconTrash,
  IconFileExport,
  IconFileTypeCsv,
  IconJson,
  IconWorld,
  IconWorldOff,
} from "@tabler/icons-react";

const HINT_CLASS =
  "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 animate-in fade-in-0 rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground whitespace-nowrap shadow-md ring-1 ring-foreground/10 sm:hidden";

interface MultiSelectToolbarProps {
  onSelectAll: () => void;
  onMove: () => void;
  onCopyUrls: () => void;
  onExport: (format: "csv" | "json") => void;
  onDelete: () => void;
  onClose: () => void;
  hasUsername?: boolean;
  onMakePublic?: () => void;
  onMakePrivate?: () => void;
}

export function MultiSelectToolbar({
  onSelectAll,
  onMove,
  onCopyUrls,
  onExport,
  onDelete,
  onClose,
  hasUsername,
  onMakePublic,
  onMakePrivate,
}: MultiSelectToolbarProps) {
  const [hint, setHint] = useState<string | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showHint = (label: string) => {
    setHint(label);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setHint(null), 1500);
  };

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      className="fixed bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-1rem)] motion-reduce:transition-none motion-reduce:animate-none"
    >
      <div className="flex items-center rounded-lg bg-popover text-popover-foreground p-1 shadow-md ring-1 ring-foreground/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          onPointerDown={() => showHint("Select All")}
          aria-label="Select all"
          className="relative gap-1.5 rounded-md px-1.5 py-1 h-auto text-[13px] hover:bg-accent hover:text-accent-foreground max-sm:size-11"
        >
          <IconListCheck className="size-5 sm:size-4" />
          <span className="max-sm:hidden">Select All</span>
          {hint === "Select All" && (
            <span className={HINT_CLASS}>Select All</span>
          )}
        </Button>
        <div className="h-4 w-px bg-border mx-0.5 -my-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onMove}
          onPointerDown={() => showHint("Move")}
          aria-label="Move"
          className="relative gap-1.5 rounded-md px-1.5 py-1 h-auto text-[13px] hover:bg-accent hover:text-accent-foreground max-sm:size-11"
        >
          <IconDragDrop className="size-5 sm:size-4" />
          <span className="max-sm:hidden">Move</span>
          {hint === "Move" && <span className={HINT_CLASS}>Move</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopyUrls}
          onPointerDown={() => showHint("Copy URLs")}
          aria-label="Copy URLs"
          className="relative gap-1.5 rounded-md px-1.5 py-1 h-auto text-[13px] hover:bg-accent hover:text-accent-foreground max-sm:size-11"
        >
          <IconCopyCheckFilled className="size-5 sm:size-4" />
          <span className="max-sm:hidden">Copy URLs</span>
          {hint === "Copy URLs" && <span className={HINT_CLASS}>Copy URLs</span>}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                onPointerDown={() => showHint("Export")}
                aria-label="Export"
                className="relative gap-1.5 rounded-md px-1.5 py-1 h-auto text-[13px] hover:bg-accent hover:text-accent-foreground max-sm:size-11"
              />
            }
          >
            <IconFileExport className="size-5 sm:size-4" />
            <span className="max-sm:hidden">Export</span>
            {hint === "Export" && <span className={HINT_CLASS}>Export</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-40">
            <DropdownMenuItem onClick={() => onExport("csv")} className="whitespace-nowrap">
              <IconFileTypeCsv className="h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("json")} className="whitespace-nowrap">
              <IconJson className="h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {hasUsername && onMakePublic && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMakePublic}
            onPointerDown={() => showHint("Make Public")}
            aria-label="Make public"
            className="relative gap-1.5 rounded-md px-1.5 py-1 h-auto text-[13px] hover:bg-accent hover:text-accent-foreground max-sm:size-11"
          >
            <IconWorld className="size-5 sm:size-4" />
            <span className="max-sm:hidden">Public</span>
            {hint === "Make Public" && (
              <span className={HINT_CLASS}>Make Public</span>
            )}
          </Button>
        )}
        {hasUsername && onMakePrivate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMakePrivate}
            onPointerDown={() => showHint("Make Private")}
            aria-label="Make private"
            className="relative gap-1.5 rounded-md px-1.5 py-1 h-auto text-[13px] hover:bg-accent hover:text-accent-foreground max-sm:size-11"
          >
            <IconWorldOff className="size-5 sm:size-4" />
            <span className="max-sm:hidden">Private</span>
            {hint === "Make Private" && (
              <span className={HINT_CLASS}>Make Private</span>
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          onPointerDown={() => showHint("Delete")}
          aria-label="Delete"
          className="relative gap-1.5 rounded-md px-1.5 py-1 h-auto text-[13px] text-destructive hover:bg-destructive/10 hover:text-destructive max-sm:size-11"
        >
          <IconTrash className="size-5 sm:size-4" />
          <span className="max-sm:hidden">Delete</span>
          {hint === "Delete" && <span className={HINT_CLASS}>Delete</span>}
        </Button>
        <div className="h-4 w-px bg-border mx-0.5" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          onPointerDown={() => showHint("Close")}
          className="relative rounded-md p-1 h-auto hover:bg-accent hover:text-accent-foreground max-sm:size-11 max-sm:p-0"
          aria-label="Close multi-select toolbar"
        >
          <IconX className="size-5 sm:size-4" />
          {hint === "Close" && <span className={HINT_CLASS}>Close</span>}
        </Button>
      </div>
    </motion.div>
  );
}
