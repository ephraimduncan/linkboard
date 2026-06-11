"use client";

import { useState } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { IconSelector, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { GroupItem } from "@/lib/schema";

interface BulkMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: GroupItem[];
  currentGroupId: string;
  selectedCount: number;
  onConfirm: (targetGroupId: string) => void;
}

export function BulkMoveDialog({
  open,
  onOpenChange,
  groups,
  currentGroupId,
  selectedCount,
  onConfirm,
}: BulkMoveDialogProps) {
  const availableGroups = groups.filter((g) => g.id !== currentGroupId);
  const [targetGroupId, setTargetGroupId] = useState<string>(
    availableGroups[0]?.id ?? "",
  );
  const selectedGroup = availableGroups.find((g) => g.id === targetGroupId);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open && !prevOpen && availableGroups.length > 0) {
    setTargetGroupId(availableGroups[0].id);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const handleConfirm = () => {
    if (targetGroupId) {
      onConfirm(targetGroupId);
      setTargetGroupId("");
      onOpenChange(false);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-xs" showCloseButton={false}>
        <Form
          className="contents"
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirm();
          }}
        >
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              Move {selectedCount} bookmarks
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Select the group to move the selected bookmarks to.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody>
            <Field>
              <FieldLabel>Target Group</FieldLabel>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="rounded-xl w-full"
                  render={
                    <Button
                      variant="outline"
                      className="w-full gap-2 px-2 justify-between"
                    />
                  }
                >
                  {selectedGroup ? (
                    <>
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: selectedGroup.color }}
                      />
                      <span className="flex-1 text-left">
                        {selectedGroup.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground flex-1 text-left">
                      Select a group
                    </span>
                  )}
                  <IconSelector className="h-4 w-4 text-muted-foreground shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="pointer-events-auto min-w-[16rem] rounded-xl space-y-1"
                >
                  {availableGroups.map((group) => (
                    <DropdownMenuItem
                      key={group.id}
                      onClick={() => setTargetGroupId(group.id)}
                      className={cn(
                        "flex items-center justify-between rounded-lg",
                        group.id === targetGroupId && "bg-accent",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: group.color }}
                        />
                        <span>{group.name}</span>
                      </div>
                      {group.id === targetGroupId && (
                        <IconCheck className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </Field>
          </ResponsiveDialogBody>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose render={<Button variant="ghost" />}>
              Cancel
            </ResponsiveDialogClose>
            <Button type="submit" disabled={!targetGroupId}>
              Move
            </Button>
          </ResponsiveDialogFooter>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
