# 019 — Kill monumental estimate remount enter on digit change

- **Status**: DONE
- **Commit**: n/a (no git HEAD; SoT `state/QuoteIntake.tsx` Version: 3.9.1)
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file, ~15 lines

## Problem

In monumental mode, every estimate tick remounts the low/high price spans because the React `key` includes the formatted text. That replay of `ENTER_TRANSITION` (340ms, translateY + opacity) is decorative noise on a high-frequency path. Digits already smooth via `useSpring`.

```tsx
/* state/QuoteIntake.tsx:334-343 — current */
const enter = reduced || onCanvas ? false : { opacity: 0.35, transform: "translateY(8px)" }
return (
    <div aria-live="polite" aria-atomic="true" style={{ display: "flex", flexDirection: "column" }}>
        <motion.span key={`lo-${lowText}`} initial={enter} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={ENTER_TRANSITION} style={num}>{lowText}</motion.span>
        {/* … divider … */}
        <motion.span key={`hi-${highText}`} initial={enter} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ ...ENTER_TRANSITION, delay: reduced || onCanvas ? 0 : 0.04 }} style={num}>{highText}</motion.span>
    </div>
)
```

## Target

- Stable keys that do **not** change when `lowText` / `highText` change (e.g. `key="est-lo"` / `key="est-hi"`).
- No enter animation on digit updates: render plain `<span>` (or `motion.span` with `initial={false}` and no remount) that only updates text content.
- Keep `useSpring` + `aria-live` behavior unchanged.
- Do **not** remove spring smoothing.

```tsx
/* target — monumental branch */
return (
    <div aria-live="polite" aria-atomic="true" style={{ display: "flex", flexDirection: "column" }}>
        <span key="est-lo" style={num}>{lowText}</span>
        {/* divider unchanged */}
        <span key="est-hi" style={num}>{highText}</span>
    </div>
)
```

## Repo conventions to follow

- Motion tokens live at top of `state/QuoteIntake.tsx` (`EASE_OUT`, `ENTER_TRANSITION`, etc.).
- Reduced / canvas: `reduced || onCanvas` already snaps display to `total` — leave that path alone.
- Exemplar of “no decorative remount”: compact branch of `AnimatedEstimate` (~347–361) already updates text without enter keys.

## Steps

1. In `state/QuoteIntake.tsx`, inside `AnimatedEstimate` monumental branch (~331–345): replace both `motion.span` remount-enter nodes with static `<span style={num}>` (or `motion.span` with stable keys and `initial={false}`).
2. Delete unused `enter` local and any now-unused `ENTER_TRANSITION` usage in that branch only.
3. Leave compact branch, spring wiring (`useSpring` / `useMotionValueEvent`), and `formatRange` untouched.
4. After local edit: push SoT to Framer via project harness (`setFileContent` on `Workshop/QuoteIntake.tsx`), typecheck 0, recreate instance if defaults/layout unchanged still recreate if prior workflow requires it, run `node scripts/framer/verify.mjs`.

## Boundaries

- Do NOT change formula / estimate math.
- Do NOT change compact or wide layout typography sizes.
- Do NOT retune `ENTER_TRANSITION` globally here (that is plan 021).
- Do NOT add dependencies.
- If monumental branch structure drifted, STOP and report.

## Verification

- **Mechanical**: Framer `typecheck({ strict: true })` → 0 diags; `node scripts/framer/verify.mjs` non-blocking.
- **Feel check**:
  - Drag a quantity slider / change intent so the range updates rapidly — prices must **tick via spring only**, no vertical fade-up on each digit change.
  - Animations panel @ 10%: no opacity/transform track restarting on every number update in monumental mode.
  - `prefers-reduced-motion`: still snaps to final numbers (existing path).
- **Done when**: monumental digit updates never replay enter; spring still interpolates when motion is allowed.
