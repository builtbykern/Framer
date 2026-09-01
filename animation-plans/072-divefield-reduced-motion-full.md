# 072 — Dive Field: full reduced-motion (decorative + Z snap)

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (`draw` + `needsFrame`)
- **Audit finding**: improve-animations Dive Field 2026-08-04-restore #1
- **Supersedes craft of**: 067 (decorative) + evening 152 (Z travel) — both missing after restore

## Problem

With `respectReducedMotion` and `prefers-reduced-motion: reduce`, Dive Field only zeros **autoScroll**, **sway**, and **FOV warp**. It still:

1. Damps `current → target` (animated Z travel on every wheel/key).
2. Uploads live `uWobble`, base `uRgbShift` / `uRgbShiftVel`.
3. Adds time micro-rotation `Math.sin(time * 0.3 + t * 2.1) * 0.015`.
4. Pulses dissolve `act` with `Math.sin(time * 13 + t * 5)`.
5. Lerps `camX`/`camY` toward pointer (can keep `needsFrame` warm even when sway is 0).

AUDIT.md §6: reduced motion drops **movement**; keep comprehension (instant camera follow is OK).

Evidence (`code-components/DiveField.tsx`):

```tsx
// ~807–828 — current
const reduce = reduced && mot.respectReducedMotion
if (!reduce && !dragging && inView) {
    target += mot.autoScroll * dt
    // …
}
const damp = 1 - Math.pow(1 - Math.min(0.99, mot.damping), dt * 60)
current += (target - current) * damp
// …
camX += (pointerX - camX) * Math.min(1, dt * 3)
camY += (pointerY - camY) * Math.min(1, dt * 3)
const fov = cam.fov + (reduce ? 0 : speed * cam.warp)
// sway = reduce ? 0 : cam.sway  (~849)
```

```tsx
// ~907–911, ~934–935, ~958–972 — decorative still live under reduce
const act =
    diss * (1 - diss) * 4 *
    (0.75 + 0.25 * Math.sin(time * 13 + t * 5))
// uRot += Math.sin(time * 0.3 + t * 2.1) * 0.015
// uRgbShift / uWobble from lk.*
```

## Target

When `reduce` is true inside `draw`:

| Signal | Under `reduce` |
| --- | --- |
| Z travel | After input updates: `current = target`; `vel = 0` (skip damp lerp) |
| `uWobble` | `0` |
| `uRgbShift` / `uRgbShiftVel` | `0` / `0` |
| time rot offset | `0` — only `layer.rot * cam.tilt * (Math.PI / 180)` |
| `act` | `diss * (1 - diss) * 3` (no `Math.sin`) |
| Pointer cam | `camX = 0`; `camY = 0` each frame (do not lerp toward pointer) |
| auto / sway / warp | Keep existing zeros |

Keep under reduce: wheel/drag/key `target` updates, fog/dissolve spatial terms from `rel`, textures.

`needsFrame`: under reduce, do **not** keep the loop alive solely for `pointerX - camX` / `pointerY - camY`.

## Repo conventions to follow

- Existing `reduce` boolean at ~807 — extend it; do not invent a second flag.
- Exemplar: sway/auto/warp already branch on `reduce`.
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. In `draw`, after computing `reduce`, if `reduce`: set `camX = 0`, `camY = 0` and skip the pointer lerp block.
2. If `reduce`: after any autoScroll skip, set `current = target`, `vel = 0` instead of damp/`instantVel` update. Else keep existing damp path.
3. Gate decorative uploads: `wobbleAmt` / `rgbShiftAmt` / `rgbShiftVelAmt` = `0` when reduce; `act` without sin; `uRot` without time offset.
4. In `needsFrame`, when `reduce`, skip pointer-cam idle checks (or they will be ~0 after step 1).
5. Push + `node scripts/framer/verify.mjs`.

## Boundaries

- Do NOT reintroduce Snap / park fog.
- Do NOT change buyer defaults (`autoScroll`, damping, Look numbers).
- Do NOT add dependencies.
- If `reduce` already snaps Z and zeros decorative uniforms, STOP and report.

## Verification

- **Mechanical**: `node scripts/framer/push-divefield.mjs` → `typeErrors: []`; `node scripts/framer/verify.mjs` ready.
- **Feel check**: DevTools Rendering → emulate `prefers-reduced-motion: reduce`:
  - Wheel/key jumps **instantly** to next plane (no float damp).
  - No UV shimmer, chromatic fringe, or micro-tilt pulse.
  - Pointer move does not sway the field.
  - With Respect off, full motion returns.
- **Done when**: under RM, Z is discrete and decorative uniforms are zero; without RM, feel unchanged.
