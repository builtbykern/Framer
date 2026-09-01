# Align Notes Tablet Hero Copy padding to sibling openers

Written against: Framer project `CmRyHJKPrPE6BZhC6d4S` (Arbour); git HEAD unavailable

## Evidence chain

- Surface: `/notes` Tablet → Notes Hero → Hero Copy
- Problem: Tablet Hero Copy still uses Desktop horizontal pad `72px 48px 56px 48px` while Properties/Neighbourhoods/Contact Tablet use `72px 40px 56px 40px`
- Design evidence: Properties Tablet `SScKalu3BL9uNRqah7`, Neighbourhoods Tablet `aJLpuUP0qI1ekolXeW`, Contact Tablet `qjv2S9WpaAATw4pip9` all `padding="72px 40px 56px 40px"` with gap `24px`
- Owner: Notes Tablet Hero Copy `LptqEiXVpNPRkgYRMH`
- Scope and affected surfaces: `/notes` Tablet only
- Uncertainty: none

## Design decision

SET Notes Tablet Hero Copy padding to `72px 40px 56px 40px` to match the sibling Tablet opener owner.

## Reuse

- Padding owner: Properties/Neighbourhoods/Contact Tablet Hero Copy `72px 40px 56px 40px`
- Exemplar: `/properties-2` `SScKalu3BL9uNRqah7`

## Changes

1. `/notes` → Hero Copy Tablet override `LptqEiXVpNPRkgYRMH`
   - Change: `padding="72px 40px 56px 40px"`
   - Preserve: `gap="24px"`, `maxWidth="1200px"`, typography, tokens; Desktop `NPRkgYRMH` and Phone `INUKgvAnaNPRkgYRMH` pads unchanged by this plan
   - Verify: serialize padding exactly `72px 40px 56px 40px`

## Scope

- Inherit: none
- Verify: `/notes` Tablet Hero Copy
- Exclude: Notes Desktop/Phone; other pages; publish

## Validation

- Product: Notes Tablet opener horizontal inset matches Properties/Hoods/Contact
- Interface: Framer Tablet breakpoint on `/notes`
- System: no new spacing token
- Repository: `serialize` `LptqEiXVpNPRkgYRMH` → padding `72px 40px 56px 40px`

## Stop conditions

- Stop if node missing or padding already matches exemplar
- Stop if edit would mutate Desktop Hero Copy `NPRkgYRMH`

## Design documentation

- none

## Status

Executed 2026-07-16: `LptqEiXVpNPRkgYRMH` padding → `72px 40px 56px 40px`. Unpublished.
