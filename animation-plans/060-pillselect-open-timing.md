# 060 — Pill Select open timing + goo fade window

- **Status**: DONE
- **Severity**: MEDIUM
- **Category**: Timing
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: #3

## Target

- `OPEN_S = 0.72` (was 0.92)
- Goo fade `GOO_FADE_START/END = 0.52–0.78` (was 0.58–0.84)

## Verification

- Open feels snappier without losing liquid crossfade; goo clears before settle.
