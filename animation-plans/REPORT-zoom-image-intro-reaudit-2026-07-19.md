# Zoom Image Intro — re-audit (2026-07-19 evening)

Post-execution of 005–008 + Preview-aligned defaults. User confirmed `/preview` feels correct.
**Read-only.** No source changes.

Surface: `code-components/ZoomImageIntro.tsx` → Framer `aNCXc66`.
Instances (Home Desktop/Tablet/Phone + Preview): delay `0.5`, zoom `1.5`, hold `0.4`, images `[]` → built-in set, bg `rgb(6,6,6)`, pace `accelerate`.

---

## Closed since prior audit

| Prior | Status |
| --- | --- |
| A1 Gap-only pace | DONE (`paceGapMultiplier`, constant `scaleDuration`) |
| A2 Freeze settled layers | DONE (`settled` + static `div` after `onAnimationComplete`) |
| A3 Opacity-only exit | DONE (`EXIT_DURATION 0.32`, `EASE_OUT`) |
| A4 Fade-in ease-out 0.24s | DONE |
| A5 / U2 Hold default | DONE (`DEFAULT_HOLD_AFTER 0.4`, matches Preview) |
| U1 Object Fit Title Case | DONE (`Cover` / `Contain` / `Fill`) |

---

## improve-animations — Recon

| Fact | Current |
| --- | --- |
| Stack | React + framer-motion; `useIsStaticRenderer`, `useReducedMotion` |
| Frequency | Rare / first paint |
| Purpose | Cinematic stacked zoom → page reveal |
| Easings | Zoom `EASE_EXPO [0.16,1,0.3,1]`; opacity/exit `EASE_OUT [0.23,1,0.32,1]` (= AUDIT `--ease-out`) |
| Durations | Zoom `1.35s` (marketing OK); fade-in `0.24s`; exit `0.32s`; settle `0.35s` ×`1.02` |
| Perf | Full `transform` strings; settle → static; no per-frame fade-out (product decision) |

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |

No HIGH/MEDIUM findings survive re-vet against current source. Prior defects are closed; Preview feel is the acceptance bar.

### Residual notes (not findings — do not plan unless requested)

1. **`onAnimationComplete` contract** (`ZoomImageIntro.tsx:587–597`) — assumes FM fires once when *all* layer tweens finish. If a future FM/runtime fired per-property after opacity (`0.24s`), settle would snap early. Current Preview feel argues the all-complete path is live. Optional hardening: mark settled only when `definition` is the transform animation / after `scaleDuration`.
2. **Click-to-skip** — still a valid rare-frequency *opportunity* (Feedback), not a defect.
3. **`useInView` pause** — skill pattern for off-canvas; this product is typically fixed fullscreen, so low leverage.

### Missed opportunities (additive only)

| # | Idea | Why not a finding |
| --- | --- | --- |
| M1 | Tap/click → `finish()` | Additive delight; Preview already accepted without it |
| M2 | Prefetch next `img` before mount beat | Perf polish; no jank reported |

---

## improve-ui — Design language

- Audited surface: Zoom Image Intro Marketplace component + demo pages `/` and `/preview` (PreLoader Images)
- Design sources: `docs/projects/preload-images-listing.md`; in-file JSDoc/controls; Preview instance as accepted cinematic reference (user 2026-07-19)
- Documented decisions: stacked zoom → dismiss → page underneath; pace curves; auto-dismiss + hold; built-in demo images; reduced motion; no per-frame fade-out
- Governing owners and consumers: `ZoomImageIntro.tsx` / `aNCXc66`; instances `kgBPE4chO` (+ breakpoints), `SvOXHX9LA`
- Explicit exceptions: None documented

## Findings

No supported findings were found.

Prior U1/U2 are fixed. Home and Preview controls match. No remaining Title Case / default / copy contradictions that pass Contract + Runtime + single Correction without inventing intent.

## Improve first

No supported recommendation.

Motion and panel chrome are at acceptance quality for Marketplace given Preview sign-off. Next work should be product choices (skip control, publish listing), not another deslop pass.

---

## Ask

If you still want a plan, the only additive candidates are:

1. Optional **Skip on click** (property control + `pointerEvents`)
2. Defensive **settle-only-after-transform** guard

Otherwise: stop — component is re-audit clean.
