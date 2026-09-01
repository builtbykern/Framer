# 083 — Cap Reveal Tooltip open under 200ms

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 1 file, ~6 constants

## Problem

Tooltip open is over the AUDIT UI budget (tooltips **125–200ms**). Combined shell fade + expand + label delay feels late for a hover tip hit many times per session.

```ts
/* code-components/RevealTooltip.tsx:116-118 — current */
const EXPAND_MS = 240
const LABEL_MS = 160
const PIXEL_MS = 280
```

```ts
/* code-components/RevealTooltip.tsx:340 — TipShellMotion opacity */
: { duration: 0.14, ease: EXPAND_EASE }
```

Label also uses `delay: 0.07` (smooth) / `0.12` (pixel) on top of those durations.

## Target

```ts
const EXPAND_MS = 180
const LABEL_MS = 120
const PIXEL_MS = 180
const SHELL_MS = 125
```

- TipShellMotion opacity: `duration: SHELL_MS / 1000` (0.125)
- Smooth label delay: `0.04` (not 0.07)
- Pixel label delay: `0.06` (not 0.12)
- Keep `EXPAND_EASE` unless plan 085 lands first (then use the shared ease-out)

## Repo conventions to follow

- AUDIT tooltip budget: 125–200ms (`animation-plans` / improve-animations AUDIT.md)
- Exemplar: Hold Confirm snaps under ~200ms for UI feedback — prefer short enter

## Steps

1. In `code-components/RevealTooltip.tsx`, change `EXPAND_MS` → `180`, `LABEL_MS` → `120`, `PIXEL_MS` → `180`.
2. Add `const SHELL_MS = 125` and use it in `TipShellMotion` transition duration.
3. In `SmoothTip` labelTx, set `delay: open ? 0.04 : 0`.
4. In `PixelTip` labelTx, set `delay: freeze ? 0 : 0.06`.
5. Push: `node scripts/framer/session.mjs --url "https://framer.com/projects/Straightforward-Engineers--DHpXX5xCoGaJHmRQfN0m-dFXww" --name "Reveal Tooltip"` then `node scripts/framer/push-revealtip.mjs` — expect `typeErrors: []`.

## Boundaries

- Do NOT change Bodak 3-slice math or pixel grid layout.
- Do NOT change Force Open / hover logic.
- Do NOT add dependencies.

## Verification

- **Mechanical**: push `typeErrors: []`; `node scripts/framer/verify.mjs` ok.
- **Feel check**: Preview → hover Tip Top; tip should feel immediate (under ~200ms to readable label). DevTools Animations at 10%: expand finishes before 200ms mark.
- **Done when**: no enter path uses duration > 200ms for tip open (excluding closeDelay, which is idle wait).
