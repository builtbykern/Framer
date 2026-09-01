# Section Island Home matches Kern demo presentation

Written against: `4aa0cbc`

## Evidence chain

- Surface: Section Island project `DHpXX5xCoGaJHmRQfN0m` · `/` Desktop `WQLkyLRf1` → Hero `UB6lTiXFm` / sections / Island Dock `CWWYbXpNS` · instance `yE_uB9dmr`
- Problem: Flat `#0A0A0A` stage with zero shaders; caption `Tap the dock · Phase 1 shell`; Island Dock height `849px` — reads as scaffold, not Kern Marketplace theater
- Design evidence: `scripts/framer/pillselect-home.mjs`; `design-plans/epic-marketplace-atmosphere.md`; `docs/projects/listings/KERN_THUMBNAIL_STYLE.md`; `design-plans/REPORT-sectionisland-improve-ui-2026-08-07.md` findings 1–3
- Owner: Home Desktop chrome frames + RichText + dock wrapper — **not** `SectionIsland.tsx`
- Scope and affected surfaces: `/` Desktop only (Atmosphere, Hero Stage, section kickers, Island Dock sizing)
- Uncertainty: exact liquid seed/speed may need one Preview glance after apply; island product stays bottom-fixed (do not move component into centered Product Well — that would fight the dock UX)

## Design decision

Bring Section Island Home to Morph / Contact Dock presentation parity: Kern `#060606` full-bleed Atmosphere (`liquid-gradient` + grain + cyan blooms + veil + vignette), Stage hierarchy (eyebrow / title / product-truth caption) with accent kickers on scroll sections, and a thin fixed Island Dock strip. Keep the Section Island instance bottom-docked — the product *is* the dock; do not center it like Morph’s Product Well.

Accent: `#6FD3FF` (Kern house / Contact Dock), not Morph amber — this SKU is cool glass island, not warm pill.

## Reuse

- Atmosphere stack pattern from `pillselect-home.mjs` (Atmosphere → Liquid → Veil → Bloom TR/BL → Vignette)
- House fill `#060606` + cyan `#6FD3FF` from `KERN_THUMBNAIL_STYLE.md` / Contact Dock
- Section block pattern from Morph Home (SECTION kicker + title, 560px)
- Timestamped DSL aliases (Section Island applyChanges alias persistence)
- Exemplar: `scripts/framer/pillselect-home.mjs`

## Changes

1. `/` Desktop `WQLkyLRf1`
   - Change: `fill="#060606"`; tall scroll canvas (~2800px); stack vertical center; rebuild children with unique alias prefix
   - Preserve: page path `/`; Section Island component id `codeFile/NzXt4xK:default`
   - Verify: Desktop fill is Kern house black

2. New Atmosphere (absolute, `zIndex=0`, under content)
   - Change: Liquid `liquid-gradient` with indexed colors toward `#060606` / deep ink / `#6FD3FF` bloom stops; Grain dither; slow speed; Veil `rgba(6,6,6,0.48)`; Bloom TR/BL cyan; Vignette
   - Preserve: none (new layer)
   - Verify: `getDescendantsOfTypes` ShaderNode count ≥ 1; Preview shows grain atmosphere

3. Hero Stage (relative, `zIndex=10`)
   - Change: Rename/structure as Stage — Eyebrow `SECTION ISLAND` (tracked, muted), Title `Jump the page`, Caption `Know where you are. Jump anywhere.` — no phase/mechanic jargon
   - Preserve: product name in eyebrow
   - Verify: Caption text exact product line; no “Phase” / “scrollspy” / “squeeze”

4. Scroll sections Overview / Work / Process / Contact
   - Change: Keep `data-framer-name` / layer names matching Section Island controls; SECTION kickers use `rgba(111,211,255,0.55)` (`#6FD3FF` alpha); titles light; consistent 560px height + padding
   - Preserve: section names used by scrollspy (`Overview`, `Work`, `Process`, `Contact`)
   - Verify: Jump from island still lands on each section

5. Island Dock `fixed` strip
   - Change: `position=fixed` `bottom=0` `left=0` `width=100%` `height=120px` `zIndex=50` `fill=null` `overflow=visible`; Section Island instance absolute fill 100%×120
   - Preserve: instance controls (sections array, colors, glass)
   - Verify: serialize Dock `height="120px"` (not ~849px); Preview shows island sitting in bottom center over atmosphere

6. Instance controls (canvas props only)
   - Change: Ensure sections map to Overview/Work/Process/Contact; background `#0E0E0E`; accent `#F5F5F5` or subtle cyan if desired — do not edit `SectionIsland.tsx`
   - Preserve: component behavior
   - Verify: Preview open/close + scrollspy labels update

## Scope

- Inherit: `/` Desktop presentation only
- Verify: Preview scroll + dock jump; `node scripts/framer/verify.mjs`
- Exclude: `SectionIsland.tsx` source; `/thumbnail` page (separate listing pack); publish; other projects

## Validation

- Product: Home feels like other Kern component demos (atmosphere + clear hierarchy + working dock)
- Interface: first viewport = Stage on atmosphere with dock visible; sections scrollable; caption is product truth
- System: one liquid Atmosphere; no second light theme; dock stays fixed bottom
- Repository: `node scripts/framer/verify.mjs` → `blocking: false`; optional `node scripts/framer/sectionisland-home.mjs` after script update to match this plan

## Stop conditions

- Stop if Atmosphere shader controls fail to stick (indexed `$control__colors.N` required)
- Stop if fixing Dock height requires changing component root to `fixed` (forbidden — keep wrapper fixed, component relative)
- Stop if user wants centered Product Well instead of bottom dock (different UX decision)

## Design documentation

- After acceptance: optional one-liner in future `docs/projects/listings/Kern_SectionIsland.md` — “Home uses Kern `#060606` liquid atmosphere + cyan blooms; dock fixed bottom.” No `DESIGN.md` update required (none governs this SKU).
