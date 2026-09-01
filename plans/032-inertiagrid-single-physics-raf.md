# 032 — Single physics rAF for InertiaGrid

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`InertiaGrid.tsx` / snapshot SoT `state/InertiaGrid.tsx.snapshot`), ~80–120 lines restructured
- **Depends**: —
- **Project**: Framer `PBghPP85VH1cuE7BNtzx` (InertiaGrid), export `Kern_InertiaGrid`

## Problem

Each `InertiaCard` runs its own perpetual `requestAnimationFrame` loop and calls `getBoundingClientRect()` every frame. With N tiles that is N concurrent rAF callbacks + N layout reads while `shouldAnimate` is true. Cards also call `startTransition(() => setIsAnimating(…))` inside the influence radius, forcing React work every frame only to toggle `willChange`.

```tsx
/* state/InertiaGrid.tsx.snapshot:582-650 — current */
useEffect(() => {
    if (!shouldAnimate) return

    let rafId: number

    const updatePosition = () => {
        if (!itemRef.current) {
            rafId = requestAnimationFrame(updatePosition)
            return
        }

        const rect = itemRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        // … force math …
        startTransition(() => setIsAnimating(true))
        rafId = requestAnimationFrame(updatePosition)
    }

    rafId = requestAnimationFrame(updatePosition)
    return () => {
        cancelAnimationFrame(rafId)
    }
}, [/* … */])
```

```tsx
/* state/InertiaGrid.tsx.snapshot:728-733 — current */
style={{
    ...buttonStyle,
    willChange: isAnimating ? "transform" : "auto",
}}
```

## Target

- **One** physics loop owned by `Kern_InertiaGrid` (parent), not per card.
- Parent stores mouse position in existing `mouseX` / `mouseY` MotionValues.
- Parent maintains a ref map of tile centers `{ id|index, cx, cy }` refreshed on resize / layout change (ResizeObserver already exists) — **not** every frame via `getBoundingClientRect` on every tile unless layout dirty.
- Each frame: if mouse is parked at sentinel `-9999`, skip work (or write rest targets once) and **do not** keep a hot loop when idle >1 frame after rest targets are set.
- Cards expose setters or receive shared “apply targets” via callbacks/refs: set `x`/`y`/`rotate`/`itemScale` MotionValues only (no React state per frame).
- Remove `isAnimating` state and the `willChange` toggle; use static `willChange: "transform"` on animated media while `shouldAnimate`, or omit `willChange` entirely.

Preserve force math exactly:

```ts
const influenceRadius = itemSize * 1.25
const force = Math.pow((influenceRadius - distance) / influenceRadius, 2.5)
const targetX = -(dx / distance) * force * maxDisp
const targetY = -(dy / distance) * force * maxDisp
const targetRotate = -(dx / distance) * force * rotationRange
// scale: distance < itemSize * 0.9 → 1.06 else 0.94 (when inside radius)
```

Presets Drift / Repel / Glitch (`PRESET_BASE`) and `amount` intensity must stay.

## Repo conventions to follow

- SoT push path: edit Framer code file `InertiaGrid.tsx` via harness (`node scripts/framer/session.mjs` must show project InertiaGrid / `PBghPP85VH1cuE7BNtzx`).
- Exemplar of single-loop pointer work: `plans/020-quoteintake-throttle-pointer-glow.md` (one rAF coalesce).
- Keep `useIsOnFramerCanvas` static preview; no physics on canvas.
- Imports: `react`, `framer`, `framer-motion` only.

## Steps

1. Pull latest `InertiaGrid.tsx` from Framer into working buffer; confirm structure matches snapshot commit stamp (stop if drifted).
2. Lift physics rAF from `InertiaCard` into `Kern_InertiaGrid`. Pass MotionValue targets into cards (or keep MotionValues in cards but drive them from parent via imperative handles / shared registry).
3. Cache centers: recompute when `scaledItemSize`, `scaledGap`, `activeColumns`, `normalizedItems.length`, or container resize fires.
4. Idle policy: on `mouseLeave` (already sets `-9999`) cancel rAF after writing rest (`0,0,0,1`) once; restart rAF only on next pointer move when physics enabled.
5. Delete `isAnimating` / `setIsAnimating` and `willChange` ternary.
6. Do **not** implement velocity (037), composite transform (033), or glitch rewrite (036) in this plan — leave hooks compatible.
7. Push code file; `node scripts/framer/verify.mjs`.

## Boundaries

- Do NOT change Drift / Repel / Glitch spring stiffness/mass personalities (`PRESET_BASE`).
- Do NOT replace distance→force with a different model (037 adds velocity on top later).
- Do NOT enable physics on canvas.
- Do NOT add dependencies.
- Do NOT touch entrance presets, property controls, or background UI.
- If code no longer matches excerpts, STOP and report.

## Verification

- **Mechanical**: session projectId `PBghPP85VH1cuE7BNtzx`; publish code file; `node scripts/framer/verify.mjs` exit 0.
- **Feel check**:
  - Hover across a 6–12 tile grid: same push/repel feel as before (presets still distinct).
  - Leave grid: tiles settle via springs; no perpetual CPU spin (Performance panel: one rAF or none when idle).
  - Rapid mouse in/out: no animation restart from keyframes; springs retarget.
- **Done when**: zero per-card rAF; no per-frame `setState` in physics path; presets unchanged by eye.
