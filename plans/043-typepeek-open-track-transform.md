# 043 — Type Peek open-track via transform (no letterSpacing layout)

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/TypePeek.tsx`), ~60–90 lines

## Problem

Hover open animates `letterSpacing` on the full Black 72px word. That is continuous **layout** on a large surface (ticker + weave), which violates composite-first motion.

```tsx
/* code-components/TypePeek.tsx:596–605 — current */
<motion.span
    animate={{
        color: open ? look.solidColor : look.mutedColor,
        letterSpacing:
            reducedMotion && open
                ? restTracking
                : open
                  ? openTrack
                  : restTracking,
    }}
    transition={tMotion}
```

Ghost already reserves open width (`letterSpacing: openTrack` on the hidden span). The visible layer still reflows mid-hover when `letterSpacing` tweens.

## Target

- Keep the ghost at `openTrack` (layout reservation — no change).
- Visible base word: **fixed** `letterSpacing: openTrack` always (matches ghost; no layout tween).
- Optional “open” feel: animate only `color` (paint on text — acceptable one-shot) **or** a tiny composite nudge on the word shell:
  - Rest: `transform: "translateX(0px)"`
  - Open: `transform: "translateX(0px)"` (preferred: **no** tracking motion if feel is already covered by crop reveal)
- If a tracking *illusion* is still required: distribute `openExtra` as per-letter `transform: translateX(i * deltaPx)` with **fixed** letterSpacing — composite only. Cap total openExtra at current control (`openTracking`, default `0.035em`).
- Durations stay under 300ms: enter `0.22`, leave `Math.min(custom, 0.18)`, ease `[0.23, 1, 0.32, 1]`.
- `freeze` / reduced-motion: duration `0` / `0.16`; no transform tracking if reduced.

**Recommended default for executor:** drop animated letterSpacing entirely; keep ghost + fixed open spacing; rely on clip/opacity peek for the signature.

## Repo conventions to follow

- Ease-out UI: `cubic-bezier(0.23, 1, 0.32, 1)` / Motion `[0.23, 1, 0.32, 1]` (already `DEFAULT_TRANSITION`).
- Static: freeze in-place same tree (`useIsStaticRenderer`); no divergent mock — `docs/projects/STATIC_RENDERER.md`.
- Exemplar (composite transform string): `plans/033-inertiagrid-composite-transform.md` / InertiaGrid shipped pattern.

## Steps

1. In `PeekWordEl`, set visible base `letterSpacing` style to `openTrack` always (same as ghost). Remove `letterSpacing` from `animate`.
2. Keep `animate={{ color: open ? look.solidColor : look.mutedColor }}` with `tMotion`.
3. Do **not** animate `letterSpacing` on any peek-window child either (none today beyond base — verify no regressions).
4. If visual QA says the word feels “stuck closed”: implement per-letter `translateX` offsets from `openTracking` only while `open && !reducedMotion`, using Motion `transform` **string**, not `x` shorthand.
5. Push: `node scripts/framer/push-typepeek.mjs` then `node scripts/framer/verify.mjs`.

## Boundaries

- Do NOT change Saviour per-letter z-index / crop layout constants.
- Do NOT remove the open-width ghost (layout jump is worse than tracking polish).
- Do NOT add GSAP or new deps.
- Do NOT animate `width` / `padding` / `gap` for open feel.

## Verification

- **Mechanical**: `push-typepeek.mjs` → `typeErrors: []`; `verify.mjs` exit 0.
- **Feel check**:
  - Hover Waterloo: peeks still exit from `l` over `o`; no horizontal jank of siblings/ticker.
  - DevTools Performance: no Layout thrashing spikes tied to letterSpacing during hover spam.
  - `prefers-reduced-motion`: opacity peek only; no tracking motion.
- **Done when**: no `letterSpacing` in any `animate={{…}}` on TypePeek; open reserved width still stable.
