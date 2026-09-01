# Toast on dark house — frosted light pill

Written against: `4aa0cbc`

## Evidence chain

- Surface: Copy Field toast below pill
- Problem: Charcoal toast under a light pill fails on Kern `#060606`
- Design evidence: `REPORT-copyfield-kern-improve-ui-2026-07-30.md` finding 3; dark-house plan locks ground `#060606`
- Owner: `CopyField.tsx` toast styles + `toastLabel` prop
- Scope and affected surfaces: Toast chrome only (motion enter/exit is `animation-plans/041`)
- Uncertainty: none — **lock frosted light** (not dark glass) for max readability on dark sell

## Design decision

Toast = frosted light pill: `background: rgba(255,255,255,0.92)`, text `#0A0A0B`, `backdrop-filter: blur(8px)` optional, radius fully rounded, horizontal padding ~14px, vertical ~8px, font ~12–13px medium. Default copy `"Copied to clipboard."` via buyer string control.

## Reuse

- Dark-house pill contrast pattern from UI plan 1
- Exemplar: muted caption + light-on-dark Kern sell (toast is inverted: light chip on dark)

## Changes

1. `code-components/CopyField.tsx`
   - Change: toast styles as above; prop `toastLabel` default `"Copied to clipboard."`; `ControlType.String`
   - Preserve: centered under pill; does not shift pill layout (absolute or overlay below)
   - Verify: on `#060606` toast is readable; no charcoal `#333` default

## Scope

- Inherit: all instances
- Exclude: toast motion timing (041); clipboard failure copy

## Validation

- Product: toast readable on dark demo
- Interface: copied state
- System: one toast chrome (frosted light) — no dual theme
- Repository: visual check on Gold Parsnip `/`

## Stop conditions

- Stop if `backdrop-filter` breaks Framer export — drop blur, keep solid `rgba(255,255,255,0.92)`

## Design documentation

- none until listing pack
