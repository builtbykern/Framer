# 012 — View Transition card image → property hero

- **Status**: REVERTED (VT no-op in Framer soft-nav; hero appear 011 restored)
- **Commit**: unavailable
- **Severity**: MEDIUM
- **Category**: Physicality / Spatial consistency
- **Estimated scope**: `Arbour_PropertyCard.tsx`, `Arbour_InertiaFrame.tsx`, hero appearEffect

## Problem

Listing→detail has no shared media morph. Loader removed (010) and hero scale-settle (011) help, but the image still hard-cuts.

## Target

Cross-document View Transitions (Chrome/Edge; progressive enhancement):

1. Shared name: `arbour-property-hero`
2. Listing: on `pointerdown`, claim that name on the card `<img>` (clear siblings first)
3. Detail: hero `Arbour_InertiaFrame` image always has `view-transition-name: arbour-property-hero`
4. CSS: `@view-transition { navigation: auto; }`; group duration **0.4s**, ease `cubic-bezier(0.23, 1, 0.32, 1)`
5. `prefers-reduced-motion: reduce` → `navigation: none`; no name claim
6. Neutralize hero `appearEffect` (opacity/scale identity, 0s) so it does not fight the VT

## Boundaries

- Do NOT animate site-wide Nav routes
- Do NOT require slug CMS binding (click-claim pattern)
- Safari/Firefox without VT: instant navigation (acceptable fallback)

## Verification

- Chrome: click card on `/properties-2` → image morphs into detail hero ~400ms
- Reduced motion: no morph
- Publish production
