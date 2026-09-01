# 017 — Origin fill scale floor + opacity

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (`code-components/Kern_FillingPoint.tsx`)

## Problem

`SCALE_HIDDEN = 0.001` ≈ `scale(0)` — wash appears from nothing.

## Target

- `SCALE_HIDDEN = 0.18`
- Animate `scale` + `opacity` (`0.18/0` ↔ `1/1`) with shared `fillTransition`

## Verification

Feel-check: enter/leave — blob starts visible-small at origin, not a pop from void.
