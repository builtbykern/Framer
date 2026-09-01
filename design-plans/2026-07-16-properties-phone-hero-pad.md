# Align Properties Phone Hero Copy padding to sibling openers

Written against: Framer project `CmRyHJKPrPE6BZhC6d4S` (Arbour); git HEAD unavailable

## Evidence chain

- Surface: `/properties-2` Phone → Properties Hero → Hero Copy
- Problem: Phone Hero Copy padding is `64px 16px 40px 16px` while Notes/Neighbourhoods/Contact Phone use `64px 24px 48px 24px`
- Design evidence: Notes Phone `INUKgvAnaNPRkgYRMH`, Neighbourhoods Phone `Qonafp_oDI1ekolXeW`, Contact Phone `jEM0wBo2vAATw4pip9` all `padding="64px 24px 48px 24px"`
- Owner: Properties Phone Hero Copy `EK6d5SyWLL9uNRqah7`
- Scope and affected surfaces: `/properties-2` Phone only
- Uncertainty: none

## Design decision

SET Properties Phone Hero Copy padding to `64px 24px 48px 24px` to match the sibling Phone opener owner.

## Reuse

- Padding owner: Notes/Neighbourhoods/Contact Phone Hero Copy `64px 24px 48px 24px`
- Exemplar: `/notes` `INUKgvAnaNPRkgYRMH`

## Changes

1. `/properties-2` → Hero Copy Phone override `EK6d5SyWLL9uNRqah7`
   - Change: `padding="64px 24px 48px 24px"`
   - Preserve: `maxWidth="1200px"`; gap (apply finding-1 plan for gap if still `20px`)
   - Verify: serialize padding exactly `64px 24px 48px 24px`

## Scope

- Inherit: none
- Verify: `/properties-2` Phone Hero Copy
- Exclude: Properties Tablet/Desktop; other pages; publish

## Validation

- Product: Properties Phone opener inset matches Notes/Hoods/Contact
- Interface: Framer Phone breakpoint on `/properties-2`
- System: no new spacing token
- Repository: `serialize` `EK6d5SyWLL9uNRqah7` → padding `64px 24px 48px 24px`

## Stop conditions

- Stop if node missing or padding already matches exemplar
- Stop if changing padding requires editing a shared component that would alter Desktop

## Design documentation

- none

## Status

Executed 2026-07-16: `EK6d5SyWLL9uNRqah7` padding → `64px 24px 48px 24px`. Unpublished.
