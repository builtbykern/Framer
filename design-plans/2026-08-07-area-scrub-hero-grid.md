# Hero grid — faint optional, off by default

Written against: `4aa0cbc`

## Evidence chain

- Surface: `code-components/AreaScrub.tsx` · Home Stage · evidence `design-plans/_evidence/2026-08-07-area-scrub-phase2-stage.png`
- Problem: Default vertical grid reads as dashboard ChartJS scaffolding, not hero/bento craft.
- Design evidence: Spec Grid lock — “Optional faint vertical lines”; Positioning — win hero/bento, lose if toolkit / dense axes; Lightdash referent uses much quieter guides.
- Owner: `showGrid`, `gridColor`, `gridLines(count)` in `AreaScrub.tsx`
- Scope and affected surfaces: Area Scrub Look defaults · project `iByGdsW6Rb9oE5M2Igua`
- Uncertainty: none for default-off; hairline tuning when grid is on is bounded below

## Design decision

Default the chart to **no grid** (hero/bento). When buyers enable Grid, draw **fewer, thinner** hairlines so it stays “faint,” not a coordinate cage.

Exact targets:

| Prop / const | From | To |
|--------------|------|-----|
| `showGrid` default | `true` | `false` |
| `gridLines(n)` call | `7` | `4` |
| grid `<line>` `strokeWidth` | `1` | `0.6` |
| `gridColor` default | `rgba(15, 23, 42, 0.07)` | `rgba(15, 23, 42, 0.05)` |

## Reuse

- Existing `gridLines` helper and SVG `<line>` map — only args/defaults change
- Spec grid wording as contract

No new primitive.

## Changes

1. `code-components/AreaScrub.tsx`
   - Change:
     - Destructure: `showGrid = false`, `gridColor = "rgba(15, 23, 42, 0.05)"`
     - `const grids = showGrid ? gridLines(4) : []`
     - In grid `<line>`: `strokeWidth={0.6}` (keep `vectorEffect="non-scaling-stroke"`)
     - Property controls: `showGrid.defaultValue: false`; `gridColor.defaultValue` match new rgba
   - Preserve: ability to turn grid on; stroke/fill/peek systems untouched
   - Verify: fresh instance = no grid; Grid on = 4 faint verticals

2. Push
   - `node scripts/framer/push-areascrub.mjs` · typecheck empty · `verify.mjs`

## Scope

- Inherit: all instances after push (existing instances may keep prior control values until reset)
- Verify: Home Stage
- Exclude: axes/ticks/labels; horizontal grid; phase 3 motion

## Validation

- Product: Default read = clean area, not dashboard
- Interface: Grid off (default) / Grid on hairlines
- System: Single grid path
- Repository: push → `typeErrors: []`; verify → `ok: true`

## Stop conditions

- Stop if buyer explicitly needs denser grid as product default — do not re-default on without updating the Area Scrub spec Grid lock.

## Design documentation

- After acceptance: update spec Look/Grid row to “default off; ≤4 hairlines when on” in `docs/superpowers/specs/2026-08-07-area-scrub-design.md`
