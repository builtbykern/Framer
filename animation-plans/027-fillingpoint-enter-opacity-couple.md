# 027 — Couple enter opacity to ink growth

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file

## Problem

Enter opacity is `90ms`, so the disk pops visible at tiny scale before the
scale tween carries the motion. That amplifies the “too fast” read.

```ts
/* code-components/Kern_FillingPoint.tsx:135 — current */
const ENTER_OPACITY_DURATION = 0.09
```

## Target

```ts
const ENTER_OPACITY_DURATION = 0.2
```

Exit opacity stay-late behavior (`EXIT_OPACITY_DURATION = 0.1` delayed to end of
exit) is unchanged.

## Repo conventions to follow

- Opacity transitions remain separate from transform transitions on origin path.
- Reduced-motion path keeps `REDUCED_FILL_DURATION = 0.2` (already aligned).

## Steps

1. Set `ENTER_OPACITY_DURATION = 0.2`.
2. Feel-check that ink appears *while* growing, not as a pop then rocket.

## Boundaries

- Do NOT fade opacity during the bulk of exit (keep late fade).
- Do NOT publish.

## Verification

- **Feel check** at 0.25×: opacity and scale rise together in the first third.
- **Done when**: no hard disk flash at frame 0 of enter.
