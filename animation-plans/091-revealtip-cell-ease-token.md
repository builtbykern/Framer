# 091 — Pixel cellTx use EXPAND_EASE token

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file, one transition object

## Problem

Pixel cells use built-in `"easeOut"` while the file’s AUDIT ease token is `EXPAND_EASE`.

```tsx
/* code-components/RevealTooltip.tsx:570-572 — current */
const cellTx: Transition = freeze || !animated
    ? { duration: 0 }
    : { duration: CELL_MS / 1000, ease: "easeOut" }
```

```tsx
/* code-components/RevealTooltip.tsx:142 — token */
const EXPAND_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1]
```

AUDIT strong ease-out: `cubic-bezier(0.23, 1, 0.32, 1)`.

## Target

```tsx
const cellTx: Transition = freeze || !animated
    ? { duration: 0 }
    : { duration: CELL_MS / 1000, ease: EXPAND_EASE }
```

## Repo conventions to follow

- One ease tuple in file — `EXPAND_EASE`
- Plan `085-revealtip-ease-token.md` established the token

## Steps

1. Replace `ease: "easeOut"` with `ease: EXPAND_EASE` in `cellTx`.
2. Pin + `push-revealtip.mjs`.

## Boundaries

- Do NOT change `CELL_MS`.
- Do NOT scatter a second bezier.
- Content layer already uses `EXPAND_EASE` — leave it.

## Verification

- **Mechanical**: typeErrors [].
- **Feel check**: pixel cells still ease-out (fast start); no ease-in sluggishness.
- **Done when**: no `"easeOut"` string remains in `RevealTooltip.tsx` cell transitions.

## Key Learnings for executor

1. Re-pin `DHpXX5x` before push.
