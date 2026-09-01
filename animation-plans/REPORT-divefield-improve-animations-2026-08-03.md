# Dive Field — improve-animations audit

- **Date**: 2026-08-03
- **Commit**: `4aa0cbc`
- **Scope**: `code-components/DiveField.tsx` (Marketplace WebGL depth field)
- **Sandbox**: `7mzOTQA5ZdZVnu6ZH54e` · preview `agreeable-direction-468549.framer.app`
- **Effort**: standard

## Recon

| Fact | Value |
| --- | --- |
| Stack | React + Framer property controls · **raw WebGL** (no Motion/GSAP/CSS keyframes for the product) |
| Motion surface | Single rAF loop: damped `target→current`, pointer cam, snap magnet, autoScroll, shader time/vel |
| Tokens | None (JS/WebGL constants + property controls) |
| Personality | Editorial cinematic depth — continuous dive + chromatic dissolve; buyer-tuned damping |
| Frequency | Wheel/drag = primary (tens–hundreds/session); keys when focused; autoScroll always-on while in view (default) |

### Settled (do not re-litigate)

- Idle rAF + `layersDirty` rebuild (fixing-motion-performance) — already shipped
- Sway default `0.2` (user-lowered from 0.85)
- Snap default **off**; Strength/Inertia controls intentional
- Transparent product (no bloom/vignette in-component)
- SKU accent `#6FFF8A`

## Findings (vetted)

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Purpose / a11y | `DiveField.tsx:1145`, `824–854` | `window` `keydown` drives the camera **without** requiring focus on the Dive Field region — Arrow/Page/Space hijack page navigation whenever the component is mounted | Gate `onKey` to `root === document.activeElement` (or `root.contains(...)`) |
| 2 | HIGH | Performance | `DiveField.tsx:984–1040` | `getUniformLocation` called ~20× per visible layer per frame on the hot path (already noted as optional follow-up after idle-rAF) | Cache uniform locations once after `linkProgram`; reuse in `draw` |
| 3 | MEDIUM | Accessibility | `DiveField.tsx:861–999`, frag `243–245` | `prefers-reduced-motion` zeros sway / autoScroll / FOV warp, but **keeps** fragment `uWobble` time wave, layer `Math.sin(time…)` micro-rot, and dissolve `act` pulse | When `reduce`: force wobble→0, skip time rot offset, freeze/zero `act`; keep damped scroll for comprehension |
| 4 | MEDIUM | Interruptibility | `DiveField.tsx:792–821` | Drag updates `target` sample-by-sample; release only `armSnap` — **no flick velocity** into target (sticky stop vs throw) | On `pointerup`, add `lastDragDelta / dt * throwGain` into `target`, then `armSnap` |
| 5 | LOW | Purpose / cohesion | `DiveField.tsx:834–846` | Arrow/Page step **±0.5** layer; Space steps **±1** from `Math.round(current)` — inconsistent keyboard grammar | Arrow/Page: `target = Math.round(current) ± 1` (match Space) |

## Missed opportunities

1. **RM pointer cam**: under `reduce`, `camX`/`camY` still lerp toward pointer and can keep `needsFrame` warm even though `sway === 0` — skip pointer cam lerp when reduced.
2. **Keyboard settle**: after whole-layer key steps (#5), briefly raise damp (same path as snap snappy) so keys feel decisive vs wheel float.
3. **Rest chromatic**: default `rgbShift` still fringes at zero velocity — optional RM-only mute of base shift (fold into #3 if desired).

## Not findings

- Continuous `autoScroll` while in-view — product atmosphere (loop correctly idles when off-screen / settled with auto≈0).
- Damping `0.48` / floaty camera — buyer control + personality; feel-check only if user asks to retune defaults.
- CSS `ease-in` / `scale(0)` / Framer Motion shorthands — N/A (no CSS/Motion UI chrome).

## Plans (user: all → TODO)

| # | Plan | Status |
| --- | --- | --- |
| 1 | [065 — keydown focus gate](./065-divefield-keydown-focus-gate.md) | DONE |
| 2 | [066 — cache uniform locations](./066-divefield-cache-uniform-locations.md) | DONE |
| 3 | [067 — RM decorative mute](./067-divefield-reduced-motion-decorative.md) | DONE |
| 4 | [068 — drag flick](./068-divefield-drag-flick.md) | DONE |
| 5 | [069 — keyboard whole-layer](./069-divefield-keyboard-whole-layer.md) | DONE |

**Execute order:** **065** → **066** (independent) → **067** → **068** → **069** (after 065). Same push OK for 065+069.

**Shipped 2026-08-03** — single push to `GGUB84a`; verify clean.
