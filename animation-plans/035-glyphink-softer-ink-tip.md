# 035 — Softer ink tip, corner-safe cover

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Physicality
- **Estimated scope**: 1 file + docs tip line
- **Source audit**: `animation-plans/REPORT-glyphink-fill-sotd-2026-07-28.md` finding #2

## Problem

Tip stops are nearly hard. Travel reads as a shutter edge, not ink. Full cover
math is fine; softness is not.

```ts
/* code-components/Kern_GlyphInk.tsx:101–111 — current */
const INK_CORE_PCT = 90
const INK_MID_PCT = 97
const INK_COVER = Math.SQRT2 * (100 / INK_CORE_PCT)
```

```ts
/* inkMask return — current */
`… #000 0%, #000 ${INK_CORE_PCT}%, rgba(0,0,0,0.55) ${INK_MID_PCT}%, transparent 100%`
```

Filling Point solid (house reference for a soft-but-complete tip):

```ts
/* Kern_FillingPoint solidBackground — reference stops */
`… ${color} 0%, ${color} 88%, color-mix(…) 55% at 95%, transparent 100%`
```

## Target

```ts
/** Ink feather — soft front in travel; cover math still clears corners at t=1 */
const INK_CORE_PCT = 82
const INK_MID_PCT = 92
/** Mid-edge axes ×√2 → corners; ×100/CORE → opaque core on those corners */
const INK_COVER = Math.SQRT2 * (100 / INK_CORE_PCT)
```

Mask gradient (same family for all `t`, including `t=1` — no solid snap):

```ts
return `radial-gradient(ellipse ${rx}px ${ry}px at ${ox}px ${oy}px, #000 0%, #000 ${INK_CORE_PCT}%, rgba(0,0,0,0.45) ${INK_MID_PCT}%, transparent 100%)`
```

Keep directional growth structure from current `inkMask` (plan 036 may edit cross-axis formula separately).

## Repo conventions to follow

- Never special-case `t>=1` with a different gradient type (`029–033` settled).
- Always derive `INK_COVER` from `INK_CORE_PCT` + `Math.SQRT2` so corner cover cannot drift.
- Exemplar tip family: Filling Point solid 88/95 — Glyph Ink uses 82/92 for a slightly wetter front on letterforms.

## Steps

1. Set `INK_CORE_PCT = 82`, `INK_MID_PCT = 92`.
2. Keep `INK_COVER = Math.SQRT2 * (100 / INK_CORE_PCT)` (recalculates ≈ 1.726).
3. Change mid stop alpha to `rgba(0,0,0,0.45)`.
4. Update `docs/projects/glyph-ink.md` tip line to `82%→92%→100%` + `√2 × 100/82`.

## Boundaries

- Do NOT remove `√2` corner factor.
- Do NOT shrink seed axes back to content-only (descenders must stay covered).
- Do NOT change enter/leave durations (034) or cross-axis formula (036).
- Do NOT publish.

## Verification

- **Mechanical**: push + verify as in 034.
- **Feel check** at 0.25×:
  - Traveling front looks soft/wet, not a hard clip.
  - At rest (`t=1`), full letter including corners/descenders is solid ink (no ghost fringe inside the glyph).
- **Done when**: ink character restored without regressing “no cubre todo”.
