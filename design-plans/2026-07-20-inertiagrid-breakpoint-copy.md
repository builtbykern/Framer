# Align InertiaGrid layout control copy with breakpoint runtime

Written against: 4aa0cbc (SoT `state/InertiaGrid.tsx.snapshot` → Framer `InertiaGrid.tsx`)

- **Status**: DONE
- **Project**: `PBghPP85VH1cuE7BNtzx` (InertiaGrid) / `Kern_InertiaGrid`

## Evidence chain

- Surface: Framer property panel — Layout object descriptions for columns / gaps / sizes
- Problem: Copy claims desktop is “1440px+” and tablet “810–1200px”, but runtime uses `breakpointMobile` / `breakpointTablet` only
- Design evidence:
  - Runtime (snapshot ~288–297): `isMobile = windowWidth <= responsive.breakpointMobile` (default 390); `isTablet = !isMobile && windowWidth <= responsive.breakpointTablet` (default 810); else desktop
  - Controls (snapshot ~924–949): Columns Desktop description “desktop (1440px+)”; Tablet “tablet (810-1200px)”; Mobile “mobile (<810px)” — mobile copy also wrong vs default mobile breakpoint 390
- Owner: `addPropertyControls` → `layout` descriptions (and any matching gap/size descriptions that cite the same wrong ranges)
- Scope and affected surfaces: Designer-facing panel copy only
- Uncertainty: none for the contradiction; exact wording should mirror the Responsive controls’ titles

## Design decision

Rewrite layout descriptions to reference the **Responsive** breakpoint controls by name and inequality, not hardcoded 1440/1200 myths.

Exact target strings:

| Control | New `description` |
| --- | --- |
| `columns` | `Number of columns when width is above the Tablet breakpoint` |
| `columnsTablet` | `Number of columns when width is above Mobile and at or below the Tablet breakpoint` |
| `columnsMobile` | `Number of columns when width is at or below the Mobile breakpoint` |
| `gap` | `Gap when width is above the Tablet breakpoint` |
| `gapTablet` | `Gap when width is above Mobile and at or below the Tablet breakpoint` |
| `gapMobile` | `Gap when width is at or below the Mobile breakpoint` |
| `itemSize` | `Item size when width is above the Tablet breakpoint` |
| `itemSizeTablet` | `Item size when width is above Mobile and at or below the Tablet breakpoint` |
| `itemSizeMobile` | `Item size when width is at or below the Mobile breakpoint` |

Do **not** change default numeric values or breakpoint defaults (810 / 390) in this plan.

Titles may stay `Columns (Desktop)` / `(Tablet)` / `(Mobile)` — only descriptions are required.

## Reuse

- Existing `responsive.breakpointTablet` / `breakpointMobile` controls as the named source of truth
- Exemplar: Responsive section descriptions already say “Maximum width for tablet/mobile layout” (snapshot ~1137–1156)

## Changes

1. `InertiaGrid.tsx` — `addPropertyControls` → `layout.controls` descriptions listed above
   - Change: Replace contradictory px ranges
   - Preserve: option titles, mins/maxes, defaults, runtime logic
   - Verify: Panel copy matches behavior when dragging frame width across 390 and 810

## Scope

- Inherit: Panel for all instances
- Verify: No runtime layout change (copy-only)
- Exclude: Renaming Desktop/Tablet/Mobile title taxonomy; motion plans; breakpoint default value changes

## Validation

- Read panel copy vs resize behavior once
- `verify.mjs` exit 0 (controls still parse)

## Stop conditions

- Do not “fix” copy by changing breakpoints to 1440 — copy follows code, not the reverse

## Design documentation

- none
