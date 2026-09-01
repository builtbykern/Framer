# Compact density follows Band BP (`!wide`), not only Mobile BP

Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.12.0)

- **Status**: DONE

## Evidence chain

- Surface: QuoteIntake stack layout when `cw < layout.collapseBreakpoint` (default 720), including mid band 480–719
- Problem: Header already stacks (monumental estimate + vertical chapters) below Band BP, but mobile padding and chapter collapse only apply when `cw < mobileBreakpoint` (480), so mid widths stay dense like a phone composition with desktop chrome
- Design evidence: `wide = cw >= layout.collapseBreakpoint` (`~417`); stack header/progress (`~722–738`); progress hides future chapters only if `isMob && !inline` (`~521`); mobile `rootPad` only if `isMob` (`~422–424`)
- Owner: `layout.collapseBreakpoint` (Band BP) for stack vs wide; density should follow the same owner once stacked
- Scope and affected surfaces: `rootPad`, `renderProgress` (non-inline), any other `isMob`-only density that should match stack
- Uncertainty: none for progress + padding; estimate monumental already keys off `!wide` — leave that coupling

## Design decision

Introduce `compact = !wide` (or reuse `!wide` inline). Whenever the card is in stack/band mode, apply the same compact density rules currently gated on `isMob`: chapter list collapses future steps; padding uses the mobile/safe-area path (or tablet tier via `tierN`, not desktop floors — see sibling plan on cardPad floors).

Do **not** change Band BP or Mobile BP default numbers unless needed; change which flag drives density.

## Reuse

- Existing `wide` / `isMob` / `tierN` / `layout.mobileBreakpoint` / `layout.collapseBreakpoint`
- Exemplar: `estStage = { monumental: !wide, compact: wide }` already ties estimate mode to Band BP (`~535`)

## Changes

1. `state/QuoteIntake.tsx` — derive compact flag
   - Change: `const compact = !wide` (name clearly; avoid shadowing AnimatedEstimate’s `compact` prop — use `stackLayout` or `isBand` if clearer).
   - Preserve: `wide` for header row vs column and estimate monumental/compact range display.
   - Verify: At `cw = 600` (default BPs), `wide === false` and compact density is on.

2. `renderProgress` (`~521`)
   - Change: Replace `isMob && !inline && !on && n > step` with `(isMob || !wide) && !inline && !on && n > step` (or `stackLayout && !inline…`).
   - Preserve: Wide inline chapter strip shows all labels; past steps remain visible when collapsed.
   - Verify: At 600px width, only current + past chapters show in the vertical list.

3. Root padding (`~422–424`)
   - Change: Use the mobile safe-area `rootPad` branch when `isMob || !wide` (stack), not only `isMob`. After sibling plan removes 36/40 floors, this branch should use `cardPad`/`pad` from `tierN`.
   - Preserve: Wide desktop padding when `wide`.
   - Verify: At 600px, horizontal padding tracks tablet/mobile tier, not desktop 40.

## Scope

- Inherit: All QuoteIntake instances
- Verify: Phone (`cw < 480`), mid stack (480–719), wide (`≥ 720`); Framer instance ~640px
- Exclude: Motion changes; RadioTile copy; formula math; changing default BP values

## Validation

- Product: Mid-width stack feels as compact as phone for chrome (chapters + padding)
- Interface: Resize across 480 and 720; step 1–4 with `showStepList` true
- System: Estimate monumental still only when `!wide`
- Repository: Push `Workshop/QuoteIntake.tsx`; typecheck 0; ≤1000 lines; `node scripts/framer/verify.mjs`

## Stop conditions

- Stop if product wants full chapter list on tablet stack — then only apply padding compact, not progress collapse

## Design documentation

- none
