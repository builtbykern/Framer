# 002 — Bring fade-in/out under UI duration budget

- **Status**: DONE
- **Commit**: none (repo has no commits; stamp against local `.tmp/BuiltByKern_ScrollBlur.tsx` + Framer code file `yC_uQFE`)
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file, ~20 lines (+ optional instance Motion reset on canvas)

## Problem

Defaults exceed the AUDIT UI budget (**under 300ms**). Fade-in `0.42s` and fade-out `0.72s` make scroll-chrome feel laggy; stage 2 dissolve reuses the full `0.72s` fade-out again after a 200ms floor hold → long total dissolve.

```tsx
/* .tmp/BuiltByKern_ScrollBlur.tsx:61-73 — current */
const DEFAULT_FADE_IN: Transition = {
    type: "tween",
    duration: 0.42,
    ease: [0.22, 1, 0.36, 1],
}

const DEFAULT_FADE_OUT: Transition = {
    type: "tween",
    duration: 0.72,
    ease: [0.33, 0, 0.2, 1],
}
```

```tsx
/* .tmp/BuiltByKern_ScrollBlur.tsx:398-414 — stage 2 reuses full FADE_OUT */
easeTo(
    IDLE_STRENGTH_FLOOR,
    resolveTransition(DEFAULT_FADE_OUT, fadeOutRef.current)
)
// …
easeTo(
    0,
    resolveTransition(DEFAULT_FADE_OUT, fadeOutRef.current)
)
```

## Target

Use AUDIT strong ease-out for **enter** and a slightly softer but still ease-out for **exit**. Asymmetric: enter snaps; exit dissolves but stays under budget.

| Constant | Duration | Ease (cubic-bezier) |
| --- | --- | --- |
| `DEFAULT_FADE_IN` | **`0.25`** | **`[0.23, 1, 0.32, 1]`** (= AUDIT `--ease-out`) |
| `DEFAULT_FADE_OUT` | **`0.35`** | **`[0.23, 1, 0.32, 1]`** |
| Stage 2 dissolve (`floor → 0`) | **`0.2`** | **`[0.23, 1, 0.32, 1]`** |

```tsx
/* target */
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

const DEFAULT_FADE_IN: Transition = {
    type: "tween",
    duration: 0.25,
    ease: EASE_OUT,
}

const DEFAULT_FADE_OUT: Transition = {
    type: "tween",
    duration: 0.35,
    ease: EASE_OUT,
}

const DEFAULT_FADE_OUT_FINAL: Transition = {
    type: "tween",
    duration: 0.2,
    ease: EASE_OUT,
}
```

Stage 2 must use `DEFAULT_FADE_OUT_FINAL` (or inline `{ type: "tween", duration: 0.2, ease: EASE_OUT }`), **not** the designer `fadeOut` control — keep stage-1 floor on `fadeOut` / `DEFAULT_FADE_OUT` so the Motion panel still owns the primary dissolve.

Also update comments above the constants to match the new intent.

Property controls already use `defaultValue: DEFAULT_FADE_IN/OUT` — they pick up new defaults automatically. If the demo instance still has stale Motion overrides, reset instance Motion to defaults or clear overrides after push (same pattern as plan 015).

## Repo conventions to follow

- Keep `type: "tween"` defaults — bounce/spring sanitize in `resolveTransition` stays (do not reintroduce springs).
- Do not invent a second easing file; constants live at top of the single component file (Framer Marketplace constraint).
- Aligns with plan 004 (same ease array); if 004 is executed first, reuse its `EASE_OUT` constant rather than duplicating.

## Steps

1. Add `EASE_OUT` constant `[0.23, 1, 0.32, 1]`.
2. Set `DEFAULT_FADE_IN` duration `0.25`, ease `EASE_OUT`.
3. Set `DEFAULT_FADE_OUT` duration `0.35`, ease `EASE_OUT`.
4. Add `DEFAULT_FADE_OUT_FINAL` duration `0.2`, ease `EASE_OUT`.
5. In the floor-hold timeout, change stage-2 `easeTo(0, …)` to use `DEFAULT_FADE_OUT_FINAL` (not `fadeOutRef.current`).
6. Push, typecheck, verify. Feel-check Preview. If instance Motion still shows old durations, clear/reset Motion on instance `lpuQSsTX0`.

## Boundaries

- Do NOT change settleMs defaults, idle floor, or `FLOOR_HOLD_MS`.
- Do NOT change fade-in restart logic (plan 001) except if merge order requires both — prefer 001 first.
- Do NOT raise durations back above 0.35 for defaults.
- Do NOT add npm packages.

## Verification

- **Mechanical**: typecheck + `verify.mjs` clean.
- **Feel check**:
  - Scroll start: veil reaches full strength in ~250ms, feels immediate (ease-out, not ease-in).
  - After settle: soft drop to floor in ~350ms, then quick dissolve (~200ms) — not a 1.5s+ linger.
  - Animations panel 10%: measure fade-in ≈ 250ms, stage-1 ≈ 350ms, stage-2 ≈ 200ms.
  - Reduced motion unchanged.
- **Done when**: code defaults match the table above; stage-2 does not use `DEFAULT_FADE_OUT` / `fadeOutRef`.
