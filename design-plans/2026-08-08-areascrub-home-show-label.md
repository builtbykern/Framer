# Area Scrub Home — show value label on scrub

Written against: `4aa0cbc`

## Evidence chain

- Surface: Home `/` Product Well chart instance · Preview https://tasty-usage-149909.framer.app/
- Problem: Caption promises “Real numbers” but scrub shows crosshair + beacon with no value readout — sell JTBD fails
- Design evidence: Caption text in `scripts/framer/areascrub-home.mjs`; Goal in `docs/superpowers/specs/2026-08-07-area-scrub-design.md` (optional value label); rendered `state/areascrub-postfix-home.png` (no digits); instance `$control__showLabel=false`
- Owner: `scripts/framer/areascrub-home.mjs` chart `SET` line; optional one-shot SET on live instance
- Scope and affected surfaces: Home demo instance only (not Marketplace component defaults)
- Uncertainty: none

## Design decision

Enable Label on the **Home** Area Scrub instance so scrubbing surfaces a value matching the caption “Real numbers.” Keep the component’s Marketplace default `showLabel: false` (quiet idle for buyers).

## Reuse

- Existing controls: `showLabel`, `labelColor` (default `rgba(15, 23, 42, 0.72)` works on cream Well)
- Label chrome already implemented in `code-components/AreaScrub.tsx`
- Exemplar: Thumbnail instance already uses `$control__showLabel=true` in `scripts/framer/areascrub-thumbnail.mjs`

## Changes

1. `scripts/framer/areascrub-home.mjs`
   - Change: On Area Scrub `SET`, set `$control__showLabel=true` (keep `$control__scrubEnabled=true`). Do not change component `defaultValue` for `showLabel`.
   - Preserve: Quiet Marketplace default; stroke/fill Home overrides unless other plans change them
   - Verify: After rebuild, scrubbing shows a numeric label near the beacon

2. Live project (session pinned to Area Scrub `iByGdsW6Rb9oE5M2Igua`)
   - Change: Re-run `node scripts/framer/areascrub-home.mjs` **or** SET existing chart `$control__showLabel=true`
   - Preserve: Well fill `#FAFAF9`, scrub on
   - Verify: Preview Home — hover chart → value visible

## Scope

- Inherit: Home sell surface only
- Verify: `/thumbnail` already has label — leave unless broken
- Exclude: Changing `showLabel` default in `AreaScrub.tsx`; keyboard scrub; snap

## Validation

- Product: Scrub on Home shows a formatted number while pointer is over the chart
- Interface: Desktop Home; idle still quiet (label opacity follows chrome)
- System: Component default remains off
- Repository:
  ```bash
  node scripts/framer/session.mjs --url "https://framer.com/projects/Tasty-Usage--iByGdsW6Rb9oE5M2Igua-407t8" --name "Area Scrub"
  node scripts/framer/areascrub-home.mjs
  node scripts/framer/verify.mjs
  ```
  → verify green; Home instance `showLabel: true`

## Stop conditions

- Stop if product decision reverts to “no numbers on Home” — then change caption instead of enabling Label (do not do both silently)

## Design documentation

- None beyond script; optional one-line in `docs/projects/AreaScrub.md` that Home demo enables Label
