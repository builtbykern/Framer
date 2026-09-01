# 022 — Remove RadioTile hover translateX

- **Status**: DONE
- **Commit**: n/a (no git HEAD; SoT `state/QuoteIntake.tsx` Version: 3.9.1)
- **Severity**: MEDIUM
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file, ~10 lines

## Problem

Option rows (`RadioTile`) slide `translateX(6px)` on hover. Intent/timeline lists are scanned often; decorative slide has weak purpose and fights a crisp studio personality.

```tsx
/* state/QuoteIntake.tsx:371-374 — current */
<motion.button type="button" id={id} role="radio" aria-checked={selected} tabIndex={tabIndex} ref={setRef as never}
    whileHover={motionOk ? { transform: "translateX(6px)" } : undefined} whileTap={motionOk ? PRESS_TAP : undefined} transition={HOVER_TRANSITION}
    onClick={onSelect} …
    style={{ … boxShadow: selected ? `inset 2px 0 0 ${colors.accent}` : "inset 2px 0 0 transparent", … opacity: selected ? 1 : 0.72 }}>
```

## Target

- **Remove** `whileHover` transform entirely on `RadioTile`.
- Keep `whileTap={motionOk ? PRESS_TAP : undefined}` with `PRESS_TAP = { transform: "scale(0.98)" }`.
- Press transition: use `PRESS_TRANSITION` (`duration: 0.12`, `ease: EASE_OUT`) — if plan 024 not done yet, still set `transition={PRESS_TRANSITION}` here (aligns with 024).
- Selection feedback remains inset accent + opacity (static OK; optional soft transition is plan 026 if written — out of scope here).

```tsx
/* target */
<motion.button
    whileHover={undefined}
    whileTap={motionOk ? PRESS_TAP : undefined}
    transition={PRESS_TRANSITION}
    …
>
```

Or omit `whileHover` prop entirely.

## Repo conventions to follow

- CTA buttons already use press-only scale without list slide — L824–825.
- `PRESS_TAP` / `PRESS_TRANSITION` at L56–57.

## Steps

1. In `RadioTile`, delete `whileHover={…translateX(6px)…}`.
2. Set `transition={PRESS_TRANSITION}` (replacing `HOVER_TRANSITION` on this component).
3. Confirm intent + timeline tiles both use `RadioTile` (no duplicate hover slide elsewhere).
4. Push, typecheck, verify.

## Boundaries

- Do NOT change radiogroup keyboard handler (`handleRadioKeys`).
- Do NOT change CTA `ctaHover` scale (separate control).
- Do NOT add hover media queries here if plan 025 covers gating — optional noop.
- Do NOT add dependencies.

## Verification

- **Mechanical**: typecheck 0; verify OK.
- **Feel check**:
  - Hover intent options — row must **not** slide horizontally.
  - Press/click — subtle scale 0.98 @ ~120ms.
  - Keyboard arrow selection — no slide animation.
- **Done when**: no `translateX` on RadioTile hover; tap press remains.
