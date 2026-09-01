# 043 — Copy Field action press scale

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (`code-components/CopyField.tsx`)
- **Depends on**: action squircle from 040

## Problem

Missing press on the action squircle makes copy feel dead vs Filling Point / Quote Intake peers.

## Target

While pointer is down on the action button:

- `transform: scale(0.97)`
- Down: **160ms** `cubic-bezier(0.23, 1, 0.32, 1)`
- Up: **100ms** same curve
- Animate transform only

```ts
const EASE_OUT = [0.23, 1, 0.32, 1] as const
// pressed ? scale(0.97) : scale(1)
// transition: { duration: pressed ? 0.16 : 0.1, ease: EASE_OUT }
```

Pointer handlers: `onPointerDown` → pressed true; `onPointerUp` / `onPointerCancel` / `onPointerLeave` → false.

Keep press under reduced-motion (AUDIT: short feedback OK) — do not strip.

## Repo conventions to follow

- Exemplar: `animation-plans/009-fillingpoint-press-scale.md` (DONE)
- AUDIT.md press: `scale(0.97)`, 160ms ease-out

## Steps

1. Add `pressed` state on the action button only (not whole pill).
2. Animate button with Motion `transform: scale(...)` string or scale if already used carefully on same node — if morph also scales icons inside, apply press scale on the **button frame**, icons stay relative.
3. Ensure press compose correctly with success fill (press still works on success before reset).

## Boundaries

- Do NOT press-scale the entire pill.
- Do NOT go below 0.95.
- Do NOT add magnetic hover.

## Verification

- **Feel check**: click compresses squircle slightly, snaps back.
- Touch + mouse both clear pressed on leave/cancel.
- **Done when**: matches Filling Point press feel (±).
