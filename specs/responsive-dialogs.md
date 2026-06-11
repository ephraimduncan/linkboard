# Responsive Dialogs

## Context

Dashboard dialogs (Settings, Export, Bulk Move, Create Group, Keyboard Shortcuts) render as centered modals at every screen size. On phones they feel cramped and non-native. Adopt the shadcn "Responsive Dialog" pattern: centered Dialog at ≥768px, vaul bottom drawer below 768px.

Stack nuance this spec accounts for: Dialog/AlertDialog are Base UI (`@base-ui/react`), Drawer is vaul (Radix-based). The shadcn sample assumes Radix `asChild`; the wrapper must bridge Base UI's `render` prop to vaul/Radix `asChild`. `useIsMobile()` already exists at `hooks/use-mobile.ts` (max-width 767px, SSR-safe, returns false on server).

Follows specs/make-app-responsive.md, which already added vaul drawers for bookmark row actions and landing nav — both untouched here.

## Requirements

1. New shared primitive set `components/ui/responsive-dialog.tsx` exporting `ResponsiveDialog`, `ResponsiveDialogContent`, `ResponsiveDialogHeader`, `ResponsiveDialogTitle`, `ResponsiveDialogDescription`, `ResponsiveDialogBody`, `ResponsiveDialogFooter`, `ResponsiveDialogClose`. The root calls `useIsMobile()` once and provides the value via context; subcomponents read the context and render the Dialog or Drawer equivalent. (Context, not per-component `useIsMobile()` calls: independent media-query reads can tear during hydration, rendering a vaul `DrawerContent` under a Base UI `Dialog` root, which crashes vaul's portal context check.) Match `ui/*` conventions (no semicolons, `data-slot`, `cn()`).
2. Root accepts `{ open, onOpenChange: (open: boolean) => void, children }` only. No Trigger export (all call sites are controlled).
3. Content forwards `className`/`showCloseButton` only in dialog mode; drawer mode is always stock full-width (call-site `sm:max-w-*` would squeeze drawers at 640–767px). Drawer mode adds dismiss guards (req. 6).
4. Body: desktop `display: contents` (desktop stays pixel-identical); mobile `flex min-h-0 flex-col gap-4 overflow-y-auto px-4 pb-4` (the scroll container inside DrawerContent's 80vh cap).
5. Footer: desktop reuses `DialogFooter`; mobile renders its own plain footer `flex flex-col-reverse gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end` (no negative margins, no `border-t`, no `bg-muted/50` — the divider and muted band are dialog-only; the footer shares the drawer background). Supports `showCloseButton` via `ResponsiveDialogClose`. Close bridges `DialogClose render={...}` ↔ `DrawerClose asChild` + `cloneElement`.
6. Interop guards (vaul/Radix drawer under Base UI popups):
   - Radix modal drawers set `body { pointer-events: none }`; Base UI portals don't force `auto`. Add `pointer-events-auto` to the `DropdownMenuContent` in bulk-move and export, and both `AlertDialogContent`s in settings ApiKeyTab.
   - Taps inside Base UI portals count as "outside" to Radix and dismiss the drawer. In drawer-mode Content: `onPointerDownOutside` → `preventDefault()` unless the target is within `[data-slot="drawer-overlay"]`; `onEscapeKeyDown` → `preventDefault()` while a `[data-slot="dropdown-menu-content"]` or `[data-slot="alert-dialog-content"]` is in the DOM.
7. Migrate five call sites (1:1 tag renames plus listed extras):
   - `components/keyboard-shortcuts-dialog.tsx`: wrap shortcuts grid in Body; `ResponsiveDialogFooter showCloseButton`; `aria-describedby={undefined}` on Content.
   - `components/header.tsx` create-group dialog: wrap Field in Body; input `autoFocus={!isMobile}`.
   - `components/bulk-move-dialog.tsx`: wrap Target Group Field in Body; dropdown `pointer-events-auto`.
   - `components/export-dialog.tsx`: wrap everything between Header and Footer in one Body; dropdown `pointer-events-auto`.
   - `components/settings-dialog.tsx`: wrap `<Tabs>` in Body; per-tab footers → `ResponsiveDialogFooter className="max-md:-mx-4 max-md:-mb-4"` (full-bleed inside Body padding); nested alerts get `pointer-events-auto`.

## Non-goals

- AlertDialog confirmations stay centered everywhere: bulk-delete-dialog.tsx, header sign-out + group-visibility, settings revoke/regenerate API key.
- Existing drawers (bookmark-list.tsx, landing.tsx) and ui/sheet.tsx untouched.
- No vaul extras exposed (snap points, `shouldScaleBackground`, separate drawer className).
- Desktop rendering must remain pixel-identical.

## Accepted limitations

- Nested alert backdrop-tap won't dismiss on mobile (Cancel button works).
- Drawers show no X close button (handle/swipe/overlay tap, matching existing app drawers).

## Verification

- `pnpm typecheck` and `pnpm lint` clean.
- ≥768px: all five dialogs unchanged (widths, close X presence, footer band, Escape/Cancel, settings tabs + nested alerts).
- <768px: each renders as bottom drawer with handle, full width, padded body; swipe-down + overlay tap dismiss; Cancel/Close work.
- Settings drawer: 80vh cap, tabs scroll, per-tab footer reachable and full-bleed; API-tab confirms stack above the drawer, buttons clickable, drawer stays open beneath.
- Export/bulk-move: dropdown opens and items are clickable inside the drawer; selecting doesn't dismiss it; submit works.
- Create-group: no autofocus on mobile; tapping the input raises the keyboard and vaul repositions.
- 640–767px: drawers full-width, footer buttons row-aligned.
- Resizing across 768px while open swaps presentation and preserves open state.
