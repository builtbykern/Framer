# Craft SOTD Page Stage hero (Home, outside Overlay Nav)

Written against: `4aa0cbc`

**Status: DONE** (executed 2026-07-31) — Page Stage: Brand `H6Wd1SIDd`, Hero `QtV0H8WZl` 64px/780w, Support `osiloTlVB`; linear scrim `AZTTbd52i` + radial vignette `VCU7kXYQP`; Overlay Nav untouched.

## Evidence chain

- Surface: Framer project Strong Luxury / Overlay Nav (`32N5ipHfkUMlPJAI6dc7`), Home Desktop `WQLkyLRf1` → **Page Stage** `iDn86rM1G` (under absolute Overlay Nav instance `sqnDbYVx6`). `pagePath: "/"`.
- Problem: After nav-only split, the “hero” is a stock full-bleed photo + flat `rgba(0,0,0,0.35)` scrim + one centered Geist `40px/400` line (“Agence conseil en réputation et influence”). It reads as a placeholder slide, not an Awwwards/SOTD opening composition.
- Design evidence:
  - Live serialize (2026-07-31): Page Stage children = `Page Scrim` `AZTTbd52i` (solid fill) + `Hero` `QtV0H8WZl` only. No brand display, no support line, no gradient atmosphere, no measure constraint.
  - Rendered Home screenshot: skyline full-bleed; single mid-size sentence dead-center; BuiltByKern exists only inside Overlay Nav header — brand test fails if nav chrome is ignored.
  - Documented architecture: Overlay Nav = Menu Overlay + Header only; page owns media/hero (`component/overlay-nav-structure`). Prior type system on this project: Geist, tracking ~`−0.04em` (`design-plans/2026-07-31-overlay-nav-type-rhythm.md`).
  - User improve-ui request: “hero section trabajado, nivel awwwards SOTD.” Binding composition rules for this work: one first-viewport composition; brand as hero-level signal; hero budget = brand + one headline + one short support (+ optional single CTA group) + one dominant full-bleed image; no cards in hero; no floating badges/chips on media; no purple/cream AI clichés.
- Owner: Home page frames under `WQLkyLRf1` / `iDn86rM1G`. Not `F7FlnigBf`, not `BurgerFlip.tsx`.
- Scope and affected surfaces: Page Stage tree only; Overlay Nav instance stays absolute full-bleed on top (transparent Closed).
- Uncertainty: Exact display size may need ±8px after screenshot; gradient scrim opacities ±0.05 for type contrast on the skyline. Do not invent new marketing CTAs or replace the existing French line’s meaning.

## Design decision

Rebuild **Page Stage** as a single SOTD hero composition **under** the nav:

1. **Brand** — page-level `BuiltByKern` wordmark (reuse exact string from Overlay Nav logo), display weight, above the French line — so the first viewport still brands if the eye skips the nav.
2. **Headline** — promote existing “Agence conseil en réputation et influence” to true display type (larger, tighter), still the one primary sentence.
3. **Support** — one short muted line under the headline using existing product language only: `Reputation & influence` (English echo of the same meaning — not a new claim). If executor prefers zero new copy, omit support and rely on brand + headline only (still valid hero budget minus support).
4. **Atmosphere** — replace flat scrim with a **vertical gradient** (darker at top for nav/type, clearer mid for photo, slight deepen at bottom). Optional soft vignette Frame. Keep the same skyline asset (already on Page Stage fill).
5. **Layout** — vertical stack, center-aligned, generous gap; headline `max` measure via width constraint (~720–820px) so the line doesn’t span edge-to-edge. No cards, no pills, no stats.

Overlay Nav remains the only interactive chrome (burger / menu). Hero stays page content.

## Reuse

- Media URL already on Page Stage: `https://framerusercontent.com/images/LmOPtjezyzHFoxv2Ln2aquvnKSY.jpg`
- Type family: `Geist` (project type rhythm)
- Brand string: `BuiltByKern` (from Logo `VDagMH3R4` in Overlay Nav — copy string only; do not move the logo node)
- Stacking exemplar: full-bleed media under chrome (`design-plans/epic-marketplace-atmosphere.md` structure) — **page** owns media; nav stays above
- Existing nodes to retarget: `iDn86rM1G`, `AZTTbd52i`, `QtV0H8WZl`
- No new code component; no Overlay Nav edits

## Changes

1. Session pin (mandatory)
   - Change: `node scripts/framer/session.mjs --url "https://framer.com/projects/Strong-Luxury--32N5ipHfkUMlPJAI6dc7-gX7Pa" --name "Overlay Nav"` then `exec.mjs -s <sessionId>`
   - Preserve: project `32N5ipHfkUMlPJAI6dc7`
   - Verify: `getProjectInfo()` id matches

