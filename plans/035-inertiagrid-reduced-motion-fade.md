# 035 — Reduced-motion keeps entrance fade

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file, ~40 lines
- **Depends**: —
- **Project**: Framer `PBghPP85VH1cuE7BNtzx`, `Kern_InertiaGrid`

## Problem

`shouldAnimate = !isCanvas && !prefersReduced && isInView` disables the entire motion card path when the user prefers reduced motion. The fallback is a static `<button>` with no entrance feedback at all. AUDIT.md: reduced motion means fewer/gentler animations, **not zero** — keep opacity comprehension aids; drop position/scale physics.

```ts
/* state/InertiaGrid.tsx.snapshot:460 — current */
const shouldAnimate = !isCanvas && !prefersReduced && isInView
```

```tsx
/* state/InertiaGrid.tsx.snapshot:705-718 — current */
if (!shouldAnimate) {
    return (
        <button
            style={{ ...buttonStyle, opacity: 1 }}
            aria-label={item.alt}
            onKeyDown={handleKeyDown}
        >
            {/* static img / placeholder */}
        </button>
    )
}
```

## Target

Split flags:

```ts
const physicsOk = !isCanvas && !prefersReduced && isInView
const entranceOk = !isCanvas && isInView // allowed under reduced motion
```

- **Physics** (mouse/pointer loop, springs on media): only when `physicsOk`.
- **Entrance**:
  - If `!prefersReduced`: existing `ENTRANCE_PRESETS[entrance.preset]` + spring transition (after 034 values if applied).
  - If `prefersReduced`: opacity-only entrance:

```ts
const reducedEntrance = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
}
transition: {
    duration: 0.2,
    ease: [0.23, 1, 0.32, 1], // AUDIT --ease-out
    delay: Math.min(index * 0.03, 0.24),
}
```

- Always use `motion.button` when `entranceOk` (or always off-canvas) so fade can run; when `!physicsOk`, media is plain `img`/`div` **without** spring transforms.
- Canvas path remains fully static (unchanged).

## Repo conventions to follow

- Already uses `useReducedMotion()` — keep it; branch transforms, do not delete the hook.
- Exemplar philosophy: AUDIT.md Accessibility section (opacity/color kept, movement dropped).

## Steps

1. Replace single `shouldAnimate` with `physicsOk` / `entranceOk` (or equivalent names) and thread into `InertiaCard`.
2. Reduced-motion branch: opacity-only `initial` / `whileInView` as above; no `x`/`y`/`scale`/`rotate` on entrance.
3. Ensure physics rAF / mouse handlers gate on `physicsOk` only.
4. Do not show entrance on canvas (`isCanvas` still short-circuits to static tree).
5. Push + verify.

## Boundaries

- Do NOT remove reduced-motion support or force physics when reduced.
- Do NOT change preset personalities.
- Do NOT add a new property control for this.
- STOP if `useReducedMotion` was removed since commit stamp.

## Verification

- **Mechanical**: verify.mjs OK.
- **Feel check**: DevTools Rendering → `prefers-reduced-motion: reduce` → tiles fade in ~200ms, no slide/scale/spiral; cursor move does **not** displace tiles. With reduce off, physics + full entrance restore.
- **Done when**: reduced path never applies translate/scale/rotate; opacity entrance present; physics off under reduce.
