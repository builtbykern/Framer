# 053 — Pill Select items opacity soft ramp

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Cohesion
- **Estimated scope**: 1 file (`code-components/PillSelect.tsx`)
- **Audit**: finding #5
- **Depends on**: 052

## Problem

`itemsOpacity` stayed `0` until `0.72 * yOpen` then jumped to `1` in a short segment — snappy item pop at end of open.

## Target

```ts
const itemsOpacity = useTransform(
  y,
  [yClosed, NECK_Y, yOpen * 0.55, yOpen],
  [0, 0, 0.2, 1]
)
```

## Steps

1. Replace the `useTransform` map for `itemsOpacity` with the target above.

## Boundaries

- Do NOT add per-row stagger that blocks pointer events.
- Motion-only; no markup changes.

## Verification

- **Feel check**: options fade in over the last ~45% of travel; no hard pop when gap settles.
- **Done when**: map matches target values.
