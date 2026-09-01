# Soft Lightdash stroke and fill defaults

Written against: `4aa0cbc`

## Evidence chain

- Surface: `code-components/AreaScrub.tsx` Look defaults · Stage evidence PNG vs Lightdash referent frames
- Problem: Stroke/fill defaults read neon SaaS / ChartJS-loud, not Lightdash-clean soft area.
- Design evidence: Spec referent “Lightdash-clean”; Fill lock = vertical gradient stroke→transparent (keep structure, soften optics); rendered Stage shows heavier purple mass than referent.
- Owner: `strokeWidth`, `fillOpacity`, gradient mid-stop in `AreaScrub.tsx`
- Scope and affected surfaces: Area Scrub Look defaults · `codeFile/xRz37eJ`
- Uncertainty: exact referent hex not re-sampled — **do not change** `stroke` default `#7C3AED` (locked brand of referent family); only weight/opacity/falloff

## Design decision

Keep purple + 3-stop gradient (product exception to baseline-ui). Soften optical weight:

| Token | From | To |
|-------|------|-----|
| `strokeWidth` default | `2.25` | `1.6` |
| `fillOpacity` default | `0.28` | `0.16` |
| Mid-stop opacity | `fillOpacity * 0.4` | `fillOpacity * 0.28` |
| Mid-stop offset | `55%` | `42%` |

Property control `defaultValue`s must match destructuring defaults.

Why: Matches Lightdash soft under-line wash without inventing glow, grain, or glass (spec out of v1).

## Reuse

- Existing `<linearGradient>` three stops — adjust numbers only
- Stroke color `#7C3AED` unchanged
- Spec fill lock

No new primitive.

## Changes

1. `code-components/AreaScrub.tsx`
   - Change:
     - Destructure: `strokeWidth = 1.6`, `fillOpacity = 0.16`
     - `const midFill = Math.min(1, fillOpacity * 0.28)`
     - Mid `<stop offset="42%" … stopOpacity={midFill} />`
     - Controls: `strokeWidth.defaultValue: 1.6` (step can stay `0.25`); `fillOpacity.defaultValue: 0.16`
   - Preserve: gradient id pattern, path builders, peek/grid systems, stroke color default
   - Verify: Stage/Preview area is quieter; line still readable at ~240–280px height

2. Push
   - `node scripts/framer/push-areascrub.mjs` · typecheck · `verify.mjs`
   - Optional: re-screenshot Stage to `design-plans/_evidence/` for before/after

## Scope

- Inherit: new defaults on push (existing instances may retain old control values)
- Verify: Home Stage Area Scrub
- Exclude: glow/beacon shadow changes; color hex change; phase 3 motion

## Validation

- Product: Soft Lightdash-like area at a glance
- Interface: Default Look; buyer can still raise opacity/width in panel
- System: Still one gradient fill — no second fill layer
- Repository: push → `typeErrors: []`; verify → `ok: true`

## Stop conditions

- Stop if softening makes the stroke disappear on light backgrounds at intrinsic 360×200 — bump floor to `strokeWidth: 1.75` / `fillOpacity: 0.18` only, do not reintroduce 2.25 / 0.28.

## Design documentation

- After acceptance: record Look defaults in spec property table (`strokeWidth` 1.6, `fillOpacity` 0.16) in `docs/superpowers/specs/2026-08-07-area-scrub-design.md`
