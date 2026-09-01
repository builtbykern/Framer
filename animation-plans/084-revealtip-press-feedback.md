# 084 — Trigger press scale feedback

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Physicality & origin / Missed opportunities
- **Estimated scope**: 1 file, TriggerButton only

## Problem

The trigger is a pressable `button` with no `:active` / press feedback. Hover opens the tip, but press feels dead.

```tsx
/* code-components/RevealTooltip.tsx — TriggerButton style (no press) */
cursor: "pointer",
display: "flex",
/* … no transform / transition on active */
```

## Target

Add subtle press feedback (AUDIT: `scale(0.97)`, `160ms ease-out`):

```tsx
/* TriggerButton — live path only; skip when isStatic */
style={{
  /* …existing… */
  transition: freeze ? undefined : "transform 160ms cubic-bezier(0.23, 1, 0.32, 1)",
}}
/* and CSS or onPointerDown/Up: */
/* :active → transform: scale(0.97) */
```

Prefer a small injected style when not static:

```tsx
{!freeze ? (
  <style>{`
    button[data-rt-trigger]:active {
      transform: scale(0.97);
    }
  `}</style>
) : null}
```

with `data-rt-trigger=""` on the button. Do **not** inject infinite keyframes.

## Repo conventions to follow

- AUDIT press feedback: 100–160ms, scale 0.95–0.98
- Static path: no motion CSS loops (`docs/projects/STATIC_RENDERER.md`)

## Steps

1. Pass `freeze` (or `isStatic`) into `TriggerButton`.
2. Add `data-rt-trigger` on the button.
3. When `!freeze`, inject the `:active { transform: scale(0.97) }` rule once + `transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1)`.
4. Push via `push-revealtip.mjs` after re-pinning sandbox `DHpXX5xCoGaJHmRQfN0m`.

## Boundaries

- Do NOT animate the tip on press (hover/focus only).
- Do NOT add spring libraries.
- Do NOT change tip expand math.

## Verification

- **Mechanical**: `typeErrors: []`.
- **Feel check**: Preview → press trigger: slight squash; release returns. Reduced-motion / static Canvas: no press CSS injected.
- **Done when**: press visibly scales ~3% and returns without jank.
