# Canvas placeholder parity with configured background tokens

Written against: 4aa0cbc (SoT `state/InertiaGrid.tsx.snapshot` → Framer `InertiaGrid.tsx`)

- **Status**: DONE
- **Project**: `PBghPP85VH1cuE7BNtzx` (InertiaGrid) / `Kern_InertiaGrid`

## Evidence chain

- Surface: Framer canvas preview path (`isCanvas === true`) empty image slots vs published `InertiaCard` placeholders
- Problem: Canvas hardcodes placeholder fill/border; designer-configured `background.placeholderColor` / `placeholderBorder` only affect the non-canvas path — panel lies on canvas
- Design evidence: Property controls `background.placeholderColor` and `background.placeholderBorder` (snapshot ~1076–1124; defaults in `DEFAULT_BACKGROUND` ~193–198). Canvas empty slot (snapshot ~440–449) uses literal `rgba(255, 255, 255, 0.06)` and `1px solid rgba(255, 255, 255, 0.08)`. Preview `placeholderStyle` (snapshot ~692–703) reads `background.placeholderColor` / `placeholderBorder`
- Owner: Shared placeholder styling derived from `background` prop
- Scope and affected surfaces: Canvas empty slots; published placeholders already correct
- Uncertainty: none

## Design decision

One helper (or shared style object) builds placeholder visuals from `background` for **both** canvas and preview. Canvas must not hardcode rgba when controls exist.

## Reuse

- `DEFAULT_BACKGROUND.placeholderColor` / `placeholderBorder`
- Exemplar: `placeholderStyle` construction in `InertiaCard` (snapshot ~692–703) — extract and call from canvas map

## Changes

1. `InertiaGrid.tsx`
   - Change: Extract `getPlaceholderStyle(background, borderRadius)` (or inline the same border string logic) and use it in the canvas `isCanvas` branch empty slots **and** in `InertiaCard`
   - Preserve: Canvas remains static (no physics); image slots with `src` unchanged; transparent mode hiding of placeholder controls unchanged
   - Verify: Change Placeholder Color on canvas → empty cells update immediately

## Scope

- Inherit: All instances
- Verify: solid / gradient / transparent modes; with and without `placeholderBorder`
- Exclude: Motion; minHeight (separate plan); inventing new placeholder props

## Validation

- On canvas: set Placeholder Color to a vivid swatch — empty tiles match
- Published preview matches canvas for empty items
- `node scripts/framer/verify.mjs` exit 0

## Stop conditions

- If `background` is undefined on canvas branch, fall back to `DEFAULT_BACKGROUND` — do not leave hardcoded rgba as the primary path

## Design documentation

- none
