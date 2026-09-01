# 020 — Press fill OUT snap 80ms

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 file

## Problem

Press opacity IN/OUT nearly symmetric (`0.12` / `0.10`).

## Target

- `PRESS_FILL_IN = 0.12`
- `PRESS_FILL_OUT = 0.08`

## Verification

Touch/keyboard release clears fill faster than it entered.
