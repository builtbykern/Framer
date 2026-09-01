# 009 — Fix PropertyCard hover rest state (no permanent zoom)

- **Status**: DONE
- **Commit**: unavailable
- **Severity**: HIGH
- **Category**: Physicality & origin / Easing & duration (regression from 006)
- **Estimated scope**: 1 code file (`Arbour_PropertyCard.tsx`)

## Problem

Plan 006 left the image at `transform: scale(1.02)` via `initial`, so the photo is **always cropped/zoomed at rest**. Hover only goes `1.02 → 1.04` (barely visible), so the hover feels broken or “stuck half zoomed.”

Also: parent `motion.div` `whileTap` and child `motion.img` both animate `transform`, which can fight under Framer Motion.

Current (Framer `Arbour_PropertyCard.tsx` ~L107–120):

```tsx
<motion.img
    …
    style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        willChange: "transform",
    }}
    initial={canHoverMotion ? { transform: "scale(1.02)" } : false}
    whileHover={
        canHoverMotion ? { transform: "scale(1.04)" } : undefined
    }
    transition={{ duration: 0.22, ease: EASE_OUT }}
/>
```

Root (~L203–208):

```tsx
<motion.div
    style={rootStyle}
    whileTap={
        shouldAnimate ? { transform: "scale(0.98)" } : undefined
    }
    transition={{ duration: 0.16, ease: EASE_OUT }}
>
```

## Target

Rest = identity scale. Hover = subtle zoom. Tap stays on the root but use Motion `scale` shorthand on **one** layer each to avoid dual `transform` string conflicts — or keep transform strings but ensure img rest is `scale(1)`.

```tsx
<motion.img
    src={imgSrc}
    alt={imgAlt}
    style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    }}
    initial={false}
    animate={canHoverMotion ? { scale: 1 } : undefined}
    whileHover={canHoverMotion ? { scale: 1.04 } : undefined}
    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
/>
```

And press on root:

```tsx
<motion.div
    style={rootStyle}
    whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
>
```

Exact values:

| State | Value |
| --- | --- |
| Rest | `scale: 1` (`initial={false}`) |
| Hover | `scale: 1.04` |
| Duration hover | **0.22s** |
| Ease | `[0.23, 1, 0.32, 1]` |
| Press | root `scale: 0.98` / **0.16s** (unchanged intent) |
| Pointer gate | keep `finePointer` + `canHoverMotion` |
| Reduced motion | keep `useReducedMotion` → no hover/tap scale |

Remove permanent `willChange: "transform"` (only needed during active hover; optional omit).

Do **not** set `initial` to any scale &gt; 1.

## Repo conventions to follow

- Exemplar: `Arbour_ArticleCard` image hover uses `whileHover={{ scale: 1.03 }}` without a zoomed rest `initial`
- Keep Space Mono / Fraunces typography from the typography plan — do not touch text styles
- Ease: `[0.23, 1, 0.32, 1]`

## Steps

1. `framer.getCodeFile("Arbour_PropertyCard.tsx")`.
2. Change `motion.img`: `initial={false}`; remove rest `scale(1.02)`; `whileHover` → `{ scale: 1.04 }` when `canHoverMotion`; drop always-on `willChange`.
3. Change root `whileTap` to `{ scale: 0.98 }` (Motion scale prop) for consistency with img.
4. `setFileContent` + `typecheck({ strict: true })` → `[]`.
5. Do not publish unless asked.

## Boundaries

- Do NOT change typography, CMS bindings, or imageHeight controls.
- Do NOT remove the fine-pointer gate.
- Do NOT restore 0.7s / 1.08 hover.
- Do NOT change canvas appearEffect stagger (008).

## Verification

- **Mechanical**: typecheck clean; source has no `scale(1.02)` as rest/initial.
- **Feel check**:
  - At rest, image fills the frame flush (no permanent crop).
  - Mouse hover: clear but subtle zoom to 1.04 in ~220ms; leave hover returns to 1.
  - Spam hover: interruptible, no stuck zoom.
  - Touch: no sticky hover zoom (fine-pointer gate).
  - Press: brief 0.98 on card; does not leave image stuck at 1.02.
  - `prefers-reduced-motion`: no scale motion.
- **Done when**: rest = 1, hover = 1.04 @ 220ms, press still works, hover no longer feels “half broken.”

## Suggested motion values (AUDIT)

- Hover UI ≤300ms → **220ms**
- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`
- Never leave UI at `scale(0)` or unintended rest scale ≠ 1
- Gate hover with `(hover: hover) and (pointer: fine)`
