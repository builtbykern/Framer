# Type Peek focus chrome — Kern accent `#6FD3FF`

Written against: `4aa0cbc` (working tree; TypePeek local untracked)

## Evidence chain

- Surface: keyboard `:focus-visible` ring on `[data-tp-word]` in `code-components/TypePeek.tsx`
- Problem: Focus chrome is neutral white `rgba(242,242,242,0.55)` — ignores BuiltByKern house accent used across Marketplace siblings
- Design evidence: TypeDrum house `#6FD3FF`; Glyph Ink ink/focus `#6FD3FF`; Copy Field / ContactDock / QuoteIntake accent `#6FD3FF`
- Owner: injected `<style>` block for `[data-tp-word]:focus-visible` inside `TypePeek`
- Scope and affected surfaces: TypePeek focus styles + Look defaults
- Uncertainty: none for accent hex; optional Look control vs hardcode — prefer Look `accent` so designers can retint without forking

## Design decision

Introduce house accent `#6FD3FF` as the focus-visible outline color (and wire it through Look so it stays overridable). Do not add glow, gradient, or extra hover chrome.

## Reuse

- Accent token: `#6FD3FF` (TypeDrum / Glyph Ink / Copy Field)
- Pattern: ContactDock / Glyph Ink focus ring using accent (2px outline, offset) — keep Type Peek’s existing `outline-offset: 6px` and `border-radius: 2px`
- Exemplar values: Glyph Ink focus uses Ink color; Type Peek uses Look accent default `#6FD3FF`

## Changes

1. `code-components/TypePeek.tsx` — types + defaults
   - Change: add `accent: string` to `LookCtrl`; `DEFAULT_LOOK.accent = "#6FD3FF"`
   - Preserve: other Look fields; no change to die-cut or dim
   - Verify: TypeScript props compile in Framer push (`typeErrors: []`)

2. `code-components/TypePeek.tsx` — focus CSS
   - Change: replace `outline: 2px solid rgba(242, 242, 242, 0.55)` with `outline: 2px solid` using `look.accent` (inject the resolved accent into the style string, e.g. `outline: 2px solid ${look.accent}`)
   - Preserve: `outline-offset: 6px`; `border-radius: 2px`; style only when `!isStatic` as today
   - Verify: Preview — Tab to a word shows cyan ring; mouse hover peek unchanged

3. `addPropertyControls` → Look
   - Change: add `accent: { type: ControlType.Color, title: "Accent", defaultValue: "#6FD3FF" }`
   - Preserve: existing Look controls order (Background, Muted Text, then Accent, then Font…)
   - Verify: panel shows Accent; changing it updates focus ring on next focus

## Scope

- Inherit: all Type Peek instances (default accent)
- Verify: linked words (`<a>`) and button-role words both show ring; Escape blur still clears
- Exclude: separator color (stays muted); atmosphere; rest mute value (plan 2); motion curve changes

## Validation

- Product: keyboard focus reads as Kern chrome
- Interface: Preview keyboard only; canvas (no live focus styles when static — OK); reduced motion
- System: one accent owner under Look; no parallel hardcoded cyan elsewhere in the file
- Repository: `node scripts/framer/push-typepeek.mjs` → `typeErrors: []`; `node scripts/framer/verify.mjs` → ready

## Stop conditions

- Stop if Framer strips dynamic `<style>` interpolation — then fall back to inline `style` on focused element via state (still use `look.accent`)
- Stop if session ≠ `DHpXX5x`

## Design documentation

- After acceptance: note Type Peek Look accent default `#6FD3FF` for focus ring (house).
