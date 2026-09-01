# About Beat 2 — Phone meta strip as dossier row (not stacked cram)

Written against: `4aa0cbc`

## Evidence chain

- Surface: `/about` Beat 2 → *Image Meta Strip* Phone `CYNrpU04trwwNROs8R` + ScrollCue `CYNrpU04tg8t2NlFts`
- Problem: Desktop/Tablet keep a horizontal dossier row (`( 02 ) — THE AGENCY` | coords + CONTINUE). Phone switches to vertical stack `gap=16` with cue `width=1fr` and `$control__stackGap=8`, so the bottom of the Ink stage reads denser and less editorial than D/T — below Arbour/SOTD bar for the same beat
- Design evidence: D/T `rwwNROs8R` `stackDirection=horizontal`; P vertical; Properties phone ScrollCue craft used `stackGap=16` + non-stretch width after hero air pass; screenshots `tmp/beat2-p.png`
- Owner: `CYNrpU04trwwNROs8R`, `CYNrpU04tKpIJLF6Pw`, `CYNrpU04tg8t2NlFts`
- Scope: Phone replica of Beat 2 meta only
- Uncertainty: ultra-narrow may need cue under label if horizontal overflows — prefer horizontal first; fall back to vertical only if verify/screenshot shows overlap

## Design decision

Restore the **same dossier grammar** on Phone as Desktop/Tablet: one horizontal meta strip with agency index on the start edge and ScrollCue on the end edge, with cue internal stack air at SOTD density (`16`), not a third stacked paragraph block.

## Reuse

- Desktop/Tablet meta strip layout on `rwwNROs8R`
- ScrollCue phone air exemplar: Properties `/properties` phone cue `$control__stackGap=16`
- Tokens already on instance (coords / label / accent) — do not retokenize

## Changes

1. `CYNrpU04trwwNROs8R` (Phone Image Meta Strip)
   - Change: `layout=stack` `stackDirection=horizontal` `stackDistribution=space-between` (or start + spacer pattern matching D) `stackAlignment=end` (or `center` if D uses center — **match Desktop `rwwNROs8R` exactly**) `gap` as Desktop (null/0 if space-between) `width=100%`
   - Preserve: both children; Meta preset on `( 02 ) — THE AGENCY`
   - Verify: Phone screenshot — label left, cue right, single baseline row

2. `CYNrpU04tg8t2NlFts` (Phone ScrollCue)
   - Change: `width="auto"` (not `1fr`); `$control__align="Right"` (keep); `$control__stackGap="16"`
   - Preserve: coordinates, `( CONTINUE )` label, Chartreuse accent token, ariaLabel
   - Verify: coords above CONTINUE with clearer air; cue does not stretch full row width

3. Optional only if horizontal overflows at 390−32:
   - Change: reduce cue `$control__metaMobile` one step or hide coordinates on phone via existing control if present — **do not** revert to vertical stack as first response
   - Verify: no text collision with `( 02 )`

## Scope

- Inherit: Phone Beat 2 meta only
- Verify: Tablet/Desktop meta unchanged; plans `177`/`178` pad insets give the row a proper stage
- Exclude: EditorialReveal copy/accent words; renaming section; adding a photographic layer (out of scope — not a contract)

## Validation

- Product: scrolling About on phone, Beat 2 bottom reads as the same dossier furniture as desktop
- Interface: Phone 390; compare side-by-side with Desktop beat2 shot
- System: one meta pattern across D/T/P for this beat
- Repository: serialize Phone meta strip direction + cue width/stackGap; screenshot `CYNrpU04tSbkA8xJAz`; `verify.mjs` ready

## Stop conditions

- Stop if horizontal layout collides after padX 16 and cannot be fixed without cutting copy — then ask before inventing a two-line phone-only pattern

## Design documentation

- After acceptance: optional one-liner in `arbour.md` About — Beat 2 meta strip stays horizontal at all breakpoints
