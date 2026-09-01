# Reveal Tip Home — JTBD caption

Written against: `4aa0cbc`

## Evidence chain

- Surface: Home `/` Caption RichText `CUNzYETqq` on Desktop `WQLkyLRf1`
- Problem: Caption text is `Preview · hover the triggers` — sandbox tooling — while Eyebrow brands `REVEAL TOOLTIP` and Tip Top already states a site verb
- Design evidence: live `getText` on Caption; `revealtip-home.mjs` Caption `SET`; `design-plans/REPORT-revealtip-improve-ui-2026-08-08.md` finding 2
- Owner: Caption node + home script
- Scope and affected surfaces: Caption string only
- Uncertainty: none

## Design decision

Replace the caption with one JTBD sentence that names the product job (icon/social tips with two reveal crafts), not “Preview”.

## Reuse

- Existing Caption node styling (14px / 500 / `rgba(255,255,255,0.4)` / center)
- Exemplar: `design-plans/marketplace-desktop-stage.md` — one product caption sentence under hero

## Changes

1. Caption `CUNzYETqq` (or name `"Caption"`):
   - Change text to exactly: `Icon tips — smooth slice or pixel assemble.`
   - Preserve: font size/weight/color/alignment; position in Desktop stack
   - Verify: Desktop reads product job under the well

2. `scripts/framer/revealtip-home.mjs`
   - Change Caption `SET` `text=` to the same string
   - Preserve: other Desktop chrome

## Scope

- Inherit: Home rebuilds
- Verify: Eyebrow still `REVEAL TOOLTIP`
- Exclude: site SEO title/description; `/thumbnail`; component source

## Validation

- Product: first viewport explains the job without saying “Preview”
- Interface: Desktop 1200×900 screenshot / Preview
- Repository:
  1. Pin session to `DHpXX5xCoGaJHmRQfN0m`
  2. Update Caption + script
  3. `node scripts/framer/verify.mjs`

## Stop conditions

- Stop if Caption node deleted — recreate with same name under Desktop before editing.

## Design documentation

- None.
