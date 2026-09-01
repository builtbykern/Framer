# Demo home matches Kern dark house

- **Status**: DONE

## Outcome

`/` Desktop `#060606`; Primary white pill / Inverse dark pill; caption muted. verify non-blocking.

## Evidence chain

- Surface: Knowledgeable Members `/` Desktop `WQLkyLRf1`
- Problem: Light `#F5F5F5` demo vs `/thumbnail` house `#060606` — split identity
- Design evidence: KERN_THUMBNAIL_STYLE; audit U3; screenshots
- Owner: Canvas page `/` only
- Scope: Desktop fill + caption color; CTA instance colors if needed for dark ground
- Uncertainty: none

## Design decision

Set Desktop fill `#060606`. Caption `rgba(180,185,195,0.5)`. Primary CTA: light base / dark fill / dark label (readable on dark). Inverse: dark base / light fill / light label.

## Reuse

- House colors `#060606`, muted caption from thumbnail recipe
- Existing instances `Bg2epV_69`, `Cv9wnBPIS`, caption `PunJ1Rt1J`

## Changes

1. Page `/` via `applyChanges`
   - Change: `SET WQLkyLRf1 fill="#060606"`; caption textColor muted; swap Primary to white pill / Inverse to dark pill for dark ground
   - Preserve: stack layout, two CTAs + caption structure
   - Verify: screenshot `/` reads as Kern dark pack

## Scope

- Inherit: Marketplace live preview
- Exclude: `/thumbnail` (already house); component source

## Validation

- Product: `/` and `/thumbnail` share dark Kern identity
- Repository: `verify.mjs` non-blocking

## Stop conditions

- Stop if page IDs drifted — re-read children before SET

## Design documentation

- none
