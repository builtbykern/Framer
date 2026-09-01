# Reveal Tip Home — Smooth / Pixel mode labels

Written against: `4aa0cbc`

## Evidence chain

- Surface: Home `/` Product Well `xxuQXOZ0m` with Tip Top / Tip Bottom — identical 44×44 dark discs at rest
- Problem: Dual-mode specimen does not label which trigger is Smooth vs Pixel until hover
- Design evidence: canvas tree (no mode RichText under well); `design-plans/REPORT-revealtip-improve-ui-2026-08-08.md` finding 3
- Owner: Home Desktop chrome via `revealtip-home.mjs`
- Scope and affected surfaces: Product Well layout + two muted labels; tip instances unchanged except parenting if restructured
- Uncertainty: exact well height may need +24px after labels — feel-check once

## Design decision

Add muted mode labels so the specimen advertises Smooth vs Pixel at rest, without putting FX jargon inside tip content (utility copy plan owns tip strings).

## Reuse

- Desktop stack / Product Well horizontal layout from `revealtip-home.mjs`
- Label style: Inter 12px / 500 / `rgba(255,255,255,0.35)` / center — quieter than Caption
- Exemplar: Marketplace stages that caption variants under demos (chrome only)

## Changes

1. Restructure Product Well into two columns (chrome only):
   - Column A (stack vertical, gap `10px`, center): Tip Top instance + RichText `"Smooth"`
   - Column B (same): Tip Bottom instance + RichText `"Pixel"`
   - Product Well stays horizontal stack, gap `96px`, width `520px`; height → `360px` if needed so labels fit with overflow visible
   - Preserve: tip instance controls (after utility-copy plan); Force Open Off
   - Verify: at rest, “Smooth” under left trigger, “Pixel” under right

2. `scripts/framer/revealtip-home.mjs`
   - Change: build the column wrappers + labels in DSL so rebuilds match
   - Preserve: Desktop fill `#0A0A0A`, eyebrow, caption (after JTBD caption plan)

## Scope

- Inherit: Home rebuilds
- Verify: tips still hoverable; labels not clipped
- Exclude: `RevealTooltip.tsx`; colors of tips; motion

## Validation

- Product: buyer can tell modes apart without hovering
- Interface: Desktop + Preview rest state
- Repository:
  1. Pin `DHpXX5xCoGaJHmRQfN0m`
  2. Apply DSL / update + run `revealtip-home.mjs`
  3. `node scripts/framer/verify.mjs`

## Stop conditions

- Stop if restructuring would require editing component code — chrome only.
- Prefer running **after** utility tip copy + JTBD caption so one Home pass can include all three.

## Design documentation

- None.
