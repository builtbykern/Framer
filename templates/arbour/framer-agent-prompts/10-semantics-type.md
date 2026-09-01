# Fase 10 — Semántica y tipografía (sin rediseñar)

**Objetivo (Help):** Tags + Text. Cierra **m1 / m2**. Semantic tags, heading structure. Framer fonts (Fraunces + Space Mono); balanced text. Tags `header`/`main`/`section`; display line-height ≥ 1.05; Space Mono 11px solo captions.

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **Sonnet 5** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/layout`** si está en el menú `/`. Si no: **ninguna** (no inventes el slash) |
| @ | Layout templates Header/Footer, text styles, main pages |
| No usar | Fable, Sol, nueva typeface, 4º breakpoint |

Higher: hay que mapear tags sin romper stacks.

## Prompt (después de constraints)

```
Accessibility tags and type metrics only. Do not change the look except where a 1.0 line-height clips descenders.

1. Assign semantic tags: header (site header), nav (overlay + footer nav), main (page content), footer, section per major block. Keep a single H1 per page. Do not turn every frame into a heading.
2. Display / H1 text style: line-height at least 1.05 (Home H1 is 84px / 84px today — too tight for “Journal” / “judgement”). Keep Fraunces. Keep tracking close to current.
3. Space Mono 11px may stay for coordinates, eyebrows, and captions. Do not use 11px for long body paragraphs — those should use the existing body style (readable, ≥14px if a body style exists; do not invent a new font).
4. 404 page should keep its custom layout but include a way back (already “RETURN TO ARBOUR”) and nav or logo to home.
5. Three breakpoints only. No overflow. If a tag change breaks a stack, fix the stack, don’t add a breakpoint.

Report tag changes per page and the new H1 line-height.
```

## Definition of done

- Landmark `header` o equivalente en páginas de marketing.
- Un H1. Descenders de “Journal” no recortados.
- Cero overflow 1440 / 768 / 390.

## No tocar

Typefaces nuevas, 4º breakpoint, look salvo line-height de display si recorta descenders. `/code`. Publicar main.

## Verificación humana

Desktop 1440 · Tablet 768 · Phone 390. Un H1 por página. Descenders de “Journal” no recortados. Sin overflow.

## Siguiente

Chat nuevo → fase 11.
