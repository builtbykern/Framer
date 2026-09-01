# 017 — Fewer blur layers at low Strength

- **Status**: DONE
- **Commit**: unavailable (no HEAD); stamp date 2026-07-19
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file, ~35 lines

## Problem

The component always builds **4** full-frame `backdrop-filter` layers. At Strength 2–3 the peak blur is only ~2–3px; four stacked filters still cost Safari GPU with little visual gain.

```tsx
/* .tmp/BuiltByKern_ScrollBlur.tsx:35 — current */
const LAYERS = 4

/* .tmp/BuiltByKern_ScrollBlur.tsx:41-46 — current */
function edgeMask(position: Position, index: number): string {
    const step = 100 / LAYERS
    // …
}

/* .tmp/BuiltByKern_ScrollBlur.tsx:239-242 — current */
for (let i = 0; i < LAYERS; i += 1) {
```

## Target

1. Keep `LAYERS_MAX = 4` as the high-quality stack.
2. Derive active layer count from strength:
   - `safeStrength <= 4` → **2** layers
   - else → **4** layers
3. Pass `layerCount` into `edgeMask`, `cupMask`, and `blurPx` so gradients and the power curve stay correct for 2 or 4 steps (do not leave formulas hardcoded to 4 when using 2 layers).

```tsx
/* target helpers */
const LAYERS_MAX = 4
const LAYERS_LOW = 2
const STRENGTH_LAYER_CUTOFF = 4

function layerCountFor(strength: number): number {
    return strength <= STRENGTH_LAYER_CUTOFF ? LAYERS_LOW : LAYERS_MAX
}

function edgeMask(
    position: Position,
    index: number,
    layerCount: number
): string {
    const step = 100 / layerCount
    const coverTop = 100 - index * step
    const fadeStart = Math.max(0, coverTop - step * 1.45)
    const dir = position === "bottom" ? "to top" : "to bottom"
    return `linear-gradient(${dir}, #fff 0%, #fff ${fadeStart}%, transparent ${coverTop}%)`
}

function blurPx(strength: number, index: number, layerCount: number): number {
    const progress = (index + 1) / layerCount
    return Math.pow(progress, 3.5) * strength
}

/* cupMask: replace every LAYERS / (LAYERS - 1) with layerCount / Math.max(1, layerCount - 1) */
```

In the component:

```tsx
const layerCount = layerCountFor(safeStrength) // use safeStrength, not reduced, so reduced-motion still follows the same cutoff by visual peak intent; OR use effectiveStrength — prefer safeStrength so prefersReduced doesn't unexpectedly drop layers twice

const layers = useMemo(() => {
    // … for (let i = 0; i < layerCount; i += 1)
    // edgeMask(activePosition, i, layerCount)
    // cupMask(activePosition, i, inverted, layerCount)
    // blurPx(effectiveStrength, i, layerCount)
}, [activePosition, activeShape, effectiveStrength, layerCount /*, inView gates if 015 applied */])
```

Use `safeStrength` for the cutoff so reduced-motion at Strength 8 still gets 4 layers (weaker blur via `effectiveStrength`, not fewer bands).

## Repo conventions to follow

- Soft progressive stack remains the product look; only reduce count at low strength.
- Peak blur still capped by STRENGTH_MAX = 10.
- If plan 015 is already applied, keep the `inView` early return in the same `useMemo`.

## Steps

1. Rename `LAYERS` → `LAYERS_MAX`; add `LAYERS_LOW`, `STRENGTH_LAYER_CUTOFF`, `layerCountFor`.
2. Update `edgeMask`, `cupMask`, `blurPx` signatures to take `layerCount` and use it in all progress math.
3. In the component, compute `layerCount = layerCountFor(safeStrength)` and drive the layer loop with it.
4. Push `yC_uQFE`, typecheck, verify.

## Boundaries

- Do NOT change Strength min/max/default (2 / 10 / 8).
- Do NOT change Shape mask *character* (Edge / U / ∩) beyond scaling band math to `layerCount`.
- Do NOT animate blur strength over time in this plan.
- Do NOT add a new property control for layer count (keep automatic).

## Verification

- **Mechanical**: typecheck + verify ok.
- **Feel check**:
  - Strength **3**, Always On: soft edge still readable; DevTools Elements shows **2** absolute blur children.
  - Strength **8**, Always On: **4** children; look matches current dense progressive stack.
  - Strength **4**: exactly 2 layers (cutoff inclusive).
  - Strength **5**: 4 layers.
  - Safari Preview: no flicker when dragging Strength across 4↔5.
- **Done when**: DOM layer count matches the cutoff table above for 3, 4, 5, and 8.
