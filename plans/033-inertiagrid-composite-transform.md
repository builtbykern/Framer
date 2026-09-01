# 033 — Composite transform for InertiaGrid tiles

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file, ~30–50 lines
- **Depends**: 032 (single physics rAF — MotionValues still driven the same way)
- **Project**: Framer `PBghPP85VH1cuE7BNtzx`, `Kern_InertiaGrid`

## Problem

Tile media binds Framer Motion layout shorthands `x`, `y`, `rotate`, `scale` separately. Per AUDIT.md these shorthands run on the main thread and drop frames under load; premium listing needs compositor-friendly transforms.

```tsx
/* state/InertiaGrid.tsx.snapshot:748-768 — current */
<motion.img
    src={item.src}
    alt={item.alt}
    style={{
        ...imageStyle,
        x: springX,
        y: springY,
        rotate: springRotate,
        scale: springScale,
    }}
/>
```

(Same pattern on `motion.div` placeholder.)

## Target

Drive a single CSS `transform` string from the four springs:

```ts
// target — useTransform on springX, springY, springRotate, springScale
const transform = useTransform(
    [springX, springY, springRotate, springScale],
    ([tx, ty, r, s]) =>
        `translate3d(${tx}px, ${ty}px, 0) rotate(${r}deg) scale(${s})`
)
```

```tsx
/* target style */
style={{
    ...imageStyle,
    transform, // MotionValue<string>
}}
```

- Keep `useSpring` configs identical to current (`SPRING_POSITION` + preset stiffness/mass; `SPRING_SCALE` unchanged).
- Prefer `translate3d` for layer promotion.
- Remove unused shorthand bindings; `useTransform` is already imported in the file (line 12) — wire it; do not leave dead imports.

## Repo conventions to follow

- File already imports `useTransform` from `framer-motion` but does not use it — this plan is the intended consumer.
- Exemplar pattern: compose transform string via `useTransform` rather than Motion `x`/`y` props (AUDIT.md Performance).
- After 032, springs may live in card or parent; bind `useTransform` where the four spring MotionValues exist.

## Steps

1. Confirm 032 is applied (single loop still writing the four motion values / springs).
2. In `InertiaCard` (or wherever springs live), add `useTransform` composite as above.
3. Replace `x`/`y`/`rotate`/`scale` style keys with `transform`.
4. Apply to both `motion.img` and placeholder `motion.div`.
5. Push + verify.

## Boundaries

- Do NOT change spring stiffness/damping/mass numbers.
- Do NOT change force math, presets, or entrance animations.
- Do NOT add GSAP or extra packages.
- Do NOT implement press scale (039) here — 039 stacks `whileTap` on the button wrapper.

## Verification

- **Mechanical**: `verify.mjs` exit 0; no TS unused-import errors.
- **Feel check**: Drift / Repel / Glitch look identical to pre-change; scrub Animations at 10% — transform updates as one matrix, no layout thrash on siblings.
- **Done when**: no `style.x` / `style.y` / `style.rotate` / `style.scale` on tile media; composite `transform` only.
