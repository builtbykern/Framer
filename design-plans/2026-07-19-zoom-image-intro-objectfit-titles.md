# Title-case Object Fit control labels

Written against: unavailable

**Status**: DONE (2026-07-19) — `optionTitles: ["Cover", "Contain", "Fill"]` pushed with 005–008.

## Evidence chain

- Surface: Zoom Image Intro property controls (`code-components/ZoomImageIntro.tsx` → Framer `aNCXc66`)
- Problem: Object Fit segmented labels are lowercase while sibling enums in the same panel use Title Case
- Design evidence: Same file — `paceCurve.optionTitles: ["Even", "Accelerate", "Decelerate", "Pulse"]`, `zoomDirection.optionTitles: ["Out (larger)", "In (smaller)"]` vs `objectFit.optionTitles: ["cover", "contain", "fill"]`
- Owner: `addPropertyControls(ZoomImageIntro, { objectFit })`
- Scope and affected surfaces: Property panel only; runtime `objectFit` values stay `"cover" | "contain" | "fill"`
- Uncertainty: none

## Design decision

Align Object Fit `optionTitles` to Title Case (`Cover`, `Contain`, `Fill`) so the Marketplace control panel reads as one coherent product chrome. Keep `options` lowercase for CSS `object-fit`.

## Reuse

- Existing Enum + `displaySegmentedControl: true` pattern on `zoomDirection` / `objectFit`
- Exemplar: `zoomDirection` optionTitles in the same `addPropertyControls` block

## Changes

1. `code-components/ZoomImageIntro.tsx` (`objectFit` control)
   - Change: `optionTitles: ["Cover", "Contain", "Fill"]`
   - Preserve: `options: ["cover", "contain", "fill"]`, default `"cover"`, runtime `String(objectFitProp).toLowerCase()`
   - Verify: Panel shows Title Case; canvas/runtime object-fit unchanged

2. Push to Framer code file `aNCXc66` via harness; `typecheck({ strict: true })`

## Scope

- Inherit: all instances of Zoom Image Intro
- Verify: demo instance still covers correctly
- Exclude: motion timing, listing copy, thumbnail assets

## Validation

- Product: Buyer opens controls → Object Fit labels match Title Case of Pace / Zoom Direction
- Interface: Desktop property panel segmented control
- System: No new control type; no parallel naming scheme
- Repository: `typecheck({ strict: true })` → 0 errors

## Stop conditions

- Stop if Framer Enum begins requiring titles === values (then document and keep lowercase values only).

## Design documentation

- After acceptance: optional one-liner in `docs/projects/zoom-image-intro.md` — “Property enum titles use Title Case; values stay CSS/lowercase.”
