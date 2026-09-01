# Demo + component defaults match Kern dark house

Written against: `4aa0cbc`

## Evidence chain

- Surface: Gold Parsnip (`fGqO95KLAs2bClhRoOW1`) — future `/` + `/thumbnail` + `code-components/CopyField.tsx` defaults
- Problem: A light-gray stage with white pill fights Kern Marketplace house `#060606`
- Design evidence: `docs/projects/listings/KERN_THUMBNAIL_STYLE.md`; `design-plans/2026-07-21-fillingpoint-demo-kern-house.md`; `design-plans/REPORT-copyfield-kern-improve-ui-2026-07-30.md` finding 1
- Owner: New `CopyField.tsx` color defaults + demo page fills (when created)
- Scope and affected surfaces: Component default `stage`/`pill` colors; Home Desktop fill; `/thumbnail` base
- Uncertainty: Exact pill elevation (near-white vs dark elevated) — **lock near-white pill** `#F4F4F5` on `#060606` for max digit contrast

## Design decision

Author Copy Field on Kern dark ground. Component root does not paint the page; demo pages use `#060606`. Pill default fill `#F4F4F5`, text `#0A0A0B`, soft shadow `0 8px 28px rgba(0,0,0,0.35)`. Caption muted `rgba(180,185,195,0.5)`.

## Reuse

- House `#060606`, muted caption from `KERN_THUMBNAIL_STYLE.md`
- Exemplar: Filling Point demo-kern-house plan + Metric Seal elevate ground

## Changes

1. `code-components/CopyField.tsx` (create or update defaults)
   - Change: default pill `backgroundColor: "#F4F4F5"`; `color: "#0A0A0B"`; `boxShadow: "0 8px 28px rgba(0,0,0,0.35)"`; no page-fill on component root (`position: relative` only)
   - Preserve: interaction contract (reveal → copy → toast)
   - Verify: on `#060606` canvas the pill reads elevated; digits are dark-on-light

2. Demo `/` Desktop (when page exists)
   - Change: page/frame fill `#060606`; caption `rgba(180,185,195,0.5)`
   - Preserve: component instance centered
   - Verify: screenshot reads as Kern dark pack

3. `/thumbnail` (when created)
   - Change: base `#060606` + dark liquid-gradient recipe per `KERN_THUMBNAIL_STYLE.md`
   - Preserve: 1600×1200 / 4:3
   - Verify: thumb house matches other Kern listings

## Scope

- Inherit: all future Copy Field instances
- Verify: Gold Parsnip Home + thumbnail
- Exclude: Arbour / other projects; light-pastel stage defaults

## Validation

- Product: pill readable on dark; house matches Kinetic Grid / Metric Seal thumbs
- Interface: `/`, `/thumbnail`, canvas with dark page fill
- System: no parallel light-gray stage default
- Repository: `node scripts/framer/verify.mjs` → non-blocking

## Stop conditions

- Stop if project is no longer Gold Parsnip — re-pin session before apply
- Stop if pill `#F4F4F5` fails contrast on chosen ground — escalate before inventing a third surface

## Design documentation

- After acceptance: record defaults in `docs/projects/listings/Kern_CopyField.md` (when listing pack is written)
