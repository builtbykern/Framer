# Elevate Neighbourhoods Territory Card dossier to SOTD editorial density

Written against: `4aa0cbc`  
**Status:** DONE (canvas) — publish pending user OK · 2026-08-01

## Evidence chain

- Surface: `/neighbourhoods` Territory Checkerboard · card `i56eWdACt` (D/T/P)
- Problem: (1) `space-between` + hidden Cartographic Field → empty mid void; (2) Highlights CMS suppressed; (3) CTA mark `↗` weaker than Properties `VIEW`
- Design evidence: improve-ui report `design-plans/REPORT-arbour-neighbourhoods-territories-improve-ui-2026-08-01.md`; Arbour tokens Paper/Ink/Ink Soft/Olive/Chartreuse; Properties listing Meta `VIEW` accent; prior directory Paper/1200 plans
- Owner: Territory Card template + dossier children
- Scope: Desktop card + Tablet/Phone replicas only
- Uncertainty: Highlights multiline may need truncation ≤2 lines to stay SOTD-tight in 360px dossier

## Design decision

Keep Arbour estate-editorial language (flush dossier|photo, Paper field, Fraunces title, Meta CTA). Do **not** resurrect Cartographic Field/maps (easy to look stock). Fix void by packing the dossier. Reveal Highlights as a restrained Meta coda under Intro. Align CTA copy/accent with Properties `VIEW →` in Chartreuse.

## Reuse

- Text: `Arbour/Subhead` (title), `Arbour/Body` (Intro), `Arbour/Meta` (Highlights + VIEW)
- Color: Ink `e2f9a9eb-…`, Ink Soft `0bc68d0d-…`, Chartreuse `db86917b-…`
- Exemplar: `/properties` PropertyCard Meta **VIEW** accent
- Preserve: card `height` 360 desktop / existing T/P heights; pair `gap: 0`; `href=/properties`; border hairline; no map watermark

## Changes

1. Dossier `QAa2V2fag` (+ `aJLpuUP0qQAa2V2fag`, `Qonafp_oDQAa2V2fag`)
   - Change: `stackDistribution="start"` · `gap="20px"`
   - Preserve: padding `28px`, width/height `1fr`, children order
   - Verify: no empty mid void on D/T/P stills

2. Intro `v61cPV2xF` (+ BP replicas)
   - Change: `textTruncation="3"` (room for Highlights coda)
   - Preserve: Body + Ink Soft color
   - Verify: still ends cleanly; not a wall of text

3. Highlights `sJB1mG6E1` (+ BP replicas)
   - Change: `visible=true` · `textTruncation="2"` · keep Meta preset · `textColor` Ink Soft `var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)` (secondary to title; Chartreuse reserved for VIEW)
   - Preserve: binding `var(--variable-ZIEwtEwXa)`
   - Verify: 1–2 lines Meta under Intro; Olive not competing with VIEW

4. CTA `d9SNjsdke` (+ BP replicas)
   - Change: text `VIEW →` · `textColor=var(--token-db86917b-d19e-4fd7-8dc5-e260f1f35cb1)` (Chartreuse) · ensure Meta preset if unset
   - Preserve: space-between title row; card link `/properties`
   - Verify: matches Properties VIEW accent language

5. Place Reading `rIIdBjqU_` (+ replicas)
   - Change: `gap="10px"` between Intro and Highlights
   - Preserve: stack start
   - Verify: tight coda, not sparse

## Scope

- Inherit: all repeated Territory Cards via CMS list template
- Verify: Desktop / Tablet / Phone `/neighbourhoods`
- Exclude: Cartographic Field visibility; Directory Panel measure; hero; METHOD section; PropertyCard code

## Validation

- Product: Directory reads as dense editorial dossier, not sparse split card
- Interface: 4 territories; long Cotswolds intro; mobile stack
- System: Chartreuse only on VIEW; Highlights quieter (Ink Soft)
- Repository: `node scripts/framer/verify.mjs` → ok; visual stills `/neighbourhoods`

## Stop conditions

- Stop if Highlights overflow clips photograph or breaks 360px pair alignment — then reduce Highlights truncation to `1` before widening card height.

## Design documentation

- After publish: note in `docs/projects/arbour.md` that Territory Card shows Intro + Highlights coda + Meta `VIEW →` (Chartreuse); Cartographic Field remains off by design.
