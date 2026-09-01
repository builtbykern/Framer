# 022 — Restore a concrete origin paint object

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (`code-components/Kern_FillingPoint.tsx`)

## Problem

The origin path currently renders a feathered radial wash and fades opacity for
the entire scale transition:

```tsx
animate={{
    transform: `scale(${layer.filled ? 1 : SCALE_HIDDEN})`,
    opacity: layer.filled ? 1 : 0,
}}
background: washBackground(layer.color)
```

The edge never becomes a concrete paint object, so the component reads as a
generic glow instead of a purchasable pointer-origin interaction.

## Target

- Default `fillStyle="solid"` uses `backgroundColor` and a 50% radius.
- Optional `fillStyle="soft"` retains the radial wash.
- Hidden scale is `0.06`, never zero.
- Enter opacity reaches 1 in `90ms`.
- Exit remains opaque through the retract and fades only during the final
  `100ms`.
- Every delayed layer uses the pointer-enter snapshot; no live-pointer drift.

## Repo conventions to follow

- Keep full `transform: scale(...)` strings and
  `willChange: "transform, opacity"`.
- Preserve `useIsStaticRenderer`, the fine-pointer media query, and the
  reduced-motion opacity branch.

## Steps

1. Add `FillStyle` and render solid/soft backgrounds without changing markup.
2. Change the origin hidden scale to `0.06`.
3. Use direction-specific opacity timing so the idle seed is invisible without
   softening the visible paint edge.
4. Activate every delayed layer with the captured `start` point.
5. Push with `node scripts/framer/push-fillingpoint.mjs`.

## Boundaries

- Do NOT use clip-path, masks, ripple, or cursor-following.
- Do NOT change touch, keyboard, or reduced-motion semantics.
- Do NOT publish.

## Verification

- **Mechanical**: push reports `typeErrors: []`.
- **Feel check**: the disk edge is crisp at normal speed, all layers share one
  origin, and idle shows no residual disk.
- **Done when**: solid is the default and soft remains an optional style.
