# Archive Preview cursor — reuse metaFont

Written against: `4aa0cbc`

## Evidence chain

- Surface: Archive Preview VIEW cursor label
- Problem: Hardcoded type invents parallel meta style (`fontSize` formula, `0.16em` tracking)
- Design evidence: Look `metaFont` owns uppercase tracked labels (year/category) on the same surface
- Owner: cursor overlay text styles in `ArchivePreview.tsx`
- Scope and affected surfaces: cursor label only
- Uncertainty: none

## Design decision

Drive cursor label typography from Look `metaFont`; keep uppercase only as presentation.

## Reuse

- `metaFont` / `textColor` from Look
- Exemplar: category/year column spans in the same file

## Changes

1. `code-components/ArchivePreview.tsx` cursor overlay
   - Change: spread `...metaFont` into cursor style; remove hardcoded `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight`
   - Preserve: `textTransform: "uppercase"`, `color: textColor`, hairline ring from plan 052
   - Verify: VIEW matches year/category tracking and size

## Scope

- Inherit: buyer changes to Meta font control
- Verify: Preview hover
- Exclude: titleFont, peek geometry

## Validation

- Product: label reads as same meta system as index columns
- Interface: custom Meta font in controls affects cursor
- System: no parallel type constants
- Repository: push + `verify.mjs` → ok

## Stop conditions

- Stop if Cursor gains its own Font control (would supersede this)

## Design documentation

- None beyond existing Cursor group note
