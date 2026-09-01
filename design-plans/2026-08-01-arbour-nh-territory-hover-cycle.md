# Neighbourhoods Territory Cards — SOTD media + hover cycle

Written against: `4aa0cbc`  
**Status:** DONE · published `148c08d24`

## Delivered

1. UI: photo 320/260, VIEW on media, border on dossier only, image-led stack  
2. Motion: zoom 1.04 (no opacity dim); reduced-motion safe  
3. Hover gallery: Hero → Map cycle (~900ms); mouse leave → original  

## Owner

- Code: `Arbour_TerritoryHoverMedia.tsx` (`codeFile/nMMl08t`)
- Canvas: `/neighbourhoods` photo frames bind `$control__image` Hero + `$control__imageB` Map

## Verify

- Live smoke: 4× `.arbour-thm`, opacity timeline crosses on hover, leave → `[1,0]`
