# 010 — Skip LoadingScreen on property detail

- **Status**: DONE
- **Commit**: unavailable
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: canvas nodes on `/properties-2/:Properties`

## Problem

Every open of a residence detail mounts `Arbour_LoadingScreen` (count-up + **700ms** swipe). Combined with a 0.7s hero fade, listing→detail feels like a hard cut that hides the image instead of continuing it.

Instances: `AgSQrniYR` (Desktop), `IQmBTrFpbAgSQrniYR` (Tablet), `MrTKJzwELAgSQrniYR` (Phone).

## Target

Hide all three LoadingScreen instances on the detail page (`visible="false"`). Leave listing-page loaders untouched. Do not delete the code file.

## Steps

1. `pagePath: "/properties-2/:Properties"`
2. `SET AgSQrniYR visible="false";` (+ tablet/phone replica ids)
3. Verify serialize: loaders `visible === false`

## Boundaries

- Do NOT remove LoadingScreen from `/properties-2` listing or other pages.
- Do NOT change LoadingScreen.tsx behavior globally.

## Verification

- Open a residence from `/properties-2`: no percent overlay; hero visible promptly.
