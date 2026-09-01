# Align Notes + Properties Phone Hero Copy gap to 24px

Written against: Framer project `CmRyHJKPrPE6BZhC6d4S` (Arbour); git HEAD unavailable

## Evidence chain

- Surface: `/notes` Phone Hero Copy; `/properties-2` Phone Hero Copy
- Problem: Phone opener stack gap is `20px` while Desktop and sibling Phone openers use `24px`
- Design evidence: Desktop Hero Copy gap `24px` (Properties/Notes/Neighbourhoods/Contact); Phone exemplars Neighbourhoods `Qonafp_oDI1ekolXeW` and Contact `jEM0wBo2vAATw4pip9` gap `24px`
- Owner: breakpoint override frames on Hero Copy
- Scope and affected surfaces: `/notes` Phone, `/properties-2` Phone
- Uncertainty: none

## Design decision

SET Phone Hero Copy `gap` to `24px` on Notes and Properties so all secondary openers share the same stack gap at Phone.

## Reuse

- Gap: `24px` (Hero Copy opener contract)
- Exemplar: `/neighbourhoods` Phone Hero Copy `Qonafp_oDI1ekolXeW`; `/contact` Phone Hero Copy `jEM0wBo2vAATw4pip9`

## Changes

1. `/notes` → Notes Hero → Hero Copy Phone override `INUKgvAnaNPRkgYRMH`
   - Change: `gap="24px"` (from `20px`)
   - Preserve: `padding="64px 24px 48px 24px"`, `maxWidth="1200px"`, typography, tokens
   - Verify: serialize gap `24px`

2. `/properties-2` → Properties Hero → Hero Copy Phone override `EK6d5SyWLL9uNRqah7`
   - Change: `gap="24px"` (from `20px`)
   - Preserve: other attributes except gap (padding may be corrected by finding-2 plan separately)
   - Verify: serialize gap `24px`

## Scope

- Inherit: none
- Verify: Notes + Properties Phone openers only
- Exclude: Tablet/Desktop Hero Copy; Neighbourhoods/Contact (already correct); publish

## Validation

- Product: Phone secondary openers use identical Hero Copy gap
- Interface: Framer Phone breakpoint on `/notes` and `/properties-2`
- System: reuse existing `24px` gap; no new token
- Repository: `serialize` both IDs → `attributes.gap === "24px"`

## Stop conditions

- Stop if either ID is missing or already `24px`
- Stop if gap cannot be set on breakpoint override without rewriting Desktop

## Design documentation

- none

## Status

Executed 2026-07-16: `INUKgvAnaNPRkgYRMH` + `EK6d5SyWLL9uNRqah7` gap → `24px`. Unpublished.
