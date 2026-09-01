# Redesign Neighbourhoods Territory Cards — image-led (baseline-ui)

Written against: `4aa0cbc`  
**Status:** DONE (canvas) — publish pending · 2026-08-01

## Design decision

Replace the rigid 50/50 horizontal split (AI-slop dossier|photo) with an **image-led vertical card**: Hero photo band → Paper dossier (title + Chartreuse `VIEW →` → 2-line Intro). One accent only. Highlights CMS list stays hidden (dense dump). No maps, gradients, or glow.

## baseline-ui → Framer mapping

| Constraint | Application |
| --- | --- |
| One accent / view | Chartreuse only on `VIEW →` |
| Dense clamp | Intro `textTruncation=2` |
| No gradients / glow | Hairline Ink border only |
| No extra motion | Kept existing photo opacity hover ≤200ms |
| Clear empty/hierarchy | Photo first; dossier packs; Cartographic Field off |

## Changes (applied)

- Card `i56eWdACt` (+ T/P): `stackDirection=vertical`, `height=auto`, photo `MOVE` to index 0
- Photo: D 220 / T·P 200 · `aspectRatio=1.6`
- Dossier: Paper fill, padding 24/22/20, gap 12
- Grid gaps: 24 / 20 / 16
- Highlights `visible=false`; Intro clamp 2; CTA `VIEW →` Chartreuse

## Validation

- `verify.mjs` ok · unpublished `/neighbourhoods`
- After publish: visual smoke D/T/P directory
