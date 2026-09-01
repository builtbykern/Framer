# 039 — Copy Field digit reveal stagger

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Easing & duration / Cohesion & tokens
- **Estimated scope**: 1 file (`code-components/CopyField.tsx`)

## Problem

Porting a long slot-machine blur cascade (>500ms, heavy blur) fights Kern UI budget and AUDIT blur cap. Digit reveal is the product signature — if wrong, the SKU reads as a generic copy button.

There is no current code (greenfield). Spec must land correctly on first implementation.

## Target

On reveal (eye click → unmask):

- Split display string into characters (keep spaces as non-animated spacers).
- Per digit animate **only**:
  - `opacity: 0 → 1`
  - `transform: translateY(6px) → translateY(0)` (full transform string, **not** Motion `y` shorthand)
  - `filter: blur(8px) → blur(0px)` — peak blur **≤ 12px** (never ≥ 20px)
- Stagger: **40ms** per digit (left → right)
- Per-digit duration: **180ms**
- Ease: `cubic-bezier(0.23, 1, 0.32, 1)` (`EASE_OUT` — same as `MetricSeal.tsx` / `KineticGrid.tsx` `COLUMN_BRIDGE.ease`)
- Total span for 16 digits ≈ `15 * 40ms + 180ms` = **780ms** wall clock is too long for UI — **cap**: animate only visible digit glyphs with stagger 40ms but **clamp last delay so last digit starts by 140ms** (max delay 140ms → total ≤ **320ms**). Implementation: `delay = min(index * 0.04, 0.14)`.
- Interruptible: Framer Motion `animate` / transitions (not CSS `@keyframes`). Rapid re-mask must retarget from current values.
- Masked idle: show mask char (default `X`) per digit slot with same grouping spaces.

```ts
const EASE_OUT = [0.23, 1, 0.32, 1] as const
const DIGIT_TRANSITION = {
  duration: 0.18,
  ease: EASE_OUT,
}
// delay: Math.min(digitIndex * 0.04, 0.14)
```

## Repo conventions to follow

- Curves: `EASE_OUT` `[0.23, 1, 0.32, 1]` in `code-components/MetricSeal.tsx` (~86–88)
- Stagger philosophy: Glyph Ink / Filling Point cascade caps — decorative, never blocks click on copy once revealed
- Exemplar stagger clamp: `animation-plans/037-glyphink-stagger-opacity.md` (cap delays)

## Steps

1. Create `code-components/CopyField.tsx` with typed props: `value` (string), `maskChar` (default `"X"`), grouped display helper inserting spaces every 4 chars when `groupDigits` true (default true for card-like values).
2. Render each character in a `motion.span` with `style={{ display: "inline-block" }}`.
3. Drive reveal with a `revealed` boolean; when true, animate digits with target values above; when false, reverse with same transition (for reset).
4. Use `transform: "translateY(6px)"` → `"translateY(0px)"` strings in `animate` / `initial`.
5. Do not animate layout width/height; keep monospace or tabular nums if needed for stability (`fontVariantNumeric: "tabular-nums"`).

## Boundaries

- Do NOT use `filter: blur` peak > 12px.
- Do NOT use Motion `x` / `y` / `scale` shorthand for the digit travel — use `transform` string (scale may be separate on button only).
- Do NOT add Auto Demo / idle loop.
- Do NOT implement icon/toast in this plan beyond leaving hooks (`revealed` state).

## Verification

- **Mechanical**: component typechecks; `useIsStaticRenderer` stub allowed empty until plan 042.
- **Feel check**: click reveal — digits cascade L→R, last digit lands by ~320ms; spam-toggle eye never restarts from keyframe zero; DevTools Animations 10% shows blur ≤8px peak.
- **Done when**: masked↔revealed matches stagger contract; no layout shift of pill width.
