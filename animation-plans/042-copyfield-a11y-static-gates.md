# 042 — Copy Field reduced-motion, static, fine-pointer gates

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Accessibility / Performance
- **Estimated scope**: 1 file (`code-components/CopyField.tsx`)
- **Depends on**: 039–041 present

## Problem

Continuous blur stagger + hover scale without reduced-motion / fine-pointer / static renderer gates causes canvas jank and a11y misses. Kern Marketplace peers always gate Motion.

## Target

### `useReducedMotion()` (framer-motion)

When `true`:

- Reveal: instant swap mask→digits (no blur, no translateY, no stagger)
- Icon morph: opacity crossfade **≤120ms** only (no scale travel) OR instant
- Progress stroke: skip; jump to success fill
- Toast: opacity-only fade **120ms** `EASE_OUT` (keep feedback; drop movement)

### `useIsStaticRenderer()` (framer)

When `true` (Canvas / Export):

- Show **mid-cycle still**: revealed digits + copy icon (wash), **no** toast, **no** rAF/timers
- Do not run entrance loops

Also gate with `useIsOnFramerCanvas` if peer pattern requires — prefer official `useIsStaticRenderer` as primary (Metric Seal / Kinetic Grid direction).

### Hover

- Any hover scale / wash brighten only under:

```css
@media (hover: hover) and (pointer: fine) { ... }
```

Or JS: matchMedia same query before applying hover handlers.

### Performance

- Animate only `transform`, `opacity`, `filter`
- No Framer Motion `x` / `y` shorthand on busy paths
- No `transition: all`

```ts
import { useIsStaticRenderer } from "framer"
import { useReducedMotion } from "framer-motion"
```

## Repo conventions to follow

- `MetricSeal.tsx`: `useIsStaticRenderer` + `useReducedMotion` + static mid-wipe
- `KineticGrid.tsx`: reduced motion freezes physics; static paths
- AUDIT.md §5–6

## Steps

1. Import both hooks; compute `isStatic` / `prefersReduced`.
2. Branch reveal/morph/toast transitions to reduced variants above.
3. Early-return static JSX still (revealed + copy) when `isStatic`.
4. Gate hover listeners with fine-pointer media query.
5. Confirm no Auto Demo timers exist.

## Boundaries

- Do NOT nuke all feedback under reduced-motion (opacity OK).
- Do NOT animate width/height/top/left.
- Do NOT skip `useIsStaticRenderer`.

## Verification

- Canvas Assets thumbnail reads mid-cycle (digits + copy), calm.
- Rendering panel `prefers-reduced-motion: reduce` → instant unmask, opacity toast only.
- Touch device: no sticky hover scale.
- **Done when**: all three gates verified.
