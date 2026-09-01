# Bind cinematic and forest dark fills to Arbour color tokens

Written against: unavailable (workspace git HEAD not resolved)

## Evidence chain

- Surface: `/notes` masthead; `/neighbourhoods` hero + Territory Grid + “How we read a place”
- Problem: Dark surfaces use raw RGB (`rgb(28, 27, 22)`, `rgb(28, 36, 22)`) while Contact cinematic and Home dark heroes resolve through Arbour color styles, so dark bands drift between pages.
- Design evidence: Color styles `/Arbour/Ink` (`e2f9a9eb-668a-4021-80d9-b04413b5f392` → `rgb(28, 27, 22)`), `/Arbour/Racing Deep` (`9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04` → `rgb(21, 43, 30)`). Contact `jmmPpci8t` fill already uses `var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)` (Ink). Home tablet hero uses Racing Deep green `rgb(21, 43, 30)`.
- Owner: Framer color styles `/Arbour/Ink`, `/Arbour/Racing Deep`; page frames listed below
- Scope and affected surfaces: `/notes` (`Vq1f2mEkj`); `/neighbourhoods` (`ycUqIc8V3`, `NrbMmTnFX`, `KraraKF0A`) + tablet/phone replicas under `aJLpuUP0q*` / `Qonafp_oD*` / Notes breakpoints if fills are local overrides
- Uncertainty: none on token IDs; confirm whether any breakpoint overrides reintroduce raw RGB after desktop SET

## Design decision

Use **Ink** for full-bleed cinematic hero chrome (same role as Contact cinematic fallback) and **Racing Deep** for editorial forest bands on `/neighbourhoods` (directory section + method band). Do not invent a third dark green. Do not change Chartreuse kickers, typography, or imagery.

## Reuse

- `/Arbour/Ink` → `var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)`
- `/Arbour/Racing Deep` → `var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)`
- Exemplar: Contact cinematic `jmmPpci8t` (Ink token fill); Home dark hero Racing Deep value

## Changes

1. `/notes` · `Vq1f2mEkj` (Notes Masthead)
   - Change: `fill` from `rgb(28, 27, 22)` to `var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)` (Ink)
   - Preserve: height 720 / InertiaFrame / overlay type / Chartreuse meta
   - Verify: serialized fill is the Ink token; Preview still reads as near-black under photo

2. `/neighbourhoods` · `ycUqIc8V3` (Neighbourhoods Hero)
   - Change: `fill` to Ink token (same as Notes masthead)
   - Preserve: 680px cinematic stack, InertiaFrame, overlay copy
   - Verify: token fill on desktop; check tablet `aJLpuUP0qycUqIc8V3` / phone `Qonafp_oDycUqIc8V3` if they store local fill overrides — set those to Ink too if present

3. `/neighbourhoods` · `NrbMmTnFX` (Territory Grid Section)
   - Change: `fill` from `rgb(28, 36, 22)` to Racing Deep token `var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)`
   - Preserve: padding, Directory Panel child, cream panel, zero radius (user request)
   - Verify: section background matches Home/Racing Deep family, not a one-off forest

4. `/neighbourhoods` · `KraraKF0A` (How We Read A Place)
   - Change: `fill` to Racing Deep token (same as `NrbMmTnFX`)
   - Preserve: two-column editorial layout, cream/chartreuse type, CTA to `/contact`
   - Verify: continuous dark band with Territory Grid (no hue jump between sections)

## Scope

- Inherit: any replica breakpoints that currently bake raw `rgb(28, 27, 22)` or `rgb(28, 36, 22)` on the nodes above
- Verify: `/contact` cinematic (already Ink) unchanged; InertiaFrame scrim controls that already use Racing Deep remain valid
- Exclude: map SVG/Lummi work (#3); maxWidth 1200 (#2 plan); SoftOrb cleanup; Chartreuse accents

## Validation

- Product: dark surfaces feel like one Arbour system across Notes / Neighbourhoods / Contact
- Interface: Desktop + Tablet + Phone `/notes` and `/neighbourhoods`; scroll hero → directory → method
- System: no new color styles; only Ink + Racing Deep
- Repository: `node scripts/framer/verify.mjs --page /notes` and `--page /neighbourhoods` → ok, no border/token errors; serialize fills show `var(--token-e2f9a9eb-…)` / `var(--token-9d3d6ca5-…)`

## Stop conditions

- Stop if Ink/Racing Deep token IDs differ in the live project from those listed (re-read `framer.getColorStyles()` before applying).
- Stop if a layout template owns these fills and page-local SET would desync chrome.

## Design documentation

- After acceptance: note in `docs/projects/arbour.md` under a short “Dark surfaces” line: cinematic chrome → Ink; editorial forest bands → Racing Deep.
