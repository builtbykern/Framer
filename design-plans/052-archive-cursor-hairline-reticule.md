# Archive Preview cursor — hairline reticule

Written against: `4aa0cbc`

## Evidence chain

- Surface: Archive Preview VIEW cursor overlay (`code-components/ArchivePreview.tsx`, fine-pointer row hover)
- Problem: Filled glass disc + double ring + soft drop shadow reads as UI card, not film hairline reticule
- Design evidence: `docs/projects/archive-preview.md` Look (hairline `#E2D2B0`, champagne craft); peek plate single `0 0 0 1px` champagne outline
- Owner: cursor `motion.div` styles in `ArchivePreview.tsx`
- Scope and affected surfaces: cursor overlay only
- Uncertainty: none

## Design decision

Strip cursor chrome to a single hairline ring on transparent fill so it matches index/peek outline language.

## Reuse

- `hairlineColor` from Look
- Exemplar: peek `boxShadow` single champagne ring (outline density), not its soft plate shadow

## Changes

1. `code-components/ArchivePreview.tsx` cursor overlay
   - Change: `background: "transparent"`; keep `border: 1px solid ${hairlineColor}`; remove `boxShadow` (no duplicate `0 0 0 1px`, no soft drop)
   - Preserve: size, spring follow, show/hide, `cursor: none`, label content
   - Verify: hover row → ring only, no muddy fill or floating shadow

## Scope

- Inherit: none beyond cursor
- Verify: Home Preview hover
- Exclude: peek plate shadows, Gate motion

## Validation

- Product: hover index → VIEW ring feels hairline luxury
- Interface: fine-pointer open; static/reduced-motion still hides cursor
- System: no new color tokens
- Repository: `node scripts/framer/session.mjs --url …1BEQetq…` → `node scripts/framer/push-archivepreview.mjs` → `node scripts/framer/verify.mjs` → ok

## Stop conditions

- Stop if Look tokens change identity away from hairline craft

## Design documentation

- After acceptance: note in `docs/projects/archive-preview.md` that cursor is hairline-only reticule (no fill/shadow)
