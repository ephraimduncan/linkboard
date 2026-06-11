# Make bmrks fully responsive (landing → dashboard → profile)

## Context

bmrks was designed keyboard-first/desktop-first. Layout is mostly fine on mobile (single-column, dialogs capped at `calc(100%-2rem)`), but the interaction model is broken on touch: all bookmark row actions (rename/delete/move/visibility/select) live exclusively in a right-click ContextMenu, the multi-select toolbar overflows at 375px, and the header can overflow. Goal: mobile users can do everything desktop users can, comfortably.

Decisions from interview:

- Row actions on touch: visible ⋯ button per row → bottom Drawer (vaul installed, primitive exists unused at `components/ui/drawer.tsx`)
- Multi-select toolbar: icon-only at small widths with enlarged ≥44px touch targets
- Landing nav: hamburger → drawer with Pricing / Changelog / Sign in
- Hide ALL keyboard-shortcut UI on mobile/touch (clutter)
- Dropdown menus: enlarge touch targets on touch devices
- Scope: landing, dashboard, public profile, changelog/terms/privacy, auth pages audit. Admin excluded.

## Key technical facts

- Tailwind v4 (CSS-first, `src/styles.css`), default breakpoints. Use `pointer-coarse:` for touch-device targeting (hover affordances, ⋯ button), `max-sm:`/`sm:` for width issues.
- shadcn/ui on Base UI (render-prop pattern). `Drawer` (vaul@^1.1.2) exists unused.
- `useIsMobile` hook exists (`hooks/use-mobile.ts`, 768px) — reuse if JS conditional needed.
- Bookmark row is a `Button` via `ContextMenuTrigger render={...}`; selection `Checkbox` already nests inside with `stopPropagation` (`bookmark-list.tsx:239-245`) — follow that pattern for the ⋯ trigger.
- Viewport meta correct in `src/routes/__root.tsx:25`.

## Requirements

### 1. Bookmark row actions drawer — `components/bookmark-list.tsx`

- Add ⋯ (IconDots) trigger in each row's right column, visible only `pointer-coarse:` (desktop unchanged, keeps ContextMenu). Stop-propagation pattern like the Checkbox.
- ONE Drawer at list level driven by `drawerBookmark` state (not per-row).
- Drawer items (≥44px rows, reuse exact handlers from ContextMenu items at lines 300-406): Copy, Rename, Delete (destructive), Refetch (if url), Make Public/Private (if `hasUsername`), Move To… (swap drawer content to inline group list w/ color dots), Select Multiple (if not selectionMode). Title = bookmark title.
- No ⌘ kbd hints in drawer.
- Right column `w-[100px]` (line 281): on small screens hide date / shrink reservation so title gets room + ⋯ fits.

### 2. Multi-select toolbar — `components/multi-select-toolbar.tsx`

- `<sm:` hide button text labels (`hidden sm:inline`), icon-only with ~44px (`min-h-11 min-w-11` mobile) tap targets; add `aria-label`s.
- Constrain `max-w-[calc(100vw-1rem)]`; safe-area bottom (`bottom-[max(2rem,env(safe-area-inset-bottom))]`).
- Labels return at `sm:+` (current look preserved on desktop).

### 3. Header — `components/header.tsx` (user annotated at 405px: crowded, spacing off)

- User menu trigger `w-44` (line 386): mobile → avatar only (hide name span + chevron `max-sm:`, fixed width becomes `sm:w-44`).
- Left cluster (logo / "/" / group switcher): tighten mobile spacing — reduce `gap-2` and group-trigger padding at `max-sm:`; group name `truncate max-w-*` guard.
- `px-6 py-3` → `px-4 sm:px-6`; clear separation between left cluster and avatar at ~400px.

### 4. Hide ALL keyboard-shortcut UI on mobile/touch

- `bookmark-input.tsx`: hide ⌘F Kbd hint (`pointer-coarse:hidden`), reduce `pe-16` correspondingly.
- `bookmark-list.tsx`: ⌘Enter row hint never renders on touch (hover-gated already, but ensure the `w-[100px]` reservation doesn't assume it).
- `header.tsx` user menu: hide "Keyboard Shortcuts" menu item on touch devices.
- Any other visible Kbd/KbdGroup in dashboard UI: hide on touch.
- Input font: ensure 16px on mobile (`text-base sm:text-sm`) to prevent iOS focus zoom — check `ui/input.tsx` default first; fix at the right layer.

### 5. Dropdown menus touch-friendly

- Group switcher + user menu (`header.tsx`), profile RSS menu: enlarge item touch targets on touch devices — `pointer-coarse:` bump item padding to ~min-h-11 (44px).
- Prefer one change at the `ui/dropdown-menu.tsx` item level (single `pointer-coarse:` class) so all menus inherit it; desktop unchanged.

### 6. Dashboard main — `components/dashboard-content.tsx`

- `py-20` (line 1323) → `py-8 sm:py-20` (or similar); `px-5` ok.
- Keyboard shortcut handlers untouched (desktop); all actions reachable via drawer on touch.

### 7. Landing — `components/landing.tsx`

- Nav: keep Sign in visible; add hamburger button (`sm:hidden`) opening bottom Drawer with Pricing / Changelog / Sign in. Desktop links keep `max-sm:hidden`.
- Footer: allow wrap / tighten at very narrow widths if needed.

### 8. Public profile — `components/public-profile-content.tsx`

- Hover-only arrow (line 293): always visible on `pointer-coarse:`.
- Audit row right column / date width at 375px, same treatment as dashboard list if needed.

### 9. Content + auth pages (audit, fix only what's broken)

- `changelog.tsx`, `terms.tsx`, `privacy.tsx`, login/signup/forgot/reset at 375px: padding, overflow, tap targets. Expected minimal.

## Non-goals

- Admin panel.
- No touch equivalents for power-keyboard features beyond drawer actions (no swipe gestures, no long-press).
- No layout redesign on desktop — desktop must look pixel-identical.
- No new dependencies.

## Verification

- `pnpm typecheck` (+ `pnpm lint` if clean baseline).
- No browser automation (user request) — user tests manually on device and gives feedback. Dev server already running; never start it.
- Manual-test checklist:
  - No horizontal scroll on any page at ~375–405px.
  - Landing: hamburger opens drawer, links navigate.
  - Dashboard: ⋯ visible on touch, drawer opens, each action works (rename focuses inline input, move shows groups, select enters selection mode); multi-select toolbar fits, buttons easy to tap; header avatar-only + tight spacing; no kbd hints anywhere.
  - Dropdowns (group switcher, user menu): comfortable tap targets.
  - Profile: stacks below lg, arrow visible on touch.
  - Desktop regression: pixel-identical (⋯ hidden on fine pointer, toolbar labels back, kbd hints back).
