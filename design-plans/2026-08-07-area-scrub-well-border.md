# Area Scrub Home — Product Well hairline border

Written against: `4aa0cbc`

## Evidence chain

- Surface: Home `/` Product Well built by `scripts/framer/areascrub-home.mjs` on project `iByGdsW6Rb9oE5M2Igua`
- Problem: Well uses `borderColor="rgba(255,255,255,0.08)"` on fill `#FAFAF9` — hairline disappears; card does not read against Kern ink stage
- Design evidence: Lightdash / Kern light wells use a soft **dark** hairline (e.g. `rgba(15,23,42,0.08)`), not white-on-cream; Area Scrub Home is light well on `#060606`
- Owner: `scripts/framer/areascrub-home.mjs` Product Well `SET` line
- Scope and affected surfaces: Home Product Well only (re-run home script or SET existing well id)
- Uncertainty: none — color swap is deterministic

## Design decision

Change Product Well border to ink hairline so the chart card reads clearly on the Kern atmosphere without adding shadow/glow.

## Reuse

- Existing well frame in `areascrub-home.mjs`
- Same border width `1px` / `solid`
- Exemplar: prior Lightdash referent card border (light gray on white)

## Changes

1. `scripts/framer/areascrub-home.mjs`
   - Change: on Product Well `SET`, replace  
     `borderColor="rgba(255,255,255,0.08)"`  
     with  
     `borderColor="rgba(15,23,42,0.08)"`
   - Preserve: fill `#FAFAF9`, radius `22px`, size, chart inset, atmosphere stack
   - Verify: after `node scripts/framer/areascrub-home.mjs`, well edge visible on Desktop screenshot

2. Optional one-shot if not rebuilding Home:
   - `SET <wellId> borderColor="rgba(15,23,42,0.08)"` on page `/`  
   - Discover well via name `"Product Well"` under Desktop

## Scope

- Inherit: future Home rebuilds from script
- Verify: Home Desktop only
- Exclude: `AreaScrub.tsx`; thumbnail page (not created yet); bloom/veil colors

## Validation

- Product: Chart well reads as a defined card on ink stage
- Interface: Desktop first viewport
- System: No component API change
- Repository: `node scripts/framer/areascrub-home.mjs` (session pinned to Area Scrub); `node scripts/framer/verify.mjs` → ok

## Stop conditions

- Stop if Product Well was intentionally borderless — then confirm with user before forcing a border

## Design documentation

- None required beyond script
