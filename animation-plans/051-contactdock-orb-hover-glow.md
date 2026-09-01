# 051 — Contact Dock orb fine-pointer glow hover

- **Status**: DONE (executed 2026-07-31 with 048/050 — orb glow hover CSS; push+verify OK)
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file (`code-components/ContactDock.tsx`)
- **Audit**: missed opportunity 3
- **Depends on**: 046/047 `DOCK_CSS` + `.cd-orb` (done)
- **Constraint**: Glow only — no hover scale (competes with whileTap)

## Problem

Closed orb has no fine-pointer hover feedback beyond cursor.

## Target

Append inside `DOCK_CSS` (after existing `.cd-orb:focus-visible` rules):

```css
.cd-orb {
  transition: box-shadow 160ms ease, border-color 160ms ease;
}
@media (hover: hover) and (pointer: fine) {
  .cd-orb:hover:not(:focus-visible) {
    border-color: color-mix(in srgb, var(--cd-accent, #6FD3FF) 70%, transparent);
    box-shadow:
      0 10px 28px rgba(0,0,0,0.4),
      0 0 36px color-mix(in srgb, var(--cd-accent, #6FD3FF) 55%, transparent),
      inset 0 1px 0 rgba(255,255,255,0.12);
  }
}
```

`:not(:focus-visible)` keeps keyboard ring clean when focused. No `transform` on hover. Duration **160ms**, easing **`ease`**.

`--cd-accent` already on dock root (044).

## Steps

1. Append CSS only — no JS hover handlers.
2. Push + verify.
3. Mark DONE.

## Boundaries

- Do NOT add magnetic pointer idle (spec rejected).
- Do NOT pulse faster on hover.
- Do NOT scale orb on hover.
- Do NOT show hover glow on touch (media query gates it).

## Verification

- **Mechanical**: `rg 'cd-orb:hover' code-components/ContactDock.tsx` → hit; push `typeErrors: []`.
- **Feel check**: desktop hover brightens cyan glow; touch tap does not leave glow stuck; whileTap still 0.97.
- **Done when**: glow-only hover, fine-pointer gated.
