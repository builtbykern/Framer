# 026 — Widen cascade stagger for three readable beats

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file + Framer demo instance fills if overridden

## Problem

Defaults `0 / 90 / 180` sit near the *perceived* fill time, so layers 2–3 start
after layer 1 already looks done. The cascade reads as a flash, not three beats.

```ts
/* code-components/Kern_FillingPoint.tsx:72-73, 151-155 — current */
const DEFAULT_DELAY_STEP_MS = 90
const DEFAULT_FILLS: FillStop[] = [
    { color: "#FFFFFF", delay: 0 },
    { color: "#6FD3FF", delay: 90 },
    { color: "#276BFF", delay: 180 },
]
```

## Target

```ts
const DEFAULT_DELAY_STEP_MS = 140
const DEFAULT_FILLS: FillStop[] = [
    { color: "#FFFFFF", delay: 0 },
    { color: "#6FD3FF", delay: 140 },
    { color: "#276BFF", delay: 280 },
]
```

Keep `MAX_DELAY_MS = 280`. Reverse exit continues to use the same delay values
mirrored by visual stack.

If the Framer demo instance (`Gd8zP574E`) stores explicit fill delays, set them
to `0 / 140 / 280` after push.

## Repo conventions to follow

- Timer `schedule(stop.delay)` remains the single stagger source of truth.
- Do not also put `transition.delay` on Motion layers.

## Steps

1. Update `DEFAULT_DELAY_STEP_MS` and `DEFAULT_FILLS`.
2. Update fills control description if it still implies `90` spacing.
3. Sync demo instance delays if they override component defaults.

## Boundaries

- Do NOT raise `MAX_DELAY_MS` above 280 in this plan.
- Do NOT publish.

## Verification

- **Feel check**: three named color beats on enter; reverse order on leave.
- **Done when**: middle cyan is visibly staged between white and electric blue.
