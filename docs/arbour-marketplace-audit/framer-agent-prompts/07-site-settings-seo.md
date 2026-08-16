# Fase 07 — Site settings, lang, favicon, OG, alt

Cierra **M5**. Help Accessibility: title + description; contrast. Help Tags: meaningful alt. Histórico Bicky: social thumbnail, site language English, metadata.

Official Agent can set titles, descriptions, OG, alt ([Agents → SEO](https://www.framer.com/agents/)).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **GPT 5.6 Terra** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/seo`** si está en el menú `/`. Si no: **ninguna** (Agents `#seo`, no inventes el slash) |
| @ | Site Settings; todas las páginas |
| No usar | Fable, Sol, `/code`, `/cms` (no mutar schema) |

Terra: Help — *large audits, consistency passes*.

## Prompt (después de constraints)

```
SEO and site settings pass. Do not redesign.

1. Site language = English (html lang en).
2. Replace the default Framer favicon (default-favicon-light.v1.png) with a simple Arbour mark consistent with the wordmark — cream/charcoal, no extra decoration.
3. Every indexed page already has a unique title and description — keep them; fill any blank. Add a unique Open Graph image per main page (Home, Properties, Neighbourhoods, Notes, About, Contact) that actually represents that page. CMS detail pages should use the item image as OG where possible.
4. Images that are content (heroes, property photos, journal photos): write specific alt text. Decorative rules/icons may keep empty alt.
5. Do not stuff keywords. Do not change visible H1s.

Report: lang, favicon path, pages missing OG before/after, count of alts filled.
```

## Definition of done

- `html lang` = `en`.
- Favicon ≠ default Framer.
- Home tiene `og:image`.
- Heroes de properties con alt específico.

## Siguiente

Chat nuevo → fase 08.
