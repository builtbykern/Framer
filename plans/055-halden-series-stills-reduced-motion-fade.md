# 055 — Series Stills reduced-motion keeps opacity fade

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file (`tmp/Series_Stills.tsx` → remote `jeA2cvO`)
- **Depends**: —
- **Project**: Halden (`k5nCTheGrijbFstHsY31`). Session **1**. Rebind `https://framer.com/projects/Higher-Beet--k5nCTheGrijbFstHsY31-cYfgu` and confirm `getProjectInfo().name === "Halden"` before writes.

## Problem

`freeze` joins canvas/export **and** `prefers-reduced-motion`. Reduced-motion users get `initial={false}` and `duration: 0` — no entrance at all. AUDIT.md: reduced motion keeps opacity/color comprehension aids and drops movement. Static renderer must still freeze in place (same tree, no motion).

```tsx
/* tmp/Series_Stills.tsx:109-111 — current */
const isStatic = useIsStaticRenderer()
const reducedMotion = useReducedMotion()
const freeze = Boolean(isStatic || reducedMotion)
```

```tsx
/* tmp/Series_Stills.tsx:164-182 — current */
initial={
    freeze
        ? false
        : { opacity: 0, transform: "translateY(8px)" }
}
whileInView={
    freeze
        ? undefined
        : { opacity: 1, transform: "translateY(0px)" }
}
viewport={{ once: true, amount: 0.2 }}
transition={
    freeze
        ? { duration: 0 }
        : {
              duration: 0.2,
              ease: [0.23, 1, 0.32, 1],
          }
}
```

## Target

Split flags. Canvas/export (`isStatic`) stays fully frozen. Live + reduced-motion fades opacity only.

```tsx
const isStatic = useIsStaticRenderer()
const reducedMotion = useReducedMotion()
const freeze = Boolean(isStatic)
const reduceMove = Boolean(reducedMotion) && !freeze
```

```tsx
initial={
    freeze
        ? false
        : reduceMove
          ? { opacity: 0 }
          : { opacity: 0, transform: "translateY(8px)" }
}
whileInView={
    freeze
        ? undefined
        : reduceMove
          ? { opacity: 1 }
          : { opacity: 1, transform: "translateY(0px)" }
}
viewport={{ once: true, amount: 0.2 }}
transition={
    freeze
        ? { duration: 0 }
        : {
              duration: 0.2,
              ease: [0.23, 1, 0.32, 1],
          }
}
```

Exact values (AUDIT.md `--ease-out`, UI under 300ms):

| Path | initial | whileInView | duration | ease |
| --- | --- | --- | --- | --- |
| `isStatic` | `false` | `undefined` | `0` | n/a |
| live + reduced-motion | `{ opacity: 0 }` | `{ opacity: 1 }` | `0.2` | `[0.23, 1, 0.32, 1]` |
| live + motion OK | `{ opacity: 0, transform: "translateY(8px)" }` | `{ opacity: 1, transform: "translateY(0px)" }` | `0.2` | `[0.23, 1, 0.32, 1]` |

Keep `transform` as the **string** (do not use Motion `y` shorthand). Same layout tree in all three paths (no early-return mock). `viewport` unchanged.

## Repo conventions to follow

- `docs/projects/STATIC_RENDERER.md`: `useIsStaticRenderer()` → freeze in place, same tree.
- Exemplar philosophy: `plans/035-inertiagrid-reduced-motion-fade.md` (opacity kept, physics dropped).
- Push: `tmp/push-series-stills.cjs` (`setFileContent` on `Series_Stills.tsx`, typecheck strict).
- Do not retune Logo Menu Roll or PageVeil.

## Steps

1. Edit `tmp/Series_Stills.tsx` only: replace `freeze = isStatic || reducedMotion` with `freeze = Boolean(isStatic)` and `reduceMove` as in Target. Thread into the existing `motion.div` inside `stills.map`.
2. Do not change `STACK_PRINTS`, Grid branch, property controls, or CMS image unwrap.
3. `node scripts/framer/exec.mjs -s 1 -f tmp/push-series-stills.cjs` — `typeErrors: []`.
4. `node scripts/framer/verify.mjs -s 1 --page "/"` and `--page "/work/:Work"`.

## Boundaries

- Do NOT remove `useIsStaticRenderer` or animate on canvas.
- Do NOT use `scale(0)` or Motion `y` shorthand.
- Do NOT change STACK_PRINTS (never 100% stills).
- Do NOT edit Logo_Menu_Roll, Page_Veil, Drift_Plane.
- Do NOT add dependencies.
- If the freeze block has drifted from the excerpt, STOP.

## Verification

- **Mechanical**: push typecheck empty; verify.mjs both pages `{ "ok": true }`.
- **Feel check**:
  - Preview (motion on): stills still ease in 200ms with 8px translateY; ease-out (starts moving immediately).
  - DevTools Rendering → `prefers-reduced-motion: reduce`: stills fade in, **no** vertical travel.
  - Canvas / static: stills visible in place, no tick.
  - Animations panel 10%: live path ~200ms.
- **Done when**: static frozen; reduced-motion opacity-only 200ms `cubic-bezier(0.23, 1, 0.32, 1)`; full motion keeps translateY(8px). Not published.
