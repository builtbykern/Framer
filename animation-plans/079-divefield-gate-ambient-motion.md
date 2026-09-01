# 079 — Dive Field: gate ambient timeRot / act on speed

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (`draw` layer loop)
- **Audit finding**: improve-animations Dive Field 2026-08-04-restore #8
- **Note**: evening 154 was REVERTED; re-specify against current restore — no Snap, no park fog

## Problem

While frames run (especially with specimen `autoScroll: 0.018`), every layer applies:

1. Micro-rotation `Math.sin(time * 0.3 + t * 2.1) * 0.015` on `uRot`.
2. Dissolve activity pulse `0.75 + 0.25 * Math.sin(time * 13 + t * 5)` inside `act`.

These are **not gesture-tied**. AUDIT.md §1: decorative motion on a continuously visible surface needs a purpose — shimmer while diving is product; shimmer while merely looping frames is noise.

Evidence (`code-components/DiveField.tsx` ~907–911, ~932–935):

```tsx
const act =
    diss *
    (1 - diss) *
    4 *
    (0.75 + 0.25 * Math.sin(time * 13 + t * 5))
// …
gl.uniform1f(
    gl.getUniformLocation(eng.textProg, "uRot"),
    layer.rot * cam.tilt * (Math.PI / 180) +
        Math.sin(time * 0.3 + t * 2.1) * 0.015
)
```

## Target

Exact speed gate:

```ts
const AMBIENT_SPEED = 0.08 // |vel| below this → no timeRot / no act sin pulse
```

```tsx
const ambientOn = !reduce && speed >= AMBIENT_SPEED
const timeRot = ambientOn ? Math.sin(time * 0.3 + t * 2.1) * 0.015 : 0
const actPulse = ambientOn
    ? 0.75 + 0.25 * Math.sin(time * 13 + t * 5)
    : 0.75
const act = diss * (1 - diss) * 4 * actPulse
// uRot = layer.rot * cam.tilt * (Math.PI / 180) + timeRot
```

Under `reduce`, plan **072** already forces `act` without sin and `timeRot = 0` — keep that; `ambientOn` false when reduce is enough if 072 lands first. If executing 079 alone, still zero decorative time terms when `reduce`.

Do **not** gate `uWobble` here (buyer Look control; RM handles it in 072).

## Repo conventions to follow

- `speed = Math.min(Math.abs(vel), 3)` already computed in `draw` (~825).
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. Add `AMBIENT_SPEED = 0.08` constant.
2. Compute `ambientOn`; wire `timeRot` / `actPulse` as above.
3. Push + verify.

## Boundaries

- Do NOT change autoScroll default.
- Do NOT add park fog / Snap.
- Do NOT zero wobble/RGB here (072 owns RM).
- If ambient already gated on speed, STOP and report.

## Verification

- **Mechanical**: push + verify green.
- **Feel check**: at rest with autoScroll 0 (temporarily) — no micro-tilt pulse. Wheel/dive — shimmer returns. With default autoScroll, slow crawl may stay under gate (acceptable) or barely tickle — if feel too dead while auto-diving, report; do not raise threshold above `0.12` without asking.
- **Done when**: `|vel| < 0.08` ⇒ no timeRot and static actPulse `0.75`.
