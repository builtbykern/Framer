# Contact Hero Desktop — content spine 90%

**Status:** applied on canvas 2026-08-12 (not published)

Written against: `4aa0cbc` · Framer `CmRyHJKPrPE6BZhC6d4S` · session from `state/session.json`

## Evidence chain

- Surface: `/contact` Desktop Contact Hero (`jmmPpci8t`)
- Problem: H1 / enquiry copy first-ink ≈ **21px** @1440 vs Opening / Journal ≈ **73px** (canon ~5% / 90% spine). Identity attrs can still look “90%” via `maxWidth` on a left-aligned child.
- Design evidence: `docs/projects/arbour.md` Layout (content width); `template-plans/REPORT-arbour-audit-ui-taste-contact-2026-08-12.md` V1; shots `tmp/taste-shots/prod/contact-D.png`
- Owner: `jmmPpci8t` + children `AATw4pip9`, `WLSMm5iy1`
- Scope and affected surfaces: `/contact` **Desktop only**
- Uncertainty: Exact copy|media fr split inside the 90% row — preserve current visual weight (~copy slightly wider); verify H1 still fully on Paper (no mid-word clip)

## Design decision

Match Opening / Properties listing heroes: full-bleed shell + **centered 90% inner row** holding the horizontal type|media split. Do not add padX 5% on the shell. Do not change Tablet/Phone (already inset 40/16 + phone 136). No gradients, washes, or blend strokes (Contact hero rule + baseline-ui).

## Reuse

- Width policy: `width="90%"` `maxWidth="90%"` on inner content row
- Exemplar: Contact Opening Stack `f6WUp6SN5`; Properties Hero `mGwrwOsDS`
- Type: keep `/Arbour/Display` + Meta on enquiry; optional `textWrapBalance` on H1 if attribute exists (baseline-ui headings)
- Tokens: Paper/Ink unchanged

## Changes

1. `/contact` Desktop `jmmPpci8t` (Contact Hero)
   - Change: Insert child `Contact Hero Inner` (+FrameNode) as sole content row: `layout=stack` `stackDirection=horizontal` `stackDistribution=start` `stackAlignment=center` `gap=24px` `width=90%` `maxWidth=90%` `height=1fr`. Set hero `stackAlignment=center`, `gap=0` (gap lives on inner). `MOVE` `AATw4pip9` then `WLSMm5iy1` into the inner.
   - Preserve: shell `padding=128px 0`, `height=52vh`, Paper fill, horizontal type|media craft, no FX.
   - Verify: copy left edge ≈72px@1440; media still right of copy with ~24px gap.

2. `/contact` Desktop `AATw4pip9` (Hero Copy)
   - Change: `width=1.1fr` (or keep ~55% of **inner**), `maxWidth=100%` (drop misleading `90%` of full viewport).
   - Preserve: vertical stack, `stackDistribution=end`, gaps, Native Enquiry Copy.
   - Verify: H1 words fully left of media seam.

3. `/contact` Desktop `WLSMm5iy1` (Hero Entrance Media)
   - Change: `width=1fr` `maxWidth=100%` (replace `90%`/`90%` that fought the split).
   - Preserve: image fill, overflow clip, cinematic crop.
   - Verify: media inset with the 90% row (not full-bleed to viewport edge).

4. Baseline-ui (no slop)
   - Change: no new animation; no gradients; no glow; no tracking tweaks; no purple.
   - If H1 rich text supports wrap balance / text wrap balance in project DSL, set it; otherwise leave type attrs alone.
   - Preserve: existing Display italics and enquiry Meta links.

## Scope

- Inherit: Desktop Contact Hero only
- Verify: Tablet/Phone Contact Hero gutters unchanged; Contact Opening / Journal spine unchanged; H1 legibility plan `2026-08-02-contact-hero-dt-h1-legibility.md` still holds
- Exclude: About Beat 2 gap-48 preference; publish; Enquiry/Continue blocks (N/A on Contact)

## Validation

- Product: Private enquiry hero reads on the same content spine as “Begin a conversation.”
- Interface: Desktop 1440 — measure copy left ≈70–80px; confirm no H1 mid-word clip; Tablet 810 / Phone 390 — left inset still ~40 / ~16
- System: Inner row matches Opening Stack / Properties Hero 90% pattern — no parallel padX-5% shell
- Repository: `PAGES=/contact,/properties node scripts/framer/taste-probe.mjs` → Contact Hero Desktop child policy 90%; `node scripts/framer/verify.mjs` → no blocking errors; optional Playwright re-shot `contact-D.png` + first-ink ≥64px

## Stop conditions

- Stop if wrapping Replica descendants is rejected by the API — fall back to Desktop-only `stackDistribution=center` with Copy+Media widths summing to ~90% of shell (no new node), then re-measure.
- Stop if H1 clips after fr change — widen copy fr before touching T/P.
- Do not alter Beat 2 overlay gap 48.

## Design documentation

- After acceptance: optional one-liner under Contact in `docs/projects/arbour.md`: “Contact Hero Desktop: type|media live in 90% inner row (same as Opening Stack).”
