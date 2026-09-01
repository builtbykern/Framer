# Type Peek rest type — readable Kern mute

Written against: `4aa0cbc` (working tree; TypePeek local untracked)

## Evidence chain

- Surface: Rest (non-open) glyph fill + separator color in `code-components/TypePeek.tsx` (`PeekWordEl` muted layer; `[data-tp-sep]`)
- Problem: Rest keywords use `rgba(242,242,242,0.2)` — too ghosted for a hoverable type field; JTBD requires finding words to peek
- Design evidence: TypeDrum house primary type = white; Copy Field sell chrome uses `rgba(180,185,195,0.72)` / `rgba(255,255,255,0.5)` for secondary labels — field keywords need the stronger readable band; product decision rest = solid muted type (no die-cut) until hover
- Owner: `DEFAULT_LOOK.mutedColor` + Look → Muted Text `defaultValue`
- Scope and affected surfaces: TypePeek defaults only (instance overrides remain)
- Uncertainty: none for the default value choice below; existing Framer instances may keep old muted until reset

## Design decision

Raise the default rest fill to a readable Kern mute so the field reads as intentional type at rest, while die-cut on the open word and dim on siblings stay the hierarchy tools.

**Locked default:** `rgba(242,242,242,0.78)`

## Reuse

- Color family: existing `mutedColor` prop (do not add a second rest-color control)
- Dim hierarchy: existing `look.dimOpacity` (default `0.4`) on non-open words while one peeks — preserve
- Exemplar readability band: Copy Field eyebrow `rgba(180,185,195,0.72)` (secondary); Type Peek keywords are primary field → `0.78` white

## Changes

1. `code-components/TypePeek.tsx`
   - Change: `DEFAULT_LOOK.mutedColor` from `rgba(242,242,242,0.2)` to `rgba(242,242,242,0.78)`; ensure Look → Muted Text `defaultValue` uses `DEFAULT_LOOK.mutedColor`
   - Preserve: die-cut open crossfade; separator uses same `mutedColor`; `dimOpacity` behavior; user-overridable Color control
   - Verify: Preview rest — all words clearly legible on `#060606` / atmosphere; hover one word — open die-cut, others dim via `dimOpacity`; separators still quieter than words only by glyph weight, not by near-invisibility

## Scope

- Inherit: new inserts and control defaultValue
- Verify: canvas Active still readable for non-active words; static renderer freeze
- Exclude: atmosphere (plan 1), accent/focus (plan 3), separator layout, font family changes

## Validation

- Product: at rest, every keyword is obviously hoverable type
- Interface: Preview rest; hover first/last/wrapped words; canvas Active index 0 and mid-list; reduced-motion freeze
- System: single owner `mutedColor` still drives rest glyphs + seps
- Repository: `node scripts/framer/push-typepeek.mjs` → `typeErrors: []`; `node scripts/framer/verify.mjs` → ready

## Stop conditions

- Stop if raising mute washes out die-cut reveal (open word must still read as media-in-glyphs, not flat white) — then try `0.72` once; do not invent a second color without user OK
- Stop if project session ≠ Type Peek `DHpXX5x`

## Design documentation

- After acceptance: note in Type Peek docs (if present) — “Rest mute default `rgba(242,242,242,0.78)`.”
