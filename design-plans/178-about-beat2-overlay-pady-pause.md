# About Beat 2 — symmetrize overlay padY to pause rhythm

Written against: `4aa0cbc`

## Evidence chain

- Surface: `/about` → Beat 2 overlay `WZkTO3vdm` (+ T/P replicas)
- Problem: Vertical padding is asymmetric and off pause scale (D `64/32`, T `72/24`, P `48/24`), so the centered EditorialReveal floats in empty mid-band while `( 02 )` + ScrollCue are pinched to the bottom of a fixed `vh` stage
- Design evidence: `docs/projects/arbour.md` Section Y **pause / soft** = Desktop **96** / Tablet **72** / Phone **48**; screenshots `tmp/beat2-{d,t,p}.png` show short bottom clearance
- Owner: `WZkTO3vdm`, `xvqDXw58eWZkTO3vdm`, `CYNrpU04tWZkTO3vdm`
- Scope: Beat 2 overlay D/T/P padY (and compose with padX from plan `177`)
- Uncertainty: Desktop overlay currently sits inside `90%` column — padY 96 is pause, not section-shell 128 (correct: this is an inner cinematic overlay, not a Paper section)

## Design decision

Treat Beat 2’s inner overlay as a **pause band** on Ink: equal top/bottom breathing so the meta strip and ScrollCue share the stage with the reveal instead of sitting in a 24px gutter.

## Reuse

- Pause Y table in `docs/projects/arbour.md`
- Coordinate padX with plan `177` on T/P

## Changes

1. `WZkTO3vdm` (Desktop)
   - Change: `padding="96px 0px 96px 0px"` (keep width/maxWidth `90%`)
   - Preserve: gap `32px` (or raise to `40` only if reveal↔meta still feels fused after Y fix — default keep 32)
   - Verify: at 1200 / `62vh`, meta strip has clear air above section bottom; reveal still vertically balanced

2. `xvqDXw58eWZkTO3vdm` (Tablet) — **compose with 177**
   - Change: `padding="72px 40px 72px 40px"`
   - Preserve: `width/maxWidth 100%`, gap `32px`, parent height `52vh`
   - Verify: 810 — bottom meta not clipped by `overflow: clip` on `SbkA8xJAz`

3. `CYNrpU04tWZkTO3vdm` (Phone) — **compose with 177**
   - Change: `padding="48px 16px 48px 16px"`
   - Preserve: gap (default keep `24` unless plan `179` changes meta structure)
   - Verify: 390 / `48vh` — `( 02 )` + cue readable with ≥48px from bottom edge of overlay

## Scope

- Inherit: Beat 2 only
- Verify: parent heights `62vh / 52vh / 48vh` still frame the composition; if meta clips after padY↑, prefer reducing reveal size controls slightly over shrinking padY below pause
- Exclude: changing section `vh` unless clip persists after padY + plan 179

## Validation

- Product: Beat 2 feels like a deliberate Ink pause, not a leftover spacer with footer cram
- Interface: D/T/P screenshots of `SbkA8xJAz` replicas; short phone landscape optional
- System: padY matches pause row in arbour.md; padX matches 177
- Repository: serialize three overlays → expect pads above; `verify.mjs` ready

## Stop conditions

- Stop if raising padY clips EditorialReveal text inside `overflow: clip` — then adjust `$control__primarySize` on phone instance or `vh` in a follow-up plan, do not abandon inset symmetry

## Design documentation

- After acceptance: add under About in `arbour.md`: Beat 2 overlay uses **pause Y** (96/72/48) inside full-bleed Ink shell
