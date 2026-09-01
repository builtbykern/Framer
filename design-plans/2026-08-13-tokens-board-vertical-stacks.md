# Tokens board stacks vertically again

Written against: `4aa0cbc`

## Evidence chain

- Surface: Design → Tokens frame `hjXttsYSF` (scope DesignPage `otrEspVZ7`)
- Problem: Five section containers that must read as vertical dossiers are `stackDirection="horizontal"`, so alphas, type specimens, section-Y bars, spec rows, and the footer collapse sideways.
- Design evidence: Prior Tokens board (pre-rebuild) used vertical stacks for typography specimens, rhythm bars, and spec rows; Arbour site sections are vertical stacks (`docs/projects/arbour.md` section rhythm). Serialize 2026-08-13: `Kjc0kQoLa`, `pupz0z7TZ`, `H_TIFDjs4`, `IOhQ4gLYB`, `YLRyJw1IR` all `dir=horizontal`.
- Owner: Tokens board children listed below
- Scope and affected surfaces: Design Tokens board only — not site pages
- Uncertainty: none for direction; optional polish (specimen borders, section chrome) is out of this plan

## Design decision

Force `stackDirection="vertical"` (and `stackDistribution="start"`) on every Tokens container that holds stacked dossier content. That restores the board’s readable editorial axis without inventing new chrome.

## Reuse

- Pattern: vertical stack sections already used on Tokens Intro / Colour Core / Typography light rows
- Exemplar: Core Swatches grid parent and light type rows (`WGmUNQPQV` etc.) already vertical/horizontal correctly for their roles
- Tokens: Paper, Racing Deep, Ink Soft, Olive — already bound; do not retoken

## Changes

1. `Kjc0kQoLa` — Dark Alpha Wrap  
   - Change: `stackDirection="vertical"` `stackDistribution="start"`  
   - Preserve: Racing Deep fill, pad 20, child Dark Alpha Grid  
   - Verify: eight dark alpha swatches read in a grid below the label, not beside it

2. `pupz0z7TZ` — Dark Type Samples  
   - Change: `stackDirection="vertical"` `stackDistribution="start"` `gap="0px"`  
   - Preserve: Racing Deep fill, pad 32, Dark Heading/Body/Meta rows  
   - Verify: three dark specimens stack top→bottom

3. `H_TIFDjs4` — Section Y Scale  
   - Change: `stackDirection="vertical"` `gap="16px"`  
   - Preserve: bar widths 128/96/64/48/32/136 and Meta labels  
   - Verify: six rhythm rows stack; bars read as a vertical scale

4. `IOhQ4gLYB` — Spec Rows  
   - Change: `stackDirection="vertical"` `gap="0px"`  
   - Preserve: each row’s horizontal key|value layout and Ink 12 borders  
   - Verify: Beds / Tenure / Guide Price stack as a dossier list

5. `YLRyJw1IR` — Footer Note  
   - Change: `stackDirection="vertical"` `gap="8px"`  
   - Preserve: Meta + Body legacy copy, top hairline  
   - Verify: LEGACY label above body copy

6. Apply via Arbour session only:  
   `node scripts/framer/session.mjs --url "https://framer.com/projects/Arbour--CmRyHJKPrPE6BZhC6d4S-iP6EP"`  
   then `framer.agent.applyChanges(dsl, {})` (Design page — no `pagePath`)  
   then `node scripts/framer/verify.mjs -s 1`

## Scope

- Inherit: Tokens board readability only
- Verify: screenshot `hjXttsYSF` after apply; serialize the five ids for `stackDirection`
- Exclude: colour swatch redesign; typography specimen border rhythm; intro copy rewrite; deleting legacy color styles; site pages

## Validation

- Product: open Design → Tokens; board reads top-to-bottom by section
- Interface: Dark Alpha Wrap, Dark Type Samples, Section Y, Spec Rows, Footer
- System: no new tokens or text styles
- Repository: `node scripts/framer/verify.mjs -s 1` → green; serialize five ids → `stackDirection=vertical`

## Stop conditions

- Stop if any id is missing after a concurrent edit — re-serialize `hjXttsYSF` depth 2 and remap by name
- Stop if the user expands scope to specimen chrome / section dividers (findings #2–#3) — write a separate plan

## Design documentation

- After acceptance: none required in `arbour.md` (Design board craft only). Optional one-line note under a Design tooling section if the team wants it.
