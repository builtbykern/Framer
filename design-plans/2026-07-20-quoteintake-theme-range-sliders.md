# Theme-styled Step 2 range track/thumb

Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.17.0)

- **Status**: DONE

## Evidence chain

- Surface: Step 2 quantity `input type="range"`
- Problem: Native UA slider ignored Theme field chrome used by stepper mode
- Owner: `colors.border` / `accent` / `textPrimary` / `layout.borderRadius`
- Uncertainty: none

## Design decision

Scoped `.qi-range` CSS with Theme CSS vars; track hairline + accent fill to `--qi-pct`; thumb `textPrimary`.

## Changes

1. `QI_RANGE_CSS` + wrapper vars; class `qi-range` on Step 2 sliders; drop fixed 32/44 height (28px hit box, 1px track).

## Validation

- typecheck 0; verify.mjs OK; Theme accent/border/text restyle track/thumb

## Design documentation

- none
