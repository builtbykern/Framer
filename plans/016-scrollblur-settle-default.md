# 016 — Snappier Settle default + clearer copy

- **Status**: DONE
- **Commit**: unavailable (no HEAD); stamp date 2026-07-19
- **Severity**: MEDIUM (finding 2) + LOW (finding 4, folded)
- **Category**: Purpose & frequency / Cohesion
- **Estimated scope**: 1 file, ~8 lines

## Problem

Scroll Blur Follow Scroll is high-frequency chrome. Default idle Settle is **420ms**, which keeps the blur visible longer than needed after the last scroll and reads like a slow UI tween rather than an idle delay.

```tsx
/* .tmp/BuiltByKern_ScrollBlur.tsx:139 — current */
settleMs = 420,

/* .tmp/BuiltByKern_ScrollBlur.tsx:327-336 — current */
settleMs: {
    type: ControlType.Number,
    title: "Settle",
    defaultValue: 420,
    min: 200,
    max: 700,
    step: 10,
    unit: "ms",
    hidden: (p) => p.mode !== "Follow Scroll",
    description: "Idle time after scroll before the blur hides.",
},
```

AUDIT.md: high-frequency surfaces should stay short; UI motion budgets stay under 300ms. Settle is an idle timeout (not a fade duration), but the **default** should still land in the snappy chrome range.

## Target

Exact values:

- Destructure default: `settleMs = 280`
- Property control `defaultValue: 280`
- Keep clamp `Math.max(200, Math.min(700, …))` unchanged
- Description: `"Idle delay after the last scroll before hide (not a fade)."`

```tsx
/* target */
settleMs = 280,

settleMs: {
    type: ControlType.Number,
    title: "Settle",
    defaultValue: 280,
    min: 200,
    max: 700,
    step: 10,
    unit: "ms",
    hidden: (p) => p.mode !== "Follow Scroll",
    description:
        "Idle delay after the last scroll before hide (not a fade).",
},
```

## Repo conventions to follow

- Defaults live on the property control `defaultValue` and matching destructure default (no `defaultProps`).
- Do not animate hide with opacity — visibility snap remains settled.

## Steps

1. In `.tmp/BuiltByKern_ScrollBlur.tsx`, change destructure default `settleMs = 280`.
2. Change `addPropertyControls` `settleMs.defaultValue` to `280`.
3. Update `settleMs.description` to the exact string above.
4. Push to `yC_uQFE`, typecheck, `node scripts/framer/verify.mjs`.

## Boundaries

- Do NOT change min/max/step of Settle.
- Do NOT add Transition / fade controls.
- Do NOT change Mode options or vertical segmented layout.

## Verification

- **Mechanical**: typecheck + verify ok.
- **Feel check** (Preview, Mode = Follow Scroll):
  - Scroll then stop: blur hides ~280ms after last delta (feels snappier than 420).
  - Drag Settle to 700: still waits longer before hide.
  - Confirm no opacity fade — hide is still an instant visibility snap.
- **Done when**: default in panel is 280 and description mentions idle delay / not a fade.
