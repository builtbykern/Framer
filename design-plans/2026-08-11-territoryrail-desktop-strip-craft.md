# TerritoryRail desktop strip craft (compact, readable)

Written against: `4aa0cbc`  
Audit: `template-plans/REPORT-territoryrail-audit-2026-08-11.md` finding **#3**  
Status: DONE  
Depends on: `2026-08-11-territoryrail-stage-fill-frame.md` (strip must be visible first)

## Evidence chain

- Surface: TerritoryRail Slide desktop/tablet strip (`role="tablist"`)
- Problem: Once unclipped, defaults `stripWidth: 160`, `stripHeight: 240`, `stripLift: 26`, `stripGap: 0`, inactive opacity `0.4` read as a heavy filmstrip over a quiet estate hero — opposite of accepted mobile `MOBILE_THUMB` (72×96, gap 8, lift 0)
- Design evidence: User accepted mobile; Arbour “never theatre”
- Owner: `LAYOUT_DEFAULTS` + strip `motion.div` in `.tmp/Arbour_TerritoryRail_live.tsx`
- Uncertainty: exact px within band below — pick the stated recipe; feel-check once

## Design decision

Bake a desktop strip recipe closer to mobile discipline: smaller thumbs, modest lift, real gap, higher inactive opacity, always bottom. Hardcode in `LAYOUT_DEFAULTS` / a `DESKTOP_STRIP` const — do not leave sliders (removal is the trim-controls plan).

## Reuse

- `MOBILE_THUMB` — do not change
- Pattern: constants object next to `MOBILE_THUMB`

## Changes

1. In `.tmp/Arbour_TerritoryRail_live.tsx`, set desktop strip constants:

```ts
// TARGET — bake into LAYOUT_DEFAULTS (and any DESKTOP_STRIP helper)
stripWidth: 104,
stripHeight: 140,
stripLift: 10,
stripInactiveOpacity: 0.72,
stripGap: 10,
stripPosition: "bottom",
```

   - Preserve: `resolveStripPlacement` for bottom; edge mask on desktop strip row OK
   - Soften active chrome: active `scale` **1.02** (not 1.04); inactive **1**; keep lift via `y: -stripLift` only when not compact
   - Active shadow: reduce to roughly `0 12px 28px rgba(10, 22, 15, 0.28)` (or none if still theatrical) — quieter than current `0 22px 44px …0.36`
   - Verify: four thumbs readable at bottom of stage on Desktop 1200 and Tablet 810 without covering title band

## Scope

- Inherit: Slide desktop/tablet only
- Exclude: mobile `MOBILE_THUMB`; Rail mode; motion duration plans (separate)

## Validation

- Product: Strip feels like a quiet selector, not a second hero
- Interface: Desktop + Tablet; Phone unchanged
- Repository: push + `node scripts/framer/verify.mjs`

## Stop conditions

- Stop if Home instance was intentionally using huge strip as brand — confirm with user before reverting sizes

## Design documentation

- Record baked `DESKTOP_STRIP` values next to `MOBILE_THUMB` in code comment
