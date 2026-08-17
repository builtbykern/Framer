# Fase 10B — Semántica + reduced motion

**Objetivo:** Tags header/main, un H1 por página, reduced motion. Sin rediseñar.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Sonnet 5** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/layout`**. Si no está: chat plano |
| @ | todas las páginas, Site Settings |
| No usar | Fable, Sol, `/code`, typeface nueva |

## Prompt (después de constraints)

```
/layout

Semantics and motion only. Do not change art direction.

- Nav wrapper: header. Page content: main. Do not fake extra landmarks
- Home: visually hidden H1 VALE (already asked in 03 — keep one H1)
- Info: H1 or kicker mapped so there is one heading “Info”
- Contact: one heading “Contact”
- 404: one heading “Missing”
- Work detail: the series Title is the H1 (Display)
- Enable Framer prefers-reduced-motion / reduced motion in Site Settings if the control exists. Then: Nav overlay instant, BrandRoll loop off, Scrim and Y instant, Page Effect Instant if it still exists, plane without idle drift
- Overlay open: sr-only H1 “Menu” already asked in 03C — do not add a second visible H1 on that overlay
- Body line-height remains 1.55. Do not swap or add fonts. Keep Mark, Display, Lead, Body, Label as defined in phase 01.

Report: tag on each page, H1 text, reduced-motion setting.
```

## Definition of done

- Un H1 por página. header/main. Reduced motion on.

## No tocar

Split, plane, fotos.

## Verificación humana

Outline de headings (extensión o inspector). 3 breakpoints intactos.

## Siguiente

Chat nuevo → fase 11.
