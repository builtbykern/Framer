# 078 — Dive Field: cache scatter hash by absIndex

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (draw + rebuild)
- **Audit finding**: improve-animations Dive Field 2026-08-04-restore #7
- **Supersedes craft of**: template 151 — missing after restore

## Problem

Every visible layer every frame recomputes deterministic hashes:

```tsx
// code-components/DiveField.tsx ~869–872
layer.offX = (hash(absIndex * 13.7 + 1.3) - 0.5) * 2
layer.offY = (hash(absIndex * 27.9 + 5.1) - 0.5) * 2
layer.rot = (hash(absIndex * 7.3 + 9.7) - 0.5) * 2
layer.seed = hash(absIndex * 3.1 + 0.7) * 37
```

Same `absIndex` → same values; waste on the hot path.

## Target

```ts
const scatterCache = new Map<
    number,
    { offX: number; offY: number; rot: number; seed: number }
>()
```

In the layer loop:

```tsx
let scatter = scatterCache.get(absIndex)
if (!scatter) {
    scatter = {
        offX: (hash(absIndex * 13.7 + 1.3) - 0.5) * 2,
        offY: (hash(absIndex * 27.9 + 5.1) - 0.5) * 2,
        rot: (hash(absIndex * 7.3 + 9.7) - 0.5) * 2,
        seed: hash(absIndex * 3.1 + 0.7) * 37,
    }
    scatterCache.set(absIndex, scatter)
}
layer.offX = scatter.offX
layer.offY = scatter.offY
layer.rot = scatter.rot
layer.seed = scatter.seed
```

Call `scatterCache.clear()` when `rebuildLayers` replaces textures (after wiping `eng.layers`).

**Do not** change hash formulas.

## Repo conventions to follow

- Existing `hash()` helper — reuse formulas verbatim.
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. Add `scatterCache` in the WebGL effect closure.
2. Replace per-frame hash assigns with lookup/create.
3. Clear cache in `rebuildLayers`.
4. Push + verify.

## Boundaries

- Do NOT change scatter/tilt camera math or hash seeds.
- Do NOT change Look/Camera defaults.
- If scatter already cached, STOP and report.

## Verification

- **Mechanical**: push + verify green.
- **Feel check**: scatter/tilt pattern unchanged at same indices; infinite wrap still varies by wrapped `absIndex`.
- **Done when**: hash runs only on cache miss.
