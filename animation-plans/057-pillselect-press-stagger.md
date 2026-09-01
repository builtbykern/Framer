# 057 — Pill Select chevron + press + row stagger

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW–MEDIUM
- **Category**: Easing / Feedback / Missed opportunity
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: #5 + find-animation-opportunities 1–3

## Target

- Chevron: `duration: 0.18`, `EASE_OUT`
- Trigger + options: `whileTap={{ scale: 0.97 }}`, `duration: 0.16`, gated off for RM/static
- Rows: `initial opacity 0 → 1`, `duration: 0.18`, `delay: min(index,5)*0.04`
- Wrap rows+highlight in `opacity: itemsOpacity` so stagger does not show before morph

## Verification

- Feel: snappy chevron; press feedback; rows cascade after morph gate.
- Pointer never blocked by stagger.
