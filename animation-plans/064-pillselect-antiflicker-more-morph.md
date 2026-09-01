# 064 — Pill Select anti-flicker + more morph

- **Status**: DONE
- **Severity**: HIGH
- **Category**: Flicker / Morph amount
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)

## Target

### Flicker
- Sharp base always opaque; goo overlays and dissolves (no `1 − goo` swap)
- Smoothstep goo dissolve on open; soft goo fade on late close
- Motion values set before `setMenuMounted`; defer `setMorphing(false)` 2× rAF

### More morph
- `OPEN_S = 0.84`; goo fade `0.40–0.92`; stretch blur `0.55` + peak `2.1`
- Open grow `0.40/0.74 → 1` until `0.55`
- Bridge `10%/80%`, taller; goo `stdDeviation=10`
- Items opacity delayed to `0.62–0.88`

## Verification

- Preview: no flash at open/close settle; longer liquid neck before sharp settle.
