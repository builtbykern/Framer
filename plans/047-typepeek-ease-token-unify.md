# 047 — Type Peek unify ease-out token

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`code-components/TypePeek.tsx`), ~15 lines

## Problem

Two near-identical ease-outs:

```ts
/* code-components/TypePeek.tsx:361 — Motion */
ease: [0.23, 1, 0.32, 1],
```

```tsx
/* code-components/TypePeek.tsx:951 — CSS dim */
transition: freeze
    ? undefined
    : "opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)",
```

## Target

Single AUDIT UI ease-out everywhere in this file:

```ts
const EASE_OUT = [0.23, 1, 0.32, 1] as const
// CSS string:
const EASE_OUT_CSS = "cubic-bezier(0.23, 1, 0.32, 1)"
```

- `DEFAULT_TRANSITION.ease` / `PRESS_T.ease` → `EASE_OUT`
- Dim opacity transition → `opacity 180ms ${EASE_OUT_CSS}` (180ms stays — hover feedback budget)

Do **not** invent a third curve.

## Repo conventions to follow

- AUDIT `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`
- Marketplace single-file component: const at top of `TypePeek.tsx`

## Steps

1. Add `EASE_OUT` + `EASE_OUT_CSS` near `DEFAULT_TRANSITION`.
2. Point `DEFAULT_TRANSITION` and `PRESS_T` at `EASE_OUT`.
3. Replace dim CSS bezier with `EASE_OUT_CSS`.
4. Grep file for `0.22, 1, 0.36` — should be zero.
5. Push + verify.

## Boundaries

- Do NOT change durations in this plan.
- Do NOT touch ticker `linear` (correct for marquees).

## Verification

- **Mechanical**: grep clean; typeErrors []; verify exit 0.
- **Feel check**: dim siblings still ~180ms; peek enter still snappy ease-out.
- **Done when**: one ease-out definition used by Motion + dim CSS.
