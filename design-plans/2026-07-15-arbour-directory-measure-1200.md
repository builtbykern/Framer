# Align Neighbourhoods directory measure to Journal 1200

Written against: unavailable (workspace git HEAD not resolved)

## Evidence chain

- Surface: `/neighbourhoods` Directory Panel + Territory Checkerboard
- Problem: Directory content sits at `maxWidth: 1100px` while Journal content blocks on Home, Notes, and Contact use `1200px`, so the template’s reading measure breaks on Neighbourhoods.
- Design evidence: Home Journal `z3aj0E0xy` `maxWidth: 1200px`; Notes Journal `wY1tfyIdc` `maxWidth: 1200px`; Contact Opening / Journal sections use the same 48px inset language with 1200-class content. Directory Panel `q3QLrEX8k` currently `maxWidth: 1100px`; kicker `Dsp5KQS9c` was previously capped at `1100`/`1280` inconsistently.
- Owner: page frames on `/neighbourhoods` (not a shared layout template)
- Scope and affected surfaces: `q3QLrEX8k`, `km7dUqZI9`, `Dsp5KQS9c`; tablet/phone replicas `aJLpuUP0qq3QLrEX8k`, `Qonafp_oDq3QLrEX8k` if they override maxWidth
- Uncertainty: none on target 1200; panel horizontal padding (16px) stays — inner grid width becomes 1200 including padding unless Framer maxWidth is content-box (verify visually that outer panel aligns with Journal columns)

## Design decision

Set the Directory Panel content measure to **1200px** to match Journal. Keep Paper/cream fill, **0px radius** (user), flush info|photo pairs, and 48px section inset on the parent forest band. Do not change card internal layout or map assets in this plan.

## Reuse

- Existing Journal content width: `1200px` (Home `z3aj0E0xy`, Notes `wY1tfyIdc`)
- Exemplar: `/` Journal section desktop padding `128px 48px` + `maxWidth: 1200px`

## Changes

1. `/neighbourhoods` · `q3QLrEX8k` (Directory Panel)
   - Change: `maxWidth` from `1100px` to `1200px`
   - Preserve: `fill` Paper/cream `rgb(252, 250, 244)` or Paper token if already/ later bound; `padding: 16px`; `borderRadius: 0px`; child checkerboard
   - Verify: panel width matches Journal measure on a 1440 desktop canvas

2. `/neighbourhoods` · `Dsp5KQS9c` (THE DIRECTORY kicker)
   - Change: `maxWidth` to `1200px` if currently smaller/larger than the panel
   - Preserve: Space Mono, muted cream-on-forest color
   - Verify: kicker left edge aligns with panel

3. `/neighbourhoods` · `km7dUqZI9` (Territory Checkerboard)
   - Change: ensure `maxWidth` is `null` or `1fr` inside the panel (no competing 1100/1280 cap)
   - Preserve: 2-col grid desktop, gap between pairs, flush pair `gap: 0`
   - Verify: grid fills the 1200 panel content box

4. Breakpoints
   - Change: if tablet/phone replicas set `maxWidth: 1100px` on the panel, update to `1200px` or leave unset so width is `1fr` with section padding
   - Preserve: phone stacks pairs vertically
   - Verify: `aJLpuUP0qq3QLrEX8k`, `Qonafp_oDq3QLrEX8k`

## Scope

- Inherit: only Neighbourhoods directory measure
- Verify: forest section `NrbMmTnFX` still `padding` with 48px horizontal inset so 1200 panel centers like Journal
- Exclude: dark token fills (separate plan); Lummi/map replacement; hero height; editorial band maxWidth 1440 (full-bleed band is intentional)

## Validation

- Product: Neighbourhoods directory aligns optically with Notes/Home Journal column width
- Interface: Desktop 1200+; Tablet; Phone — panel not clipped; two pairs per row on desktop still fit
- System: no new tokens; reuse Journal 1200 convention
- Repository: `node scripts/framer/verify.mjs --page /neighbourhoods` → ok; serialize `q3QLrEX8k.attributes.maxWidth === "1200px"`

## Stop conditions

- Stop if raising to 1200 causes the 2× pair grid to overflow or wrap unintentionally at the project’s desktop breakpoint — then keep 1200 on the panel but reduce pair card fixed heights, do not revert to 1100 without user approval.
- Stop if Directory Panel is driven by a shared layout template maxWidth (re-check `$layoutTemplateId`).

## Design documentation

- After acceptance: in `docs/projects/arbour.md`, add: content measure desktop = **1200px** (Journal + Neighbourhoods directory panel).
