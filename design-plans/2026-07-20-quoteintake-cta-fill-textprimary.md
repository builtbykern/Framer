# Primary CTA fill uses Theme textPrimary

Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.15.0)

- **Status**: DONE

## Evidence chain

- Surface: Footer Next/Continue and success Start over
- Problem: Primary fill hardcoded `#EEF1F6` while Theme `colors.textPrimary` is the light ink owner
- Design evidence: `accentCta = "#EEF1F6"`; `colors.textPrimary` default `#EEF1F6`
- Owner: `colors.textPrimary`
- Scope and affected surfaces: Primary CTAs only
- Uncertainty: none for fill; inverse label stays `#03050A` (no Theme inverse control)

## Design decision

Primary CTA `backgroundColor = colors.textPrimary`. Keep `ctaLabel = "#03050A"` as inverse ink on that fill.

## Reuse

- `colors.textPrimary`
- Exemplar: estimate / titles already consume `textPrimary`

## Changes

1. `state/QuoteIntake.tsx` — remove `accentCta`; primary + success use `colors.textPrimary` fill; keep `#03050A` label.

## Scope

- Inherit: All instances
- Exclude: Accent cyan CTAs; inventing inverse Theme control

## Validation

- Theme Text changes restyle primary CTA fill
- typecheck 0; verify.mjs OK

## Stop conditions

- none

## Design documentation

- none
