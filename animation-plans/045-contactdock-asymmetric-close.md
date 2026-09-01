# 045 — Contact Dock asymmetric close + exit toward orb

- **Status**: DONE (executed 2026-07-31 — exit spring 520/36/0.8 y:14; enter 380/28 unchanged; push+verify OK)
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Easing & duration / Spec
- **Estimated scope**: 1 file (`code-components/ContactDock.tsx`), sheet `motion.div` only
- **Audit**: `animation-plans/REPORT-contactdock-improve-animations-2026-07-31.md` finding 2 (+ missed op 2)
- **Constraint**: Restored open UX must not break — change exit spring/pose only; keep `onClick={toggle}`, portal, layout

## Problem

Design spec (`docs/superpowers/specs/2026-07-31-contact-dock-design.md` Motion table): close should be “Reverse, slightly faster”. Exit currently mirrors enter spring:

```tsx
// code-components/ContactDock.tsx:413–432 — current
initial={
    reduced
        ? { opacity: 1, y: 0, scale: 1 }
        : { opacity: 0, y: 12, scale: 0.94 }
}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={
    reduced
        ? { opacity: 0 }
        : { opacity: 0, y: 10, scale: 0.96 }
}
transition={
    reduced
        ? { duration: 0.12 }
        : {
              type: "spring",
              stiffness: 380,
              damping: 28,
          }
}
```

Same spring for enter and exit → close does not snap.

## Target

Keep enter on the outer `transition` prop. Put a **faster** spring on the exit object (Framer Motion exit-specific `transition`):

```tsx
initial={
    reduced
        ? { opacity: 1, y: 0, scale: 1 }
        : { opacity: 0, y: 12, scale: 0.94 }
}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={
    reduced
        ? { opacity: 0, transition: { duration: 0.1 } }
        : {
              opacity: 0,
              y: 14,
              scale: 0.96,
              transition: {
                  type: "spring",
                  stiffness: 520,
                  damping: 36,
                  mass: 0.8,
              },
          }
}
transition={
    reduced
        ? { duration: 0.12 }
        : {
              type: "spring",
              stiffness: 380,
              damping: 28,
          }
}
```

Exact values (do not approximate):
- Enter spring: `stiffness: 380`, `damping: 28` (unchanged)
- Exit spring: `stiffness: 520`, `damping: 36`, `mass: 0.8`
- Exit pose: `y: 14` (toward orb; was `10`), `scale: 0.96`, `opacity: 0`
- Reduced exit: opacity-only, `duration: 0.1` (faster than enter reduced `0.12`)

Do **not** convert to transform strings in this plan (that is 048).

## Repo conventions to follow

- Spec: close reverse, slightly faster
- AUDIT.md asymmetric timing: system response snaps
- Exemplar: `animation-plans/041-copyfield-toast-enter-exit.md` (exit faster than enter)
- Push: pin Contact Dock → `node scripts/framer/push-contactdock.mjs`

## Steps

1. On the sheet `motion.div` inside `AnimatePresence` (~lines 409–432), replace `exit` and keep `transition` as in Target.
2. Leave `initial`, `animate`, `style`, portal, pulse CSS, `whileTap`, ChannelRow untouched.
3. Pin + push + verify:
   - `node scripts/framer/session.mjs --url "https://framer.com/projects/Overly-Interaction--2GOZzqC76RSbm2V0FOXP-i5R6n" --name "Contact Dock"`
   - If session list fails, `npx @framer/agent@latest session new "<url>"` then pin `-s <id>`
   - `node scripts/framer/push-contactdock.mjs` → `typeErrors: []`
   - `node scripts/framer/verify.mjs` → ready
4. Mark this plan DONE and README 045 → DONE.

## Boundaries

- Do NOT switch sheet to CSS keyframes.
- Do NOT reintroduce morph orb→sheet / `layoutId`.
- Do NOT slow enter (keep 380/28).
- Do NOT change toggle handlers, outside-close, Escape, portal, pulse CSS (044), or whileTap (049).
- Do NOT change `transformOrigin` or sheet position (`bottom: orbSize + 14`).
- If sheet already has exit `stiffness: 520`, STOP and report drift.

## Verification

- **Mechanical**: `rg -n 'stiffness: 520' code-components/ContactDock.tsx` → one hit inside exit; enter still `stiffness: 380`; push `typeErrors: []`; verify ready.
- **Feel check**: Preview — spam open/close; close feels snappier; sheet retreats toward orb; open still springy; single click still toggles. DevTools Animations at 10% — exit shorter than enter.
- **Reduced motion**: exit is opacity-only ~0.1s; no large `y` travel.
- **Done when**: exit spring clearly stiffer/faster than enter; open/close still reliable.
