# 006 — Freeze buried layers (no fade-out, max 2 live tweens)

- **Status**: DONE
- **Commit**: unavailable
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/ZoomImageIntro.tsx`), ~80 lines

## Problem

After removing fade-out, every started layer stays a live `motion.div` for its full scale tween (`code-components/ZoomImageIntro.tsx:486–573`). With up to 12 full-bleed images, many concurrent `transform` animations run even when completely covered by a higher `zIndex` layer — wasted composite work and a risk of jank on mobile.

User constraint (do not regress): **no per-frame fade-out**; next zoom must cover the previous by stacking.

Current mount gate:

```ts
if (head < 0 || index > head) return null
// all index <= head are motion.div with active tweens
```

## Target

- Keep stacking (no opacity → 0 on non-last frames).
- At most **two** layers use `motion.div` with active tweens: `head - 1` (if ≥ 0) and `head`.
- Layers with `index < head - 1` render as **static** `<div>` frozen at final pose:
  - `opacity: 1`
  - `transform: scale(${scaleTo})` where `scaleTo` matches the same formula as the motion path (`grows ? full : compact`)
- When `head` advances, the layer that falls to `index < head - 1` swaps from motion → static **without** animating opacity down (hard swap to settled transform is invisible under the opaque cover of newer layers).
- Optional micro-optimization: set `willChange: "auto"` on static layers; keep `willChange: "transform, opacity"` only on live ones.

## Repo conventions to follow

- Prefer full `transform: "scale(N)"` strings (AUDIT: no FM `scale` shorthand).
- `startTransition` when updating `head`.
- Exemplar: static canvas branch already freezes with `transform: \`scale(${scale})\`` (`376–428`).

## Steps

1. Extract a pure helper in the same file:

```ts
function layerScaleEnds(
  contentZoom: number,
  zoomDirection: "in" | "out"
): { scaleFrom: number; scaleTo: number; settleTo: number } {
  const amount = Math.max(contentZoom, 1.1)
  const full = 1
  const compact = 1 / amount
  const grows = zoomDirection === "out"
  const scaleFrom = grows ? compact : full
  const scaleTo = grows ? full : compact
  const settleTo = grows ? full * SETTLE_SCALE : compact / SETTLE_SCALE
  return { scaleFrom, scaleTo, settleTo }
}
```

2. In the runtime map:
   - If `index < head - 1`: render static `<div style={{...layerStyle, zIndex, opacity: 1, transform: \`scale(${scaleTo})\`}}>` + `<img />`.
   - If `index === head || index === head - 1`: keep current `motion.div` path (fade-in + scale tween). For `index === head - 1` that is not last, still **no fade-out** (opacity stays 1 after fade-in).
3. Do **not** remount static layers with a new key that resets images — key stays `` `${image.src}-${index}` ``.
4. Push to `aNCXc66` + `typecheck({ strict: true })`.

## Implementation note (2026-07-19)

Executed with settle-complete freeze: layers become static `div` only after `onAnimationComplete` (no mid-zoom snap to `scaleTo`, which would show around a smaller covering frame). Live tweens drop as each beat finishes.
- Do NOT change pace math (plan 005) except if 005 not yet applied — then apply 005 first.
- Do NOT change exit / hold / fade-in easing (007–008).
- Do NOT add new npm dependencies.

## Verification

- **Mechanical**: typecheck clean; at most two `motion.div` image layers in React tree mid-sequence (inspect with React DevTools or count in render).
- **Feel check**:
  - Sequence looks identical to pre-change stacking (no flashes of background between frames).
  - No visible “pop” when a layer freezes under the next cover — scrub at 10% speed around beat N→N+1.
  - Phone / throttled CPU: less jank in late beats with 6+ images.
  - `prefers-reduced-motion`: unchanged (single last-frame fade).
- **Done when**: Visual parity with stacked cover + ≤2 live transform tweens after the third image has started.
