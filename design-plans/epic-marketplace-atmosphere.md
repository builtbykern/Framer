# Epic Marketplace atmosphere (shader + grain)

Written against: unavailable · project `WaveDotLink` (`ZwyVKF2gZm09JBTBj5RT`) · session `3`

## Evidence chain

- Surface: `/` Desktop `WQLkyLRf1` → Stage `aD0V2O9xQ` (eyebrow / title / WaveDotLink instance `D86aoiS2J` / caption)
- Problem: Desktop `fill="#FFFFFF"` only; Stage `fill="rgba(0,0,0,0)"`; zero `ShaderNode`s — Marketplace stage reads as empty canvas, not product theater
- Design evidence: prior stage plan (`design-plans/marketplace-desktop-stage.md`) established one composition + product title; user contract now requires **animated / shader / noise** background for epic Marketplace presentation; Framer `<available-shaders>` includes `liquid-gradient` (has `ditherMode` Off/Smooth/**Grain**) and `wave-gradient` (wave metaphor)
- Owner: Desktop chrome frames only — **not** `WaveDotLink.tsx`
- Scope and affected surfaces: Desktop breakpoint layout + chrome RichText colors + demo instance color controls (canvas props only)
- Uncertainty: none for structure; exact shader seed/speed may need one visual pass after apply

## Design decision

Build a **full-bleed atmospheric layer** behind the existing Stage using Framer `liquid-gradient` with **Grain** dither (noise), tuned slow and dark so the WaveDotLink hero stays the sharp figure. Invert Stage chrome (eyebrow / title / caption) to light ink for contrast. Keep single composition; do not edit component source.

Chosen over `particles`/`mesh`: liquid-gradient ships built-in **Noise = Grain**, matches “wave” product without hyperspace cliché; still animated.

## Reuse

- Stage structure: `aD0V2O9xQ` children order (eyebrow → title → instance → caption)
- Fonts already on runs: Clash Display (title), Inter (eyebrow/caption)
- Shader: `liquid-gradient` via `+ShaderNode` + `framer.agent.readShaderControls`
- Color intent: deep ink base + muted light chrome (do not invent a second light Marketplace theme)

## Changes

1. `WQLkyLRf1` (Desktop)
   - Change: `position` stack stays; `overflow="hidden"`; keep `1200×900`; `fill` can stay black or transparent once shader covers; ensure stacking context for absolute bg
   - Preserve: size and padding rhythm (~140×96)
   - Verify: Desktop still 1200×900; content centered

2. New absolute atmosphere behind Stage
   - Change: insert `+FrameNode bgPlate` (or place Shader as first child with absolute fill) **under** Stage:
     - `+ShaderNode atmShader shader="liquid-gradient"` parented to Desktop or a full-bleed frame
     - Layout: `position="absolute"` `inset` / `width="1fr"` `height="1fr"` `left="0"` `top="0"` `zIndex` behind Stage
     - Controls (from `readShaderControls`):
       - `$control__colors` ≈ `["#050508","#0B0F1A","#1A1F2E","#3D4454","#8B90A0"]` (cool ink, no purple cliché)
       - `$control__speed` ≈ `0.18`–`0.28` (slow, premium)
       - `$control__scale` ≈ `0.5`
       - `$control__turbAmp` ≈ `0.45`
       - `$control__ditherMode` = Grain (`2`)
       - `$control__dither` ≈ `0.06`–`0.09`
       - `$control__exposure` slightly lifted if needed for title readability
   - Preserve: Stage content tree
   - Verify: animated grain visible; WaveDotLink still sharp on top

3. Stage `aD0V2O9xQ`
   - Change: keep transparent fill; `position="relative"`; `zIndex` above shader; optional subtle `backdrop` none (do not frost the link)
   - Preserve: gap 48, child order
   - Verify: text + component above atmosphere

4. Chrome type contrast
   - Change: eyebrow + caption → `#B8B8C0` or `#C8C8D0`; title → `#F5F5F7`
   - Preserve: copy strings and Clash Display / Inter
   - Verify: readable on dark liquid bg (contrast warning cleared or acceptable)

5. Demo instance `D86aoiS2J` (canvas controls only — **no** `.tsx` edit)
   - Change: set `typographyGroup.textColor` / `activeColor` and marker `dotColor` to light values (e.g. `#F5F5F7` / `#9A9AA3` / `#F5F5F7`) so the link reads on dark atmosphere
   - Preserve: label, trigger, motion knobs unless contrast forces color only
   - Verify: WaveDotLink readable; wave still visible

6. Optional soft vignette (only if shader alone feels flat)
   - Change: absolute Frame with radial transparent→black 20–30% opacity over shader, **under** Stage, `pointerEvents` none
   - Preserve: no cards, no extra marketing blocks
   - Verify: edges deepen; center stays clear for the link

## Scope

- Inherit: Desktop Marketplace showcase only
- Verify: screenshot Desktop; Stage hierarchy; no second WaveDotLink instance
- Exclude: `WaveDotLink.tsx` source; Phone/Tablet; publish; CMS; new pages

## Validation

- Product: Marketplace listing screenshot feels cinematic; product name + live component remain the hero
- Interface: Desktop `/`; hover/click on instance still works; no focus “cajita” regression (component unchanged)
- System: one `liquid-gradient` atmosphere; reuse Stage; no parallel white Marketplace theme
- Repository:
  ```bash
  node scripts/framer/session.mjs
  node scripts/framer/exec.mjs -s 3 -e '...serialize Desktop; confirm ShaderNode present...'
  node scripts/framer/verify.mjs
  ```
  → verify green; Desktop contains ShaderNode; chrome light-on-dark

## Stop conditions

- Stop if project session is not WaveDotLink / Largest Flows (`ZwyVKF2gZm09JBTBj5RT`)
- Stop if asked to edit `WaveDotLink.tsx`
- Stop if Grain + liquid washes out the component after one contrast pass fails — then switch atmosphere to `wave-gradient` (same layering) instead of stacking multiple shaders

## Execution (2026-07-19)

**Status:** DONE · verify green · `WaveDotLink.tsx` untouched

Applied on Desktop `WQLkyLRf1`:
- Absolute `liquid-gradient` (`YiW_Wuerd`) — ink palette, slow speed, **Grain** dither
- Soft radial vignette (`NPgCPXnWj`) under Stage
- Stage chrome light-on-dark; instance text/marker lightened via canvas controls only
