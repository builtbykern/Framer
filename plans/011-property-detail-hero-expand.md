# 011 — Property detail hero “opens large”

- **Status**: DONE
- **Commit**: unavailable
- **Severity**: HIGH
- **Category**: Easing & duration / Physicality
- **Estimated scope**: appearEffect on hero frames

## Problem

Hero wrapper `TanN7b8Lp` uses onMount appear: `opacity: 0`, scale `1`, tween **0.7s**. Image fades in from nothing after navigation — no “opens large” continuity.

## Target

```
appearEffect.trigger = onMount
appearEffect.replay = false
appearEffect.enter.opacity = 0
appearEffect.enter.scale = 1.06
appearEffect.enter.x = 0
appearEffect.enter.y = 0
appearEffect.enter.transition = "tween 0.23,1,0.32,1 0.45s 0s"
```

Apply to Desktop `TanN7b8Lp` and replicas `IQmBTrFpbTanN7b8Lp`, `MrTKJzwELTanN7b8Lp` if they override.

## Boundaries

- Do NOT add View Transitions (012 deferred).
- Do NOT change InertiaFrame internals.
- Do NOT restore LoadingScreen.

## Verification

- Navigate listing→detail: hero settles from slight overscale to 1 in ~450ms; no loader.
