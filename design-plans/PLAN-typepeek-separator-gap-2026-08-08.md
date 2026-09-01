# Type Peek inter-word rhythm (unit + columnGap)

Written against: `4aa0cbc`

## Evidence chain

- Surface: `code-components/TypePeek.tsx` — field/sentence word list
- Problem: Separator glyphs float centered in a fixed `look.gap` slot; lead/trail use separate margins — optical gap between words is wrong and sentence ≠ field owner
- Design evidence: User contract “mismo gap entre un item y el siguiente”; improve-ui findings #1 + #2
- Owner: `TypePeek` field flex + `look.gap` + `separator`
- Scope and affected surfaces: Type Peek only (`b7bGqg9` sandbox)
- Uncertainty: none

## Design decision

Treat each keyword as a **unit** `[word][trailing sep?]`. Use a single `columnGap: look.gap` (and matching `rowGap`) between flex siblings (lead, units, trail). Attach punctuation to the preceding word with **no** side margins and **no** fixed-width centered slot. `none` / `space` (empty) = gap only via `columnGap`.

## Reuse

- Existing `look.gap`, `separator`, `resolveSeparator`
- Exemplar: standard list typography (`Word,` + gap + `Word`)

## Changes

1. `code-components/TypePeek.tsx`
   - Change: Wrap each word + optional trailing sep in one `inline-flex` unit; field `columnGap: look.gap`, `rowGap: look.gap` (or 0.7× if wrap needs tighter — prefer same `look.gap` for consistency); remove `sepSlotStyle` fixed width/center; sep is tight after word; lead/trail are siblings with **no** marginInline — rely on columnGap
   - Preserve: die-cut, hover rest=none, separator kinds, Active canvas, links
   - Verify: switching separator kinds does not change word→word distance; Field and Sentence share the same gap owner

2. Gap control description
   - Change: copy reflects “space between word units” not “centered slot”
   - Verify: panel description matches behavior

## Scope

- Inherit: Home Type Peek instance after push
- Verify: Field + Sentence, all separator enums
- Exclude: listing assets, motion retune, new props

## Non-goals

- Per-separator optical kerning tables
- Changing default Gap value

## Acceptance checks

- [x] Comma sits flush after the word; next word starts after exactly `look.gap`
- [x] Middot/slash/dash/pipe/custom same inter-unit gap
- [x] None/Space: equal empty gap, no floating glyph
- [x] Sentence lead → first word and last word → trail use same `columnGap`
- [x] `typeErrors: []` + verify ready after push

## Status

Executed 2026-08-08 — unit + columnGap shipped to `b7bGqg9`.
