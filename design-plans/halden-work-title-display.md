# Work series title uses Display

Written against: `4aa0cbc`

## Evidence chain

- Surface: Halden `/work/:Work` Info rail Title `gPAtEpWYL` (Desktop `rtJNTCNFr` / PageSurface `i_pl00Sun` / Info `rT9WGdFVR`).
- Problem: The series name is Syne 48 / weight 600 / tracking 0. Display (Syne ExtraBold 68 / −0.05em) is unused on this page.
- Design evidence: text style Display `q2kItQX4I`. User: the template is not editorial at the type level. 404 Lead must stay Syne 27 (executed exception).
- Owner: Work Title `gPAtEpWYL`.
- Scope and affected surfaces: `/work/:Work` Desktop/Tablet/Phone title.
- Uncertainty: long CMS titles in the 33% rail will wrap more at 68 ExtraBold — expected for this trial.

## Design decision

Bind the series title to Display so the detail rail has a real display voice against the still.

## Reuse

- Display `q2kItQX4I`
- ink `24aaa6c6-0b98-4eac-b695-5f20471f6b92`
- Exemplar: the Display preset itself (not 404 Lead)

No new token or preset.

## Changes

1. `/work/:Work` Title `gPAtEpWYL`

   - Change: `SET gPAtEpWYL textStylePreset="Display"` only (optional `textColor` ink). Do **not** SET fontName/fontSize/weight/tracking in the same command — DSL rejects inline type while a preset is set. Keep CMS text binding and width `1fr`. Display breakpoints: 68 default, 60 at 1440, 48 at 768.
   - Preserve: Info 33% / Gallery 67% split; Type kicker; credits; Body; tags; pager; Cover; Nav `I4Ai7zBLv`; PageVeil; 404 Lead `TvxbdlTzw`.
   - Verify: getNode shows `textStylePreset="Display"` (or Syne 68/800/−0.05em). Screenshot: series name is ExtraBold 68, not Semibold 48.

## Scope

- Inherit: Tablet/Phone replicas of the Title if they still inherit.
- Verify: `/work/:Work` D/T/P. Overlay titles are plan 2, not this SET.
- Exclude: 404 Lead, Logo Menu Roll, Home plane, overlay Title `sWU5I6bKH`, publish.

## Validation

- Product: opening a series shows the name as Display against the still.
- Interface: a short title (Salt Light) and a longer CMS title; closed Nav still ~48–56px.
- System: Display used as the series headline; 404 stays Syne 27.
- Repository: `node scripts/framer/verify.mjs -s 2 --page /work/:Work` → `{ "ok": true }`

## Stop conditions

- Stop if Display on the title inflates the closed Nav bar above ~56px.
- Stop if `textStylePreset="Display"` is rejected — set the Display metrics as handmade and record that in the verify dump.
- Do not put Display on 404 Lead or HALDEN.
- Do not publish.

## Design documentation

- After acceptance: none unless the user asks for `docs/projects/halden.md`. Record that series titles on Work use Display.
