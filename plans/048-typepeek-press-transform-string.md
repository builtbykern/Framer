# 048 — Type Peek press: transform string + AUDIT scale 0.97

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Physicality & origin / Performance
- **Estimated scope**: 1 file (`code-components/TypePeek.tsx`), ~10–20 lines

## Problem

Press uses Motion `scale` shorthand at `0.985` (softer than AUDIT press band and main-thread shorthand):

```tsx
/* code-components/TypePeek.tsx:758–761 — current */
whileTap:
    freeze || !interactive
        ? undefined
        : { scale: 0.985, transition: PRESS_T },
```

```ts
/* PRESS_T:360–367 */
duration: 0.14, // OK — within 100–160ms
ease: [0.23, 1, 0.32, 1], // OK after 047
```

## Target

```tsx
whileTap={
  freeze || !interactive
    ? undefined
    : {
        transform: "scale(0.97)",
        transition: PRESS_T,
      }
}
```

- Duration stays `0.14` (140ms).
- Ease: `[0.23, 1, 0.32, 1]` (after 047: `EASE_OUT`).
- No press when `freeze` or `!interactive` (unchanged).

## Repo conventions to follow

- AUDIT press: `scale(0.97)` @ 100–160ms ease-out; keep 0.95–0.98.
- Prefer transform string over `scale` shorthand (AUDIT §5 / plan 044).
- Prior plan 042 shipped press; this upgrades the implementation, not the idea.

## Steps

1. Change `whileTap` payload to `transform: "scale(0.97)"` + `PRESS_T`.
2. Ensure no conflicting `style.transform` on the shell (shell has none today).
3. Push + verify.

## Boundaries

- Do NOT add `:active` CSS in parallel (one system).
- Do NOT apply press to ticker track containers.

## Verification

- **Mechanical**: typeErrors []; verify exit 0.
- **Feel check**: mousedown on a word — subtle press, release snaps back; spam click interruptible.
- **Done when**: `whileTap` uses `transform: "scale(0.97)"` only (no `scale` shorthand).
