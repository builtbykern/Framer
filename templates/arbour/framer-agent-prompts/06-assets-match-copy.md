# Fase 06 — Assets vs copy (fotos que coinciden con el brief)

**Objetivo (Help):** Assets + Copyright. Cierra **M4**. Polished, high quality; original or licensed. Histórico: unique CMS images. Cheyne Walk = Támesis/Chelsea; Bibury = honey-stone manor.

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **Sonnet 5** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **`/cms`** |
| @ | Properties collection |
| Context | Cheyne Walk detail hero; Bibury detail hero |
| References | Optional: attach 2–4 licensed stills (Thames/Chelsea brick; Cotswolds honey stone) |
| No usar | Fable/Sol (generarían un look nuevo), `/code` |

Sonnet: default para edits cotidianos. Light: swap de assets, no layout.

## Prompt (después de constraints)

```
/cms

Replace misleading heroes only. Do not restyle pages.

Cheyne Walk Riverside Residence copy describes Thames / Chelsea / Battersea. The current hero reads as a Manhattan skyline. Swap the hero (and any identical thumbnails) for a licensed image that reads as London riverside or Chelsea interior with river/city-of-London character — not One World Trade Center.

Bibury Stone Manor copy describes honey-stone, seventeenth-century, gravel drive, Cotswolds. The current hero is an urban garage door. Swap for honey-stone manor / Cotswolds vernacular.

If you cannot find an appropriate Unsplash/Framer stock match, leave the slot marked and do not use another US skyline.

Add meaningful alt text on the new images (not empty, not “Property detail photograph”).

List old vs new asset names per slug.
```

## Definition of done

- Cheyne Walk hero no es Manhattan.
- Bibury hero no es garage door urbano.
- Alt no vacío.

## No tocar

Layout, paleta, typefaces, resto de fotos que sí coinciden, extra breakpoint, `/code`. Publicar main.

## Verificación humana

Desktop 1440 · Tablet 768 · Phone 390. Cheyne Walk hero ≠ Manhattan. Bibury hero ≠ garage door.

## Siguiente

Chat nuevo → fase 07.
