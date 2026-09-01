# Align PropertyCard typography to Arbour Meta + Price

Written against: unavailable (Framer project `CmRyHJKPrPE6BZhC6d4S`, code file `Arbour_PropertyCard.tsx` / `codeFile/I2raC3I`)

**Status**: DONE — applied 2026-07-16 via Framer session 1

## Evidence chain

- Surface: `/properties-2` — live listing cards (`Arbour_PropertyCard` instances `WVombBjcj`, `LY7Xl0038`, `wfrBfUhOA`, `ZnSLoFoz2`, `ymLH5EXzH`, `FLn5Uk9as` and breakpoint replicas)
- Problem: Cards render BBH Bartle + PP Editorial New instead of the Arbour type system used by the rest of the site and by the previous Frame-based cards
- Design evidence:
  - Text styles: `Arbour/Meta` → Space Mono 11px, letterSpacing `0.12em`, lineHeight `1.5em`
  - Text styles: `Arbour/Price` → Fraunces 24px, letterSpacing `-0.02em`, lineHeight `1.2em`
  - Legacy listing nodes (hidden): `xdyqPewkZ` / `tYC5LtoAQ` / `RZSs4jqEK` → `textStylePreset: Arbour/Meta`; `ZazQNyfnk` → `Arbour/Price`
- Owner: Framer code file `Arbour_PropertyCard.tsx` (`codeFile/I2raC3I:default`)
- Scope and affected surfaces: `/properties-2` all breakpoints (desktop / tablet / phone)
- Uncertainty: none — style values and legacy presets are confirmed via `framer.getTextStyles()` and node attributes

## Design decision

Replace hardcoded BBH Bartle / PP Editorial stacks in `Arbour_PropertyCard` with Space Mono for meta rows and Fraunces for price, matching `Arbour/Meta` and `Arbour/Price`. Keep ink/meta/accent color props. Do not invent a new text style.

## Reuse

- `Arbour/Meta` (Space Mono 11px / 0.12em / 1.5em)
- `Arbour/Price` (Fraunces 24px / −0.02em / 1.2em)
- Exemplar: previous Frame card bindings on `/properties-2` (`xdyqPewkZ`, `ZazQNyfnk`)

## Changes

1. Framer code file `Arbour_PropertyCard.tsx`
   - Change: Update inline `fontFamily` / `fontSize` / `letterSpacing` / `lineHeight` / `textTransform` as follows:
     - Pill labels `( RESIDENCE )` + `VIEW` (on image): Space Mono, **11px**, letterSpacing **0.12em**, uppercase, lineHeight **1.5em**
     - Title row (title + trailing VIEW): Space Mono, **11px**, letterSpacing **0.12em**, uppercase, lineHeight **1.5em**
     - Price: Fraunces, **24px**, letterSpacing **−0.02em**, lineHeight **1.2em**, normal case (no forced uppercase)
     - Location + area: Space Mono, **11px**, letterSpacing **0.12em**, uppercase, lineHeight **1.5em**, color from `meta` prop
   - Font stacks to use (match site loading):
     - Meta: `"Space Mono", ui-monospace, monospace`
     - Price: `"Fraunces", "Times New Roman", serif`
   - Preserve: layout structure, gaps, colors (`ink` / `meta` / `accent`), image height control, CMS control bindings, reduced-motion hover logic (separate motion plans)
   - Verify: canvas + published `/properties-2` cards read as Space Mono meta + Fraunces price; no BBH Bartle / PP Editorial in computed styles on card text

## Scope

- Inherit: all six Property Card instances and their Tablet/Phone replicas (they share the code file)
- Verify: `/properties-2` Desktop 1200 / Tablet 810 / Phone 390
- Exclude: `Arbour_ArticleCard`, Neighbourhoods cards, detail page `/properties-2/:Properties`, unused legacy Frame cards

## Validation

- Product: browse residences — titles/prices/locations look on-brand with Home/Notes meta + price language
- Interface: all six cards; long titles wrapping; price strings with £; phone width
- System: no new text style created; values match existing presets
- Repository: after `CodeFile.setFileContent` + `typecheck({ strict: true })` → `[]` errors; `node scripts/framer/verify.mjs --page /properties-2` → ok

## Stop conditions

- Stop if Framer project fonts no longer include Space Mono or Fraunces
- Stop if PropertyCard was replaced by another component on the grid
- Stop if scope expands to redesigning card layout / pill chrome

## Design documentation

- After acceptance: none required (conformance to existing styles, not a new decision)
