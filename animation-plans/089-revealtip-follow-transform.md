# 089 — Follow-cursor tip via transform MotionValues

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Performance / Physicality (gesture)
- **Estimated scope**: 1 file, follow path in `RevealTooltip` + `clampTipPos` usage
- **Includes**: find-animation-opportunities #1 (spatial follow without layout thrash)

## Problem

Pixel follow updates React state every `pointermove` and styles `left`/`top` on a `position: fixed` tip — layout thrash; tip can feel sticky/janky.

```tsx
/* code-components/RevealTooltip.tsx:820-825 — current */
const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
        if (!follow) return
        setCursor({ x: e.clientX, y: e.clientY })
    },
    [follow]
)
```

```tsx
/* code-components/RevealTooltip.tsx:959-965 — current */
style={{
    position: "fixed",
    left: tipPos.left,
    top: tipPos.top,
    zIndex: 99999,
    pointerEvents: "none",
}}
```

AUDIT.md Performance: animate `transform` and `opacity` only — not `left`/`top`.

## Target

1. Import `useMotionValue`, `useMotionTemplate` (or set `transform` via `motionValue` + style) from `framer-motion`.
2. Keep `cursor` state **only** for open/clamp seed on enter if needed; on move, write MotionValues without `setState`.
3. Follow wrapper:

```tsx
// tipMvX / tipMvY are MotionValues (px of translate), OR left/top stay 0 and transform carries position
style={{
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 99999,
    pointerEvents: "none",
    transform: useMotionTemplate`translate3d(${tipMvX}px, ${tipMvY}px, 0)`,
}}
```

Or equivalent: `style={{ x: tipMvX, y: tipMvY }}` is **not** preferred (AUDIT: Motion `x`/`y` shorthands are main-thread). Prefer **`transform: translate3d(...)`** via motion template / `useTransform`.

4. On pointer enter/move: `const { left, top } = clampTipPos(clientX, clientY, tipW, tipH)` then `tipMvX.set(left)`, `tipMvY.set(top)`.
5. Reduced motion / freeze: still set values, no spring. Optional soft spring only if feel-check wants lag — **default = direct `.set` (zero lag)** for tip utility. Do not add spring unless Preview feels teleport-harsh after transform migration.
6. Root stays `position: relative`. Tip child may stay `fixed` (Engram: tip fixed OK).

## Repo conventions to follow

- AUDIT: transform + opacity only; tooltip budget unchanged
- Static renderer: follow already disabled when `isStatic` (`follow = pixel && followCursor && !isStatic`)
- Push: `scripts/framer/push-revealtip.mjs` after pin `DHpXX5x`

## Steps

1. Add MotionValues for follow X/Y in `RevealTooltip`.
2. Rewrite `onPointerEnter` / `onPointerMove` to update MotionValues through `clampTipPos` without per-move `setCursor` (may keep one state set on enter for non-follow code paths if still required — prefer deleting `cursor` state if only used for follow).
3. Replace follow wrapper `left`/`top` tipPos with `translate3d` from MotionValues; opacity enter/exit can remain on the same `motion.div`.
4. Confirm SSR: no `window` in render; `clampTipPos` already guards `typeof window`.
5. Pin + `push-revealtip.mjs` + `verify.mjs`.

## Boundaries

- Do NOT change pixel cell animation (087/088).
- Do NOT use `position: fixed` on the **root**.
- Do NOT add GSAP or new packages.
- Do NOT enable follow in static renderer.
- If `clampTipPos` API changed, STOP.

## Verification

- **Mechanical**: `typeErrors: []`; verify ok.
- **Feel check**: Preview Tip Bottom with Follow On — tip tracks cursor smoothly; DevTools Performance: no layout thrash storm on move; Animations: transform updates, not left/top churn.
- **Reduced motion**: tip still appears; no spring oscillation.
- **Done when**: follow path does not call `setState` on every `pointermove` and does not animate layout `left`/`top`.

## Key Learnings for executor

1. Re-pin `DHpXX5x` before push.
2. Prefer direct MotionValue `.set` over spring for utility tips.
