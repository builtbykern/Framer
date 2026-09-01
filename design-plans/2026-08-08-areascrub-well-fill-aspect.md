# Area Scrub — chart owns the Product Well

Written against: `4aa0cbc`

## Evidence chain

- Surface: `code-components/AreaScrub.tsx` SVG + Home Well layout
- Problem: `preserveAspectRatio="xMidYMid meet"` letterboxes the 100×56 viewBox inside the Well; cream shows unused bands; bento area does not own the card
- Design evidence: Spec architecture flexible frame / bento cell; original implementation used `preserveAspectRatio="none"`; Lightdash-style area fills the card plane. Current: `AreaScrub.tsx` ~542 `meet` + Home inset `28px` in 520×300 Well
- Owner: `preserveAspectRatio` in `AreaScrub.tsx`; optional Home inset tweak in `areascrub-home.mjs`
- Scope and affected surfaces: All Area Scrub instances (component SVG) + Home layout
- Uncertainty: none — restore stretch-to-frame for Marketplace bento use

## Design decision

Restore **`preserveAspectRatio="none"`** so the path fills the component frame (bento/hero). Optionally tighten Home inset from `28px` to `20px` so the chart dominates the Well without changing Well size.

## Reuse

- Existing viewBox `0 0 100 56`
- Home Well 520×300 — keep
- Spec: `@framerSupportedLayoutWidth/Height any-prefer-fixed`

## Changes

1. `code-components/AreaScrub.tsx`
   - Change: SVG `preserveAspectRatio="none"` (replace `xMidYMid meet`)
   - Preserve: Scrub px transforms; monotone path; static freeze
   - Verify: Chart fills the instance box with no side letterboxing

2. `scripts/framer/areascrub-home.mjs` (optional, recommended)
   - Change: Chart inset `left/top` and size from `28/464/244` → `20px` inset → `width="480px" height="260px"` (Well 520×300)
   - Preserve: Well radius/border/fill
   - Verify: Path owns the cream card

3. Push + Home rebuild
   ```bash
   node scripts/framer/session.mjs --url "https://framer.com/projects/Tasty-Usage--iByGdsW6Rb9oE5M2Igua-407t8" --name "Area Scrub"
   node scripts/framer/push-areascrub.mjs
   node scripts/framer/areascrub-home.mjs
   node scripts/framer/verify.mjs
   ```

## Scope

- Inherit: All instances (stretch behavior)
- Verify: `/thumbnail` Well — re-run `areascrub-thumbnail.mjs` if letterboxing was relied on
- Exclude: Changing viewBox aspect; adding axes; snap

## Validation

- Product: Area reads edge-aware inside the Well
- Interface: Home Desktop; thumbnail Desktop
- System: No new layout annotations
- Repository: push `typeErrors: []`; verify green

## Stop conditions

- Stop if a buyer-facing decision requires non-warped geometry (meet) for all uses — then size the **frame** to 100:56 instead of using meet inside a mismatched Well

## Design documentation

- Note in `docs/projects/AreaScrub.md`: SVG uses `none` to fill flexible frames
