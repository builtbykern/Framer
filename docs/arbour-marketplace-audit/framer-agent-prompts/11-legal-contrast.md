# Fase 11 — Legal, contraste, acento

**Objetivo (Help):** Accessibility. Cierra **m3 / m4**. Contrast WCAG 4.5:1 normal / 3:1 large. Privacy (y Terms si hay form); scrim en meta sobre cielo claro; unificar acento lima/oliva.

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **Opus 5** (si no: **Opus 4.8**, luego **4.7**. Nunca Fable) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/component`** (no `/style`: contraste = scrim/opacidad, no paleta nueva) |
| @ | Footer, `@Home` `@About` heroes, Properties CLEAR, new Privacy page |
| No usar | Fable (no “ pulir ” el 404 ni el hero), `/code` |

## Prompt (después de constraints)

```
/component

Three polish items. Do not redesign the brand.

1. Contrast: Home and About heroes have small white meta on bright sky. Add a subtle scrim or move meta onto a darker part of the photo so WCAG 4.5:1 holds for that small Space Mono. Do not flatten the photography.
2. CLEAR button on Properties uses lime. Either keep lime as the single accent and use it on primary buttons consistently, or retint CLEAR to olive/charcoal already in the system. Pick one accent. Check 4.5:1 on the label.
3. Because the site collects email, add a short Privacy page (and link it in the footer LEGAL row) in Arbour voice: demo agency, what the form stores, how to change the page after purchase. Optional Terms one-pager. Do not add cookie banners unless native and necessary. Match footer/type. No new palette.

List pages created and contrast method used on heroes.
```

## Definition of done

- Meta del hero legible sobre el cielo.
- Un acento, no lima vs oliva aleatorio.
- Footer → Privacy.

## No tocar

Fotografía aplanada, paleta nueva, cookie banner innecesario, 404, extra breakpoint, `/code`. Publicar main.

## Verificación humana

Desktop 1440 · Tablet 768 · Phone 390. Meta del hero legible. Footer → Privacy. Un acento.

## Siguiente

Chat nuevo → fase 12.
