# 040 — Copy Field icon morph + success stroke

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Physicality & origin / Interruptibility
- **Estimated scope**: 1 file (`code-components/CopyField.tsx`)
- **Depends on**: design accent grammar (`2026-07-30-copyfield-kern-accent-grammar.md`); reveal state from 039

## Problem

Eye ↔ copy ↔ check swaps that use `scale(0)` or CSS keyframes feel cheap and break when the user spam-clicks. The progress arc must be a retargetable Motion stroke, not a one-shot animation.

## Target

### States

| Phase | Icon | Button fill |
| --- | --- | --- |
| Masked | Eye outline | accent @ 16% wash |
| Revealed | Copy ( overlapping squares) | accent @ 16% wash |
| Copying | Copy + SVG progress stroke | wash |
| Success | Check | solid accent |

### Morph (eye ↔ copy ↔ check)

- Crossfade stacked icons: outgoing `opacity 1→0` + `transform: scale(0.92)`; incoming `opacity 0→1` + `transform: scale(0.92→1)`
- **Never** `scale(0)`
- Duration **180ms**
- Ease moving/morph: `cubic-bezier(0.77, 0, 0.175, 1)` (`EASE_IN_OUT` from AUDIT.md)

```ts
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
const MORPH = { duration: 0.18, ease: EASE_IN_OUT }
```

### Progress stroke (on copy click)

- SVG rect/rounded-rect path around button; `pathLength` / `strokeDashoffset` 0→1
- Duration **220ms**, ease **`linear`** (AUDIT: constant progress → linear)
- On complete → success fill **160ms** `EASE_OUT` `[0.23, 1, 0.32, 1]` + check morph

### Clipboard

- `navigator.clipboard.writeText(rawValue)` after `typeof navigator !== "undefined"`
- On success → stroke → check; on failure → do not enter success (optional shake left to 043/missed — out of scope unless trivial)

All phases use Motion transitions (interruptible). Re-click during stroke retargets; do not restart keyframes from zero.

## Repo conventions to follow

- Accent colors from design plan accent grammar
- `EASE_OUT` / interruptible transitions like Filling Point press plans
- Exemplar: `animation-plans/009-fillingpoint-press-scale.md` for transition retargeting mindset

## Steps

1. Implement three SVG icons (eye, copy, check) as inline paths, 20×20 viewBox, `currentColor`.
2. Stack icons in absolute layers inside the squircle; animate opacity/transform per phase.
3. Add SVG progress outline sibling; animate with Motion `pathLength` or strokeDasharray technique, **linear 220ms**.
4. Wire click: masked→reveal (039); revealed→copying→success; after toast hold (041) reset to masked.
5. Ensure `scale` floor is **0.92** on morph.

## Boundaries

- Do NOT use `@keyframes` for morph/stroke.
- Do NOT use `scale(0)`.
- Do NOT invent mint/lavender fills (accent plan owns color).
- Do NOT add Auto Demo.

## Verification

- **Feel check**: eye→copy feels like a morph not a pop; copy→check after ~220ms stroke; spam-click never flashes from empty scale.
- DevTools 10%: scale never below 0.92.
- **Done when**: three phases match table; clipboard writes the unmasked raw value (no spaces or with spaces — pick **raw digits without spaces** and document).
