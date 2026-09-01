# 023 — Build the cinematic reverse cascade

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Easing, duration & interruptibility
- **Estimated scope**: 1 file (`code-components/Kern_FillingPoint.tsx`)

## Problem

The component uses one `240ms` transition and exits layers in the same order as
enter. Because the top layer exits last, hover out appears frozen before it
blinks away.

```tsx
fills.forEach((stop, index) => {
    schedule(stop.delay, () => deactivateLayer(index))
})
```

## Target

- Cinematic enter: `480ms`, ease `[0.23, 1, 0.32, 1]`.
- Cinematic exit: `600ms`, same ease family.
- Default delays: `0 / 90 / 180ms`; cap `280ms`.
- Exit reverses visual stacking: top at `0ms`, middle at `90ms`, bottom at
  `180ms`.
- Origin locks remain alive for `maxDelay + exitDuration + 80ms`.
- Rapid enter/leave/re-enter cancels pending timers and retargets cleanly.

## Repo conventions to follow

- Keep timer scheduling as the single stagger source of truth.
- Keep press/touch feedback at `120ms` in / `80ms` out.
- Keep reduced motion full-bleed and transform-free.

## Steps

1. Add direction-aware resolved transitions.
2. Raise delay cap and update curated defaults.
3. Reverse exit delay by `maxDelay - stop.delay`.
4. Derive lock lifetime from the resolved exit duration, with a safe fallback
   for custom springs.
5. Verify interruption at full speed and 0.25× playback.

## Boundaries

- Do NOT add bounce to the cinematic default.
- Do NOT add a second stagger mechanism in Motion transitions.
- Do NOT publish.

## Verification

- **Mechanical**: push reports `typeErrors: []`; verify has no blocking errors.
- **Feel check**: enter reads as three forward paint beats; leave reacts
  immediately and reveals the colors in reverse before returning to base.
- **Done when**: no visible leave pause and no stuck layers after rapid flicker.
