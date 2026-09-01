# 081 — Area Scrub: scrub chrome on transform, not left/top

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/AreaScrub.tsx`), ~40 lines

## Problem

Scrub crosshair, beacon, and label drive CSS `left` / `top` from Framer Motion values every spring frame. That forces layout + paint on a high-frequency gesture (pointer move). Emil/AUDIT rule: animate **transform** and **opacity** only — never layout props.

```tsx
/* code-components/AreaScrub.tsx — current (approx lines 507–538) */
const leftPctMv = useTransform(xScrub, (t) => { /* returns `${pct}%` */ })
const topPctMv = useTransform(xScrub, (t) => { /* returns `${pct}%` */ })

<motion.div style={{ left: leftPctMv, transform: "translateX(-50%)", ... }} />
<motion.div style={{ left: leftPctMv, top: topPctMv, transform: "translate(-50%, -50%)", ... }} />
```

## Target

Keep `xScrub` (0–1) as the source of truth. Map to **percentage translates** only:

```tsx
/* target */
const xPct = useTransform(xScrub, (t) => {
  const x = PAD_X + Math.min(1, Math.max(0, t)) * (VB_W - PAD_X * 2)
  return (x / VB_W) * 100
})
const yPct = useTransform(xScrub, (t) => {
  const x = PAD_X + Math.min(1, Math.max(0, t)) * (VB_W - PAD_X * 2)
  return (yOnCubic(pts, x) / VB_H) * 100
})

/* Crosshair: full height, track X only */
style={{
  position: "absolute",
  top: "4%",
  bottom: "4%",
  left: 0,
  x: xPct, // Motion % of parent width — or useTransform to `translate3d(${x}%,0,0)`
  width: 0,
  borderLeft: `1px dashed ${crosshairColor}`,
  translateX: "-50%", // keep centering; combine into one transform string if needed
}}

/* Beacon */
style={{
  position: "absolute",
  left: 0,
  top: 0,
  x: xPct,
  y: yPct,
  width: beaconSize,
  height: beaconSize,
  translateX: "-50%",
  translateY: "-50%",
  ...
}}
```

Exact preferred pattern for Framer Motion in this repo (avoid layout):

```tsx
const crosshairTransform = useTransform(xPct, (x) => `translate3d(${x}%, 0, 0) translateX(-50%)`)
const beaconTransform = useTransform([xPct, yPct], ([x, y]) =>
  `translate3d(${x}%, ${y}%, 0) translate(-50%, -50%)`
)
// style={{ left: 0, top: 0, transform: beaconTransform }}  // crosshair: top/bottom 4%, left 0
```

Do **not** leave `left`/`top` as motion values.

## Repo conventions to follow

- Compositor-only motion (AUDIT.md §5; house motion-craft)
- Exemplar: scrub/gesture UIs that use `transform` strings — prefer full `transform:` over layout
- Area Scrub constants `PAD_X`, `PAD_Y`, `VB_W`, `VB_H`, `yOnCubic` stay as-is
- Spring `SCRUB_SPRING = { stiffness: 320, damping: 32, mass: 0.7 }` unchanged

## Steps

1. In `code-components/AreaScrub.tsx`, replace `leftPctMv` / `topPctMv` string transforms with numeric `xPct` / `yPct` (0–100) via `useTransform`.
2. Add `crosshairTransform` and `beaconTransform` (and label transform) as `useTransform` → `translate3d(...)` strings.
3. Set crosshair/beacon/label `style.left = 0`, beacon/label `style.top = 0`, crosshair keep `top/bottom: 4%`; assign `transform: *Transform` motion value. Remove motion-driven `left`/`top`.
4. Label: same beacon XY + extra `translate(-50%, calc(-100% - 10px))` baked into its transform string (static offset after %).
5. Push: `node scripts/framer/session.mjs` (pin Area Scrub) then `node scripts/framer/push-areascrub.mjs` — expect `typeErrors: []`.
6. `node scripts/framer/verify.mjs` → `ok: true`.

## Boundaries

- Do NOT change scrub spring, draw-on, data math, or property controls.
- Do NOT add glow/shadows.
- Do NOT implement chrome fade (that is plan 082).
- If line numbers drifted, match by `leftPctMv` / `topPctMv` identifiers — STOP if those symbols are gone.

## Verification

- **Mechanical**: push-areascrub typecheck empty; verify ok.
- **Feel check**: Preview Home → hover scrub across chart:
  - Beacon stays on the curve (cubic Y still correct).
  - In Chrome Performance, scrubbing should not flood Layout (Layout count stays flat vs before).
  - Slow Animations 10%: spring still smooth on X.
  - `prefers-reduced-motion`: scrub still tracks (direct `xTarget`), no spring — still transform-based.
- **Done when**: no motion values assigned to CSS `left`/`top` on scrub chrome; hover scrub feels as sticky as before without jank.

## Dependencies

- None. Run **before** 082 if both are executed (082 builds on chrome nodes).
