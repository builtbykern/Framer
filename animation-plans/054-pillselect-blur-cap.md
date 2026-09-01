# 054 — Pill Select blur cap + detach window

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: finding #6
- **Depends on**: 052

## Problem

`BLUR_PEAK = 2.8` stacked with SVG goo caused Safari paint stutter that read as “frozen.” Blur also ran too long across Phase B.

## Target

```ts
const BLUR_PEAK = 2 // AUDIT: keep transition blur under 20px; prefer ≤2 with goo

// Open onUpdate: blur only for t in [0.55, 0.85], triangular peak at 0.7
// Close onUpdate: ≤1px (BLUR_PEAK * 0.5) for first 25% of merge
```

## Steps

1. Set `BLUR_PEAK = 2`.
2. Drive blur only in the detach window via continuum `onUpdate` (see 052).

## Boundaries

- Do NOT raise blur above 2px while goo is active.
- Do NOT animate layout properties.

## Verification

- **Feel check**: soft dissolve at detach without stutter; Safari preview stays fluid.
- **Done when**: peak blur is 2px and limited to the handoff window.
