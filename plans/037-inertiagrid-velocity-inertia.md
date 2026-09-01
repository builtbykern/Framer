# 037 — Real velocity inertia (keep proximity core)

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH (product claim) / opportunity
- **Category**: Physicality / Missed opportunity
- **Estimated scope**: 1 file, ~40–60 lines
- **Depends**: 032
- **Project**: Framer `PBghPP85VH1cuE7BNtzx`, `Kern_InertiaGrid`

## Problem

The component documents velocity-based inertia, but the implementation is pure distance→force. Listing and JSDoc over-claim; premium paid tier needs the motion to match the story **without** replacing the proximity model that defines the product.

```ts
/* state/InertiaGrid.tsx.snapshot:231-236 — current claim */
/**
 * Interactive grid of media items with physics-based hover animations.
 * Each item responds to mouse velocity with inertia effects including
 * translation, rotation, and scaling using spring physics.
 */
```

```ts
/* state/InertiaGrid.tsx.snapshot:600-624 — current (distance only) */
const dx = mouseXVal - centerX
const dy = mouseYVal - centerY
const distance = Math.sqrt(dx * dx + dy * dy)
// … force from distance → targetX/targetY/targetRotate …
```

## Target

**Additive** velocity impulse on top of existing proximity force (essence preserved):

```ts
// In the single physics loop (parent), track:
let prevX = mouseX.get()
let prevY = mouseY.get()
let prevT = performance.now()

// each tick when mouse !== -9999:
const now = performance.now()
const dt = Math.max((now - prevT) / 1000, 1 / 120) // seconds
const vx = (mouseX.get() - prevX) / dt // px/s
const vy = (mouseY.get() - prevY) / dt
prevX = mouseX.get()
prevY = mouseY.get()
prevT = now

// after computing proximity targetX/targetY from distance force:
let inertiaX = -(vx / 2400) * presetConfig.maxDisp * 0.35
let inertiaY = -(vy / 2400) * presetConfig.maxDisp * 0.35
const cap = presetConfig.maxDisp * 0.5
inertiaX = Math.max(-cap, Math.min(cap, inertiaX))
inertiaY = Math.max(-cap, Math.min(cap, inertiaY))

x.set(targetX + inertiaX)
y.set(targetY + inertiaY)
```

`Amount` and preset intensity already live in `presetConfig.maxDisp` — do not add a separate velocity control.

Springs unchanged (`PRESET_BASE` stiffness/mass). Drift stays low-energy because `maxDisp` and stiffness stay low.

Update JSDoc only if behavior matches (one sentence still accurate). Listing copy may say velocity once this is DONE — do not edit listing in this plan.

## Repo conventions to follow

- Physics tick from 032 only — no second rAF.
- Reduced motion / canvas: velocity path off when physics off (035 / canvas guard).

## Steps

1. Add prev mouse + time refs in the shared loop.
2. Compute `vx`/`vy`; add capped inertia to proximity targets before `x.set` / `y.set`.
3. Do not add inertia to `rotate` beyond existing proximity rotate (keeps Glitch personality from 036).
4. Reset velocity on mouse leave / sentinel.
5. Push + verify; feel-check all three presets.

## Boundaries

- Do NOT remove distance→force core.
- Do NOT equalize Drift/Repel/Glitch spring configs.
- Do NOT add a new “velocity” property control (Amount already scales intensity).
- Do NOT edit Marketplace listing files in this plan.

## Verification

- **Mechanical**: verify.mjs OK.
- **Feel check**: Slow hover ≈ old proximity feel; fast swipe across tiles adds a short overshoot that springs settle (inertia). Drift still subtler than Repel. Reduced motion: no motion.
- **Done when**: fast cursor produces visible inertia; slow cursor still proximity-led; presets distinct.
