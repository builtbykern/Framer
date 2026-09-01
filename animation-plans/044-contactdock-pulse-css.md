# 044 — Contact Dock pulse via CSS transform

- **Status**: DONE (executed 2026-07-31 — CSS pulse; push typeErrors []; open/close untouched)
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/ContactDock.tsx`)
- **Audit**: `animation-plans/REPORT-contactdock-improve-animations-2026-07-31.md` finding 1
- **Constraint**: Restored open UX must not break — replace pulse rings only; do not touch toggle/portal/sheet

## Problem

Continuous idle pulse uses Framer Motion `scale` / `opacity` keyframe loops on two rings. FM transform shorthands run on the main thread — worst case for always-on decorative motion.

```tsx
// code-components/ContactDock.tsx:526–563 — current
{/* Pulse rings */}
{pulseOn ? (
    <>
        <motion.span
            aria-hidden
            animate={{ scale: [1, 1.55], opacity: [0.45, 0] }}
            transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeOut",
            }}
            style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                border: `1.5px solid ${accent}`,
                pointerEvents: "none",
            }}
        />
        <motion.span
            aria-hidden
            animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
            transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.55,
            }}
            style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                border: `1px solid ${accent}`,
                pointerEvents: "none",
            }}
        />
    </>
) : null}
```

## Target

1. Module-level CSS string (exact values from AUDIT.md ease-out):

```ts
const DOCK_PULSE_CSS = `
@keyframes cd-dock-pulse-a {
  from { transform: scale(1); opacity: 0.45; }
  to { transform: scale(1.55); opacity: 0; }
}
@keyframes cd-dock-pulse-b {
  from { transform: scale(1); opacity: 0.35; }
  to { transform: scale(1.35); opacity: 0; }
}
.cd-dock-pulse-a,
.cd-dock-pulse-b {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  pointer-events: none;
  will-change: transform, opacity;
}
.cd-dock-pulse-a {
  border: 1.5px solid var(--cd-accent, #6FD3FF);
  animation: cd-dock-pulse-a 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
}
.cd-dock-pulse-b {
  border: 1px solid var(--cd-accent, #6FD3FF);
  animation: cd-dock-pulse-b 2.4s cubic-bezier(0.23, 1, 0.32, 1) 0.55s infinite;
}
@media (prefers-reduced-motion: reduce) {
  .cd-dock-pulse-a,
  .cd-dock-pulse-b {
    animation: none;
    opacity: 0;
  }
}
`
```

2. Inside the portal `dock` root `<div>` (the fixed corner wrapper that already has `ref={rootRef}`), set CSS variable and inject style once:

```tsx
style={{
  // ...existing fixed/corner styles...
  ["--cd-accent" as string]: accent,
}}
```

Near the top of that dock’s children (before AnimatePresence is fine):

```tsx
<style>{DOCK_PULSE_CSS}</style>
```

3. Replace the two `motion.span` rings with:

```tsx
{pulseOn ? (
    <>
        <span aria-hidden className="cd-dock-pulse-a" />
        <span aria-hidden className="cd-dock-pulse-b" />
    </>
) : null}
```

Keep the JS gate: rings render only when `pulseOn` (`motion.pulse !== false && !reduced`). Canvas static stub (mid-pulse `span` around lines 628–638) stays as-is — not part of this plan.

## Repo conventions to follow

- AUDIT.md: animate `transform` + `opacity` only; strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)`
- Single-file Marketplace component — CSS string + `<style>` in-file; zero new deps
- Push: pin Contact Dock sandbox → `node scripts/framer/push-contactdock.mjs`

## Steps

1. Add `DOCK_PULSE_CSS` constant near other module constants (after `DEFAULT_FONT` / before icon helpers is fine).
2. On the fixed dock root `div`, add `["--cd-accent" as string]: accent` to its style object; render `<style>{DOCK_PULSE_CSS}</style>` as first child.
3. Replace `{pulseOn ? (<>…motion.span…</>) : null}` with the two plain `<span className="cd-dock-pulse-a|b" />` as in Target.
4. Confirm `motion` is still imported (sheet / button still use it); do not remove `framer-motion` import.
5. Pin + push + verify:
   - `node scripts/framer/session.mjs --url "https://framer.com/projects/Overly-Interaction--2GOZzqC76RSbm2V0FOXP-i5R6n" --name "Contact Dock"`
   - `node scripts/framer/push-contactdock.mjs` → `typeErrors: []`
   - `node scripts/framer/verify.mjs` → ready
6. Mark this plan DONE and README 044 → DONE.

## Boundaries

- Do NOT remove the pulse feature (locked in design spec).
- Do NOT animate `width` / `height` / `box-shadow` / `border-width`.
- Do NOT add GSAP or extra packages.
- Do NOT change sheet open/close springs, `onClick={toggle}`, outside-close, Escape, portal target, ChannelRow, or `whileTap`.
- Do NOT implement 046/047/051 hover/focus CSS in this plan (shared stylesheet later is OK only if already present — currently it is not; pulse-only CSS).
- If pulse rings are already CSS (no `motion.span` with `scale: [1, 1.55]`), STOP and report drift.

## Verification

- **Mechanical**: `rg 'scale: \\[1, 1\\.55\\]' code-components/ContactDock.tsx` → no matches; `rg cd-dock-pulse code-components/ContactDock.tsx` → hits; push `typeErrors: []`; verify ready.
- **Feel check**: Preview — two rings breathe continuously around the orb; click orb — sheet still opens/closes; Pulse Off in props — rings gone; DevTools Rendering → `prefers-reduced-motion` → rings stop (opacity 0 / no scale loop).
- **Done when**: idle presence preserved, no FM scale loop on pulse rings, open/close still works with one click.
