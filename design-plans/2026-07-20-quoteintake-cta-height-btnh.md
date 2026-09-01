# Footer primary height uses btnH (no 52 floor)

Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.15.0)

- **Status**: DONE

## Evidence chain

- Surface: Footer Next/Continue
- Problem: `Math.max(52, btnH)` ignored tablet `buttonHeightTablet` (50); success already used `btnH`
- Owner: `layout.buttonHeight*` → `btnH`
- Uncertainty: none

## Design decision

Footer primary `height: btnH` — same as success Start over.

## Changes

1. Replace `Math.max(52, btnH)` with `btnH` on footer primary.

## Validation

- Tablet width can resolve to 50px height via defaults
- typecheck 0; verify.mjs OK

## Design documentation

- none
