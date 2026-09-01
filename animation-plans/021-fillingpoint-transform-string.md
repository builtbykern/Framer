# 021 — Origin fill via transform string

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/Kern_FillingPoint.tsx`)

## Problem

`animate={{ scale }}` shorthand on the wash layers — fine for one CTA, but FM recommends explicit `transform` strings for compositor clarity.

## Target

```tsx
animate={{
  transform: `scale(${filled ? 1 : SCALE_HIDDEN})`,
  opacity: filled ? 1 : 0,
}}
```

Keep `transformOrigin: "50% 50%"`. No layout props animated.

## Verification

Feel identical to pre-change; enter/leave still origin-locked. Typecheck clean.
