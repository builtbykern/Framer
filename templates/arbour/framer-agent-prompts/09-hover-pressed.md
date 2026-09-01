# Fase 09 — Hover / pressed / no hover en Phone

**Objetivo (Help):** Links. Cierra **M7**. *Hover and active states are clearly defined*; interactive elements recognizable. Hover/active en todos los `a`/buttons; pressed; hover off en Phone.

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **Sonnet 5** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **`/component`** (no `/style`: hover = variants, no paleta) |
| @ | Header, Footer, Home, Properties cards, Notes cards |
| Context | `EXPLORE →`, `VIEW ALL →`, `VIEW ALL NOTES →`, featured property cards, journal cards, overlay links |
| No usar | Fable, `/code` (usar variants / interactions nativas) |

Sonnet + Light: micro-interacción en componentes existentes.

## Prompt (después de constraints)

```
/component

Add consistent Hover and Pressed (active) states to every clickable text link, text button, and card that already has a link. Do not restyle the resting state.

Known gaps on Home: EXPLORE →, VIEW ALL →, VIEW ALL NOTES →, Cheyne Walk featured card, both journal cards. Overlay nav links and footer links too.

Keep it on-brand: opacity, underline, or olive/charcoal shift — no new colors, no bounce, no scale >1.02.
On Phone breakpoint: disable hover (or use a variant with no hover) so tap does not stick in a hover appearance. Pressed may remain.

Cursor pointer on all of the above.

List components/variants you edited.
```

## Definition of done

- Desktop: EXPLORE → cambia en hover.
- Phone: no queda “pegado” el hover.
- Resting look igual.

## No tocar

Resting look, paleta nueva, bounce, scale >1.02, `/code`, extra breakpoint. Publicar main.

## Verificación humana

Desktop 1440: EXPLORE → cambia en hover. Phone 390: hover no queda pegado. Tablet 768: sin overflow.

## Siguiente

Chat nuevo → fase 10.
