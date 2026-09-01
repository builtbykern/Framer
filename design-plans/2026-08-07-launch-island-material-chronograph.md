# Launch Island — material chronograph digit wells

Written against: `4aa0cbc`

## Evidence chain

- Surface: Expanded mode chronograph inside `code-components/LaunchIsland.tsx` (`Unit` + colon row)
- Problem: Expanded time zoom is flat typography (padded spans + CSS `:`) so it fails the accepted “material chronograph digits” craft bar and undercuts SOTD / BuiltByKern feel
- Design evidence: `docs/superpowers/specs/2026-08-07-launch-island-design.md` craft bar — “Material chronograph digits in expanded”; material language exemplar `HoldConfirm.tsx` inset rim + edge sheen (not bare text). Runtime: `Unit` ~127–178 plain `fontSize: 24`; expanded block ~365–396 uses `Colon` separators; seconds use `foreground={accent}` making seconds the loudest unit
- Owner: `LaunchIsland.tsx` expanded content only
- Scope and affected surfaces: Expanded detent UI only (compact/transient/live labels unchanged)
- Uncertainty: exact well radius/padding — derive from shell padding already used (`14px 20px`); do not invent a new radius token beyond local constants

## Design decision

Replace the colon-separated span row with **four equal digit wells**: inset filled cells, hairline dividers between wells (not typographic colons), tabular lining figures, shared foreground for all four units. Reserve accent for status (live/transient dots), not for “seconds scream.”

## Reuse

- Inset material — `HoldConfirm.tsx` inset highlight pattern
- Accent `#6FD3FF` — status only (existing compact/live dots)
- Tabular nums — keep `fontVariantNumeric: "tabular-nums"`
- Exemplar: HoldConfirm material chrome; do not copy Morph goo

No shared package primitive — local `DigitWell` (or refactor `Unit`) inside `LaunchIsland.tsx`.

## Changes

1. `code-components/LaunchIsland.tsx`
   - Change:
     - Remove `Colon` usage from expanded row
     - Refactor `Unit` (or add `DigitWell`) so each unit is a cell: `flex: 1`, min width kept, inner well with `background: rgba(255,255,255,0.04)`, `borderRadius: 12` (or 10–14 local), `padding: 8px 4px`, optional `boxShadow: inset 0 1px 0 rgba(255,255,255,0.06)`
     - Between wells: 1px hairline `rgba(255,255,255,0.08)` full-height divider (or gap + border-right on first three cells) — not `:` glyphs
     - All four units use the same `foreground` color; labels stay `muted` uppercase
     - Seconds well must **not** pass `accent` as digit color
   - Preserve: Expanded title row + small status dot; compact/transient/live layouts; `previewRemaining` → parts math; a11y `aria-label`
   - Verify: Preview Mode → Expanded shows four material wells with equal weight; seconds not cyan

## Scope

- Inherit: Expanded preview + future live expand (phase 3)
- Verify: Static canvas Expanded still frame
- Exclude: Opaque shell defaults (plan #1 — execute #1 first if both pending); Home copy (plan #3); morph animation

## Validation

- Product: Expanded reads as a chronograph instrument, not a text countdown
- Interface: Preview Mode Expanded at `previewRemaining` 0.1 / 0.42 / 0.9; long title truncation still OK above wells
- System: No new accent meaning; no glass dependency (works on opaque ink from plan #1)
- Repository: `node scripts/framer/push-launchisland.mjs` → `typeErrors: []`; `node scripts/framer/verify.mjs` → ready

## Stop conditions

- Stop if expanded height must grow beyond dock (`Island Dock` 140px) — then reduce well padding before growing `EXPANDED_H` past ~104px
- Stop if Font control metrics break well alignment — keep digit size local override as today

## Design documentation

- After acceptance: tick craft bar item “Material chronograph digits” as implemented in the Launch Island spec
