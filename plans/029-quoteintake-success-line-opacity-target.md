# 029 — Success next-step opacity: animate to 0.88 not 1

- **Status**: DONE
- **Commit**: n/a (SoT `state/QuoteIntake.tsx` Version: 3.10.0)
- **Severity**: MEDIUM
- **Category**: Cohesion
- **Estimated scope**: 1 file, ~5 lines

## Problem

Success next-step lines set `style.opacity: 0.88` but `animate={{ opacity: 1 }}`, so when `motionOk` the muted look never applies.

```tsx
/* state/QuoteIntake.tsx:806-808 — current */
{[...].filter(Boolean).map((txt, i) => motionOk ? (
    <motion.div key={txt} initial={{ opacity: 0, transform: "translateY(4px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ ...LINE_ENTER, delay: i * SUCCESS_LINE_STAGGER }}
        style={{ ...typography.labelFont, color: colors.textPrimary, display: "flex", gap: 14, fontSize: "14px", opacity: 0.88 }}>…
```

## Target

```tsx
animate={{ opacity: 0.88, transform: "translateY(0px)" }}
```

Or omit opacity from `animate`/`initial` and only animate `transform` (CSS opacity 0.88 stays). Prefer **animate to 0.88** so the enter fades into the intended muted level.

Keep: `LINE_ENTER`, `SUCCESS_LINE_STAGGER` (0.05), `!motionOk` static branch with `opacity: 0.88`.

## Repo conventions to follow

- Breakdown lines use transform + opacity enter (`~710` area) without fighting a second opacity target.
- `EASE_OUT` / `LINE_ENTER` already module-level.

## Steps

1. In success next-steps `motion.div`, change `animate.opacity` from `1` to `0.88`.
2. Optionally set `initial.opacity` to `0` (keep) so fade still runs.
3. Push Framer file; typecheck 0; verify.

## Boundaries

- Do NOT change stagger timing.
- Do NOT restyle success title.
- Do NOT touch chapter progress (plan 030).

## Verification

- **Mechanical**: typecheck 0; ≤1000 lines; verify.mjs OK.
- **Feel check**: After submit, next-step lines fade in to slightly muted (not full white); @ 10% playback final opacity ≈ 0.88.
- **Done when**: motionOk and !motionOk success lines match perceived opacity.
