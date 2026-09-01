# Dive Field — improve-animations + find-animation-opportunities

- **Date**: 2026-08-04
- **Commit**: `4aa0cbc`
- **Scope**: `code-components/DiveField.tsx` (Marketplace WebGL depth field)
- **Effort**: standard

## Recon

| Fact | Value |
| --- | --- |
| Stack | React + Framer controls · **raw WebGL rAF** (no CSS/Motion UI chrome) |
| Motion surface | Damped `target→current`, pointer sway, FOV warp, drag flick, key whole-layer + damp boost, optional autoScroll |
| Personality | Editorial cinematic dive — chromatic dissolve is the product |
| Frequency | Wheel/drag = primary session gesture; keys when focused; mount = rare |

### Settled (do not re-litigate)

- Continuous dive only (damping + `KEY_BOOST` for keys) — no layer magnet
- Focus-gated keys · RM decorative mute · drag flick · whole-layer keys
- Idle rAF + dirty rebuild · uniform/aPos/color/scatter caches
- `autoScroll` default **0** · transparent product

---

# Part A — improve-animations (corrective)

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | **No new high-confidence corrective findings** after the 065–069 / 148–151 pass | — |

### Explicitly not findings

| Candidate | Why dropped |
| --- | --- |
| Keyboard camera damp / `KEY_BOOST` | Product *is* the damped field response; keys are focused region nav, not app chrome. Raycast “no anim” rule does not delete the dive itself |
| Default damping `0.48` float | Buyer control + personality; no user complaint this pass |
| Continuous shader wobble when rAF running | Look control; RM zeros it; idle stops the loop by design (148) |
| CSS `ease-in` / `scale(0)` / Motion shorthands | N/A |

### Missed opportunities (additive — improve-animations §8)

1. **First WebGL paint** — after `boot`, canvas can go blank→full stack in one frame (rare mount). Soft opacity ramp would bridge without fighting scroll.
2. **Content texture rebuild** — `rebuildLayers` replaces textures; mid-edit can pop. Rare designer path; optional brief hold-last-frame / opacity bridge (costly — only if felt).

Feel of damp/flick/FOV cannot be fully judged from code alone — Preview wheel + flick + Tab keys remain the ground truth.

**Improve-animations verdict:** Corrective motion debt is largely cleared. Do not invent plans for taste retunes unless you pick a missed opportunity below (via `improve-animations plan …` or finding selection).

---

# Part B — find-animation-opportunities (additive gate)

## Opportunities (≤7, gated)

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | `DiveField.tsx` live canvas after `boot` (~1088–1163) | WebGL appears at full opacity when first frame paints | Preventing a jarring change | Rare (mount / Preview enter) | Root or canvas: start `opacity: 0`, after first successful `draw` set `opacity: 1` with `transition: opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-out`). Under `prefers-reduced-motion`: `opacity` only, **≤120ms**, or instant if already painted. Do **not** animate transform on the full-bleed field. |
| 2 | *(optional)* `rebuildLayers` completion (~699–748) | Texture swap can pop when Content layers change | Preventing a jarring change | Occasional (designer edit) | Prefer **skip** unless felt in Framer; if pursued: hold previous textures one frame then crossfade canvas opacity 150–200ms `ease-out` — never block wheel input |

Only **#1** is high-conviction. **#2** is conditional.

## Rejected candidates (required)

- **Keyboard Arrow/Space damp** — **Rejected: frequency / product function.** Keys advance the field; animating “less” would teleport layers (jarring). `KEY_BOOST` already shortens settle.
- **`:active` scale(0.97) on `.df-root`** — **Rejected: tens/day drag surface + function.** Full-bleed grab region; press-scale reads as a button, not a depth stage.
- **Idle continuous wobble while settled** — **Rejected: conflicts with idle-rAF (148) and perf.** Loop stop when settled is intentional.
- **Staggered per-layer entrance on mount** — **Rejected: purpose unclear + fights infinite dive metaphor**; would add decorative motion on every Preview load without explaining depth scroll.
- **Pointer-follow accent bloom / HUD** — **Rejected: decoration on functional typographic read**; product forbids in-component HUD/bloom.

## Verdict (opportunities)

Dive Field already concentrates motion where it belongs: **gesture-driven camera + velocity look**. It does not need more daily motion. The single additive that passes the gate cleanly is a **≤200ms opacity settle on first WebGL paint** so mount does not flash empty→dense. Everything else either violates frequency/function or reopens settled product decisions.

Handoff: say `plan 1` / `improve-animations plan first-paint opacity` to get a self-contained `animation-plans/070-…` file — or `ninguno` if you want zero additive work.

---

## Next (improve-animations Phase 3 → 4)

Corrective table is empty. Plans written (user: todo):

| # | Plan | Status |
| --- | --- | --- |
| 1 | [070 — first paint opacity](./070-divefield-first-paint-opacity.md) | TODO |
| 2 | [071 — rebuild opacity bridge](./071-divefield-rebuild-opacity-bridge.md) | TODO (cancel if unfelt) |

**No source edits in the advisor skills.** Execute with `framer-component` + push/verify.
