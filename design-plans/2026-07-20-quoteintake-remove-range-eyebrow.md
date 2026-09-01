# Remove hardcoded Range label (title-only estimate header)


- **Status**: DONE
Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.10.0)

## Evidence chain

- Surface: Estimate header in stack layout (`!wide`)
- Problem: Narrow layout shows configurable `productTitle` plus a hardcoded English `"Range"` line; wide layout shows title only — inconsistent labeling across breakpoints
- Design evidence: `narrative.productTitle` rendered always (`~784`); `{!wide ? (… "Range" …) : null}` (`~785–787`); Narrative control exposes Title / Supporting only — no Range string (`~929–932`)
- Owner: `narrative.productTitle`
- Scope and affected surfaces: Header block when `cw < layout.collapseBreakpoint`
- Uncertainty: none — remove hardcoded line to match wide and the control surface

## Design decision

Estimate block is labeled solely by `narrative.productTitle` (default `"Estimate"`) at every breakpoint. Delete the hardcoded `"Range"` row.

## Reuse

- `narrative.productTitle` + `typography.smallPrintFont` + `colors.accent` (existing title styling)
- Exemplar: wide header path already title-only (`~783–790` without Range)

## Changes

1. `state/QuoteIntake.tsx` — header (`~785–787`)
   - Change: Remove the entire `{!wide ? ( <div>…Range…</div> ) : null}` block.
   - Preserve: `productTitle`, `AnimatedEstimate`, supporting line, chapter strip placement.
   - Verify: Stack and wide headers both show one eyebrow (`Estimate` or custom title) above prices.

## Scope

- Inherit: All QuoteIntake instances
- Verify: Monumental (stack) and compact (wide) estimate presentations
- Exclude: Do not add a new Range narrative control; do not rename `productTitle` defaults

## Validation

- Product: Narrow card no longer shows ESTIMATE + RANGE stack — only product title
- Interface: Resize across `collapseBreakpoint` (720 default)
- System: No orphaned copy
- Repository: typecheck 0; verify.mjs OK

## Stop conditions

- Stop if brand requires a second eyebrow — then add `narrative.rangeLabel` with default `""` (hidden when empty) instead of hardcoding; do not invent without confirmation

## Design documentation

- none
