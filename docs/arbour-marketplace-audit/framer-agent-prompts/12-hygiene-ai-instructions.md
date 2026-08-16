# Fase 12 — Hygiene audit + instrucciones AI del template

**Objetivo (Help):** Assets + Code + AI-ready. Nombrar layers/components, styles no huérfanos, 3 breakpoints, reduced motion, performance. Pegar instrucciones del template para compradores ([AI-ready](https://www.framer.com/help/articles/build-ai-ready-template/)).

Dos chats: **12A** audit/fix, **12B** instructions. No reciclar el hilo. No rediseñar.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración 12A — audit

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **GPT 5.6 Terra** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/audit`** si está en el menú `/`. Si no: **ninguna** (Agents `#audit`, no inventes el slash) |
| @ | proyecto entero |
| No usar | Fable, Sol, `/code` nuevo, rediseño |

Terra: Help — *large audits and consistency*.

## Prompt 12A (después de constraints)

```
Audit then fix only hygiene. Do not change art direction.

Scan for:
- Broken internal links (none should 404 except the true 404 page)
- Empty CMS items
- Default layer names (Frame 1, Rectangle 2) — rename descriptively
- Unused styles, unused components, unused pages
- More than 3 breakpoints
- Missing reduced-motion respect in Site Settings (enable Framer’s prefers-reduced-motion option)
- Images without alt that are not decorative
- Hardcoded colors that should be color styles
- Creator promo / leftover @builtbykern links
- Performance: oversized uncompressed images, excessive blurs (>10)

Fix what you can without visual change. Report what you fixed and what needs a human.

Do not write Template Agent Instructions in this chat. Do not publish.
```

## Configuración 12B — instructions del comprador

| Control | Valor |
|---|---|
| Chat | **New Chat** (no reciclar 12A) |
| Branch | `marketplace-qa` |
| Modelo | **Sonnet 5** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **Ninguna** |
| @ | Site Settings / template Agent instructions field if visible |
| No usar | Fable, Sol, `/cms`, `/code`, cambios de look |

## Prompt 12B (después de constraints)

```
Do not edit the canvas look. Write Template Agent Instructions for buyers of this template (Help: AI-ready template).

Tell future in-canvas Agents:
- preserve Fraunces + Space Mono, cream, 72px-class padding, hamburger overlay, custom 404
- edit CMS and component variables for contact/socials
- do not add breakpoints or lorem
- prefer native Form, CMS, and component variants over code

Paste those instructions into the template’s custom Agent instructions field if it exists; otherwise output them in chat for me to paste.

Finally list remaining manual checks: Framer Performance panel, Desktop/Tablet/Phone walkthrough, form submit, filters, all 7 notes, 4 territories, 6 properties.

Do not publish.
```

## Definition of done

- Informe de hygiene en el chat 12A.
- Instructions del template pegadas o listadas en 12B.
- Tú recorres preview del **branch** (no main) en 1440 / 768 / 390.

## No tocar

Art direction, Fraunces + Space Mono, `#F9F8F3`, overlay, 404, extra breakpoint, `/code` nuevo, listing de Marketplace. Publicar main (hasta Review Changes humano).

## Verificación humana

Desktop 1440 · Tablet 768 · Phone 390. Walkthrough del branch preview: form, filtros, 7 notes, 4 territories, 6 properties. Sin overflow. Sin 404 nuevos.

## Después

Review Changes → Apply to main cuando el walkthrough humano esté limpio. Listing de Marketplace (byline, screenshots) es otro trabajo — no este Agent.
