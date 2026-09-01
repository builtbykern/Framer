# 025 — Cinematic ink enter duration and mid-body curve

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 1 file + product contract doc

## Problem

Cinematic enter is `480ms` with UI ease-out `[0.23, 1, 0.32, 1]`. That curve
front-loads progress; combined with cover overshoot the paint never reads as
first-class kinetic editorial motion.

```ts
/* code-components/Kern_FillingPoint.tsx:76-87 — current */
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
const CINEMATIC_ENTER: Transition = {
    type: "tween",
    duration: 0.48,
    ease: EASE_OUT,
}
const CINEMATIC_EXIT: Transition = {
    type: "tween",
    duration: 0.6,
    ease: EASE_OUT,
}
```

## Target

```ts
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
/** Strong ease-in-out — readable mid-travel for paint growth */
const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1]

const CINEMATIC_ENTER: Transition = {
    type: "tween",
    duration: 0.76,
    ease: EASE_IN_OUT,
}
const CINEMATIC_EXIT: Transition = {
    type: "tween",
    duration: 0.72,
    ease: EASE_OUT,
}
```

Exit stays ease-out so reverse cascade still snaps into retract immediately.
Press / reduced-motion / balanced / snappy keep their existing budgets.

## Repo conventions to follow

- Preset table `MOTION_PRESETS.cinematic` must use these constants.
- Custom control defaults for Enter/Exit should match cinematic.
- Update `docs/projects/filling-point.md` defaults line to `760ms` enter /
  `720ms` exit.

## Steps

1. Add `EASE_IN_OUT` and retune `CINEMATIC_ENTER` / `CINEMATIC_EXIT` as above.
2. Confirm `resolveMotion` fallbacks and property-control `defaultValue`s pick
   up the new constants.
3. Sync product contract defaults.

## Boundaries

- Do NOT add bounce/spring to cinematic default.
- Do NOT change press `0.97` timing (140/180) or reduced-motion opacity path.
- Do NOT publish.

## Verification

- **Mechanical**: push `typeErrors: []`.
- **Feel check**: enter has visible mid-body growth; leave still starts
  retracting on the top layer immediately.
- **Done when**: hover in Preview feels deliberate, not snappy UI.
