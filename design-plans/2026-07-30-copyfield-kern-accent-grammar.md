# Accent grammar — idle wash + solid success (no lavender/mint)

Written against: `4aa0cbc`

## Evidence chain

- Surface: `code-components/CopyField.tsx` action squircle colors
- Problem: Lavender → mint → green icon colors are not Kern accent grammar
- Design evidence: `KERN_THUMBNAIL_STYLE.md` accent `#6FD3FF`; Metric Seal owns `#8B9BFF`; `REPORT-copyfield-kern-improve-ui-2026-07-30.md` finding 2
- Owner: `CopyField.tsx` defaults + Color property controls
- Scope and affected surfaces: Idle button wash, icon stroke, success fill, optional success hairline on pill
- Uncertainty: none — lock house cyan for this SKU unless user picks a unique accent later

## Design decision

Idle action button: wash `rgba(111,211,255,0.16)` (`#6FD3FF` @ 16%), icon stroke `#6FD3FF`.  
Success: solid fill `#6FD3FF`, check icon `#060606` (or `#0A0A0B`).  
No lavender. No pastel mint. Buyer `accent` Color control defaults to `#6FD3FF` and drives wash/solid from that hex.

## Reuse

- Accent `#6FD3FF` from Kern thumbnail house
- Exemplar: `Kern_FillingPoint.tsx` default ink/accent cyan; Color controls pattern in `MetricSeal.tsx`

## Changes

1. `code-components/CopyField.tsx`
   - Change: constants `DEFAULT_ACCENT = "#6FD3FF"`; idle wash = accent @ 0.16 alpha; success fill = accent solid; check contrasting dark `#0A0A0B`
   - Preserve: eye / copy / check SVG geometry
   - Verify: panel Accent changes idle wash + success together; no hardcoded lavender/mint hexes in source

2. Property controls
   - Change: `ControlType.Color` `accent` default `#6FD3FF`
   - Preserve: grouped Object pattern if Layout/Motion groups exist
   - Verify: designer can recolor without code edit

## Scope

- Inherit: demo instances on Gold Parsnip
- Exclude: inventing a second “success green” token; toast surface (separate plan)

## Validation

- Product: idle reads cyan wash; copied state is solid cyan check on dark house
- Interface: idle / revealed / copied states
- System: accent matches house cyan unless buyer overrides
- Repository: grep source for lavender/mint hexes → zero matches

## Stop conditions

- Stop if user assigns a unique SKU accent (like Metric indigo) — update default only, keep wash@16% + solid success pattern

## Design documentation

- Record accent default in listing pack Features when written