2. Page Stage `iDn86rM1G` — composition shell
   - Change: Keep `position="absolute"` `left/top=0` `width/height=1200×800` `overflow="hidden"` and existing image fill. Set `layout="stack"` `stackDirection="vertical"` `stackAlignment="center"` `stackDistribution="center"` `gap="18px"` `padding="120px 64px 96px 64px"` (top padding clears nav header ~72px).
   - Preserve: media asset URL; absolute full-bleed under `sqnDbYVx6`
   - Verify: serialize padding/gap; Home screenshot still full-bleed photo

3. Scrim `AZTTbd52i` — gradient atmosphere (replace flat wash)
   - Change: Keep absolute full-bleed. Remove solid `rgba(0,0,0,0.35)` as the only treatment. Apply a **linear gradient** top→bottom approximately:
     - `rgba(0,0,0,0.55)` at 0%
     - `rgba(0,0,0,0.25)` at 45%
     - `rgba(0,0,0,0.45)` at 100%
     Use Framer DSL/`setAttributes` gradient API available in-session (`backgroundGradient` / fill gradient — check `npx @framer/agent@latest docs` for exact field; do not guess property names). If gradient SET fails, fallback: keep solid `rgba(0,0,0,0.4)` **and** add a second absolute Frame `heroVignette` with radial transparent→`rgba(0,0,0,0.5)` at edges (still better than flat equal wash).
   - Preserve: pointer-events none / no onTap; sits under type, above photo
   - Verify: Home screenshot — skyline still readable; white type contrast OK

4. Brand wordmark (new RichText under Page Stage)
   - Change: `+RichTextNode heroBrand` parent `iDn86rM1G`, **above** headline in stack order (after scrim in z, with type siblings in stack):
     - text `BuiltByKern`
     - `fontName="Geist"` `fontWeight="600"` `fontSize="14px"` `letterSpacing="0.18em"` `lineHeight="1.2em"` `textColor="rgba(255,255,255,0.72)"` `textAlignment="center"`
     - Optional: uppercase via Framer text transform if available; else leave mixed case matching nav logo
   - Preserve: Overlay Nav logo unchanged
   - Verify: Home Closed — brand appears in hero band under header, not only in nav

5. Headline `QtV0H8WZl` — display metrics
   - Change: Keep copy `Agence conseil en réputation et influence`. Set:
     - `fontName="Geist"` `fontWeight="400"` `fontSize="64px"` `letterSpacing="-0.045em"` `lineHeight="1.05em"` `textColor="rgb(255,255,255)"` `textAlignment="center"`
     - Width: `width="780px"` (or `maxWidth` if supported) so the sentence wraps to 2 lines max on 1200 canvas
   - Preserve: exact French string
   - Verify: screenshot — headline dominates; wraps cleanly; no collision with Overlay Nav burger/logo

6. Support line (optional but preferred)
   - Change: `+RichTextNode heroSupport` under headline:
     - text `Reputation & influence`
     - `fontName="Geist"` `fontWeight="400"` `fontSize="15px"` `letterSpacing="0.04em"` `lineHeight="1.35em"` `textColor="rgba(255,255,255,0.55)"` `textAlignment="center"`
   - Preserve: no extra CTAs, cards, or stats
   - Verify: tertiary read under headline; still one composition

7. Z-order / nav
   - Change: Ensure Desktop children order: `iDn86rM1G` (0) then `sqnDbYVx6` (1). Overlay Nav instance stays absolute `1200×800`.
   - Preserve: Overlay Nav Closed/Open behavior; burger morph; menu links
   - Verify: Preview — Closed shows crafted hero; Open menu still works; page photo may show through menu scrim

## Scope

- Inherit: Home `/` Desktop only
- Verify: Overlay Nav Open/Closed; burger hit; no regression of nav-only architecture
- Exclude: Editing `F7FlnigBf` tree; `BurgerFlip.tsx`; new Marketplace CTAs; replacing skyline asset unless user supplies a new URL; Phone/Tablet breakpoints (unless already present — do not invent)

## Validation

- Product: First viewport reads as one SOTD composition — brand + display headline + atmosphere + photo; nav is chrome only
- Interface: Screenshot Home Closed (`WQLkyLRf1`); toggle Overlay Nav Open; confirm French headline still legible; no cards/pills
- System: Page owns hero; Overlay Nav untouched; Geist retained
- Repository: `node scripts/framer/verify.mjs` (pinned Overlay Nav session) → `ok: true`, no blocking errors

## Stop conditions

- Stop if session is not `32N5ipHfkUMlPJAI6dc7`
- Stop if change requires putting Page Stage / media back inside Overlay Nav
- Stop if gradient API is unavailable **and** vignette fallback also fails — escalate with screenshot rather than inventing a shader code component
- Stop if headline at 64px clips under nav or overflows badly — nudge to `56px` or width `720px` only

## Design documentation

- After acceptance: record “Home Page Stage = SOTD hero (brand + display + gradient scrim); Overlay Nav remains nav-only.” Destination: Engram `component/overlay-nav-structure` update + Status DONE on this plan file.
