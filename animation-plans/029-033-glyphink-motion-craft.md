# 029–033 — Glyph Ink motion craft (findings 1–5)

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Source audit**: `animation-plans/REPORT-glyphink-improve-animations-2026-07-28.md`
- **File**: `code-components/Kern_GlyphInk.tsx`

Executed in order via framer-code-components (refinement):

| # | Finding | Change |
| --- | --- | --- |
| 029 | #1 startTransition on hover | Sync `setOrder`/`setSeeds`/`setActive` on pointer enter/leave (+ focus/blur) |
| 030 | #2 double curve | Cinematic enter `ease: [0.77,0,0.175,1]`; leave ease-out; removed `INK_GROWTH_POWER` |
| 031 | #3 solid snap | Same elliptical mask family for all `t`; tiny ellipse at `t≤0`; no `linear-gradient(#000)` at `t≥1` |
| 032 | #4 seed deps hitch | `seedRef` for mask; `seed` out of animate deps; delay `0` when progress mid-flight |
| 033 | #5 pad-inflated axes | Seed + `rx`/`ry` from content box (optical pad subtracted) |

Skipped: finding #6 (mask paint cost — accept).

## Verification

- Push typecheck `[]`; `node scripts/framer/verify.mjs` green
- Feel: hover starts immediately; ink mid-travel readable; leave no soft-halo flash; flicker-hover no stagger hitch
