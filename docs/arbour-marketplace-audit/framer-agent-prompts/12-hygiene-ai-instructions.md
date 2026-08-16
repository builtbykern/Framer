# Fase 12 — Hygiene, audit, instrucciones AI del template

Cierra **hygiene** + deja el archivo AI-ready. Help Assets: named folders, no dupes. Help Code: native first. [AI-ready templates](https://www.framer.com/help/articles/build-ai-ready-template/): custom instructions for the buyer’s Agent. Histórico: layer names, 3 breakpoints, reduced motion, performance checks.

Esta fase es **audit + cleanup**, no un rediseño.

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **GPT 5.6 Terra** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/audit`** si aparece |
| @ | proyecto entero |
| No usar | Fable, Sol, `/code` salvo bugs reales de código ya existente |

Terra: Help — *large audits and consistency*.

## Prompt (después de constraints)

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

Fix what you can without visual change. Then write Template Agent Instructions (for buyers) that tell future Agents:
- preserve Fraunces + Space Mono, cream, 72px-class padding, hamburger overlay, 404
- edit CMS and component variables for contact/socials
- do not add breakpoints or lorem
Paste those instructions into the template’s custom Agent instructions field if it exists; otherwise output them in chat for me to paste.

Finally list remaining manual checks: Framer Performance panel, Desktop/Tablet/Phone walkthrough, form submit, filters, all 7 notes, 4 territories, 6 properties.

Do not publish.
```

## Definition of done

- Informe de hygiene en el chat.
- Instructions del template pegables.
- Tú recorres preview del **branch** (no main) en 1440 / 768 / 390.

## Después

Review Changes → Apply to main cuando el walkthrough humano esté limpio. Listing de Marketplace (byline, screenshots) es otro trabajo — no este Agent.
