import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useTransition,
  lazy,
  Suspense,
} from "react";
import { useNavigate, ClientOnly } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconSelector,
  IconPlus,
  IconCheck,
  IconTrash,
  IconSettings,
  IconLogout,
  IconWorld,
  IconWorldOff,
  IconUser,
  IconLoader2,
  IconKeyboard,
  IconLifebuoy,
  IconRocket,
  IconCreditCard,
  IconPalette,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { authClient, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { type GroupItem } from "@/lib/schema";
import type { ProfileData } from "@/components/dashboard-content";
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog";
import { ChromeIcon } from "@/components/chrome-icon";
import { useTheme } from "@/components/theme-provider";

import { hasActiveProAccess } from "@/lib/plan-limits";
import { startCheckout } from "@/lib/checkout";

const SettingsDialog = lazy(() =>
  import("@/components/settings-dialog").then((m) => ({
    default: m.SettingsDialog,
  })),
);
const preloadSettingsDialog = () => import("@/components/settings-dialog");

interface HeaderProps {
  groups: GroupItem[];
  selectedGroup: GroupItem;
  onSelectGroup: (id: string) => void;
  onCreateGroup: (name: string) => void;
  onDeleteGroup?: (id: string) => void;
  onToggleGroupVisibility?: (id: string, isPublic: boolean, onSettled?: () => void) => void;
  isTogglingGroupVisibility?: boolean;
  userName: string;
  userEmail: string;
  userImage?: string | null;
  username?: string | null;
  profile?: ProfileData;
  onExport?: () => void;
  readOnly?: boolean;
  showUserMenu?: boolean;
  logoSize?: number;
}

export function Header({
  groups,
  selectedGroup,
  onSelectGroup,
  onCreateGroup,
  onDeleteGroup,
  onToggleGroupVisibility,
  isTogglingGroupVisibility,
  userName,
  userEmail,
  userImage,
  username,
  profile,
  onExport,
  readOnly = false,
  showUserMenu = true,
  logoSize = 24,
}: HeaderProps) {
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const [newGroupName, setNewGroupName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [pendingVisibilityGroupId, setPendingVisibilityGroupId] = useState<
    string | null
  >(null);
  const [pendingVisibilityTarget, setPendingVisibilityTarget] = useState<
    boolean | null
  >(null);
  const [holdingGroupId, setHoldingGroupId] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isBillingPending, startBillingTransition] = useTransition();
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartRef = useRef<number>(0);

  const openExternal = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const hasProAccess = hasActiveProAccess(
    profile?.plan,
    profile?.subscriptionStatus,
    profile?.subscriptionCurrentPeriodEnd,
  );

  const isCancelledButActive =
    profile?.subscriptionStatus === "canceled" && hasProAccess;

  const handleUpgradeClick = () => {
    const billingCycle =
      import.meta.env.VITE_DEFAULT_BILLING_CYCLE === "monthly"
        ? ("monthly" as const)
        : ("yearly" as const);
    startBillingTransition(async () => {
      await startCheckout({ billingCycle, source: "dashboard_dropdown" });
    });
  };

  const handleBillingPortalClick = () => {
    startBillingTransition(async () => {
      const { error } = await authClient.customer.portal({
        redirect: true,
      });

      if (error) {
        toast.error(error.message || "Unable to open billing portal");
      }
    });
  };
  const handleSignOut = async () => {
    setSignOutOpen(false);
    await signOut();
    navigate({ to: "/login" });
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName.trim());
      setNewGroupName("");
      setDialogOpen(false);
    }
  };

  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    setHoldingGroupId(null);
    setHoldProgress(0);
  }, []);

  const startHold = useCallback(
    (groupId: string) => {
      if (readOnly) return;
      if (groups.length <= 1) return;
      setHoldingGroupId(groupId);
      holdStartRef.current = Date.now();

      const updateProgress = () => {
        const elapsed = Date.now() - holdStartRef.current;
        const progress = Math.min((elapsed / 2000) * 100, 100);
        setHoldProgress(progress);

        if (progress >= 100) {
          onDeleteGroup?.(groupId);
          cancelHold();
        } else {
          holdTimerRef.current = setTimeout(updateProgress, 16);
        }
      };

      holdTimerRef.current = setTimeout(updateProgress, 16);
    },
    [groups.length, onDeleteGroup, cancelHold, readOnly],
  );

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  return (
    <header
      className={cn(
        "flex items-center justify-between",
        readOnly ? "px-4 py-2" : "px-4 py-3 sm:px-6",
      )}
    >
      <div className="flex min-w-0 items-center gap-1 sm:gap-2">
        <BmrksLogo size={logoSize} />
        <span className="text-muted-foreground">/</span>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-xl"
            render={
              <Button
                variant="ghost"
                className="gap-1.5 px-1.5 sm:gap-2 sm:px-2"
              />
            }
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: selectedGroup.color }}
            />
            <span className="max-w-[32vw] truncate sm:max-w-none">
              {selectedGroup.name}
            </span>
            <IconSelector className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 space-y-1 rounded-xl pointer-coarse:space-y-0"
          >
            {groups.map((group) => (
              <DropdownMenuItem
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                className={cn(
                  "flex items-start justify-between rounded-lg px-2 py-1.5 pointer-coarse:items-center",
                  group.id === selectedGroup.id && "bg-accent",
                )}
              >
                <div className="flex items-start gap-2 pointer-coarse:items-center">
                  <span
                    className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full pointer-coarse:mt-0"
                    style={{ backgroundColor: group.color }}
                  />
                  <span>{group.name}</span>
                  {group.isPublic && (
                    <IconWorld className="mt-1 h-3 w-3 shrink-0 text-muted-foreground pointer-coarse:mt-0" />
                  )}
                </div>
                {group.id === selectedGroup.id ? (
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 pointer-coarse:mt-0" />
                ) : (
                  <span className="mt-0.5 shrink-0 text-xs tabular-nums text-muted-foreground pointer-coarse:mt-0">
                    {group.bookmarkCount ?? 0}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => {
                if (!readOnly) setDialogOpen(true);
              }}
              disabled={readOnly}
              className="rounded-lg w-full px-2 py-1.5"
            >
              <IconPlus className="h-4 w-4 mr-0" />
              Create Group
            </DropdownMenuItem>
            {!readOnly && onToggleGroupVisibility && (
              <DropdownMenuItem
                onClick={() => {
                  setPendingVisibilityGroupId(selectedGroup.id);
                  setPendingVisibilityTarget(!selectedGroup.isPublic);
                  setVisibilityDialogOpen(true);
                }}
                className="rounded-lg px-2 py-1.5"
              >
                {selectedGroup.isPublic ? (
                  <>
                    <IconWorldOff className="h-4 w-4" />
                    Make Private
                  </>
                ) : (
                  <>
                    <IconWorld className="h-4 w-4" />
                    Make Public
                  </>
                )}
              </DropdownMenuItem>
            )}
            {!readOnly && groups.length > 1 && (
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onMouseDown={() => startHold(selectedGroup.id)}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={() => startHold(selectedGroup.id)}
                onTouchEnd={cancelHold}
                className="relative overflow-hidden text-destructive focus:text-destructive rounded-lg px-2 py-1.5"
              >
                {holdingGroupId === selectedGroup.id && (
                  <div
                    className="absolute inset-0 bg-destructive/20 origin-left"
                    style={{ transform: `scaleX(${holdProgress / 100})` }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <IconTrash className="h-4 w-4 text-destructive" />
                  {holdingGroupId === selectedGroup.id
                    ? "Hold to delete..."
                    : "Delete Group"}
                </span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-sm" showCloseButton={false}>
            <Form
              className="contents"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateGroup();
              }}
            >
              <DialogHeader>
                <DialogTitle>Create Group</DialogTitle>
                <DialogDescription>
                  Create a new group to organize your bookmarks.
                </DialogDescription>
              </DialogHeader>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  placeholder="Enter group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  autoFocus
                />
              </Field>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" />}>
                  Cancel
                </DialogClose>
                <Button type="submit" disabled={!newGroupName.trim()}>
                  Create
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {showUserMenu ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-xl"
              render={
                <Button
                  variant="ghost"
                  className="justify-start gap-2 px-2 border-0 max-sm:h-9 max-sm:w-9 max-sm:justify-center max-sm:px-0 sm:w-44"
                />
              }
            >
              <UserAvatar name={userName} image={userImage} />
              <span className="truncate max-sm:hidden">{userName}</span>
              <IconSelector className="ml-auto h-4 w-4 shrink-0 text-muted-foreground max-sm:hidden" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl max-sm:w-60">
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() => setSettingsOpen(true)}
                onMouseEnter={preloadSettingsDialog}
                onFocus={preloadSettingsDialog}
                disabled={readOnly}
              >
                <IconSettings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {username && (
                <DropdownMenuItem
                  className="rounded-lg"
                  onClick={() => openExternal(`/u/${username}`)}
                >
                  <IconUser className="h-4 w-4" />
                  Public Profile
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() => openExternal("/chrome")}
                disabled={readOnly}
              >
                <ChromeIcon />
                Chrome Extension
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!hasProAccess ? (
                <DropdownMenuItem
                  className="rounded-lg"
                  onClick={handleUpgradeClick}
                  disabled={readOnly || isBillingPending}
                >
                  <IconRocket className="h-4 w-4" />
                  Upgrade
                </DropdownMenuItem>
              ) : null}
              {hasProAccess ? (
                <DropdownMenuItem
                  className="rounded-lg"
                  onClick={handleBillingPortalClick}
                  disabled={readOnly || isBillingPending}
                >
                  <IconCreditCard className="h-4 w-4" />
                  Billing Portal
                </DropdownMenuItem>
              ) : null}
              {isCancelledButActive && profile?.subscriptionCurrentPeriodEnd ? (
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  Pro until{" "}
                  {new Date(
                    profile.subscriptionCurrentPeriodEnd,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="rounded-lg">
                  <IconPalette className="h-4 w-4" />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-2xl">
                    <DropdownMenuItem
                      className="rounded-lg"
                      onClick={() => setTheme("light")}
                    >
                      <IconSun className="h-4 w-4" />
                      Light
                      {theme === "light" && <IconCheck className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-lg"
                      onClick={() => setTheme("dark")}
                    >
                      <IconMoon className="h-4 w-4" />
                      Dark
                      {theme === "dark" && <IconCheck className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem
                className="rounded-lg pointer-coarse:hidden"
                onClick={() => setShortcutsOpen(true)}
              >
                <IconKeyboard className="h-4 w-4" />
                Keyboard Shortcuts
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() => openExternal("mailto:ephraimduncan68@gmail.com")}
              >
                <IconLifebuoy className="h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() => setSignOutOpen(true)}
                disabled={readOnly}
              >
                <IconLogout className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={signOutOpen} onOpenChange={setSignOutOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-semibold text-xl">
                  Sign out?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to sign in again to access your bookmarks.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="ghost">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleSignOut}
                >
                  Sign out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog
            open={visibilityDialogOpen}
            onOpenChange={(open) => {
              if (isTogglingGroupVisibility) return;
              setVisibilityDialogOpen(open);
              if (!open) {
                setPendingVisibilityGroupId(null);
                setPendingVisibilityTarget(null);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-semibold text-xl">
                  {pendingVisibilityTarget ? "Make group public?" : "Make group private?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {pendingVisibilityTarget
                    ? "All bookmarks in this group will become publicly visible on your profile."
                    : "All bookmarks in this group will no longer be publicly visible on your profile."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  variant="ghost"
                  disabled={isTogglingGroupVisibility}
                  onClick={() => {
                    setVisibilityDialogOpen(false);
                    setPendingVisibilityGroupId(null);
                    setPendingVisibilityTarget(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isTogglingGroupVisibility}
                  onClick={() => {
                    if (
                      pendingVisibilityGroupId &&
                      pendingVisibilityTarget !== null
                    ) {
                      onToggleGroupVisibility?.(
                        pendingVisibilityGroupId,
                        pendingVisibilityTarget,
                        () => {
                          setVisibilityDialogOpen(false);
                          setPendingVisibilityGroupId(null);
                          setPendingVisibilityTarget(null);
                        },
                      );
                    }
                  }}
                >
                  {isTogglingGroupVisibility && (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                  )}
                  {pendingVisibilityTarget ? "Make Public" : "Make Private"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <KeyboardShortcutsDialog
            open={shortcutsOpen}
            onOpenChange={setShortcutsOpen}
          />
          <ClientOnly>
            <Suspense fallback={null}>
              <SettingsDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                user={{
                  name: userName,
                  email: userEmail,
                  image: userImage ?? null,
                }}
                profile={profile}
                onExport={onExport}
              />
            </Suspense>
          </ClientOnly>
        </>
      ) : null}
    </header>
  );
}

function BmrksLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Logo"
    >
      <title>minimal logo</title>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12.432 17.949c.863 1.544 2.589 1.976 4.13 1.112c1.54 -.865 1.972 -2.594 1.048 -4.138c-.185 -.309 -.309 -.556 -.494 -.74c.247 .06 .555 .06 .925 .06c1.726 0 2.959 -1.234 2.959 -2.963c0 -1.73 -1.233 -2.965 -3.02 -2.965c-.37 0 -.617 0 -.925 .062c.185 -.185 .308 -.432 .493 -.74c.863 -1.545 .431 -3.274 -1.048 -4.138c-1.541 -.865 -3.205 -.433 -4.13 1.111c-.185 .309 -.308 .556 -.432 .803c-.123 -.247 -.246 -.494 -.431 -.803c-.802 -1.605 -2.528 -2.038 -4.007 -1.173c-1.541 .865 -1.973 2.594 -1.048 4.137c.185 .31 .308 .556 .493 .741c-.246 -.061 -.555 -.061 -.924 -.061c-1.788 0 -3.021 1.235 -3.021 2.964c0 1.729 1.233 2.964 3.02 2.964" />
      <path d="M4.073 21c4.286 -2.756 5.9 -5.254 7.927 -9" />
    </svg>
  );
}

function UserAvatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="size-6 sm:size-4.5 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      width="18"
      height="18"
      className="size-6 sm:size-4"
    >
      <title>User avatar</title>
      <rect width="32" height="32" rx="16" fill="#74B06F" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="500"
      >
        {name.charAt(0).toUpperCase()}
      </text>
    </svg>
  );
}

