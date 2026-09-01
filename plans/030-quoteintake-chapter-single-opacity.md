# 030 — Chapter progress: single opacity owner (no double multiply)

- **Status**: DONE
- **Commit**: n/a (SoT `state/QuoteIntake.tsx` Version: 3.10.0)
- **Severity**: MEDIUM
- **Category**: Cohesion
- **Estimated scope**: 1 file, ~15 lines

## Problem

`renderProgress` animates parent `opacity: op` while the label child still has `opacity: on ? 1 : 0.4`, so inactive chapters compound (e.g. `0.28 × 0.4`) and read darker than the pre-028 design.

```tsx
/* state/QuoteIntake.tsx:573-581 — current */
const op = on ? 1 : n < step ? 0.5 : 0.28
const row = (
    <>
        <span style={{ … color: on ? colors.accent : colors.textSecondary }}>{String(n).padStart(2, "0")}</span>
        <span style={{ … color: on ? colors.textPrimary : colors.textSecondary, opacity: on ? 1 : 0.4 }}>{lbl}</span>
    </>
)
return motionOk
    ? <motion.div … animate={{ opacity: op }} transition={CHAPTER_FADE}>{row}</motion.div>
    : <div … style={{ … opacity: op }}>{row}</div>
```

## Target

**One opacity owner — prefer parent only:**

1. Remove `opacity: on ? 1 : 0.4` from the label span (color alone distinguishes active/inactive name).
2. Keep parent `animate={{ opacity: op }}` / static `opacity: op` with `op = on ? 1 : n < step ? 0.5 : 0.28`.
3. Keep `CHAPTER_FADE = { duration: 0.15, ease: EASE_OUT }`.

Alternative (also valid): drop parent opacity animation; put `opacity: op` only on both spans and animate those — do **not** combine approaches.

## Repo conventions to follow

- Pre-028 look: number used `opacity: op`; label used separate `on ? 1 : 0.4` **without** a parent opacity wrapper. Restoring parent-as-sole-owner approximates completed-step 0.5 / future 0.28 without extra darkening.

## Steps

1. Delete label span’s `opacity: on ? 1 : 0.4`.
2. Leave parent motion/static opacity as-is.
3. Feel-check active vs past vs future chapters.
4. Push; typecheck; verify.

## Boundaries

- Do NOT change chapter copy or padStart numerals (UI plan may remove option indices separately).
- Do NOT reintroduce hover slides.
- Do NOT change `CHAPTER_FADE` duration.

## Verification

- **Mechanical**: typecheck 0; verify OK.
- **Feel check**: Inactive future chapter readable (not near-invisible); active at full opacity; step change fades ~150ms once.
- **Done when**: No element has both parent and child opacity multiplying for the same chapter row.
