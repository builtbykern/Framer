# 040 — Type Peek asymmetric die-cut leave

- **Status**: DONE (folded into signature die-cut craft 2026-08-08)
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 file (`code-components/TypePeek.tsx`), ~30 lines

## Problem

Die-cut open and close use the **same** transition. Leave feels as snappy as enter, so the photo snaps shut instead of breathing out.

```ts
/* code-components/TypePeek.tsx:140-144 — current */
const DEFAULT_TRANSITION: Transition = {
    type: "tween",
    ease: [0.22, 1, 0.36, 1],
    duration: 0.22,
}
```

```tsx
/* code-components/TypePeek.tsx:297-312 — both layers use `t` */
animate={{ opacity: open ? 0 : 1 }}
transition={t}
// …
animate={{ opacity: open ? 1 : 0 }}
transition={t}
```

## Target

Asymmetric defaults (AUDIT: response can breathe on leave; UI under 300ms):

| Phase | duration | ease |
| --- | --- | --- |
| Enter (rest → open) | `0.22` | `[0.22, 1, 0.36, 1]` (keep) |
| Leave (open → rest) | `0.28` | `[0.22, 1, 0.36, 1]` (same curve) |

When `freeze` (`useIsStaticRenderer` \|\| `useReducedMotion`): both durations `0`.

When designer passes `ControlType.Transition` (`props.transition`): use that object for **both** directions (single control override — do not invent a second Transition control).

```ts
const enterT: Transition = freeze
  ? { ...base, duration: 0 }
  : { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.22, ...base }
const leaveT: Transition = freeze
  ? { ...base, duration: 0 }
  : { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.28, ...base }
// Per layer: transition={open ? enterT : leaveT} matching the direction of travel
```

Exact wiring: muted layer going to opacity 0 on open → `enterT`; muted returning to 1 on leave → `leaveT`. Die-cut inverse.

## Repo conventions to follow

- Single-file Framer component; freeze in-place (no divergent static tree) — `docs/projects/STATIC_RENDERER.md`
- Exemplar asymmetric enter/leave: `code-components/Kern_GlyphInk.tsx` `MOTION.cinematic` enter `0.48` / leave `0.62`
- Push: `node scripts/framer/push-typepeek.mjs` → pin Type Peek `DHpXX5xCoGaJHmRQfN0m`

## Steps

1. In `TypePeek.tsx`, keep `DEFAULT_TRANSITION` as the **enter** default (`duration: 0.22`).
2. Add `DEFAULT_LEAVE_TRANSITION` with same ease, `duration: 0.28`.
3. In `PeekWordEl`, resolve `enterT` / `leaveT` from `props.transition` when provided (one object for both), else defaults; force `duration: 0` when `freeze`.
4. Pass `transition={open ? enterT : leaveT}` on muted and die-cut `motion.span` (and keep word-level dim transition on enterT — dim is secondary).
5. Do **not** change property controls API (still one `transition` control).

## Boundaries

- Do NOT implement pointer mask / signature die-cut (that is `design-plans/PLAN-typepeek-signature-diecut-2026-08-08.md`).
- Do NOT add blur (plan 041) or press scale (plan 042) in this plan.
- Do NOT change separator / layout / Look colors.
- No new npm deps.

## Verification

- **Mechanical**: `node scripts/framer/push-typepeek.mjs` → `typeErrors: []`; `node scripts/framer/verify.mjs` → `blocking: false`.
- **Feel check**: Preview — hover a word (open), then leave. At 10% animation speed: leave visibly longer than enter; no slam. `prefers-reduced-motion`: instant snap, no tween.
- **Done when**: leave default is 280ms; enter 220ms; custom Transition still overrides both.
