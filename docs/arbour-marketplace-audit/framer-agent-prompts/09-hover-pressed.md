# Fase 09 — Hover / pressed / no hover en Phone

Cierra **M7**. Help Links: *Hover and active states are clearly defined*; interactive elements recognizable. Histórico 24 Seven: hover + pressed; disable hover on mobile.

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

## Siguiente

Chat nuevo → fase 10.
