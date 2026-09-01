# 007 — Add PropertyCard press feedback

- **Status**: DONE
- **Commit**: unavailable
- **Severity**: MEDIUM
- **Category**: Missed opportunity / Physicality & origin
- **Estimated scope**: 1 code file (`Arbour_PropertyCard.tsx`)

## Problem

Property cards are primary click targets on `/properties-2` but provide no press feedback. Hover zoom (plan 006) confirms hover; press should confirm activation. Frequency is tens/day → keep near-imperceptible.

No `whileTap` / `:active` on the card root today — root is a plain `<div style={rootStyle}>`.

## Target

Wrap the existing root `div` with `motion.div` (or convert root to `motion.div`) and add:

```tsx
const prefersReduced = useReducedMotion()
const shouldAnimate = !isCanvas && !prefersReduced

<motion.div
    style={rootStyle}
    whileTap={shouldAnimate ? { transform: "scale(0.98)" } : undefined}
    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
>
    {body}
</motion.div>
```

Exact values:

| Prop | Value |
| --- | --- |
| Tap scale | **0.98** |
| Duration | **0.16s** (160ms) |
| Ease | `[0.23, 1, 0.32, 1]` |
| Reduced motion | no tap scale |

Do **not** animate layout properties. Transform only.

## Repo conventions to follow

- Exemplar: `Arbour_PrimaryButton.tsx` uses `whileTap={shouldAnimate ? { scale: 0.98 } : undefined}` with `transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}`
- This plan uses **160ms** (AUDIT press band 100–160ms) — shorter than PrimaryButton’s 280ms because cards are larger and more frequent
- Prefer `transform: "scale(0.98)"` over Motion `scale` shorthand (same GPU rationale as plan 006)
- Keep `useIsOnFramerCanvas` + `useReducedMotion` pattern already in the file

## Steps

1. Depends on / can run after plan **006** (same file). If both pending, apply 006 first then 007 to avoid merge conflicts.
2. Convert root `<div style={rootStyle}>` → `<motion.div style={rootStyle} …>`.
3. Add `whileTap` + `transition` as in Target.
4. Ensure nested `motion.img` hover still works; tap scale on parent is fine.
5. `setFileContent` + `typecheck({ strict: true })`.

## Boundaries

- Do NOT change hover values (006 owns them).
- Do NOT change typography (design-plan typography).
- Do NOT add springs / bounce.
- Do NOT animate opacity on press.
- Do NOT touch filter controls or other pages.

## Verification

- **Mechanical**: typecheck clean.
- **Feel check**:
  - Mouse: press-and-hold on a card — brief 0.98 scale; release snaps back with ease-out.
  - Interrupt: press then drag off — should not stick scaled down.
  - Reduced motion: no press scale.
  - DevTools 10% playback: ~160ms.
- **Done when**: press feedback present at 0.98 / 160ms on fine + coarse pointers (tap is intentional on touch), reduced-motion quiet.

## Suggested motion values (AUDIT)

- Press feedback: `scale(0.97–0.98)`, `100–160ms`, ease-out
- `cubic-bezier(0.23, 1, 0.32, 1)`
