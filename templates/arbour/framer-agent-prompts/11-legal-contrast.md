# Fase 11 — Contraste y acento (sin páginas nuevas)

**Objetivo (Help):** Accessibility. Cierra **m3 / m4**. Contrast WCAG 4.5:1 normal / 3:1 large. Scrim en meta sobre cielo claro; unificar acento lima/oliva. **No crear Privacy / Terms / Cookies.**

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **Sonnet 5** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **`/component`** (no `/style`: contraste = scrim/opacidad, no paleta nueva) |
| @ | `@Home` `@About` heroes, Properties CLEAR, `@Contact` newsletter |
| No usar | Fable, Opus, `/code`, páginas nuevas |

## Prompt (después de constraints)

```
/component

Two polish items on existing pages only. Do not create pages. Do not redesign the brand.

1. Contrast: Home and About heroes have small white meta on bright sky. Add a subtle scrim or move meta onto a darker part of the photo so WCAG 4.5:1 holds for that small Space Mono. Do not flatten the photography.
2. CLEAR button on Properties uses lime. Either keep lime as the single accent and use it on primary buttons consistently, or retint CLEAR to olive/charcoal already in the system. Pick one accent. Check 4.5:1 on the label.

Do not add Privacy, Terms, or cookie pages. If the newsletter/contact form needs a legal note, add one short line on the existing Contact or newsletter block: “Demo template — replace with your own privacy policy before publishing.” Same type styles. No new route.

List contrast method used on heroes. List no new pages.
```

## Definition of done

- Meta del hero legible sobre el cielo.
- Un acento, no lima vs oliva aleatorio.
- Sitemap igual: sin Privacy/Terms nuevas.

## No tocar

Fotografía aplanada, paleta nueva, cookie banner, 404, extra breakpoint, `/code`, páginas nuevas. Publicar main.

## Verificación humana

Desktop 1440 · Tablet 768 · Phone 390. Meta del hero legible. Un acento. Ninguna ruta legal nueva.

## Siguiente

Chat nuevo → fase 12.
