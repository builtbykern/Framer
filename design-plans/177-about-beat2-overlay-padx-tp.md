# About Beat 2 — restore T/P overlay side inset (40 / 16)

Written against: `4aa0cbc`

## Evidence chain

- Surface: `/about` → Beat 2 — Cinematic Image → *Image Editorial Overlay* (`WZkTO3vdm` + replicas)
- Problem: Tablet/Phone overlay uses `padding-x: 0` on a `100%` column, so EditorialReveal + meta strip sit flush to the viewport while sibling About sections inset 40/16
- Design evidence: `docs/projects/arbour.md` — Tablet/Phone content **100%** with side pads **≈40 / ≈16**; exemplars on same page `m1IuCE2Ht` / `Te9LPe3Or` (T `… 40px …`, P `… 16px …`)
- Owner: `WZkTO3vdm` (Desktop), `xvqDXw58eWZkTO3vdm` (Tablet), `CYNrpU04tWZkTO3vdm` (Phone)
- Scope and affected surfaces: `/about` Beat 2 only (D already `width/maxWidth 90%` with pad X 0 — leave Desktop X policy alone)
- Uncertainty: none for X inset values; Y values coordinated in plan `178`

## Design decision

Apply brand side inset on the Beat 2 overlay for Tablet and Phone so the dark cinematic band stays full-bleed while type and meta share the same content edge as the rest of About.

## Reuse

- Pad X canon from `docs/projects/arbour.md`
- Exemplar: `/about` `m1IuCE2Ht` Tablet/Phone padding

## Changes

1. `xvqDXw58eWZkTO3vdm` (Tablet overlay)
   - Change: set horizontal padding to **40px** (preserve whatever padY plan `178` sets; if executing alone, interim `72px 40px 24px 40px` then let 178 symmetrize Y)
   - Preserve: `width/maxWidth 100%`, `height 100%`, gap, children order, Racing/Ink section fill on parent
   - Verify: meta `( 02 )` and ScrollCue no longer flush to viewport left/right at 810

2. `CYNrpU04tWZkTO3vdm` (Phone overlay)
   - Change: set horizontal padding to **16px** (interim Y ok until 178)
   - Preserve: stack structure, EditorialReveal instance, meta strip
   - Verify: 390 viewport — content edge aligns with About sections below

## Scope

- Inherit: only Beat 2 T/P overlay
- Verify: Beat 2 Desktop `WZkTO3vdm` still `90%` + pad X 0
- Exclude: EditorialReveal / ScrollCue internals; other About beats; code components

## Validation

- Product: About scroll — Beat 2 reads as full-bleed Ink stage with inset dossier type
- Interface: Tablet 810, Phone 390; check kicker/headline/meta clearance from screen edges
- System: matches T/P pad X used on `m1IuCE2Ht` / Continue-class sections
- Repository: `node scripts/framer/session.mjs` → serialize overlay pads → expect T `… 40px …`, P `… 16px …`; `node scripts/framer/verify.mjs` → ready

## Stop conditions

- Stop if product decides Beat 2 overlay is an explicit full-bleed edge-to-edge exception (document in `arbour.md` instead of applying pad X)

## Design documentation

- After acceptance: none required (already canon); optional note under About that Beat 2 overlay inherits T/P pad X
