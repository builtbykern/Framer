# 010 — FillingPoint reduced-motion opacity fill

- **Status**: DONE

## Outcome

Reduced-motion path: full-bleed opacity fill 180ms; default path keeps origin spring.
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file

## Problem

```tsx
// current
const fillTransition =
    isStatic || prefersReducedMotion
        ? { duration: 0 }
        : { type: "spring", stiffness, damping }
```

Reduced motion nukes all fill feedback (`duration: 0`).

## Target

When `useReducedMotion()`:
- Do **not** animate scale spring
- Fill layer uses `opacity: filled ? 1 : 0` with `{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }`
- Scale stays at 1 covering full button (positioned center or full inset) OR scale 1 with opacity only on a full-bleed rect

Concrete: under reduced motion, render a full-bleed `motion.div` (inset 0, borderRadius inherit) animating opacity only — skip origin circle scale.

## Steps

1. Branch render: reduced → full-bleed opacity fill; default → origin circle spring scale.
2. Push + verify.

## Boundaries

- Do NOT remove hover fill entirely under reduced motion
- Keep `useIsStaticRenderer` static path (no fill motion)

## Verification

- Emulate reduced-motion: fill fades 180ms, no spring
- Default path unchanged spring
