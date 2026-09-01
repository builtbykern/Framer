# 055 — Pill Select neck keyframes + late goo

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Physicality / Easing
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: re-audit #1 #3 #4 (detach too early vs EASE_DRAWER)

## Problem

Single `animate(y → yOpen)` with goo kill at `t≥0.72` (y-progress) detached early under drawer ease, leaving a dry slide.

## Target

```ts
const OPEN_S = 0.46
const NECK_RATIO = 0.4
// Stretch to NECK_Y @ OPEN_S*0.4 EASE_DRAWER
// Kill goo immediately at neck; blur peak→0 over first 40% of settle
// Settle to yOpen @ OPEN_S*0.6 EASE_OUT
```

## Retune (2026-08-01)

User: detach tardaba demasiado con goo kill @ `t≥0.9`. Ahora el goo muere al llegar al cuello.

## Steps

1. Retarget `OPEN_S = 0.55`.
2. Replace single open animate with two chained animates (neck → gap).
3. Shift blur/goo kill to late window as above.

## Verification

- Feel: longer connected stretch; detach near settle; no HOLD freeze.
- Push `om6bp0W` typeErrors `[]`.
