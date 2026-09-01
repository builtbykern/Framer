# Overlay series titles match Info Lead

Written against: `4aa0cbc`

## Evidence chain

- Surface: Halden Nav overlay Selected Work row Title `sWU5I6bKH` on Info pane `XM4MY5kEq`.
- Problem: Series names in the overlay are Syne 18/500/−0.02em, quieter than Info Lead `AkMxCySBQ` (Syne 27/500/−0.03em/1.28) on the same pane. Type/Year sit at Inter 16 beside them.
- Design evidence: Info Lead metrics (the loudest Syne already on that pane). User: not editorial at the type level. Display stays on Work detail (plan 1), not on this index.
- Owner: overlay Title `sWU5I6bKH` (CMS list template).
- Scope and affected surfaces: Nav overlay Work Row titles on every page that uses Nav `Ebz57iEJS`.
- Uncertainty: none for the inversion; wrapping at 27px in the overlay column is the trial.

## Design decision

Raise overlay series titles to the Info Lead metrics so the index is not quieter than the about dek.

## Reuse

- Syne 27/500/−0.03em/1.28em from `AkMxCySBQ`
- ink `24aaa6c6-0b98-4eac-b695-5f20471f6b92`
- Exemplar: overlay Info Lead `AkMxCySBQ`

No new preset. Do not use Display here.

## Changes

1. Overlay Work Row Title `sWU5I6bKH`

   - Change: `SET sWU5I6bKH fontName="Syne" fontSize="27px" fontWeight="500" letterSpacing="-0.03em" lineHeight="1.28em" textColor="var(--token-24aaa6c6-0b98-4eac-b695-5f20471f6b92)"`.
   - Preserve: `link.href="/work/:Work"` and collection-item binding; `linkStylePreset="Info Link"`; Work Row structure; Logo Menu Roll; sheet padding; Info Lead copy.
   - Verify: getNode Title is Syne 27/500/−0.03em/1.28 ink, still linked. Overlay screenshot: series names at Lead size, still smaller than Work Display.

## Scope

- Inherit: CMS repeats of the Work Row template.
- Verify: MENU open on `/`, `/work/:Work`, `/404`.
- Exclude: Work detail Title `gPAtEpWYL`, 404 Lead, Contact form labels, publish.

## Validation

- Product: MENU series list reads as an index, not as 18px CMS leftovers.
- Interface: several series names; long titles wrap in the Info column.
- System: overlay titles = Lead metrics; Work titles = Display (plan 1).
- Repository: `node scripts/framer/verify.mjs -s 2 --page /` → `{ "ok": true }`

## Stop conditions

- Stop if the SET drops the Work detail link or collection binding.
- Stop if overlay Title is forced to Display — revert to Lead metrics.
- Do not tween Nav height. Do not publish.

## Design documentation

- After acceptance: none unless asked. Overlay series titles share Info Lead metrics; they are not Display.
