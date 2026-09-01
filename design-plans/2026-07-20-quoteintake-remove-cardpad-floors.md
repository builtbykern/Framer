# Remove card padding floors so Layout tiers win

Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.12.0)

- **Status**: DONE

## Evidence chain

- Surface: Root card padding on QuoteIntake at all widths
- Problem: Non-mobile widths force at least 36px vertical / 40px horizontal padding even when `tierN` returns smaller `cardPad`
- Design evidence: Defaults `cardPaddingDesktop: 40`, `cardPaddingTablet: 32`, `cardPaddingMobile: 20` (`~162`); `cardPad = tierN(…)` (`~413`); then `cardPadY = Math.max(isMob ? pad : 36, cardPad)` and `cardPadX = Math.max(isMob ? pad : 40, cardPad)` (`~420–421`)
- Owner: `layout.cardPadding*` via `tierN`
- Scope and affected surfaces: `rootPad` only
- Uncertainty: none

## Design decision

Card padding equals the resolved `cardPad` (and for mobile/stack safe-area branch, `pad` where already used for page padding). Delete the hardcoded `36` / `40` floors.

## Reuse

- `tierN`, `layout.cardPaddingDesktop|Tablet|Mobile`, `layout.pagePadding*`
- Exemplar: `secGap` / `fldGap` / `btnH` already use `tierN` without extra floors (`~414–416`)

## Changes

1. `state/QuoteIntake.tsx` (`~420–424`)
   - Change: Set `cardPadY = cardPad` and `cardPadX = cardPad` (or `pad` on the mobile/stack safe-area branch if that plan uses `pad` for horizontal — prefer one source: `cardPad` for both axes after tier). Keep `env(safe-area-inset-*)` wrappers on the mobile/stack branch.
   - Preserve: `boxSizing`, border, stack vs wide structure.
   - Verify: At tablet width, padding ≈ 32px from defaults; at mobile ≈ 20px; at desktop ≈ 40px with no forced bump above tablet.

## Scope

- Inherit: All instances
- Verify: Together with compact-density plan if both execute — apply floors removal first or in same edit
- Exclude: Changing default padding numbers; exposing cardPadding in property panel (optional later, out of scope)

## Validation

- Product: Mid-width card has visibly tighter inset than today’s 40px floor
- Interface: 375 / 600 / 900+ widths
- System: No parallel min-padding constants left in rootPad
- Repository: typecheck 0; verify.mjs OK

## Stop conditions

- Stop if Marketplace listing requires minimum 40px inset for thumbnails — then gate floors with `isOnCanvas` only (document exception)

## Design documentation

- none
