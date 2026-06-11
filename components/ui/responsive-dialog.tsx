"use client";

import * as React from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface ResponsiveDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

// Subcomponents read the mode from context instead of useIsMobile() so they
// can never disagree with their root: a DrawerContent rendered under a Base UI
// Dialog root (possible when per-component media-query reads tear during
// hydration) crashes vaul's portal context check.
const ResponsiveDialogContext = React.createContext(false);

function ResponsiveDialog({ children, ...props }: ResponsiveDialogProps) {
  const isMobile = useIsMobile();
  return (
    <ResponsiveDialogContext.Provider value={isMobile}>
      {isMobile ? (
        <Drawer {...props}>{children}</Drawer>
      ) : (
        <Dialog {...props}>{children}</Dialog>
      )}
    </ResponsiveDialogContext.Provider>
  );
}

// Base UI popups (dropdown menus, alert dialogs) portal outside the vaul
// drawer, so Radix treats interactions with them as "outside" and would
// dismiss the drawer.
function hasOpenBaseUiPopup() {
  return !!document.querySelector(
    '[data-slot="dropdown-menu-content"], [data-slot="alert-dialog-content"]',
  );
}

function ResponsiveDialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  const isMobile = React.useContext(ResponsiveDialogContext);
  if (isMobile) {
    return (
      <DrawerContent
        onPointerDownOutside={(e) => {
          const target = e.target as Element | null;
          if (!target?.closest('[data-slot="drawer-overlay"]')) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (hasOpenBaseUiPopup()) e.preventDefault();
        }}
        {...props}
      >
        {children}
      </DrawerContent>
    );
  }
  return (
    <DialogContent
      className={className}
      showCloseButton={showCloseButton}
      {...props}
    >
      {children}
    </DialogContent>
  );
}

function ResponsiveDialogHeader(props: React.ComponentProps<"div">) {
  const isMobile = React.useContext(ResponsiveDialogContext);
  if (isMobile) return <DrawerHeader {...props} />;
  return <DialogHeader {...props} />;
}

function ResponsiveDialogTitle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const isMobile = React.useContext(ResponsiveDialogContext);
  if (isMobile) {
    return <DrawerTitle className={className}>{children}</DrawerTitle>;
  }
  return <DialogTitle className={className}>{children}</DialogTitle>;
}

function ResponsiveDialogDescription({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const isMobile = React.useContext(ResponsiveDialogContext);
  if (isMobile) {
    return (
      <DrawerDescription className={className}>{children}</DrawerDescription>
    );
  }
  return (
    <DialogDescription className={className}>{children}</DialogDescription>
  );
}

function ResponsiveDialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const isMobile = React.useContext(ResponsiveDialogContext);
  return (
    <div
      data-slot="responsive-dialog-body"
      className={cn(
        isMobile
          ? "flex min-h-0 flex-col gap-4 overflow-y-auto px-4 pb-4"
          : "contents",
        className,
      )}
      {...props}
    />
  );
}

function ResponsiveDialogClose({
  render,
  children,
  ...props
}: {
  render?: React.ReactElement<Record<string, unknown>>;
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = React.useContext(ResponsiveDialogContext);
  if (!isMobile) {
    return (
      <DialogClose render={render} {...props}>
        {children}
      </DialogClose>
    );
  }
  if (render) {
    return (
      <DrawerClose asChild {...props}>
        {children === undefined
          ? render
          : React.cloneElement(render, undefined, children)}
      </DrawerClose>
    );
  }
  return <DrawerClose {...props}>{children}</DrawerClose>;
}

function ResponsiveDialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  const isMobile = React.useContext(ResponsiveDialogContext);
  const closeButton = showCloseButton ? (
    <ResponsiveDialogClose render={<Button variant="outline" />}>
      Close
    </ResponsiveDialogClose>
  ) : null;

  if (isMobile) {
    return (
      <div
        data-slot="dialog-footer"
        className={cn(
          "flex flex-col-reverse gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end",
          className,
        )}
        {...props}
      >
        {children}
        {closeButton}
      </div>
    );
  }

  return (
    <DialogFooter className={className} {...props}>
      {children}
      {closeButton}
    </DialogFooter>
  );
}

export {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
};
