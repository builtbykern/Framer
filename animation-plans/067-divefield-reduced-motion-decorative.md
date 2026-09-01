# 067 — Dive Field: reduced-motion mute decorative time motion

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (`draw` + optional `needsFrame`)
- **Audit finding**: improve-animations Dive Field 2026-08-03 #3 (+ missed #1 / #3)

## Problem

With `respectReducedMotion` and `prefers-reduced-motion: reduce`, Dive Field already zeros **sway**, **autoScroll**, and **FOV warp**. It still runs decorative time-based motion:

1. Fragment UV wobble via `uWobble` + `uTime` (`TEXT_FRAG` ~243–245).
2. Layer micro-rotation `Math.sin(time * 0.3 + t * 2.1) * 0.015` (~998–999).
3. Dissolve activity pulse `Math.sin(time * 13 + t * 5)` inside `act` (~971–975).
4. Base `rgbShift` still applied at rest (~1023–1024).
5. Pointer `camX`/`camY` still lerp even when sway is 0, which can keep `needsFrame` warm (~890–891, ~755–756).

Reduced motion should keep **comprehension** (damped wheel/drag/key camera) and drop **decorative movement**.

## Target

When `const reduce = reduced && mot.respectReducedMotion` is true inside `draw`:

| Signal | Target under `reduce` |
| --- | --- |
| `uWobble` upload | `0` (ignore `lk.wobble`) |
| Layer time rot offset | `0` — use only `layer.rot * cam.tilt * (Math.PI / 180)` |
| `act` pulse | Use static envelope **without** `Math.sin`: `act = diss * (1 - diss) * 4 * 0.75` (same floor as today’s `(0.75 + 0.25*sin…)` mid) **or** simply `act = diss * (1 - diss) * 3` — pick **one** and keep it; recommend: `diss * (1 - diss) * 3` |
| `uRgbShift` | `0` under reduce (velocity fringe also off: upload `uRgbShiftVel` as `0` too) |
| Pointer cam | Skip `camX`/`camY` lerp; set `camX = 0`, `camY = 0`, `pointerX = 0`, `pointerY = 0` once when entering reduce **or** each frame under reduce: `camX = 0; camY = 0` and do not approach pointer |

Keep under reduce (unchanged): damped `target→current`, snap settle (`settleMs` already `0`), wheel/drag/key `target` updates, fog/dissolve spatial terms from `rel`.

`needsFrame`: under reduce, do **not** keep the loop alive solely for `pointerX - camX` / `pointerY - camY` (those deltas should be ~0 after cam zeroing). Leave other `needsFrame` clauses intact.

## Repo conventions to follow

- Existing reduce branches at sway / auto / warp (~866–874, ~894, ~912) — extend the same `reduce` boolean; do not invent a second flag.
- Property control `respectReducedMotion` remains the buyer override.
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. In `draw`, after `const reduce = …`:
   - If `reduce`: `camX = 0; camY = 0` (and skip the lerp block).
   - Else: keep `camX += (pointerX - camX) * Math.min(1, dt * 3)` (current).
2. Compute `const wobbleAmt = reduce ? 0 : lk.wobble` and upload that.
3. Compute rot without time sin when reduce:
   ```ts
   const tiltRot = layer.rot * cam.tilt * (Math.PI / 180)
   const timeRot = reduce ? 0 : Math.sin(time * 0.3 + t * 2.1) * 0.015
   // upload tiltRot + timeRot
   ```
4. Compute `act`:
   ```ts
   const act = reduce
       ? diss * (1 - diss) * 3
       : diss * (1 - diss) * 4 * (0.75 + 0.25 * Math.sin(time * 13 + t * 5))
   ```
5. Upload `uRgbShift` / `uRgbShiftVel` as `0` when reduce; else `lk.rgbShift` / `lk.rgbShiftVel`.
6. Push + verify.

## Boundaries

- Do NOT disable damped camera settle under RM.
- Do NOT change default `wobble` / `rgbShift` property defaults for non-RM users.
- Do NOT remove the `respectReducedMotion` control.
- Do NOT touch idle-rAF structure except as needed so RM pointer cam no longer holds the loop.
- No new dependencies.

## Verification

- **Mechanical**: push → `typeErrors: []`; `verify.mjs` → `ok: true`.
- **Feel check**:
  1. DevTools → Rendering → **Emulate CSS media feature `prefers-reduced-motion: reduce`**.
  2. Idle in view with autoScroll default: field must **not** creep; no UV shimmer; no pulsing rim; layers hold still until user scrolls.
  3. Wheel still eases `current` toward `target` (comprehension motion OK).
  4. Toggle reduce off — wobble / auto / chromatic fringe return.
- **Done when**: under RM, time-based wobble/rot/act pulse and base RGB shift are visually gone; scroll damping still works.
