# Reveal Tip Home — utility tip copy on Tip Bottom

Written against: `4aa0cbc`

## Evidence chain

- Surface: Home `/` Tip Bottom instance `Wqzz8XQ2I` (Pixel) on Straightforward Engineers `DHpXX5xCoGaJHmRQfN0m`
- Problem: Tip Bottom `content.label` / `description` document the FX (“Pixel reveal” / “Solid cells assemble…”) while Tip Top sells a real tip verb (“Follow on X”) — same Product Well contradicts itself on utility
- Design evidence: live controls + `scripts/framer/revealtip-home.mjs` lines setting Tip Bottom content; `design-plans/REPORT-revealtip-improve-ui-2026-08-08.md` finding 1
- Owner: Tip Bottom instance controls + `revealtip-home.mjs` (so rebuilds stick)
- Scope and affected surfaces: Home Tip Bottom `content` only; Tip Top left as utility exemplar
- Uncertainty: none — copy strings are fixed below

## Design decision

Make Tip Bottom a real tip (drop / studio note) so both specimens demonstrate site utility; Pixel mode stays only in `motion.reveal` / follow / media.

## Reuse

- Existing Tip Bottom instance + control shape from Tip Top
- Exemplar: Tip Top `bxRuu8FjR` content pattern (verb title + useful body)

## Changes

1. Live canvas — Tip Bottom `Wqzz8XQ2I` (or rediscover by name `"Tip Bottom"`):
   - Change `controls.content` to:
     - `triggerLabel`: `"◈"` (keep)
     - `label`: `"New drop"`
     - `description`: `"Studio notes and limited releases."`
     - `showImage`: `true` (keep)
   - Preserve: `motion.reveal: "pixel"`, `followCursor: true`, placement `bottom`, look sizes, `preview.open: false`
   - Verify: Preview hover Tip Bottom → title reads as tip content, not FX docs

2. `scripts/framer/revealtip-home.mjs`
   - Change: in Tip Bottom branch of `setAttributes`, replace label/description with the same strings as step 1
   - Preserve: motion/look/preview branches
   - Verify: script source matches live controls

## Scope

- Inherit: future Home rebuilds from script
- Verify: Tip Top still “Follow on X”
- Exclude: `RevealTooltip.tsx` defaults; listing; Link control; motion timing

## Validation

- Product: buyer sees two real tip use-cases; modes differ by motion only
- Interface: Preview `/` hover both triggers; Force Open Off
- System: no new chrome nodes
- Repository:
  1. `node scripts/framer/session.mjs --url "https://framer.com/projects/Straightforward-Engineers--DHpXX5xCoGaJHmRQfN0m-dFXww" --name "Reveal Tooltip"`
  2. Apply via `node.setAttributes` / small `exec.mjs` or re-run `node scripts/framer/revealtip-home.mjs` after editing script
  3. `node scripts/framer/verify.mjs` → no blocking errors

## Stop conditions

- Stop if Tip Bottom instance id missing and cannot rediscover by name.
- Stop if asked to rename modes in tip title (that belongs to mode-labels plan).

## Design documentation

- None required beyond updating `revealtip-home.mjs` as the stage SoT.
