# Let buttonFont own CTA type size


- **Status**: DONE
Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.10.0)

## Evidence chain

- Surface: Primary Next / Continue CTA and Back control in the form footer; success “Start over” if it shares the same pattern
- Problem: Theme `typography.buttonFont` (default 15px) is spread then overridden with hardcoded sizes
- Design evidence: Property control `typography.buttonFont` default `fontSize: "15px"` (`~942`); Next `fontSize: "13px"` after `...typography.buttonFont` (`~845`); Back `fontSize: "12px"` (`~850`)
- Owner: `typography.buttonFont` Font control
- Scope and affected surfaces: Footer primary + Back; check success primary (`~813–814`)
- Uncertainty: none for size ownership; uppercase/letterSpacing on Next may stay as layout chrome if they do not fight Font size — prefer removing only `fontSize` overrides first

## Design decision

`buttonFont` is the single owner of CTA font size (and other Font-controlled fields). Remove hardcoded `fontSize` on primary and Back. Keep uppercase transform if desired for studio chrome; if `letterSpacing` is also hardcoded (`0.06em` / `0.08em`), remove those too so Font control letterSpacing applies — unless the design explicitly needs tracked uppercase independent of the control (then document as exception; default action: remove both size and letterSpacing overrides).

## Reuse

- `typography.buttonFont` from props / Theme Typography object
- Exemplar: success CTA already uses `...typography.buttonFont` without a `fontSize` override (`~814`) — match that

## Changes

1. `state/QuoteIntake.tsx` — primary Next button (`~844–846`)
   - Change: Delete `fontSize: "13px"` from style. Delete `letterSpacing: "0.06em"` so `buttonFont.letterSpacing` wins. Keep `textTransform: "uppercase"` if present unless Font control should own that too (Font does not include transform — uppercase may stay).
   - Preserve: height, colors (`accentCta` / `ctaLabel`), press/hover motion, disabled states.
   - Verify: Changing Button Font size in Framer panel updates Next type size.

2. `state/QuoteIntake.tsx` — Back button (`~849–851`)
   - Change: Delete `fontSize: "12px"` and `letterSpacing: "0.08em"`. Keep `textTransform: "uppercase"` and `colors.secondaryButtonTextColor`.
   - Preserve: transparent background, press motion.
   - Verify: Back uses `buttonFont` size; still visually secondary via color/opacity.

## Scope

- Inherit: All instances of this code component
- Verify: Steps 1–4 footer; success screen CTA unchanged unless it also overrides
- Exclude: Estimate title fonts; RadioTile title sizes; inventing new primary button color controls

## Validation

- Product: Designer changes Typography → Button fontSize in panel → Next/Back reflect it
- Interface: Mobile + desktop footer; submitting disabled state
- System: No parallel hardcoded size
- Repository: typecheck 0; ≤1000 lines; verify.mjs OK

## Stop conditions

- Stop if Marketplace listing requires a fixed 13px tracked label regardless of Font control — then hide size from Font control instead (out of scope unless confirmed)

## Design documentation

- none
