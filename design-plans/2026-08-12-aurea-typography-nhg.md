# Aurea Home: grotesk NHG, no Newsreader

Written against: `4aa0cbc` (repo) · Framer project Strong Luxury `32N5ipHfkUMlPJAI6dc7` · Home `/` node `WQLkyLRf1`

## Evidence chain

- Surface: Home `/` Desktop `WQLkyLRf1` and global text styles `Aurea/*`
- Problem: Display still paints as a serif catalog (Newsreader 400) or as fashion-tight Switzer 700 / `-0.045em`. Quantum Body reads as Neue Haas Grotesk: medium-bold grotesque, tight but not Clash Display.
- Design evidence: Live Quantum Body (`https://www.quantumbody.io`) + Aurea presets already created (`Aurea/Hero`, `Aurea/Display`, `Aurea/H1`–`H3`, `Aurea/Body`, `Aurea/Label`). Proven leftover serif nodes: `UdmTClBm7`, `SwrsIDQcw`, `lwVdPKwId`, `MmY6Qg_Y_`, `cBME7UNIR`. Geist leftovers: `Yg3sTNXUD`, `wbGyxGiJj`.
- Owner: Global text styles `Aurea/*` plus local `fontName` overrides on Home (and shared footer/nav if they still carry Newsreader).
- Scope and affected surfaces: Home `/` first. Overlay Nav + Footer inherit via shared styles. Rituals/Journal/Contact inherit only if they still bind Newsreader locally — verify, do not restyle those pages in this plan.
- Uncertainty: Exact Switzer axis that reads closest to NHG Display Medium/Bold. Validate with a Desktop screenshot of hero + manifesto after retune.

## Design decision

Retune `Aurea/Hero`, `Aurea/Display`, and `Aurea/H1` to Switzer **500–600**, tracking **~-0.02em**, line-height **0.95–1.05**. Strip every local `fontName` override that still paints Newsreader or Geist. Bind those nodes to the matching Aurea preset. Do not introduce a second type family. Do not invent a new tracking scale beyond this NHG retune.

## Reuse

- `Aurea/Hero`, `Aurea/Display`, `Aurea/H1`, `Aurea/H2`, `Aurea/H3`
- `Aurea/Body`, `Aurea/Body Large`, `Aurea/Label`, `Aurea/Caption`, `Aurea/Number`, `Aurea/Button`
- Inverse cream variants already on Overlay Nav
- Exemplar: Quantum Body hero + manifesto headlines (grammar only, no copy)

If a new primitive is required: none. Existing Aurea presets can express this.

## Changes

1. `Aurea/Hero` (global text style)
   - Change: `fontWeight` 600, `letterSpacing` `-0.02em`, `lineHeight` `0.95`
   - Preserve: Switzer family, cream/ink color bindings, size
   - Verify: Hero title no longer looks Clash Display / fashion-tight

2. `Aurea/Display` (global text style)
   - Change: `fontWeight` 500, `letterSpacing` `-0.02em`, `lineHeight` `1.0`
   - Preserve: Switzer, sizes used by manifesto
   - Verify: Manifesto 01/02 reads as NHG Medium, not serif editorial

3. `Aurea/H1` (global text style)
   - Change: `fontWeight` 600, `letterSpacing` `-0.018em`, `lineHeight` `1.02`
   - Preserve: Switzer, existing size
   - Verify: Section titles match hero family

4. Home nodes with leftover `fontName`
   - Change: clear local `fontName` on `UdmTClBm7`, `SwrsIDQcw`, `lwVdPKwId`, `MmY6Qg_Y_`, `cBME7UNIR`, `Yg3sTNXUD`, `wbGyxGiJj`; bind to `Aurea/H2` or `Aurea/Display` as appropriate. Footer logo `cBME7UNIR` → `Aurea/H3` or Label, still Switzer.
   - Preserve: copy, layout, CMS bindings
   - Verify: no Newsreader/Geist computed on Home Desktop

## Scope

- Inherit: any node already bound to `Aurea/Hero|Display|H1`
- Verify: Overlay Nav, Footer, `/rituals` `/journal` `/contact` for leftover Newsreader (fix only if the same local override exists; do not restyle those pages)
- Exclude: layout rebuild, hero composition, new fonts, new pages, publish

## Validation

- Product: Home Desktop screenshot of hero + manifesto; titles read as one grotesque family
- Interface: Desktop 1440; check one long title (hero) and one short (H3)
- System: no parallel Newsreader style left on Home
- Repository: rebound Strong Luxury → `node scripts/framer/exec.mjs` inspect fonts → `node scripts/framer/verify.mjs`

## Stop conditions

- Stop if Framer cannot retune the named Aurea styles, or if stripping `fontName` breaks a CMS text binding.

## Design documentation

- After acceptance: record NHG retune values in `docs/projects/` only if Home passes the 3-second Quantum-family test.
