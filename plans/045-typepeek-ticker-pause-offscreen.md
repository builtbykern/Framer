# 045 — Type Peek ticker: pause off-screen / hidden tab; drop standing will-change

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/TypePeek.tsx`), ~50–80 lines

## Problem

Three infinite CSS marquees always run in Preview with permanent layer promotion:

```tsx
/* code-components/TypePeek.tsx:1059–1076 — current */
style={{
    display: "flex",
    alignItems: "baseline",
    width: "max-content",
    animation: canRun
        ? `${direction === "left" ? "typePeekTickerLeft" : "typePeekTickerRight"} ${duration}s linear infinite`
        : "none",
    animationPlayState: paused ? "paused" : "running",
    willChange: canRun ? "transform" : undefined,
}}
```

`paused` only covers hover. No pause when the component is off-screen or the tab is hidden. Continuous compositor work on large tracks.

## Target

- Keep CSS `@keyframes` + `translate3d` + `linear` (correct for marquees).
- Remove standing `willChange: "transform"` (browser promotes animated transforms adequately).
- Add pause when **any** of:
  1. Existing `ticker.pauseOnHover && pausedRow === rowIndex`
  2. `document.visibilityState === "hidden"`
  3. Root not intersecting viewport (`IntersectionObserver`, `threshold: 0`, rootMargin optional `"50px"`)
- SSR-safe: gate `window` / `document` with `typeof window !== "undefined"`; observers only when `!isStatic && !reducedMotion`.
- Static / reduced-motion: `animation: none` unchanged (`canRun` false).

```tsx
// playState target
animationPlayState:
  !canRun || paused || tabHidden || !inView ? "paused" : "running"
```

## Repo conventions to follow

- fixing-motion-performance: pause/stop when off-screen; CSS for predetermined motion.
- Exemplar pause pattern: `plans/015-scrollblur-viewport-gate.md` (IntersectionObserver gate).
- Static renderer freeze same tree — do not early-return a divergent mock.

## Steps

1. `useRef` on root (`data-tp-root`) or field.
2. `useState`/`useSyncExternalStore`-style flags: `inView` (default `true`), `tabHidden` (default `false`).
3. `useEffect`: `IntersectionObserver` on root; `visibilitychange` listener; cleanup disconnect/remove.
4. Fold into `animationPlayState` for every ticker track.
5. Delete `willChange: canRun ? "transform" : undefined`.
6. `push-typepeek.mjs` + `verify.mjs`.

## Boundaries

- Do NOT rewrite ticker as Framer Motion `animate` loop / rAF.
- Do NOT change row split / duration / alternate defaults in this plan.
- Do NOT pause on scroll position polling.

## Verification

- **Mechanical**: typeErrors []; verify exit 0.
- **Feel check**:
  - Preview: lanes move; hover still pauses that row.
  - Switch tab away → animations paused (Animations panel).
  - Scroll component off-screen (if page allows) → paused; back → running.
  - Canvas static: no keyframes applied.
- **Done when**: no standing will-change on tracks; off-screen + hidden-tab pause wired.
