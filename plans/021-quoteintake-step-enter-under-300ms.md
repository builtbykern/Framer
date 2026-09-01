# 021 — Cap step enter duration under 300ms

- **Status**: DONE
- **Commit**: n/a (no git HEAD; SoT `state/QuoteIntake.tsx` Version: 3.9.1)
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file, ~5 lines

## Problem

Form step body enter uses `ENTER_TRANSITION` at **340ms**, over the AUDIT UI budget (UI animations stay under 300ms). This is form UI, not a marketing page.

```tsx
/* state/QuoteIntake.tsx:55-61 — current */
const EASE_OUT = [0.23, 1, 0.32, 1] as const
const PRESS_TAP = { transform: "scale(0.98)" }
const PRESS_TRANSITION = { duration: 0.12, ease: EASE_OUT }
const ENTER_TRANSITION = { duration: 0.34, ease: EASE_OUT }
const EXIT_TRANSITION = { duration: 0.18, ease: EASE_OUT }
const LINE_ENTER = { duration: 0.22, ease: EASE_OUT }
const HOVER_TRANSITION = { duration: 0.22, ease: EASE_OUT }
```

```tsx
/* state/QuoteIntake.tsx:529-533 — usage */
initial: { opacity: 0, transform: "translateY(14px)" },
animate: { opacity: 1, transform: "translateY(0px)", transition: ENTER_TRANSITION },
exit: { opacity: 0, transform: "translateY(-8px)", transition: EXIT_TRANSITION },
```

## Target

```tsx
const ENTER_TRANSITION = { duration: 0.24, ease: EASE_OUT }
```

- Keep easing: `[0.23, 1, 0.32, 1]` (AUDIT strong ease-out).
- Duration: **0.24s** (240ms) — inside 200–250ms dropdown/UI band, under 300ms.
- `EXIT_TRANSITION` stays `0.18` unless plan 023 changes Presence mode (do not lengthen exit here).
- `successAnim` also uses `ENTER_TRANSITION` — same 240ms is correct for rare success enter.

## Repo conventions to follow

- All motion constants are module-level in `state/QuoteIntake.tsx` L55–61.
- Full `transform` strings already used — keep that (do not switch to `y` shorthand).

## Steps

1. Change `ENTER_TRANSITION.duration` from `0.34` to `0.24` in `state/QuoteIntake.tsx`.
2. If plan 019 already removed monumental uses of `ENTER_TRANSITION`, still update the constant for `stepAnim` / `successAnim`.
3. Push, typecheck, verify.

## Boundaries

- Do NOT change `PRESS_TRANSITION`, `LINE_ENTER`, or spring stiffness.
- Do NOT change translate distances (`14px` / `-8px`) in this plan.
- Do NOT change `AnimatePresence` mode (plan 023).
- Do NOT add dependencies.

## Verification

- **Mechanical**: typecheck 0; verify.mjs OK.
- **Feel check**:
  - Click Next between steps — enter should feel snappier; @ 10% playback, enter track ≈ 240ms not 340ms.
  - Success screen enter also ~240ms.
  - Reduced motion: still `motionOk` false → no movement (unchanged).
- **Done when**: `ENTER_TRANSITION.duration === 0.24` and step/success enters use it.
