# 042 — Type Peek word press feedback

- **Status**: DONE (shipped with signature die-cut craft 2026-08-08)
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Physicality & origin / Missed opportunities
- **Estimated scope**: 1 file (`code-components/TypePeek.tsx`), ~20 lines

## Problem

Interactive words (`motion.a` / `motion.span` role=button) have hover die-cut but **no press scale**. Linked words feel dead on click (AUDIT: press `scale(0.97)` @ 100–160ms ease-out; keep 0.95–0.98).

```tsx
/* code-components/TypePeek.tsx:273-292 — current shared props */
animate: { opacity: dimmed ? dim : 1 },
transition: t,
// no whileTap / :active scale
```

## Target

Near-imperceptible press (frequency = tens/day on the field):

```tsx
whileTap={
  freeze || !interactive
    ? undefined
    : { scale: 0.98 }
}
transition={{
  ...t,
  // tap scale uses short budget
}}
```

Tap scale transition:

- `duration: 0.14` (140ms — within 100–160ms press budget)
- `ease: [0.23, 1, 0.32, 1]` (AUDIT `--ease-out`) **or** reuse existing `[0.22, 1, 0.36, 1]` if already on the element — do not invent a third curve in-file; prefer AUDIT ease-out for press only:

```ts
const pressT: Transition = {
  type: "tween",
  ease: [0.23, 1, 0.32, 1],
  duration: 0.14,
}
```

Gate: only when `interactive && !freeze`. Prefer `whileTap` on the outer `motion.a` / `motion.span` (transform on the word wrapper — OK).

Do **not** animate scale on hover (tens/day decorative hover reject).

Optional CSS fallback if Motion tap fights layout:  
`@media (hover: hover) and (pointer: fine) { [data-tp-word]:active { transform: scale(0.98); } }` with `transition: transform 140ms` — only if `whileTap` conflicts with opacity animate; prefer Motion first.

## Repo conventions to follow

- Exemplar press: `plans/039-inertiagrid-press-scale.md` / InertiaGrid press scale 0.98 class of fix
- Freeze: no tap motion on canvas / reduced-motion
- Push: `node scripts/framer/push-typepeek.mjs`

## Steps

1. On `PeekWordEl` outer `motion.a` and `motion.span`, add `whileTap={freeze || !interactive ? undefined : { scale: 0.98 }}`.
2. Ensure style keeps `transform` composable — if opacity animate is on same node, Motion merges; OK.
3. Use press transition 140ms ease-out for the scale channel if Motion allows per-value transition; else accept shared `t` if feel is still ≤160ms.
4. Do not add hover scale.

## Boundaries

- Do NOT change die-cut layers.
- Do NOT add glow / accent fill on press.
- Do NOT touch separators.
- Stop if scale causes layout shift of flex field (then reduce to 0.99 or CSS transform on inner grid only).

## Verification

- **Mechanical**: push-typepeek → `typeErrors: []`; verify ready.
- **Feel check**: Preview — mouse-down on a linked word: subtle squash, no bounce; release restores. Canvas: no scale. Touch coarse: whileTap still OK (press ≠ hover).
- **Done when**: press scale 0.98 @ ~140ms; no hover scale.
