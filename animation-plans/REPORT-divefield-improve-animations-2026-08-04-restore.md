# Dive Field — improve-animations (post user restore)

- **Date**: 2026-08-04
- **Commit**: `4aa0cbc`
- **Scope**: `code-components/DiveField.tsx` (Framer pull — user-restored specimen)
- **Effort**: standard
- **Sandbox**: `7mzOTQA5ZdZVnu6ZH54e` · codeFile `GGUB84a`

## Recon

| Fact | Value |
| --- | --- |
| Stack | React + Framer controls · raw WebGL rAF (no Framer Motion) |
| Motion | Exponential damp `target→current`; pointer sway; FOV×speed; shader wobble/RGB/dissolve |
| Personality | BuiltByKern Marketplace depth field — gesture-led, chromatic, transparent |
| Frequency | Wheel/drag continuous; keys when focused; autoScroll `0.018` keeps ambient dive |

### Settled (do not re-litigate)

- No Snap / no magnet
- No park fog
- Transparent product (page owns background)
- Specimen defaults in this build (104px, autoScroll `0.018`, fog 1.05/2.35, etc.)

### Context

Prior plans **065–069** / **070–071** marked DONE, but **this restore lacks that craft**. Evening **152–154** were **REVERTED**. New plans **072–080** re-specify against current line numbers. Do not reintroduce Snap or park fog.

## Findings → plans

| Finding | Sev | Plan |
| --- | --- | --- |
| 1 RM incomplete (decorative + Z damp) | HIGH | [072](./072-divefield-reduced-motion-full.md) |
| 2 Uniform + color lookups per frame | HIGH | [073](./073-divefield-cache-uniforms-colors.md) |
| 3 Drag release no flick | HIGH | [074](./074-divefield-drag-flick.md) |
| 4 Window keys without focus | MEDIUM | [075](./075-divefield-keydown-focus-gate.md) |
| 5 Arrow ±0.5 vs Space whole-layer | MEDIUM | [076](./076-divefield-keyboard-whole-layer.md) |
| 6 Hidden-tab rAF | MEDIUM | [077](./077-divefield-visibility-pause.md) |
| 7 Scatter hash every frame | MEDIUM | [078](./078-divefield-cache-scatter.md) |
| 8 Ambient timeRot / act while idle-looping | MEDIUM | [079](./079-divefield-gate-ambient-motion.md) |
| 9 Pointer leave sway stuck | LOW | [080](./080-divefield-pointerleave.md) |

## Recommended execution order

**072** → **073** → **075** → **076** → **074** → **077**+**080** (same push OK) → **078** → **079**

Dependencies: **076** after **075**; **080** pairs with **077**.

Push: `node scripts/framer/push-divefield.mjs` · verify: `node scripts/framer/verify.mjs`  
**No Community publish without OK.** Tip republish only if user asks.
