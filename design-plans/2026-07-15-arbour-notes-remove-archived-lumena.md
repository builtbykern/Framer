# Remove archived Lumena hero grid and SoftOrb from /notes

Written against: unavailable (no git HEAD)

## Evidence chain

- Surface: `/notes` masthead; live hero is cinematic (`ELuMN2aX9` InertiaFrame + `NPRkgYRMH` overlay)
- Problem: Hidden Lumena 4-quadrant experiment + `Arbour_SoftOrb` remain in the tree (`WvHvZenFI` visible=false), rejected visually and unused.
- Design evidence: User rejected SoftOrb; cinematic Notes hero is the live composition. Soft Orb instance name `Soft Orb Live` under archived orb stack.
- Owner: page `/notes` desktop `T4DtVCP3y` / masthead `Vq1f2mEkj`
- Scope: delete archived subtree only; do not touch cinematic nodes
- Uncertainty: confirm SoftOrb instance id before DEL (`knpgZwExX` historically); re-serialize `nFKDQqLI4` children

## Design decision

**DEL** the archived Hero Grid subtree rooted at `WvHvZenFI` (includes SoftOrb and old title/meta/deck copies moved out of live use). Live text nodes (`xEORYedqg`, `sqsFVTzsL`, etc.) must already live under `NPRkgYRMH` — verify before delete. Do not delete `Vq1f2mEkj`, `ELuMN2aX9`, `NPRkgYRMH`, or overlay children.

## Reuse

- Live exemplar: cinematic structure matching Contact (`InertiaFrame` + overlay)

## Changes

1. `/notes` — serialize `Vq1f2mEkj` depth 4; confirm live overlay still holds Display Title, kicker, deck, Continue, ScrollCue
2. If any live text still parents under `WvHvZenFI`, **MOVE** to `NPRkgYRMH` first
3. `DEL WvHvZenFI` (cascade removes `SArJyDzpS`, `UEx0DLCvr`, `nFKDQqLI4`, SoftOrb instance, stagger, bottom row shells)
4. Optionally remove unused code file `Arbour_SoftOrb.tsx` only if no other instances (`getCodeFiles` / instance search) — separate optional step; prefer canvas DEL first
5. Tablet/phone: deleting primary should clear replicas; verify no orphan SoftOrb replicas

## Scope

- Inherit: `/notes` only
- Exclude: `/neighbourhoods`, map work, appearEffects, Paper token plan

## Validation

- Product: `/notes` Preview identical visually; no SoftOrb in Components usage on page
- Serialize masthead: children = cinematic + overlay only (no Hero Grid archived)
- `node scripts/framer/verify.mjs --page /notes` → ok

## Stop conditions

- Stop if serialize shows live title/deck still inside `WvHvZenFI` — MOVE first, do not DEL until empty of live content.
- Stop if SoftOrb is used on another page.

## Design documentation

- None required beyond noting SoftOrb retired if code file removed.
