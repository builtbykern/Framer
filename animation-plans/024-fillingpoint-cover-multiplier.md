# 024 — Retune paint cover so scale travel is readable

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (`code-components/Kern_FillingPoint.tsx`)

## Problem

`coverForElement` multiplies `max(width, height)` by `3.4`. The CTA is already
flooded near scale `0.35–0.55`, so most of the cinematic tween is invisible
overshoot. With a strong ease-out this makes enter feel ~70–120ms.

```ts
/* code-components/Kern_FillingPoint.tsx:203-206 — current */
function coverForElement(el: Element): number {
    const rect = el.getBoundingClientRect()
    return Math.max(rect.width, rect.height) * 3.4 || 960
}
```

## Target

```ts
const COVER_MULTIPLIER = 2.4

function coverForElement(el: Element): number {
    const rect = el.getBoundingClientRect()
    return Math.max(rect.width, rect.height) * COVER_MULTIPLIER || 960
}
```

Button fill should complete near **60–75%** of the enter tween for typical
origins (center and edge). Soft wash mode must still cover wide CTAs.

## Repo conventions to follow

- Keep pointer-origin lock and `marginLeft/Top: -coverSize/2` centering.
- Soft mode comment may note the multiplier; do not reintroduce clip-path.

## Steps

1. Replace `3.4` with named `COVER_MULTIPLIER = 2.4` in `coverForElement`.
2. Feel-check Soft fill on a wide CTA — no corner bleed of base color at rest
   filled state.

## Boundaries

- Do NOT change origin locking, layer stacking, or solid vs soft paint media.
- Do NOT publish.

## Verification

- **Mechanical**: push `typeErrors: []`.
- **Feel check**: at 0.25× playback, the visible CTA flood lasts through most
  of the enter; idle still fully covered when `filled === true`.
- **Done when**: enter no longer feels like a flash on Solid + Cinematic.
