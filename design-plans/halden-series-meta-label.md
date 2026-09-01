# Series meta uses Label

Written against: `4aa0cbc`

## Evidence chain

- Surface: overlay series index + Work detail credit/year labels.
- Problem: Type/Year in the overlay are Inter 16 `rgb(0,0,0)`. Info Kicker and Work Label are handmade Plex (`rgb(102)`, 0.12–0.14em). Work credit/year labels are Plex 11/500/0.08em ink. Meta sits at body size next to titles, so Display/Lead cannot contrast.
- Design evidence: Label `I9B65psWv` (IBM Plex Mono 11 / 400 / 0.14em / muted). Contact kickers and 404 Kicker already use it.
- Owner: listed RichText nodes below.
- Scope and affected surfaces: Nav overlay Info + Work Row template; Work detail Info rail labels.
- Uncertainty: none.

## Design decision

Put all series meta kickers/labels on Label so Display (Work) and Lead (overlay titles) have a quiet floor.

## Reuse

- Label `I9B65psWv`
- muted `8028b435-146d-4074-967e-823e6635036f`
- Exemplar: 404 Kicker `G33v6mV22`; Contact Kicker `AY4KnbG3w`

No new preset. Do not restyle credit *values*, tags, or Previous/Next.

## Changes

1. Overlay

   - Change: `SET` `fveumvb2W` (Info Kicker), `e8gqaPJqT` (Work Label), `hC7YJIKqd` (Type), `hj6acH9zr` (Year) `textStylePreset="Label"` only (optional muted `textColor`). Do not SET fontName/fontSize in the same command as the preset.
   - Preserve: Work Row link, title (plan 2), hairline, overlay copy, form.
   - Verify: those four nodes report `textStylePreset="Label"` (or Plex 11 / 0.14em / muted). Type/Year no longer Inter 16 black.

2. Work detail

   - Change: same Label SET on `YVFefyZaD` (Type), `QozVEofed` `jIzMEMleY` `Y76mHpAi3` (credit labels), `IbckjcWn0` (Year Label) — preset only.
   - Preserve: Title Display (plan 1); credit *values* Inter; Body; tags; pager; split 33/67.
   - Verify: labels are Label; values unchanged.

## Scope

- Inherit: T/P replicas if they inherit; CMS repeats of Work Row.
- Verify: MENU open; `/work/:Work` D/T/P.
- Exclude: credit values, Year Value, tags, Previous/Next, 404 Lead, Logo Menu Roll, publish.

## Validation

- Product: meta reads as caption, titles as display.
- Interface: overlay list + one series detail; Contact labels already Label — no regression.
- System: one Label owner for kickers.
- Repository: `node scripts/framer/verify.mjs -s 2 --page /` and `--page /work/:Work` → `{ "ok": true }`

## Stop conditions

- Stop if Label SET on Type/Year drops CMS bindings.
- Do not change credit values to Label.
- Do not publish.

## Design documentation

- After acceptance: none unless asked. Series meta uses Label.
