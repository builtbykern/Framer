# 090 — Pixel cells: transform string instead of scale shorthand

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file, `PixelPanel` cell motion only
- **Depends on**: 087 (scale floor 0.92 must exist first)

## Problem

AUDIT.md: Framer Motion `scale` / `x` / `y` shorthands run on the main thread. Pixel grid animates many cells with `scale`.

```tsx
/* code-components/RevealTooltip.tsx:695-699 — after 087 */
initial={ freeze ? false : { opacity: 0, scale: 0.92 } }
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.92 }}
```

## Target

Animate via full transform strings + opacity:

```tsx
initial={
    freeze
        ? false
        : { opacity: 0, transform: "scale(0.92)" }
}
animate={{ opacity: 1, transform: "scale(1)" }}
exit={{ opacity: 0, transform: "scale(0.92)" }}
```

Keep `transformOrigin: "center"` on style. Keep `transition` delays. Remove `willChange` if it remains after confirming no regression (optional; may leave).

**Do not** convert Bodak SmoothTip `scaleX` / `x` in this plan (slice math is fragile; out of scope).

## Repo conventions to follow

- AUDIT Performance: full `transform` string
- Scale floor from 087: `0.92`
- `EXPAND_EASE` / `cellTx` duration unchanged (091 may fix ease token)

## Steps

1. After 087 is applied, replace cell `scale` props with `transform: "scale(...)"` as above.
2. Pin `DHpXX5x` → `push-revealtip.mjs` → `typeErrors: []`.

## Boundaries

- Do NOT edit SmoothTip / StaticSmooth / follow wrapper.
- Do NOT change durations/delays.
- Do NOT use `scale` shorthand on cells after this plan.
- If 087 not landed, STOP and land 087 first.

## Verification

- **Mechanical**: push clean; verify ok.
- **Feel check**: Tip Bottom pixel assemble feels same as post-087; no pop from zero.
- **Done when**: pixel cell motion props use `transform` strings, not `scale` number shorthand.

## Key Learnings for executor

1. Re-pin before push.
