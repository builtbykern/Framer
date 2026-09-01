# Contact hero D/T — H1 fully readable in Paper column

Written against: `4aa0cbc` (repo) · live Contact densify v2 · Framer project `CmRyHJKPrPE6BZhC6d4S`

## Evidence chain

- Surface: `https://arbour.framer.website/contact` — Contact Hero desktop (1440) + tablet (834); nodes `jmmPpci8t` / `AATw4pip9` / `qxIyvg6PE` / `R80e8PwNu` / `WLSMm5iy1` (BP `qjv2S9Wpa*`)
- Problem: On tablet, Display H1 is clipped mid-word at the Paper|media seam (`conversation` → `conversatio`). Desktop copy column is wider and currently reads; same `overflow: clip` + large Display + narrow fr share is the shared mechanism.
- Design evidence: Live tablet capture `.tmp/arbour-contact-improve-t.png`; canvas `qxIyvg6PE.overflow = clip`, `jmmPpci8t.overflow = clip`, copy `0.78fr` (D) / `0.85fr` (T), H1 `Display` + `maxWidth: 640px`. Brand system expects type on Paper (`docs/projects/arbour/LISTING.md` Paper & Ink; user: mobile OK, fix D/T legibility; no gradients).
- Owner: Contact page hero stack — `AATw4pip9` (width), `R80e8PwNu` (maxWidth), `qxIyvg6PE` (overflow)
- Scope and affected surfaces: `/contact` Desktop + Tablet only. Phone (`jEM0wBo2v*`) excluded (user OK).
- Uncertainty: Exact fr split that clears the longest word at current Display sizes may need one visual verify pass after apply.

## Design decision

Keep the densify horizontal split (type | media). Make the Paper column the sole reading surface for the H1: widen copy vs media on D/T and bind H1 measure to the column (`maxWidth: 100%`) so Display wraps inside Paper. Do not overlay type on the photo, do not add gradients/washes/strokes/blend.

## Reuse

- Color: `/Arbour/Paper`, `/Arbour/Ink`
- Text: `/Arbour/Display` (do not switch to Display Punch)
- Layout: existing Contact Hero stack `jmmPpci8t`
- Exemplar: Phone Contact hero — full words on Paper, no mid-glyph clip

## Changes

1. `/contact` Desktop `AATw4pip9` (Hero Copy)
   - Change: Set width to about `1.05fr`–`1.1fr` (restore early beats-era copy weight; densify had `0.78fr`).
   - Preserve: `stackDistribution: end`, Paper fill via hero, padding rhythm.
   - Verify: H1 longest line/words fully visible left of media edge.

2. `/contact` Desktop `WLSMm5iy1` (Hero Entrance Media)
   - Change: Set width to about `0.95fr`–`1fr` so media stays cinematic but yields space to type.
   - Preserve: Image fill, `overflow: clip` on media frame.
   - Verify: Media still dominates right half visually.

3. `/contact` Desktop + Tablet `R80e8PwNu`
   - Change: `maxWidth: 100%` (drop `640px` cap that fights the column).
   - Preserve: `inlineTextStyle` = Display; italic runs in copy.
   - Verify: No mid-word clip; wrap only at spaces.

4. `/contact` Desktop + Tablet `qxIyvg6PE` (Native Enquiry Copy)
   - Change: `overflow: visible` (or `overflowX: visible` if API allows) so a single glyph cannot be sheared if measure is tight; primary fix remains column width.
   - Preserve: Vertical stack meta → H1.
   - Verify: No soft edge fade; no type painted across photo as a design device.

5. Tablet replicas `qjv2S9WpaAATw4pip9`, `qjv2S9WpaWLSMm5iy1`, `qjv2S9WpaR80e8PwNu`, `qjv2S9WpaqxIyvg6PE`
   - Change: Mirror D ratios (copy ≥ `1fr`, media ≤ `1fr`), H1 `maxWidth: 100%`, native overflow visible.
   - Preserve: Hero height `640px`, padding.
   - Verify: At 834-wide, full word `conversation` visible.

## Scope

- Inherit: Contact Desktop + Tablet only
- Verify: Contact Phone unchanged; Home untouched
- Exclude: Gradients, Paper Wash re-enable, blend/stroke, Display Punch, appearEffects, image swap

## Validation

- Product: Private enquiry hero — full headline readable on Paper beside media
- Interface: Desktop 1440×900; Tablet 834×1112; confirm H1 + meta + Direct Enquiry; no mid-word clip; no type-over-photo treatment
- System: Still Display + Ink on Paper; no new text style unless Display cannot fit after width fix (then stop and report)
- Repository: Pin Arbour → `applyChanges` / `setAttributes` → `node scripts/framer/verify.mjs` → publish only with user OK → Playwright screenshots D/T

## Stop conditions

- Stop if widening copy below ~45% media makes the stage feel brochure-empty (user previously rejected “mucho aire”) — then reduce Display size on Contact H1 via a Contact-only text style instead of widening further.
- Stop if Phone layout regresses.
- Stop if asked to fade/gradient the seam.

## Design documentation

- After acceptance: note in `docs/projects/arbour.md` Contact hero — D/T H1 must remain fully inside Paper column; no mid-word clip at media edge.
