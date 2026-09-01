# Area Scrub Home — readable area fill opacity

Written against: `4aa0cbc`

## Evidence chain

- Surface: Home `/` chart in Product Well `#FAFAF9`
- Problem: With `fillOpacity` 0.16 the area wash barely reads; chart looks like a thin line, not an area (utility/clarity on sell surface)
- Design evidence: Soft defaults locked for **Marketplace buyers** in `design-plans/2026-08-07-area-scrub-soft-stroke-fill.md` (`fillOpacity` 0.16). Lightdash referent shows visible under-line mass. Rendered Home (`state/areascrub-postfix-home.png`) — wash nearly invisible on cream
- Owner: Home instance `$control__fillOpacity` via `scripts/framer/areascrub-home.mjs`
- Scope and affected surfaces: Home demo instance only
- Uncertainty: none — Home override; do not change component default

## Design decision

Raise **Home-only** fill opacity to **0.24** so the area reads on cream. Keep component / Marketplace default **0.16** (soft-stroke plan intact).

## Reuse

- Existing `fillOpacity` prop + 3-stop gradient (`midFill = fillOpacity * 0.28`)
- Stroke `#7C3AED` unchanged
- Soft-stroke plan remains the buyer default contract

## Changes

1. `scripts/framer/areascrub-home.mjs`
   - Change: `$control__fillOpacity=0.24` on the Home chart SET (was `0.16`)
   - Preserve: `strokeWidth=1.6`; component default `0.16`
   - Verify: Area under the curve is clearly visible on `#FAFAF9` without looking neon

2. Live Home
   - Change: Re-run `areascrub-home.mjs` or SET fillOpacity on instance
   - Preserve: Label/scrub settings from sibling plans
   - Verify: Preview Home

## Scope

- Inherit: Home only
- Verify: Thumbnail may keep 0.16 or match 0.24 for listing still — prefer **0.22–0.24** on thumb if wash invisible; default leave thumb unless wash fails
- Exclude: Changing `AreaScrub.tsx` `fillOpacity = 0.16` default; stroke color; glow

## Validation

- Product: Area chart reads as an area on the cream Well
- Interface: Desktop Home
- System: Marketplace default still 0.16 in code + property controls
- Repository:
  ```bash
  node scripts/framer/session.mjs --url "https://framer.com/projects/Tasty-Usage--iByGdsW6Rb9oE5M2Igua-407t8" --name "Area Scrub"
  node scripts/framer/areascrub-home.mjs
  node scripts/framer/verify.mjs
  ```

## Stop conditions

- Stop if user wants denser fill as the **global** default — that requires reopening soft-stroke plan with explicit OK

## Design documentation

- None (Home override only)
