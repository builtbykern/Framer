# 028 — Soft-fade chapter progress active state

- **Status**: DONE
- **Commit**: n/a (no git HEAD; SoT `state/QuoteIntake.tsx` Version: 3.9.1)
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file, ~25 lines

## Problem

Chapter strip labels teleport opacity/color when `step` changes, while the body crossfades — progress feels disconnected from the step swap.

```tsx
/* state/QuoteIntake.tsx:556-564 — current */
{narrative.showStepList ? stepLabels.map((lbl, i) => {
    const n = i + 1; const on = n === step
    …
    const op = on ? 1 : n < step ? 0.5 : 0.28
    return (
        <div key={lbl} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
            <span style={{ … color: on ? colors.accent : colors.textSecondary, opacity: op }}>…
            <span style={{ … color: on ? colors.textPrimary : colors.textSecondary, opacity: on ? 1 : 0.4 }}>…
```

## Target

Wrap each chapter row in `motion.div` (or animate spans) when `motionOk`:

```tsx
animate={{ opacity: op }}
transition={{ duration: 0.15, ease: EASE_OUT }}
```

Color can snap or use 150ms `ease` — prefer animating **opacity only** (compositor-friendly). Keep colors as style props that update with `on`.

Duration **150ms** (125–200ms band). Do not stagger chapters (would fight step Presence).

When `!motionOk`: keep current static spans.

## Repo conventions to follow

- Progress lives in `renderProgress` L551–568; both inline (wide) and stacked (narrow) call it — fix once inside that function.
- Align timing loosely with step exit after 023 (~140ms).

## Steps

1. In `renderProgress`, animate opacity of number/label (or parent row) on `step` change when `motionOk`.
2. Ensure both wide header and narrow placements benefit (same function).
3. Push, typecheck, verify.

## Boundaries

- Do NOT make chapter labels clickable / change IA.
- Do NOT animate layout position of the strip.
- Best after 023 so progress and body settle together.

## Verification

- **Feel check**: Next step — active chapter opacity eases ~150ms in sync with body; no layout jump.
- Reduced motion: instant opacity.
- **Done when**: chapter active state no longer hard-cuts when `motionOk`.
