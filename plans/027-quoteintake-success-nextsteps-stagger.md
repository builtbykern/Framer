# 027 — Stagger success next-step lines

- **Status**: DONE
- **Commit**: n/a (no git HEAD; SoT `state/QuoteIntake.tsx` Version: 3.9.1)
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file, ~20 lines

## Problem

Success “next steps” render as a simultaneous block. Breakdown lines already stagger; this rare delight moment is allowed a short stagger (AUDIT: 30–80ms, never blocking).

```tsx
/* state/QuoteIntake.tsx:788-791 — current */
<div style={{ display: "flex", flexDirection: "column", gap: fldGap, paddingTop: secGap * 0.5, borderTop: faintRule(colors.border) }}>
    {[submission.successScreenCopy.nextStep1Text, submission.successScreenCopy.nextStep2Text, submission.successScreenCopy.nextStep3Text].filter(Boolean).map((txt) => (
        <div key={txt} style={{ … }}><span style={{ color: colors.accent }}>→</span><span …>{txt}</span></div>
    ))}
</div>
```

## Target

When `motionOk`:

```tsx
const SUCCESS_LINE_STAGGER = 0.05 // 50ms — within 30–80ms
…
{lines.map((txt, i) => (
  <motion.div
    key={txt}
    initial={{ opacity: 0, transform: "translateY(4px)" }}
    animate={{ opacity: 1, transform: "translateY(0px)" }}
    transition={{ ...LINE_ENTER, delay: i * SUCCESS_LINE_STAGGER }}
  >
    …
  </motion.div>
))}
```

When `!motionOk`: keep plain `<div>` (same as breakdown L717).

Reuse `LINE_ENTER` (`duration: 0.22`, `ease: EASE_OUT`) — already in file.

Stagger must not delay the primary success CTA; CTA stays outside the staggered list (already is).

## Repo conventions to follow

- Exemplar: breakdown stagger at L697–716 (`Math.min(0.08, submission.breakdownStaggerMs / 1000)`).
- Success enter container already uses `successAnim` — do not double-delay the whole card.

## Steps

1. Map next-step lines with `motion.div` + 50ms stagger when `motionOk`.
2. Keep static fallback when `!motionOk`.
3. Push, typecheck, verify. Watch ≤1000 lines.

## Boundaries

- Do NOT animate the success title with extra delay.
- Do NOT exceed 80ms stagger step.
- Do NOT block CTA interaction (stagger decorative only).

## Verification

- **Feel check**: after submit, three lines cascade ~50ms apart; CTA clickable immediately.
- Reduced motion: all lines visible at once, no translate.
- **Done when**: success lines stagger only when `motionOk`.
