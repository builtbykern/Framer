# 046 — Contact Dock channel hover fine-pointer gate

- **Status**: DONE (executed 2026-07-31 with 047 — fine-pointer CSS hover; push+verify OK)
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file (`code-components/ContactDock.tsx`)
- **Audit**: finding 3
- **Execute with**: `047` in the same push (shared `DOCK_CSS`)
- **Constraint**: Do not touch toggle/portal/sheet springs

## Problem

`ChannelRow` applies hover lift via JS handlers — touch can flash false hover:

```tsx
// code-components/ContactDock.tsx:286–293 — current
onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.08)"
    e.currentTarget.style.transform = "translateY(-1px)"
}}
onMouseLeave={(e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.04)"
    e.currentTarget.style.transform = "translateY(0)"
}}
```

## Target

1. Rename `DOCK_PULSE_CSS` → `DOCK_CSS` (same string, then append). Keep pulse rules unchanged.
2. Append channel rules (AUDIT media query verbatim):

```css
.cd-channel {
  background: rgba(255,255,255,0.04);
  transform: translateY(0);
  transition: background 160ms ease, transform 160ms ease;
}
@media (hover: hover) and (pointer: fine) {
  .cd-channel:hover {
    background: rgba(255,255,255,0.08);
    transform: translateY(-1px);
  }
}
```

3. On `ChannelRow` `motion.a`:
   - Add `className="cd-channel"`
   - Remove `onMouseEnter` / `onMouseLeave`
   - Remove inline `background`, `transition` from `style` (CSS owns them); keep display/flex/padding/border/color/etc.

```tsx
style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 14,
    textDecoration: "none",
    color: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(255,255,255,0.06)",
}}
```

4. `<style>{DOCK_CSS}</style>` (was `DOCK_PULSE_CSS`).

## Repo conventions to follow

- AUDIT.md: `@media (hover: hover) and (pointer: fine)`; hover duration 160ms `ease`
- Exemplar: `011-fillingpoint-fine-pointer-hover-gate.md`

## Steps

1. Extend stylesheet + ChannelRow as Target.
2. Land in same commit/push as **047**.
3. Pin Contact Dock → `push-contactdock.mjs` → `verify.mjs`.
4. Mark 046 DONE.

## Boundaries

- Do NOT remove ChannelRow enter stagger springs.
- Do NOT add hover scale > 1.02.
- Do NOT change Book/Email hrefs or labels.
- Do NOT change `onClick={toggle}` / outside-close / Escape.

## Verification

- **Mechanical**: `rg onMouseEnter code-components/ContactDock.tsx` → no matches; `rg cd-channel` → hits; push `typeErrors: []`.
- **Feel check**: desktop — row lifts 1px; DevTools mobile/touch — no stuck lift after tap; sheet still opens.
- **Done when**: hover motion only under fine-pointer media.
