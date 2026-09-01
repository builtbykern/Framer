# Back uses secondaryButtonColor for fill

Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.15.0)

- **Status**: DONE

## Evidence chain

- Surface: Footer Back (steps 2–4)
- Problem: Hardcoded `transparent` while `colors.secondaryButtonColor` owns secondary fill
- Owner: `colors.secondaryButtonColor` (default transparent)
- Uncertainty: none

## Design decision

Back `backgroundColor = colors.secondaryButtonColor`; keep `secondaryButtonTextColor` for label.

## Changes

1. Wire Back fill to `colors.secondaryButtonColor`.

## Validation

- Default look unchanged (transparent); prop ownership correct
- typecheck 0; verify.mjs OK

## Design documentation

- none
