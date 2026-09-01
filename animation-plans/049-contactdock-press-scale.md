# 049 — Contact Dock orb whileTap 0.97

- **Status**: DONE (executed 2026-07-31 — whileTap 0.97; push typeErrors []; verify ready)
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (`code-components/ContactDock.tsx`), one token
- **Audit**: `animation-plans/REPORT-contactdock-improve-animations-2026-07-31.md` finding 6
- **Constraint**: Restored open UX must not break — motion property only

## Problem

Orb press feedback is too strong (reads as a squash):

```tsx
// code-components/ContactDock.tsx:571 — current
whileTap={reduced ? undefined : { scale: 0.94 }}
```

AUDIT.md Physicality: press feedback target is `transform: scale(0.97)` (band 0.95–0.98). `0.94` is below the band.

## Target

```tsx
// code-components/ContactDock.tsx:571 — target
whileTap={reduced ? undefined : { scale: 0.97 }}
```

Keep `undefined` when `reduced` is true (no press movement under reduced-motion / static). Do **not** switch to a `transform` string in this plan (that is 048); keep the existing `scale` shorthand for a one-number diff.

## Repo conventions to follow

- AUDIT.md press: `scale(0.97)`, subtle (0.95–0.98)
- Exemplar: `animation-plans/043-copyfield-press-scale.md` → `0.97`
- Push path: pin Contact Dock sandbox, then `node scripts/framer/push-contactdock.mjs`

## Steps

1. In `code-components/ContactDock.tsx`, on the orb `<motion.button>` (~line 571), change `scale: 0.94` → `scale: 0.97` inside `whileTap`.
2. Pin session and push:
   - `node scripts/framer/session.mjs --url "https://framer.com/projects/Overly-Interaction--2GOZzqC76RSbm2V0FOXP-i5R6n" --name "Contact Dock"`
   - `node scripts/framer/push-contactdock.mjs` → expect `typeErrors: []`
   - `node scripts/framer/verify.mjs` → ready / no blocking errors
3. Mark this plan **DONE** and set README row 049 to DONE.

## Boundaries

- Do NOT change sheet springs, pulse rings, ChannelRow hover, portal, `onClick={toggle}`, outside-close, or Escape.
- Do NOT press-scale the sheet or channel rows.
- Do NOT set whileTap below `0.95`.
- Do NOT add new dependencies or CSS for this plan.
- If line 571 no longer has `whileTap` with `0.94`, STOP and report drift.

## Verification

- **Mechanical**: `rg 'whileTap' code-components/ContactDock.tsx` shows `scale: 0.97`; push `typeErrors: []`; verify ready.
- **Feel check**: Preview → press orb — subtle compress, not a squash; release returns; open/close still toggles on click.
- **Reduced motion**: with `prefers-reduced-motion`, whileTap stays off (`undefined`) — no press scale.
- **Done when**: whileTap scale is `0.97` and orb still opens/closes with a single click.
