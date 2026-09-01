# Bind Directory Panel fill to Paper color style

Written against: unavailable (no git HEAD)

## Evidence chain

- Surface: `/neighbourhoods` Directory Panel `q3QLrEX8k`
- Problem: Panel fill is raw `rgb(252, 250, 244)` instead of `/Arbour/Paper`, so cream drifts from tokenized Paper consumers.
- Design evidence: Color style Paper `d5b3c09d-0364-4ed0-8804-e56957faa275` → `rgb(252, 250, 244)`. Dark bands already use Ink/Racing Deep tokens (plan executed 2026-07-15).
- Owner: `/Arbour/Paper`; frame `q3QLrEX8k`
- Scope: `q3QLrEX8k` + tablet/phone replicas if they override fill
- Uncertainty: none on token id; confirm replicas after SET

## Design decision

Set Directory Panel `fill` to `var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)` (Paper). Keep maxWidth 1200, padding, **borderRadius 0**, checkerboard children unchanged.

## Reuse

- `/Arbour/Paper` → `var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)`
- Exemplar: Notes Journal / other Paper token fills in project

## Changes

1. `/neighbourhoods` · `q3QLrEX8k`
   - Change: `fill="var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)"`
   - Preserve: `maxWidth="1200px"`, `padding`, `borderRadius="0px"`, children
   - Verify: serialize fill is Paper token

2. Replicas `aJLpuUP0qq3QLrEX8k`, `Qonafp_oDq3QLrEX8k`
   - Change: same Paper token if local fill override exists
   - Preserve: breakpoint padding differences
   - Verify: no raw Paper RGB left on panel

## Scope

- Inherit: directory panel only
- Exclude: info/photo card fills; map replacement; dark tokens (done)

## Validation

- Product: cream panel tracks Paper style updates site-wide
- Interface: Desktop/Tablet/Phone `/neighbourhoods`
- Repository: `node scripts/framer/verify.mjs --page /neighbourhoods` → ok; serialize Paper token on panel

## Stop conditions

- Stop if Paper token id differs live (`framer.getColorStyles()` name Paper).

## Design documentation

- After acceptance: note Paper for directory panels in `docs/projects/arbour.md` with Ink/Racing Deep dark rules.
