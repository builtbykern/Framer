# Type Peek — signature die-cut (SOTD craft)

Written against: `4aa0cbc`

## Evidence chain

- Surface: `PeekWordEl` die-cut layers in `code-components/TypePeek.tsx` (~234–320)
- Problem: Product JTBD is sound (hover keywords → peek work), but signature beat is a dual **opacity** crossfade on `background-clip: text` — reads CodePen, not Awwwards/Kern. Soft-fail gate 6 vs Glyph Ink / Erika Moreira SVG mask.
- Design evidence: `docs/projects/glyph-ink.md` + `Kern_GlyphInk.tsx` pointer-origin mask (`CROSS_START = 0.38`); Awwwards Elements SVG mask hover (Erika Moreira); Type Peek canon = die-cut media in glyphs (not louvers)
- Owner: die-cut reveal path only
- Scope: `TypePeek.tsx` (+ push/home verify). Optional later: listing demo
- Uncertainty: exact mask formula may need one Preview feel pass; stop if mask fights `background-clip` in Safari and fall back documented below

## Design decision

**One signature beat:** pointer-seeded mask reveal of the die-cut (photo) through the glyph, muted type underneath. Not a cyan ink clone of Glyph Ink — media is the fill; mask is the gesture.

Leave breathes longer than enter (align with motion plan 040 values if both ship).

## Reuse

- Pointer → mask progress pattern: `code-components/Kern_GlyphInk.tsx` (`useMotionValue` progress, `useTransform` → `maskImage` / `WebkitMaskImage`, `CROSS_START = 0.38`, optical glyph pad)
- Freeze: `useIsStaticRenderer` + `useReducedMotion` — mid-open static for Active index (mask fully open on Active word only)
- House: transparent component bg; page atmosphere unchanged
- Push: `scripts/framer/push-typepeek.mjs`

## Changes

1. `code-components/TypePeek.tsx` — `PeekWordEl`
   - Change:
     - Track pointer local coords on `pointerenter` / `pointermove` (rAF-throttled) while interactive; seed = point in word box (nearest edge clamp like Glyph Ink if outside).
     - Drive `progress` 0→1 on open, 1→0 on leave with enter `0.22` / leave `0.28`, ease `[0.22, 1, 0.36, 1]` (or Glyph Ink `EASE_OUT` `[0.23, 1, 0.32, 1]` for leave — pick one pair and stick).
     - Die-cut layer: keep `background-clip: text` + peek image; add `WebkitMaskImage` / `maskImage` radial (or soft diamond) from seed that expands with progress (`CROSS_START`-style contact then cover). Muted layer: inverse mask **or** opacity tied to `1 - progress`.
     - Optional craft: die-cut `backgroundSize` from `112%` → `100%` as progress→1 (media settles; transform/composite only via background-size — if janky, skip).
     - `freeze`: progress = open ? 1 : 0; no pointer listeners.
   - Preserve: field layout, separators, links, Look controls, rest muted until open, one open word, `onPeek`, static Active.
   - Verify: Preview hover — photo wipes from pointer through glyphs; leave slower; canvas shows Active word fully die-cut.

2. Safari / clip interaction fallback
   - If mask + `background-clip: text` breaks: wrap die-cut in an inner span — outer carries mask, inner carries clip+image (Glyph Ink separates mask box from paint). Document which structure shipped.

3. Do **not** reintroduce louvers / rotateX.

## Scope

- Inherit: Marketplace Type Peek only
- Verify: Home Preview; keyboard focus still opens (seed = box center when keyboard); reduced-motion → instant full open/close
- Exclude: Quantity Unlock; listing MP4; font family redesign (optional follow-up: remove `Inter` from `DEFAULT_FONT` stack only if touched)

## Validation

- Product: 3–5s demo reads as one gesture — “pointer opens the photo inside the word”
- Interface: multi-word field; wrap lines; linked vs unlinked; Active on canvas
- System: must not ship a second SKU that is Glyph Ink with photos — keep multi-word field JTBD
- Repository: `node scripts/framer/push-typepeek.mjs` → `typeErrors: []`; `node scripts/framer/verify.mjs` → ready

## Stop conditions

- Stop if single-file Framer rejects required Motion APIs already used by Glyph Ink (they are allowed).
- Stop if mask+clip is unfixable in Safari after one restructure — revert to opacity + ship plans 040–042 only; report.
- Stop if session ≠ `DHpXX5x`.

## Design documentation

- After acceptance: update `docs/projects/type-peek.md` — “Signature: pointer-seeded mask die-cut (Glyph Ink–class), not opacity fade.”

## Recommended execution vs motion polish

1. **This craft plan first** (nivel / SOTD)
2. Then `plans/040` leave timing (may already be folded into this plan’s enter/leave)
3. `041` blur — **cancel** if opacity crossfade is gone
4. `042` press — still valid after craft
