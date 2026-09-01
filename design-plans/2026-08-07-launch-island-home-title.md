# Launch Island Home — Stage title matches countdown

Written against: `4aa0cbc`

## Evidence chain

- Surface: Home `/` Stage Title (+ Caption) built by `scripts/framer/launchisland-home.mjs` on project `DHpXX5xCoGaJHmRQfN0m`
- Problem: Hero title says the drop is already live while the docked Launch Island defaults to countdown compact — sell surface contradicts itself
- Design evidence: Kern improve-ui convention — Stage copy must be product truth for the live figure (see `design-plans/REPORT-metricseal-improve-ui-2026-07-28.md`, Morph/Copy Field caption rules). Runtime: Title text `The drop is live` (`launchisland-home.mjs` ~83) while instance `previewMode: "compact"` and `targetDate` in the future (~108–116)
- Owner: `scripts/framer/launchisland-home.mjs` Stage RichText nodes only
- Scope and affected surfaces: Home Stage Title; Caption only if it still implies “already live”
- Uncertainty: none — title string is deterministic

## Design decision

Retitle the Stage to countdown truth so the page and the island sell the same moment. Keep one muted product-truth caption about glanceable countdown / time zoom — no phase jargon.

## Reuse

- Home Stage grammar — eyebrow → title → caption (existing `launchisland-home.mjs` / Morph Home pattern)
- Eyebrow `LAUNCH ISLAND` — keep
- Exemplar captions: product line, not mechanic dump (`REPORT-sectionisland-improve-ui` caption rule)

## Changes

1. `scripts/framer/launchisland-home.mjs`
   - Change:
     - Stage Title text: `Before the drop` (preferred) — alternatives only if executor confirms length; do not use “Live”
     - Caption text: `Glance the countdown. Tap to zoom time.` (or keep current if it already matches; current `Countdown as live activity. Tap to zoom time.` is acceptable product truth — **do not** change caption unless it still says the event is live)
   - Preserve: Atmosphere, dock, component instance, accent blooms, typography sizes/colors on Stage
   - Verify: After `node scripts/framer/launchisland-home.mjs`, Desktop Stage Title reads countdown state; island still compact

## Scope

- Inherit: Future Home rebuilds from this script
- Verify: Home `/` only
- Exclude: `LaunchIsland.tsx` visuals (plans #1–#2); `/thumbnail` page (not in scope yet)

## Validation

- Product: Visitor understands the event has not started; island and headline agree
- Interface: Desktop Home first viewport — eyebrow, title, caption, dock island
- System: No component API change
- Repository: `node scripts/framer/launchisland-home.mjs`; `node scripts/framer/verify.mjs` → ready

## Stop conditions

- Stop if Home is intentionally demoing `previewMode: "live"` — then title may say Live, but controls must switch together (out of this plan’s default)

## Design documentation

- None required beyond script; optional note in Launch Island spec Home demo section when added
