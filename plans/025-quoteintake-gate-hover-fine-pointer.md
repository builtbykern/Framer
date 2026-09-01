# 025 — Gate whileHover for fine pointers only

- **Status**: DONE
- **Commit**: n/a (no git HEAD; SoT `state/QuoteIntake.tsx` Version: 3.9.1)
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file, ~25 lines

## Problem

`whileHover` on CTAs (and formerly RadioTiles) is not gated for coarse pointers. Touch can latch hover scale (`scale(1.015)`), leaving sticky transforms after tap.

```tsx
/* state/QuoteIntake.tsx:549 — current */
const ctaHover = motionOk ? { transform: "scale(1.015)" } : undefined
```

```tsx
/* state/QuoteIntake.tsx:793, 824 — usage */
whileHover={ctaHover}
whileHover={!submitting ? ctaHover : undefined}
```

AUDIT:

```css
@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); }
}
```

## Target

- Introduce a boolean `canHover` evaluated once (client-only):

```tsx
const canHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
```

- Combine with existing gate:

```tsx
const hoverOk = motionOk && canHover
const ctaHover = hoverOk ? { transform: "scale(1.015)" } : undefined
```

- `whileTap` remains `motionOk ? PRESS_TAP : undefined` (press feedback is allowed on touch; hover scale is not).
- RadioTile: after 022 there is no hover — still pass `hoverOk` if any hover is reintroduced.
- SSR / canvas: `useIsOnFramerCanvas` already forces `motionOk` false on canvas; for SSR first paint, `canHover` false is OK (no window).

Optional: subscribe to `matchMedia` `change` events if device can switch input — nice-to-have, not required.

## Repo conventions to follow

- Existing `typeof window !== "undefined"` mindset; `motionOk` at L405.
- Do not nuke all motion under reduced-motion — only drop movement; opacity/press already handled.

## Steps

1. Add `canHover` (and optional `useState`+`useEffect` if you need reactivity; otherwise compute each render behind `typeof window` is enough for Marketplace).
2. Derive `ctaHover` from `motionOk && canHover`.
3. Confirm RadioTile has no `whileHover` (022) or gate it with the same `hoverOk`.
4. Push, typecheck, verify.

## Boundaries

- Do NOT disable `whileTap` on touch.
- Do NOT change reduced-motion semantics beyond existing `motionOk`.
- Do NOT add CSS files (single-file Framer component constraint).
- Do NOT add dependencies.

## Verification

- **Mechanical**: typecheck 0; verify OK.
- **Feel check**:
  - Desktop mouse: CTA still scales slightly on hover.
  - DevTools device mode / touch emulation: tap CTA — no lingering `scale(1.015)` after release; only brief press scale.
  - `prefers-reduced-motion`: no hover or tap transform (`motionOk` false).
- **Done when**: hover scale never applies unless `(hover: hover) and (pointer: fine)`.
