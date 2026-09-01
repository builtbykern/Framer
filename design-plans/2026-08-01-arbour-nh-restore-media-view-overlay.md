# Restore image-led Meta VIEW on Territory media (kill Paper cue strip)

Written against: `4aa0cbc`  
**Status:** DONE (canvas + publish) · 2026-08-01

## Evidence chain

- Surface: `/neighbourhoods` Territory Card `i56eWdACt` + `Arbour_TerritoryHoverMedia` (`nMMl08t`)
- Problem: Paper cue strip under media breaks image-led contract; dual Paper + space-between toolbar; user rejected as non-SOTD/non-Arbour
- Design evidence: `design-plans/REPORT-arbour-nh-territories-cue-reject-improve-ui-2026-08-01.md` findings 1–3; `docs/projects/arbour.md` (VIEW on media); PropertyCard Meta-on-media exemplar
- Owner: `Arbour_TerritoryHoverMedia` + photo frame heights + dossier padding
- Scope: codeFile `nMMl08t`; photo `hX5NduSNi` (+ T/P); dossier padding preserved
- Uncertainty: none — correction is restore prior overlay pattern with refined arrow nudge

## Design decision

Remove the Paper cue column entirely. Media is full-bleed again. Meta `VIEW →` returns as a quiet overlay on the photograph (bottom-left, Chartreuse), with hover opacity + arrow translate only. Bottom air stays on the dossier via existing padding — not a second Paper owner.

## Reuse

- Chartreuse token / instance `$control__accent`
- PropertyCard Meta-on-media pattern (Space Mono, uppercase, on photo)
- Existing hover cycle + stage zoom (unchanged)
- Exemplar: pre-cue `.arbour-thm__view` overlay; PropertyCard `VIEW` on media

## Changes

1. `Arbour_TerritoryHoverMedia` (`nMMl08t` / `.tmp` mirror)
   - Change: drop `.arbour-thm__cue` / column flex; root = full-bleed media; restore overlay Meta with inline label + arrow; arrow `translateX` on hover; remove `cueBackground` control (or ignore)
   - Preserve: Hero↔Map cycle, zoom on stage, reduced-motion, leave→index 0
   - Verify: no Paper band under photo; VIEW visible on media

2. Canvas photo heights
   - Change: Desktop `380px`; Tablet/Phone `300px` (media-only again)
   - Preserve: dossier padding bottom 40/36 for air
   - Verify: photo fills frame edge-to-edge

## Scope

- Inherit: all Territory Card instances D/T/P
- Verify: `/neighbourhoods` directory hover
- Exclude: Highlights/Map layers; PropertyCard; new primitives

## Validation

- Product: hover card → cycle + Meta arrow nudge; leave → primary image
- Interface: D/T/P; reduced-motion
- System: single Paper owner = dossier
- Repository: `node scripts/framer/verify.mjs -s <id> --page /neighbourhoods` → ready, no blocking errors

## Stop conditions

- Stop if session drifts off Arbour; re-pin URL before edits

## Design documentation

- After acceptance: confirm `arbour.md` still reads “Meta VIEW → on media” (already correct; no doc invent)
