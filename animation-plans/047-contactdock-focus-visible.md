# 047 — Contact Dock orb :focus-visible ring

- **Status**: DONE (executed 2026-07-31 with 046 — :focus-visible CSS only; push+verify OK)
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file (`code-components/ContactDock.tsx`)
- **Audit**: finding 4
- **Execute with**: `046` in the same push (shared `DOCK_CSS`)
- **Constraint**: CSS-only focus ring — do NOT call `.focus()` on open (past scroll bug)

## Problem

Orb button has `outline: "none"` with no `:focus-visible` replacement (`ContactDock.tsx` ~601). Keyboard users lose the only focus target.

## Target

Append to shared `DOCK_CSS` (after pulse + channel rules from 046):

```css
.cd-orb:focus {
  outline: none;
}
.cd-orb:focus-visible {
  outline: 2px solid var(--cd-accent, #6FD3FF);
  outline-offset: 3px;
}
```

On the orb `<motion.button>`:
- Add `className="cd-orb"`
- Keep existing inline styles including `outline: "none"` as base
- Keep `whileTap={reduced ? undefined : { scale: 0.97 }}`
- Do **not** add `autoFocus` or `element.focus()` anywhere

`--cd-accent` is already set on the dock root from plan 044.

## Repo conventions to follow

- Spec success criteria: focus visible
- Accent `#6FD3FF` / `var(--cd-accent)` — no purple rings
- Exemplar: Copy Field a11y `042-copyfield-a11y-static-gates.md`

## Steps

1. Add CSS + `className="cd-orb"` as Target.
2. Same push as **046**.
3. Mark 047 DONE.

## Boundaries

- Do NOT remove Escape / click-outside close.
- Do NOT `focus()` the orb or sheet on open.
- Do NOT change orb size, pulse, or sheet springs.
- Do NOT add a second close control in the sheet.

## Verification

- **Mechanical**: `rg cd-orb:focus-visible code-components/ContactDock.tsx` → hit; `rg '\\.focus\\(' code-components/ContactDock.tsx` → no matches; push `typeErrors: []`.
- **Feel check**: Tab to orb → accent ring; mouse click → no sticky ring; Escape still closes; open/close still one click.
- **Done when**: keyboard focus always visible on orb; mouse path unchanged.
