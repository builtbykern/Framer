# 052 — Pill Select open continuum (no hold / no React goo cut)

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Easing & duration / Interruptibility / Cohesion
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: findings #1–#4 (snappy + freezeado)

## Problem

Phased open used `EASE_MORPH` `[0.77, 0, 0.175, 1]` (strong ease-in start = freeze), `HOLD_MS = 40` (dead pause at neck), and `setGooActive(false)` via React → `useEffect` lag on `gooUrl` (filter snap).

## Target

```ts
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1]
const EASE_DRAWER: [number, number, number, number] = [0.32, 0.72, 0, 1]
const OPEN_S = 0.62
const CLOSE_S = 0.4
const NECK_Y = 2 // waypoint only — no pause

// Open: single animate(y, yOpen, { duration: OPEN_S, ease: EASE_DRAWER, onUpdate })
// Close: animate(y, yClosed, { duration: CLOSE_S, ease: EASE_IN_OUT, onUpdate })
// gooUrl.set / softBlur.set inside onUpdate — no useState(gooActive)
```

## Repo conventions

- AUDIT.md `--ease-out` / `--ease-in-out` / `--ease-drawer`
- Interruptible `seqRef` pattern (BurgerFlip / prior Pill Select)
- Push: `node scripts/framer/push-pillselect.mjs` → `om6bp0W` session 4

## Steps

1. Replace phased constants / easings with continuum tokens above.
2. Remove `HOLD_MS`, serial Phase A/B/C awaits, `gooActive` state.
3. Drive `gooUrl` + `softBlur` in `onUpdate`; kill goo at `t >= 0.72`.
4. Close with `EASE_IN_OUT` + brief ≤1px blur into merge.

## Boundaries

- Do NOT add `scaleY`, GSAP, or Framer internal agent.
- Do NOT publish without user OK.
- Keep silhouette/content split and y-only blobs.

## Verification

- **Mechanical**: push-pillselect typeErrors `[]`.
- **Feel check**: open starts immediately (no freeze); no pause at neck; no filter pop at detach; spam-toggle stays interruptible.
- **Done when**: open is one continuum ~0.62s; close ~0.4s merge.
