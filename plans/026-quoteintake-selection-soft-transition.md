# 026 — Soft-transition RadioTile selection accent

- **Status**: DONE
- **Commit**: n/a (no git HEAD; SoT `state/QuoteIntake.tsx` Version: 3.9.1)
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file, ~10 lines

## Problem

Selected-state `boxShadow` inset accent and `opacity` snap instantly when choosing an intent/timeline option — a jarring state change on an interactive list.

```tsx
/* state/QuoteIntake.tsx:374 — current (style excerpt) */
boxShadow: selected ? `inset 2px 0 0 ${colors.accent}` : "inset 2px 0 0 transparent",
…
opacity: selected ? 1 : 0.72
```

## Target

CSS transition on the button style (not layout props):

```tsx
transitionProperty: "box-shadow, opacity",
transitionDuration: "160ms",
transitionTimingFunction: "ease",
```

Or Framer Motion:

```tsx
animate={{
  opacity: selected ? 1 : 0.72,
  boxShadow: selected ? `inset 2px 0 0 ${colors.accent}` : "inset 2px 0 0 transparent",
}}
transition={{ duration: 0.16, ease: "ease" }}
```

If combining with `whileTap` / `PRESS_TRANSITION`, use per-property transition map so press transform stays 120ms ease-out and selection opacity/shadow stay 160ms `ease`.

Do **not** animate `width`/`padding`. Do **not** reintroduce hover `translateX` (022).

## Repo conventions to follow

- AUDIT: hover/color → `ease`; duration tooltips/small UI 125–200ms → **160ms**.
- Press remains `scale(0.98)` @ 120ms.

## Steps

1. Add selection opacity/boxShadow transition as above on `RadioTile`.
2. Resolve conflict with `transition={PRESS_TRANSITION}` via per-property map if needed.
3. Push, typecheck, verify.

## Boundaries

- Do NOT change selection visual design (still 2px inset accent).
- Do NOT stagger list selection.
- Depends on: 022 (no hover slide), 024 (press timing) — apply after or merge carefully.

## Verification

- **Feel check**: click between options — accent bar and opacity ease over ~160ms; press scale still snappy.
- **Done when**: selection no longer hard-cuts opacity/shadow.
