# 011 — FillingPoint fine-pointer hover gate

- **Status**: DONE

## Outcome

Hover fill gated by `matchMedia("(hover: hover) and (pointer: fine)")`.
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file

## Problem

`onMouseEnter`/`onMouseLeave` run on touch devices → sticky hover fill.

## Target

```ts
const canHover =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches
```

- Origin-fill enter/leave only when `canHover` is true (read in handlers or via state synced in useEffect)
- Coarse pointers: skip enter/leave fill (press + ripple still OK)

SSR-safe: default `canHover=false` until effect, or check inside handlers with typeof window.

## Steps

1. Add `useEffect` + matchMedia listener for `(hover: hover) and (pointer: fine)`.
2. Early-return in enter/leave when `!canHover`.
3. Push + verify.

## Boundaries

- Do NOT disable click/link
- Do NOT invent touch-specific fill choreography beyond skip

## Verification

- Desktop mouse: fill from entry point works
- Touch emulation: no sticky fill after tap
