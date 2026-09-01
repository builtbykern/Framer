# 086 — Pixel cells: avoid near-zero scale

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 1 file, PixelTip variants only

## Problem

Pixel reveal starts cells at `scale: 0.35`, which reads close to “appear from nothing” (AUDIT: never `scale(0)`; prefer `0.9–0.97` + opacity for UI). For a tooltip-sized grid this also feels showy vs Smooth mode.

```tsx
/* code-components/RevealTooltip.tsx:545 — current */
hidden: {
    opacity: 0,
    scale: 0.35,
},
```

## Target

```tsx
hidden: {
    opacity: 0,
    scale: 0.92,
},
show: {
    opacity: 1,
    scale: 1,
    transition: freeze ? { duration: 0 } : { ...cellTx, delay: dist * 0.012 },
},
```

Also drop radial delay factor from `0.018` → `0.012` so total stagger stays inside the 180ms budget from plan 083.

## Repo conventions to follow

- AUDIT physicality: scale 0.9–0.97 + opacity for entrances
- Pixel mode is delight-adjacent but still a tooltip (occasional) — keep short

## Steps

1. In `PixelTip` variants `hidden`, set `scale: 0.92`.
2. Change `delay: dist * 0.018` → `dist * 0.012`.
3. Push after re-pin.

## Boundaries

- Do NOT change `MAX_PIXEL_CELLS` or grid sizing.
- Do NOT alter SmoothTip / Bodak slices.
- Note: Bodak `scaleX: 0` on the 1px center slice is intentional (width-expand trick) — leave it.

## Verification

- **Mechanical**: `typeErrors: []`.
- **Feel check**: Tip Bottom (pixel) — cells fade/scale gently, not pop from a point; still readable under 200ms with plan 083.
- **Done when**: no pixel cell uses scale &lt; 0.9 in `hidden`.
