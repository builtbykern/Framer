# 084 — Area Scrub: beacon enter via transform string (not scale shorthand)

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/AreaScrub.tsx`), ~25 lines

## Problem

Beacon visibility animates Motion `scale` shorthand. AUDIT: Framer Motion `scale` / `x` / `y` shorthands run on the main thread and drop frames under load. Scrub chrome is high-frequency while hovering.

```tsx
/* code-components/AreaScrub.tsx ~665–675 — current */
<motion.div
  animate={{
    opacity: chromeVisible ? (scrubbing || canvasPeek ? 1 : 0.5) : 0,
    scale: chromeVisible ? 1 : 0.96,
  }}
  transition={chromeTransition}
  style={{ width: beaconSize, height: beaconSize, ... }}
/>
```

Outer node already owns scrub position via `transform: beaconTransform` (px translate3d). Animating `scale` on the **inner** node is correct nesting — but must not use the `scale` shorthand.

## Target

Inner beacon uses opacity + **transform string** only:

```tsx
/* target */
<motion.div
  initial={false}
  animate={{
    opacity: chromeVisible ? (scrubbing || canvasPeek ? 1 : 0) : 0,
    transform: chromeVisible ? "scale(1)" : "scale(0.96)",
  }}
  transition={{
    opacity: { duration: scrubbing ? 0.14 : 0.2, ease: [0.23, 1, 0.32, 1] },
    transform: { duration: 0.18, ease: [0.23, 1, 0.32, 1] },
  }}
  style={{
    width: beaconSize,
    height: beaconSize,
    borderRadius: "50%",
    background: beaconFill,
    border: `1.5px solid ${beaconStroke || stroke}`,
    boxSizing: "border-box",
    transformOrigin: "center center",
  }}
/>
```

(Leave opacity linger values to plan **086** if executed together — use full hide on leave once 086 lands.)

Keep outer wrapper:

```tsx
style={{ position: "absolute", left: 0, top: 0, transform: beaconTransform }}
```

## Repo conventions to follow

- Never animate `scale` shorthand on the same node as scrub `translate3d` MotionValue (already nested)
- Ease: `[0.23, 1, 0.32, 1]`
- Push via `push-areascrub.mjs`

## Steps

1. Replace inner beacon `animate.scale` with `animate.transform` scale strings as above.
2. Remove `scale` key from shared `chromeTransition` if it becomes unused (crosshair/label only need opacity).
3. Push; typecheck clean.

## Boundaries

- Do NOT move scrub position onto the inner node
- Do NOT use `scale` Motion shorthand anywhere in chrome
- Do NOT change spring config (plan **083**)

## Verification

- **Mechanical**: push `typeErrors: []`; `node scripts/framer/verify.mjs`
- **Feel check**:
  - Beacon fades/scales in on enter without fighting X tracking
  - Fast scrub: beacon stays on curve (outer transform intact)
  - DevTools Animations 10%: transform + opacity only on inner beacon
- **Done when**: No `scale` shorthand on beacon; scrub tracking unchanged
