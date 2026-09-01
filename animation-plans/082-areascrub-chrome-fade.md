# 082 — Area Scrub: soft scrub chrome enter/exit

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Purpose & Physicality + Interruptibility
- **Estimated scope**: 1 file (`code-components/AreaScrub.tsx`), ~50 lines

## Problem

Spec Interaction table requires:

- Pointer enter → crosshair + beacon **fade/scale in**
- Pointer leave → scrub chrome **out suave**

Runtime hard-mounts/unmounts chrome when `showChrome` flips (`{showChrome ? <div>…`}), so enter/leave pops and mid-spring leave cannot interrupt cleanly.

```tsx
/* code-components/AreaScrub.tsx — current pattern */
const showChrome = canvasPeek || liveChrome
{showChrome ? (
  <div>…crosshair + beacon…</div>
) : null}
```

## Target

Always render the chrome layer when `scrubEnabled && !isStatic` **or** `canvasPeek`. Drive visibility with opacity (+ slight scale on beacon only):

| State | opacity | beacon scale |
|-------|---------|--------------|
| Hidden (live idle) | 0 | 0.96 |
| Visible (scrubbing or canvas peek) | 1 | 1 |

Transition (AUDIT ease-out, UI budget):

```ts
const CHROME_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1]
const chromeTransition = {
  opacity: { duration: 0.18, ease: CHROME_EASE },
  scale: { duration: 0.18, ease: CHROME_EASE },
}
// reducedMotion || isStatic → { duration: 0 }
```

Crosshair: opacity only (no scale — a line scaling looks wrong).  
Beacon: opacity + scale 0.96→1.  
Label (if on): opacity with same duration.

Pointer leave sets `scrubbing` false → animate to hidden; **do not unmount** until optional `onAnimationComplete` if you use AnimatePresence — preferred simpler approach: **never unmount** live chrome when `interactive`; keep `pointer-events: none` and `opacity: 0` when idle so springs can finish.

Canvas peek (`showPeek && isStatic`): opacity 1, duration 0 (static freeze).

## Repo conventions to follow

- Ease `[0.23, 1, 0.32, 1]` already used for Area Scrub draw-on
- `useReducedMotion` / `useIsStaticRenderer` → duration 0
- Prefer same layout tree (STATIC_RENDERER.md) — keep chrome in tree when interactive
- Depends on **081** transform wiring if both land; if 081 not done yet, still apply fade on whatever left/top or transform exists

## Steps

1. Introduce `chromeVisible = canvasPeek || (interactive && scrubbing)`.
2. When `interactive || canvasPeek`, always render chrome wrapper (not `null` when idle live).
3. Wrap crosshair in `motion.div` with `animate={{ opacity: chromeVisible ? 1 : 0 }}` + `chromeTransition`.
4. Wrap beacon with `animate={{ opacity: chromeVisible ? 1 : 0, scale: chromeVisible ? 1 : 0.96 }}`.
5. Label: only when `showLabel && interactive`; opacity follows `chromeVisible` (or `scrubbing`).
6. Ensure idle live: `opacity: 0` and no hit-testing (`pointerEvents: "none"` already on wrapper).
7. Push + typecheck + verify.

## Boundaries

- Do NOT change draw-on pathLength timings (spec 0.8–1.1s).
- Do NOT add idlePulse / glow.
- Do NOT use `AnimatePresence` mode that remounts from scale(0) — floor scale **0.96**.
- Do NOT use `ease-in`.
- Do NOT touch Home DSL.

## Verification

- **Mechanical**: `node scripts/framer/push-areascrub.mjs` → `typeErrors: []`; `verify.mjs` ok.
- **Feel check**:
  - Enter well: chrome fades in ~180ms, beacon slightly scales up — no pop.
  - Leave: chrome fades out; spam enter/leave — no restart flash from opacity 0 keyframe restart (transitions interrupt).
  - Animations panel @ 10%: confirm ease-out (fast start).
  - Reduced motion: chrome snaps visible/hidden (duration 0), scrub still works.
  - Canvas with Peek on: chrome visible, no animation.
- **Done when**: live idle has no visible chrome; enter/leave never hard-cuts; reduced-motion and static still correct.

## Dependencies

- Prefer execute **081** first (transform scrub), then **082**.
