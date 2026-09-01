# 062 — Pill Select close content fade

- **Status**: DONE
- **Severity**: MEDIUM
- **Category**: Readability
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: #5

## Target

- `contentOpacity` fades when `closeT ≥ 0.15` (over ~0.2 progress)
- `listOpacity = itemsOpacity * contentOpacity` — no squashed text on close

## Verification

- Close: options disappear before aggressive squash; no illegible squeezed labels.
