# 003 — Cap blur and stop driving filters via parent CSS var

- **Status**: DONE
- **Commit**: none (repo has no commits; stamp against local `.tmp/BuiltByKern_ScrollBlur.tsx` + Framer code file `yC_uQFE`)
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file, ~40–60 lines

## Problem

1. Strength is written as a **CSS custom property on the parent**; each of 3 layers uses `blur(calc(Npx * var(--kern-blur-str)))`. AUDIT: *Don't drive child transforms via a CSS variable on the parent — it recalcs styles for all children.* Same cost pattern applies to filter.

2. `blurAmount` control max and `safeBlur` clamp allow **32px**. AUDIT: keep transition-time `filter: blur()` **under 20px** (Safari especially). Progressive stack can push effective layer blur near that max at strength 1.

```tsx
/* .tmp/BuiltByKern_ScrollBlur.tsx:84, 328-339, 447 — current */
const STRENGTH_VAR = "--kern-blur-str"
const safeBlur = Math.max(0, Math.min(32, blurAmount))
// …
node.style.setProperty(STRENGTH_VAR, String(Math.max(0, value)))
// …
const filter = `blur(calc(${layerBlur}px * var(${STRENGTH_VAR}, 0)))`
```

```tsx
/* property control — current */
blurAmount: {
    max: 32,
    // …
}
```

## Target

**A. Cap**

- `safeBlur = Math.max(0, Math.min(20, blurAmount))`
- Property control `blurAmount.max: 20` (default can stay `14`)
- Update description to mention Safari-friendly max.

**B. Write filters on layers directly**

- Remove `STRENGTH_VAR` / `--kern-blur-str`.
- On each layer node, set `data-kern-blur` (or `data-blur-px`) to the **base** `layerBlur` number (pre-strength).
- In the layout-effect `write(value)` callback:

```tsx
/* target write path */
const write = (value: number) => {
    const root = containerRef.current
    if (!root) return
    const s = Math.max(0, value)
    const layers = root.querySelectorAll<HTMLElement>("[data-kern-blur]")
    layers.forEach((el) => {
        const base = Number(el.dataset.kernBlur)
        if (!Number.isFinite(base)) return
        const px = Math.max(0, base * s)
        const filter = px > 0.001 ? `blur(${px}px)` : "none"
        el.style.backdropFilter = filter
        el.style.webkitBackdropFilter = filter
    })
}
```

- Layer render: **do not** set `backdropFilter` / `WebkitBackdropFilter` in the static style object when using the animated path; set only mask + positioning (+ fallback tint styles). Initial paint comes from the layout-effect `write(...)`.
- Fallback tint mode (no backdrop): leave as-is (opacity/background); no `data-kern-blur` needed, or skip write when `shouldRenderFallback`.

Fallback / unsupported: if `shouldRenderFallback`, optionally drive opacity from strength instead of blur — **out of scope unless already trivial**; primary path is backdrop layers only.

## Repo conventions to follow

- Keep `LAYER_COUNT = 3` and existing mask/`layerBlurPx` math — only change how strength multiplies into the filter string.
- `aria-hidden="true"` on layers stays.
- Prefer `dataset` over React state per frame — strength already updates via MotionValue `on("change")`.

## Steps

1. Change blur clamp and control `max` from `32` → `20`.
2. Add `data-kern-blur={String(layerBlur)}` on each backdrop layer (when not fallback).
3. Replace `setProperty(STRENGTH_VAR, …)` with the per-layer `write` above.
4. Remove `STRENGTH_VAR` constant and `calc(... var(...))` filter strings from layer styles.
5. Ensure first `write(blurStrength.get())` still runs after layers mount (layout effect deps / order). If layers are empty on first paint, call `write` again after paint (`requestAnimationFrame` once) — only if needed.
6. Push, typecheck, verify. Feel-check Safari if available.

## Boundaries

- Do NOT reduce `LAYER_COUNT` further.
- Do NOT switch to WebGL.
- Do NOT animate layout properties (`height`, `top`, etc.).
- Do NOT change Motion transitions (plans 001/002).
- If canvas Always On / reduced-motion paths break (filters stuck at 0), fix write subscription — do not reintroduce the CSS var.

## Verification

- **Mechanical**: typecheck + `verify.mjs` clean; no remaining `--kern-blur-str` / `STRENGTH_VAR` in file.
- **Feel check**:
  - Preview Follow Scroll: Edge/U still readable; rise/dissolve still works.
  - DevTools: on scroll, inspect a layer — `backdrop-filter` updates as `blur(Xpx)` with changing X; parent has **no** `--kern-blur-str`.
  - At Blur control = 20, no layer exceeds 20px × strength (strength ≤ 1).
  - Prefer Safari: scrolling a tall page should feel less sticky than with 32px + CSS var (subjective; note if unchanged).
  - Reduced motion: calm veil filters apply once at 0.4 strength.
- **Done when**: CSS var gone; max blur 20; strength updates write filters on `[data-kern-blur]` nodes only.
