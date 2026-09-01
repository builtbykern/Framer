# Zoom Image Intro — motion + UI + opportunities (2026-07-19)

Surface: `code-components/ZoomImageIntro.tsx` → Framer `BuiltByKern_ZoomImageIntro.tsx` (`aNCXc66`).
Personality: Marketplace cinematic intro (rare / first-view delight). Stack: React + Framer Motion (`motion`, `useReducedMotion`).
Commit stamp: unavailable (`git rev-parse` failed in harness).

Skills run: `improve-animations` · `improve-ui` · `find-animation-opportunities`.
**No source was modified.** Plans live under `animation-plans/` and `design-plans/`.

---

## Recon (motion)

| Fact | Value |
| --- | --- |
| Frequency | Rare / first paint — delight budget allowed |
| Purpose | Explanation + preventing jarring page reveal |
| Tokens in file | `EASE_OUT [0.23, 1, 0.32, 1]` (= AUDIT `--ease-out`), `EASE_EXPO [0.16, 1, 0.3, 1]` (zoom) |
| Default zoom | `SCALE_DURATION = 1.35` (marketing — OK over 300ms UI cap) |
| Exit | Root `opacity → 0` + `scale(0.98)`, cap `0.45s` |
| Reduced motion | Opacity-only last frame, `0.2s` |
| Perf path | Full `transform: scale(...)` strings (correct per AUDIT) |

---

## improve-animations — Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| A1 | HIGH | Purpose & frequency / Cohesion | `ZoomImageIntro.tsx:173–209`, `513` | `paceMultiplier` scales **both** gap *and* `scaleDuration`. Accelerate shortens late zooms → camera rushes at the end (matches user report). | Pace curves change **gaps only**; zoom duration stays `baseScaleDuration`. |
| A2 | HIGH | Performance | `ZoomImageIntro.tsx:340–360`, `486–573` | Every started layer stays a live `motion.div` for its full tween. 6–12 full-bleed concurrent transforms. | Freeze completed layers to static `div` after reach `scaleTo`; keep at most 2 live animating layers. **No fade-out.** |
| A3 | MEDIUM | Physicality / Easing | `ZoomImageIntro.tsx:458–461`, `84–86` | Exit `scale(0.98)` fights last-frame settle `×1.02` and softens the page handoff. | Opacity-only exit; `duration: 0.32`, `ease: EASE_OUT`. |
| A4 | MEDIUM | Easing & duration | `ZoomImageIntro.tsx:83`, `518`, `543–548` | Fade-in uses `EASE_EXPO` up to `0.4s` — opacity starts slow; layer ghosts before zoom reads. | Fade-in `0.24s`, `ease: EASE_OUT`. |
| A5 | LOW | Missed opportunities | `ZoomImageIntro.tsx:247`, `650–653` | Default `holdAfterSequence = 0.2` truncates the rare settle beat before dismiss. | Default hold `0.45`. |

### Missed opportunities (additive — see find-animation-opportunities)

See Part 1 table below. Highest leverage additive: opacity-only exit (A3) and optional skip-click.

---

## improve-ui — Design language

- Audited surface: Zoom Image Intro Marketplace code component (`code-components/ZoomImageIntro.tsx`, demo Home + `/preview` in PreLoader Images).
- Design sources: `docs/projects/preload-images-listing.md` (byline/description), in-file JSDoc + propertyControls, recent product decision: stacked cover without per-frame fade-out.
- Documented decisions: “Cinematic stacked zoom sequence for page reveals”; pace curves; auto-dismiss; reduced motion; demo images ship filled.
- Governing owners and consumers: sole product file `aNCXc66` / local `ZoomImageIntro.tsx`; instance `kgBPE4chO`.
- Explicit exceptions: None documented.

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| U1 | Object Fit panel labels break Title Case used by sibling enums in the same controls panel. | Contract: `paceCurve` / `zoomDirection` use Title Case optionTitles (`Even`, `Out (larger)`). Runtime: `objectFit.optionTitles: ["cover", "contain", "fill"]` at `ZoomImageIntro.tsx:630–636`. | Set optionTitles to `["Cover", "Contain", "Fill"]` (values stay lowercase). | Property panel only | High |
| U2 | Out-of-box hold feels truncated vs listing promise of cinematic dismiss. | Contract: listing “Auto dismiss + hold after sequence” + in-file settle “before auto-exit”. Runtime: hold default `0.2` vs `SETTLE_DURATION 0.35` (`247`, `650`). | Default `holdAfterSequence` → `0.45` (same as A5). | Defaults + control defaultValue | Medium |

No other UI candidates survived the proof gate without rendered Marketplace evidence (thumbnail composition, density, hierarchy).

## Improve first

**U1** — zero risk, immediate panel polish for every buyer; pair with A5/U2 defaults in the same executor pass if desired.

---

## find-animation-opportunities

### Part 1 — Opportunities

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| O1 | Root exit `458–461` | Opacity + `scale(0.98)` | Preventing a jarring change | Rare | Opacity-only → `0`, `duration: 0.32`, `ease: [0.23, 1, 0.32, 1]` (`EASE_OUT`). Keep reduced-motion path. |
| O2 | After last settle | Hold default `0.2s` then exit | Delight | Rare | Hold default `0.45s` so settle `×1.02` reads before dismiss. |
| O3 | Layer mount `486+` | Instant mount + opacity fade | Preventing a jarring change | Rare | Keep fade-in but `0.24s` + `EASE_OUT` (A4) — no second effect. |
| O4 | Whole sequence | No skip | Feedback | Rare (preview / impatient) | Optional: `pointerEvents: "auto"` + click/tap → `finish()` when `autoDismiss`. Do **not** add hover motion. |

### Part 2 — Rejected

- Spring / bounce on zoom — **Rejected: Function** — fights expo camera; not UI press feedback.
- 30–80ms stagger of all images at once — **Rejected: Purpose** — product *is* sequential stacked zoom.
- Ken Burns crop pan — **Rejected: Purpose** — would change product identity (frame-size zoom, not crop).
- Blur crossfade between layers — **Rejected: Frequency/feel** — user explicitly rejected fade-out handoffs; blur risks same soft dissolve.
- Hover scale on intro — **Rejected: Frequency + pointer-events none** — decorative hover on a blocking intro.

### Part 3 — Verdict

This surface already has the right motion *job* (rare cinematic zoom). It does **not** need more effects — it needs cleaner rhythm (gap-only pace), cheaper stacking (freeze buried layers), and a quieter exit. Highest leverage: **A1 + A2**, then **O1/A3**.

Handoff: execute plans in `animation-plans/README.md` (Zoom Image Intro section), or say which numbers to run.

---

## Recommended plan order

1. `005` Gap-only pace  
2. `006` Freeze buried layers  
3. `007` Opacity-only exit + hold default  
4. `008` Fade-in ease-out budget  
5. Design: `design-plans/2026-07-19-zoom-image-intro-objectfit-titles.md`
