# 052 — Arbour site-wide page fade (opacity only)

- **Status**: DONE (canvas 2026-08-12; unpublished)
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Cohesion / missed opportunity (page transitions)
- **Estimated scope**: 1 Framer Page Effect on Home Desktop, target All Pages (no code files)

## Problem

Arbour has **no route transition**. Live production `https://arbour.framer.website` (2026-08-12): click Nav Home → About **78ms**, About → Contact **43ms**. Hard cut. WebPageNode serialize has **no** `pageTransition` attribute on any page (`/`, `/about`, `/contact`, `/properties`, `/neighbourhoods`, `/notes`, `/404`, CMS details).

`plans/opportunities-arbour-2026-07-15.md` rejected Nav transitions as “100+/day never animate.” That ban was against **theatrical** wipes/slides. The user later asked for page transitions **in Arbour style**: quiet editorial, short, opacity-only. A **200ms fade** is allowed; a wipe / `offsetY ±30%` / 0.6s cinematic is not.

`plans/012-view-transition-property-hero.md` is **REVERTED** (View Transitions no-op in Framer soft-nav). Do **not** reintroduce VT or `Arbour_LoadingScreen`.

## Target

One **global Page Effect**, preset **Fade / Crossfade** (not Wipe, Slide, Push, Blinds, Inset).

| Property | Value |
|----------|--------|
| Target | **All Pages** |
| Enter | opacity `0 → 1`, **no** offset X/Y, **no** scale, **no** mask |
| Exit | opacity `1 → 0`, **no** offset X/Y |
| Duration | **0.2s** (200ms) both enter and exit |
| Easing | ease-out **`cubic-bezier(0.23, 1, 0.32, 1)`** (AUDIT.md `--ease-out`). If Framer only offers named curves, pick the strongest ease-out, **not** ease-in, **not** linear. |
| Delay | **0s** (no black-frame gap) |
| Reduced motion | OS `prefers-reduced-motion: reduce` → effect should drop to Instant / opacity-only. If Framer Page Effects ignore RM, leave a note; do not add a custom overlay. |

Nav/Footer may fade with the page for 200ms. **Do not** create a Layout Template or Page Effect → Exclude in this plan (structural, out of scope).

## Repo conventions to follow

- Personality: quiet / editorial (`docs/projects/arbour.md`). Opacity + tiny `y` on **content appears** (plan 053), **zero travel** on the **route** layer.
- Canvas motion already uses `tween 0.23,1,0.32,1` (Footer appears). Same curve here.
- Session: Arbour `CmRyHJKPrPE6BZhC6d4S` — always re-bind before edits:

```bash
node scripts/framer/session.mjs --id CmRyHJKPrPE6BZhC6d4S --name Arbour
```

- Exemplar of “do not invent a second system”: do not add a code-component veil. Use Framer Page Effects only.

## Steps

1. Re-bind Arbour session (command above). Confirm `projectId` is `CmRyHJKPrPE6BZhC6d4S`, not Strong Luxury.
2. Probe whether the agent can see Page Effects. Serialize Home Desktop `PYd9q93eW` depth 1 (`pagePath: "/"`). Log every attribute key matching `/effect|transition|page/i`. If a `pageEffect` / `pageEffects` field exists, SET it to fade 0.2s ease-out All Pages via `applyChanges` — **only if the dump shows a real field**. Do not guess DSL keys.
3. If no API field (expected as of 2026-08-12): apply in the Framer UI on **Home → Desktop** (`PYd9q93eW`):
   - Right sidebar → **Effects** → **+** → **Page Effect**
   - Target dropdown → **All Pages**
   - Preset **Fade** (or Crossfade)
   - Enter/exit duration **0.2s**, offset **0**, no mask, easing ease-out `cubic-bezier(0.23, 1, 0.32, 1)`
4. Do **not** add per-page overrides (no special Contact wipe, no properties-only morph).
5. `node scripts/framer/verify.mjs --page /` — warnings-only OK; no new blocking errors.
6. Preview (Framer preview or production after user publishes): Nav `/` → `/about` → `/contact` should show a **short opacity crossfade**, not a slide.

## Boundaries

- Do NOT use Wipe / Slide / Push / circular mask / blinds.
- Do NOT set Offset Y to ±30% or duration ≥ 0.4s.
- Do NOT resurrect `Arbour_LoadingScreen` or View Transitions (`view-transition-name`).
- Do NOT edit `appearEffect` here — that is plan **053**.
- Do NOT change Home `transition: spring-physics…` here — that is plan **054**.
- Do NOT publish unless the user asks.
- Do NOT switch session to Strong Luxury / Aurea.

## Verification

- **Mechanical**: After the effect exists, live Nav timing Home→About should be **visibly > 150ms** of fade (not the previous 43–78ms hard cut). Serialize still may not show the effect — UI + preview are source of truth.
- **Feel check**:
  - Click Properties, Notes, About, Contact in sequence. Same fade every time.
  - Nav bar may dim briefly; content must not slide or wipe.
  - DevTools Animations panel at 10%: only opacity on the page layer.
  - `prefers-reduced-motion: reduce`: no slide; fade gone or opacity-only.
- **Done when**: All Pages Fade 0.2s ease-out is on; no wipe; verify.mjs not blocking.

## Suggested motion values (AUDIT.md)

- Entering/exiting UI: **ease-out** `cubic-bezier(0.23, 1, 0.32, 1)`
- Dropdowns / selects budget: **150–250ms** → page fade **200ms**
- Tens of times/session (Nav): drastically reduce — opacity only, no travel
- Never `scale(0)`; never `ease-in` on enter
