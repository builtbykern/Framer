# TerritoryRail trim property controls (bake craft)

Written against: `4aa0cbc`  
Audit: `template-plans/REPORT-territoryrail-audit-2026-08-11.md` finding **#2**  
Status: DONE  
Depends on: stage-fill + desktop-strip-craft (bake values before deleting knobs)

## Evidence chain

- Surface: Framer property panel for `Arbour_TerritoryRail`
- Problem: ~48 leaf controls across Mobile / Items / Content / Layout (~15) / Typography / Atmosphere (7) / Colors (7) / Motion (4). Skill: “Keep controls focused — hardcode the rest.” Control `defaultValue`s drift from `LAYOUT_DEFAULTS` / `MOTION_DEFAULTS` / `ATMOSPHERE_DEFAULTS` (e.g. stripWidth UI **100** vs code **160**; stripPosition **center** vs **bottom**; interval UI **6** vs code **10**; springs UI **60/20** vs **90/22**).
- Design evidence: `framer-code-components` property-control guide; Arbour Marketplace craft
- Owner: `addPropertyControls(...)` block ~2020–2480 in dump
- Uncertainty: whether any remix instance relies on Rail mode — keep Rail code path but hide Mode control unless a live instance uses `variant: "rail"` (default is slide)

## Design decision

Public controls = content + brand + pacing only. Bake layout strip geometry, atmosphere stack, and spring physics. Align every surviving control `defaultValue` with the const defaults used at runtime.

## Reuse

- Keep: `items`, Content (`itemLimit`, `linkBase`, `viewLabel`, `ariaLabel`), Typography fonts + title caps, Colors (title/meta/accent/stage/scrim), Motion `slideInterval` + `pauseOnHover` only
- Bake (remove from panel, keep as consts): Atmosphere entire Object; Layout strip* / imagePadding / textAlign / contentPadding / contentPosition / topBandAlign / showEditorialIndex / showViewLink / imageRatio (slide) / cardWidth if rail hidden; Motion `springStiffness` / `springDamping`
- Mobile: keep `mobileLayoutOverride` if still needed; otherwise bake `"inherit"`

## Changes

1. Update `LAYOUT_DEFAULTS` / `ATMOSPHERE_DEFAULTS` / `MOTION_DEFAULTS` / `TYPOGRAPHY_DEFAULTS` so runtime consts match intended craft (strip from desktop-strip-craft plan; atmosphere: grain on, vignette off, frame on, blurs on, blurStrength 10, grainOpacity 0.33 per current `ATMOSPHERE_DEFAULTS`).
2. In `addPropertyControls`:
   - Remove or do not register Atmosphere Object entirely — always use baked `ATMOSPHERE_DEFAULTS`.
   - Slim Layout Object to nothing public OR only `variant` if Rail must stay; prefer hardcoding `variant: "slide"`.
   - Motion Object: only `slideInterval` (default **10**) and `pauseOnHover` (default **true**). Remove stiffness/damping controls (values baked — see `animation-plans/094-territoryrail-bake-spring.md`).
   - Typography control `defaultValue`s must match `TYPOGRAPHY_DEFAULTS` (Space Mono title defaults in const, not Fraunces-only panel drift).
   - Every remaining control: `defaultValue` === corresponding `*_DEFAULTS` field.
3. Component still accepts optional props with `?? DEFAULTS` so old instance overrides do not crash — ignored extras OK.
4. Preserve: Items array + CMS-friendly fields; Colors; static renderer behavior.

## Scope

- Inherit: property panel + defaults for TerritoryRail
- Exclude: rewriting CMS collections; deleting RailStage function body (can remain dead code one release); site chrome

## Validation

- Product: New drop of component shows strip + atmosphere without opening Layout/Atmosphere
- Interface: Panel leaf count clearly reduced (target ≤ ~20 including item fields)
- Repository: push + `node scripts/framer/verify.mjs`
- Confirm Home instance still renders (Object props may still be stored on instance but unused)

## Stop conditions

- Stop if deleting a control breaks Framer project load — then `hidden: () => true` first, ship, delete later
- Stop if a published Marketplace listing documents Atmosphere knobs as a feature (Arbour template — bake anyway unless user objects)

## Design documentation

- Comment at top of defaults: “Public controls: Items, Content, Typography, Colors, Autoplay. Layout/Atmosphere/springs baked.”
