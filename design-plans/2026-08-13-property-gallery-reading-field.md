# Gallery reading-field — one text grammar

**Status:** applied on canvas 2026-08-13 (not published)

Written against: `4aa0cbc` · Framer `CmRyHJKPrPE6BZhC6d4S`

## Evidence chain

- Surface: `/properties/:slug` Cinematic Gallery `lP4ZL6y0c`
- Problem: Three text grammars — heading rail, centered CMS narrative 760px, caption `space-between` Body + Meta
- Design evidence: Chapter Intro `ubrig7P0R`; Journal Article Reading Field `F88MmOdES`; `docs/projects/arbour.md` D 90% / T·P pad 40/16
- Owner: `lP4ZL6y0c` (heading `xikGIamdr`, narrative `dvQGZybHU`, caption `XQfSPVEJl`)
- Scope and affected surfaces: property detail D/T/P only
- Uncertainty: CMS `Gallery Narrative` may be empty on some items — reading column still shows Heading title

## Design decision

Collapse gallery copy into the same reading-field as Chapter Intro: Meta rail `( INTERIORS )` + one column (Heading title + CMS `Gallery Narrative`). Delete Caption row. Do not change the 3-image grid.

## Reuse

- `Arbour/Meta` + Olive on the label; `Arbour/Heading` on title; `stylePresetParagraph=Arbour/Body` on CMS narrative
- Exemplar: Chapter Intro rail `ocXA2IDpp` (180/140) + reading `HrK5B9dl2` (max 760/550)
- Width: heading 90% D / 100% T·P

## Changes

1. `/properties/:Properties` Gallery Heading `xikGIamdr`
   - Change: Add `Gallery Rail` + `Gallery Reading`. MOVE `oxMJ7AcyY` into rail; MOVE `FH8AOsipo` + `dvQGZybHU` into reading. Horizontal D/T gap 80/40, align start. Rail 180/140. Reading 1fr max 760/550 gap 24/20. Phone vertical, rail+reading 1fr.
   - Preserve: label copy `( INTERIORS )`, title copy, CMS binding `FCqIX3F0S`. Do not SET text (avoids Inter fallback).
   - Verify: one rail + one prose column; narrative left-aligned with title, not a centered 760 island.

2. Caption `XQfSPVEJl`
   - Change: `DEL` (Detail + Index `[ SELECTED VIEWS ]` go with it).
   - Preserve: grid `CGYpcrzdu` and image CMS fills.
   - Verify: section children are Heading + Grid only.

## Scope

- Inherit: Tablet `IQmBTrFpb…`, Phone `MrTKJzwEL…`
- Verify: Chapter Intro / Amenities reading-fields unchanged
- Exclude: grid composition (featured / full-bleed) — not selected

## Validation

- Product: interiors still read as a sequence; less duplicate caption
- Interface: D/T/P; item with empty Gallery Narrative still shows title
- System: same rail+reading as Chapter Intro
- Repository: `node scripts/framer/verify.mjs -s 1` → `ok: true`

## Stop conditions

- Stop if DEL caption is blocked or CMS narrative cannot MOVE into heading.

## Design documentation

- After acceptance: none required in `arbour.md` (same reading-field already documented by Chapter Intro).
