# Aurea Home: hero as Quantum stage

Written against: `4aa0cbc` (repo) · Framer project Strong Luxury `32N5ipHfkUMlPJAI6dc7` · Hero `AXoBqu6TL`

## Evidence chain

- Surface: Home `/` first child `Page Stage` `AXoBqu6TL` on Desktop `WQLkyLRf1`
- Problem: Hero is a stacked poster (lotus + manifesto block), not Quantum’s cinematic stage. Overlay Nav is correct; HeroStage code component must stay hidden.
- Design evidence: Quantum Body home — full-bleed macro, grotesque title top-left, frosted rounded object card with index + ghost CTA, “Introduction” label, bottom tagline + hairline. Aurea Overlay Nav `sqnDbYVx6` / component `F7FlnigBf`.
- Owner: Frame `AXoBqu6TL` and its children. Overlay Nav stays a sibling of the page, not inside the hero.
- Scope and affected surfaces: Home hero only. Do not restyle Manifesto `Za7Y2OADF` or later sections here.
- Uncertainty: Exact photo asset currently in `AXoBqu6TL`. Reuse the existing hero image if it is a close-up body/object; replace only if it still reads as a spa lotus poster.

## Design decision

Rebuild `AXoBqu6TL` as a full-bleed stage: title top-left, one frosted rounded object card (image + short title + `01` + ghost CTA), Introduction label, bottom tagline and hairline. Keep Overlay Nav. Keep HeroStage hidden. Same layout tree in static renderer — no divergent mock.

## Reuse

- Overlay Nav `sqnDbYVx6` / `F7FlnigBf`
- Colors: Ink `#1D1107`, Warm Cream `#FCE8C2`, Hairline Cream
- Text: `Aurea/Hero`, `Aurea/Label`, `Aurea/Button`, `Aurea/Caption` (after typography plan)
- Existing hero image if it is already a macro still-life
- Exemplar: Quantum Body hero stage (grammar only)

If a new primitive is required: none. No new code component. Frosted card is a Frame with `backdrop-filter` / translucent fill.

## Changes

1. `AXoBqu6TL` Page Stage
   - Change: full-bleed height ~100vh, image cover, no stacked manifesto column
   - Preserve: Overlay Nav sibling, page width, hidden HeroStage
   - Verify: first screenshot reads as a stage, not a poster

2. Hero title (new or retargeted text node, `Aurea/Hero`, Warm Cream)
   - Change: top-left, 2–3 lines, Aurea voice (not Quantum copy). Example direction: “A house of modern ritual.”
   - Preserve: no kinetic letters
   - Verify: title sits in the upper-left third, not centered

3. Frosted object card
   - Change: rounded (~24–32px), translucent cream/white ~12–18% + blur, inner image, index `01`, short object title, ghost CTA “Enter the house”
   - Preserve: one object only — not a product grid
   - Verify: card reads as glass over the photo, left-of-center

4. Introduction + bottom tagline
   - Change: small `Aurea/Label` “Introduction”; bottom hairline + one-line tagline in `Aurea/Caption`
   - Preserve: no extra CTAs, no lotus-as-logo lockup
   - Verify: stage has top title, mid card, bottom line — three anchors like Quantum

## Scope

- Inherit: typography plan values if already applied
- Verify: Overlay Nav contrast on the new photo
- Exclude: rest of Home spine, Rituals/Journal/Contact, new pages, publish, HeroStage visibility

## Validation

- Product: Desktop screenshot of hero only; 3-second test = Quantum-family stage
- Interface: Desktop 1440 and Tablet; Overlay Nav still clickable
- System: HeroStage remains hidden; no new code component
- Repository: rebound session → screenshot `AXoBqu6TL` → `node scripts/framer/verify.mjs`

## Stop conditions

- Stop if Overlay Nav is absorbed into the hero or if HeroStage is shown.
- Stop if the only available image still reads as spa/yoga after crop — swap asset before continuing.

## Design documentation

- After acceptance: none until the full Home spine also passes.
