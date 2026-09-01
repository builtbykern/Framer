# Aurea Home: Quantum chapter spine

Written against: `4aa0cbc` (repo) · Framer project Strong Luxury `32N5ipHfkUMlPJAI6dc7` · Home Desktop `WQLkyLRf1`

## Evidence chain

- Surface: Home `/` children of `WQLkyLRf1` after the hero
- Problem: Home is a 12-block product catalog (essence cards, ingredients still-life, journal preview, four principle cards). Quantum Body is a chapter scroll: manifesto → type → one object → North Stars list → close.
- Design evidence: Quantum Body page flow (live). Current Home children: Manifesto `Za7Y2OADF`, There Is More `kc2eH_4Yf`, Ritual Story `wzb2WV9bv`, Essence 01 `ZJ0pt1wzY`, Past Wisdom `Va8p5eH32`, Four Principles `H6NDV3SH8`, Other Rituals `gnjgqENs1`, Ingredients `dS7p8NOPJ`, Journal Preview `HuRcBoVre`, Inner Circle `RaBtZkl9M`, Footer `uc_ZoQdWr`.
- Owner: Home Desktop `WQLkyLRf1` section frames listed above. Hero `AXoBqu6TL` is owned by the hero-stage plan — do not rebuild it here.
- Scope and affected surfaces: Home `/` only. Overlay Nav and Footer stay. CMS Rituals collection stays bound on the rituals chapter.
- Uncertainty: Which catalog blocks can be absorbed vs hidden. Prefer hide/absorb over delete until the new spine screenshots pass.

## Design decision

Rebuild Home after the hero into this spine: **01/02 manifesto → type chapter → one object card → North Stars list → rituals CMS → Inner Circle → Footer**. Kill or absorb Essence 01, Ingredients, Journal Preview, and the 4-up principle cards. Four Principles becomes a hairline 01–0n list on Bone/cream, not cards. Other Rituals stays as the CMS chapter but must not look like a perfume grid.

## Reuse

- Colors: Ink, Bone, Warm Cream, Sand, Deep Brown, Hairline
- Text: `Aurea/*` presets (after typography plan)
- Overlay Nav, Footer, Rituals CMS collection
- Inner Circle `RaBtZkl9M` as the close, restyled to cream-on-ink if needed
- Exemplar: Quantum Body manifesto + North Stars list (grammar only)

If a new primitive is required: none. No new code components. No new pages.

## Changes

1. Manifesto `Za7Y2OADF`
   - Change: two-column 01 / 02 chapter on Ink, Display type, no 3-up cards
   - Preserve: Aurea copy voice; Overlay Nav not duplicated
   - Verify: reads as Quantum “Mind Over Matter” chapter, not a feature row

2. Type chapter `kc2eH_4Yf` + Ritual Story `wzb2WV9bv`
   - Change: one type/story chapter — large grotesque line + supporting body; absorb Ritual Story into this chapter or restyle as espresso diptych with one rounded photo
   - Preserve: existing photography if it is object/body, not spa lotus
   - Verify: one chapter, not two stacked posters

3. Essence 01 `ZJ0pt1wzY`
   - Change: restyle as **one** object card chapter (frosted or cream panel, single product/ritual). Hide extra product tiles.
   - Preserve: CMS or static title if already bound
   - Verify: not a catalog row

4. Four Principles `H6NDV3SH8`
   - Change: North Stars — Bone/cream page, one headline, hairline rows `01`–`04` (or 06), no 4-up cards
   - Preserve: principle copy if it still fits Aurea
   - Verify: list, not cards

5. Other Rituals `gnjgqENs1`
   - Change: CMS chapter with quiet rows or one featured + list; kill perfume-card chrome
   - Preserve: Rituals CMS binding
   - Verify: still links to `/rituals`

6. Ingredients `dS7p8NOPJ` + Journal Preview `HuRcBoVre`
   - Change: hide or absorb into North Stars / rituals. Do not leave still-life ingredient theater or a journal magazine block on Home.
   - Preserve: Journal page itself; only Home preview goes away
   - Verify: Home child count drops; spine is hero → manifesto → type → object → stars → rituals → inner circle → footer

7. Inner Circle `RaBtZkl9M` + Footer `uc_ZoQdWr`
   - Change: keep as close; cream type on Ink; no Newsreader logo
   - Preserve: form / waitlist behavior
   - Verify: last two beats before end of page

## Scope

- Inherit: typography + hero plans
- Verify: Overlay Nav on each new section background
- Exclude: hero rebuild, new pages, Shopify, publish, Rituals/Journal/Contact page restyles

## Validation

- Product: full Home Desktop scroll screenshots; 3-second test = Quantum-family chapter site, not perfume catalog
- Interface: Desktop 1440; Tablet stack of the same chapters
- System: Rituals CMS still bound; HeroStage hidden; no new components
- Repository: rebound session → screenshots per section → `node scripts/framer/verify.mjs`

## Stop conditions

- Stop if a CMS binding would be destroyed by hiding Other Rituals — restyle in place instead.
- Stop if Overlay Nav or Footer would be deleted.

## Design documentation

- After acceptance: update visual notes only if the 3-second Quantum-family test passes on Home.
