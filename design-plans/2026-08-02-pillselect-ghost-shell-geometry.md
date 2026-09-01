# Nest highlight ghost to menu shell geometry

- **Status**: DONE (applied 2026-08-02)

## Evidence chain

- Surface: Pill Select open menu — hover ghost vs menu silhouette (`/` Preview / live)
- Problem: Highlight radius (14) and vertical pad (10) do not nest with menu radius (24) + side inset (6); trigger text pad (20/18) ≠ option pad (24)
- Design evidence: `docs/superpowers/specs/2026-08-01-pill-select-design.md` — menu radius ~24, highlight inset ~6; concentric nesting ⇒ inner radius = outer − inset; live CDP + screenshot 2026-08-02
- Owner: `code-components/PillSelect.tsx` craft constants
- Scope and affected surfaces: PillSelect code component only (`om6bp0W`)
- Uncertainty: none — values derived from existing MENU_RADIUS + SHELL_INSET

## Design decision

One shell inset token drives highlight inset, menu vertical pad, and nested highlight radius so the ghost sits concentrically inside the menu border. Unify trigger/option horizontal text padding so labels share one column.

## Reuse

- Existing craft constants block in `PillSelect.tsx` (`MENU_RADIUS`, `HIGHLIGHT_*`, `MENU_PAD_Y`)
- Spec inset ~6 / menu radius ~24
- Exemplar: current silhouette `MENU_RADIUS = 24`

No new shared design-system primitive — Marketplace single-file component.

## Changes

1. `code-components/PillSelect.tsx`
   - Change:
     ```ts
     const SHELL_INSET = 6
     const MENU_RADIUS = 24
     const HIGHLIGHT_INSET = SHELL_INSET
     const HIGHLIGHT_RADIUS = MENU_RADIUS - SHELL_INSET // 18
     const MENU_PAD_Y = SHELL_INSET
     const TEXT_PAD_X = 20
     ```
     - Trigger button padding: `0 ${TEXT_PAD_X}px` (symmetric; drop 20/18 split)
     - Option padding: `0 ${TEXT_PAD_X}px` (replace `18 + HIGHLIGHT_INSET`)
     - Highlight: keep `left/right: HIGHLIGHT_INSET`, `borderRadius: HIGHLIGHT_RADIUS`
   - Preserve: colors, ROW_H, morph/goo motion, Appearance controls, composite-only hover motion
   - Verify: CDP insetL/R === MENU_PAD_Y === 6; highlight br === 18px; trigger padL === option padL === 20px; first/last ghost corners visually track menu curve

2. Push + validate
   - `node scripts/framer/session.mjs --url "https://framer.com/projects/Independent-Information--PFjqWOivVzNyrdIJwOlR-goLho"`
   - `node scripts/framer/push-pillselect.mjs`
   - `node scripts/framer/verify.mjs`
   - Preview open: ghost nested; text column aligned trigger↔options

## Scope

- Inherit: PillSelect instances on `/` and `/thumbnail`
- Verify: open morph still clears; hover scale still composite-only
- Exclude: new property controls; color changes; publish (unless user OK)

## Verification

- Highlight `border-radius` computes to 18px; side inset 6; vertical list pad 6
- Trigger and option labels share the same left edge
- No regression: open/close goo, select, keyboard

## Executor skill

`framer-component` (+ Framer harness push/verify). Do not use Framer internal agent.
