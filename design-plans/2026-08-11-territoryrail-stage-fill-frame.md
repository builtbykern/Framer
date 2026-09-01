# TerritoryRail Slide stage fills Framer frame (desktop strip visible)

Written against: `4aa0cbc`  
Audit: `template-plans/REPORT-territoryrail-audit-2026-08-11.md` finding **#1**  
Status: DONE

## Evidence chain

- Surface: Arbour Home → `Arbour_TerritoryRail` Slide stage (live `codeFile/il4DSn9`; dump `.tmp/Arbour_TerritoryRail_live.tsx`)
- Problem: At desktop ~1920, instance is `1628×648` but stage uses `aspectRatio: imageRatio` (default **1.74**) → intrinsic height ≈935px. Bottom strip tabs measure `top≈911` with `vis: false` — entirely below the frame. Mobile OK (narrower width → shorter stage ≤ frame).
- Design evidence: User: mobile path is correct; desktop/tablet strip must remain navigable. `LAYOUT_DEFAULTS.stripPosition: "bottom"`.
- Owner: `SlideStage` root styles in `.tmp/Arbour_TerritoryRail_live.tsx` (~1136–1144) and outer wrapper (~1940+)
- Scope: TerritoryRail code file only (push to Framer `il4DSn9`)
- Uncertainty: none for clip cause; confirm Home instance height after fix still looks editorial

## Design decision

Drive Slide stage size from the Framer instance box (`width/height: 100%`), not from `aspectRatio`. Keep strip absolutely positioned inside that box. Framer layout (Desktop/Tablet instance height) owns proportion; do not invent a fourth breakpoint.

## Reuse

- Mobile already ignores desktop strip geometry via `MOBILE_THUMB` — preserve
- Exemplar: mobile compact path forces strip `bottom` and fits inside stage

## Changes

1. `.tmp/Arbour_TerritoryRail_live.tsx` → push as project code file `Arbour_TerritoryRail` / `il4DSn9`
   - Change: In `SlideStage`, replace stage root sizing:

```tsx
// CURRENT (~1136–1144)
style={{
    position: "relative",
    width: "100%",
    aspectRatio: imageRatio,
    overflow: "hidden",
    backgroundColor: colors.stageBackground,
}}
```

```tsx
// TARGET
style={{
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
    backgroundColor: colors.stageBackground,
}}
```

   - Ensure the component root / slide branch wrapper also uses `height: "100%"` (and `minHeight: 0`) so the stage can fill the Framer frame. Do **not** leave a lone child with `aspectRatio` that re-expands past the instance.
   - Preserve: `overflow: "hidden"`, atmosphere overlays, absolute strip, top-band chrome, `useIsStaticRenderer` freeze-in-place (same tree).
   - `imageRatio` may remain in types for Rail mode / legacy; it must **not** set Slide stage height. Demotion of the control itself is plan `2026-08-11-territoryrail-trim-controls.md`.
   - Verify: Desktop Home @ ≥1200px — all `[role=tab]` rects intersect the component root (`vis: true`). Strip fully visible; no clip of thumb bottoms.

2. Optional canvas empty state: `CanvasPlaceholder` may keep its own `aspectRatio` (no strip). Do not change unless it breaks canvas drop size.

## Scope

- Inherit: every TerritoryRail Slide instance (Home primary)
- Verify: Tablet 810 — strip still visible; Phone compact thumbs unchanged
- Exclude: Rail mode card layout; Nav/Footer; CMS item data; publishing without user OK

## Validation

- Product: On Home desktop, switch territories via strip thumbs without scrolling the stage
- Interface: Desktop 1200/1440/1920; Tablet 810; Phone 390 (no regression)
- System: No parallel “mock” static tree; static renderer still same layout frozen
- Repository: After push — `node scripts/framer/verify.mjs` → no blocking review errors. CDP check: tabs `vis: true` inside root

## Stop conditions

- Stop if Framer instance height is `auto`/hug and collapsing to 0 after removing aspectRatio — then set `@framerIntrinsicHeight` / document required fixed height on instances instead of inventing aspectRatio again
- Stop if scope expands to redesign Home section chrome

## Design documentation

- After acceptance: note in `docs/projects/` or session memory: TerritoryRail Slide fills instance; ratio is not a stage driver
