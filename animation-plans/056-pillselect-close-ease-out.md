# 056 — Pill Select close ease-out

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: re-audit #2

## Problem

Close used `EASE_IN_OUT` — ease-in start felt frozen before merge.

## Target

```ts
const CLOSE_S = 0.36
await animate(y, yClosed, { duration: CLOSE_S, ease: EASE_OUT /* [0.23,1,0.32,1] */ })
```

Keep ≤1px blur in first 25% of merge; goo on at close start.

## Verification

- Feel: close responds immediately, merges under goo without freeze.
