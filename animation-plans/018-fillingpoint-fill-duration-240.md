# 018 — Fill duration 240ms

- **Status**: SUPERSEDED by 023
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file

## Problem

This plan treated the component as generic high-frequency UI. The user later
locked an Awwwards/SOTD product requirement where the hover itself is the SKU.

## Target

```ts
See plan 023: cinematic `480ms` enter and `600ms` reverse-cascade exit.
```

## Verification

Historical only. Do not restore the generic sub-300ms default.
