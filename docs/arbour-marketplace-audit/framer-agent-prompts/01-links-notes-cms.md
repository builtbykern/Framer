# Fase 01 — Notes CMS: slugs, featured, cero 404

**Objetivo (Help):** Links + CMS. Cierra **B1** del audit. *Broken or inactive links have been removed.* Fields connected; unused/empty entries removed. Histórico: unique CMS content; human slugs.

Ficha de picker: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **GPT 5.6 Luna** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/cms`** |
| @ | Collection Notes (nombre real), pages `@Home` `@Notes` `@Contact` |
| Context | Home journal cards; Notes index list; Notes detail layout template |
| No usar | Fable 5, Sol, `/code`, Fast Mode |

Luna: Help — *fastest option for large CMS updates*. Higher: hay que planear schema/slug/bind antes de tocar.

## Prompt (después de constraints)

```
/cms

Inspect the Notes CMS collection and every link to a note on Home, Notes, and Contact.

Problems to fix (do not redesign):
1. Home journal card “The case for waiting” currently links to /notes/:Jd2WAsZn3 (raw CMS id) and 404s. Create or repair a real CMS item titled “The case for waiting.” Human slug: the-case-for-waiting. Excerpt (British English): “A market that rewards speed makes patience the rarest luxury — the right address is worth the wait.” Bind the Home card title, date, category, excerpt, and URL entirely from CMS — no overlay/static text.
2. Home journal card “On finding quiet in Marylebone” currently points at /notes/on-proportion-light-london-row-house, whose real title is “On proportion, light, and the London row house.” Either create a matching Marylebone item with a matching slug, or retarget that card to the real item and show that item’s real title/date/category. CMS fields must equal what the card displays.
3. Notes index claims 07 entries but numbering skips 04, and “The case for waiting” is missing from the index. End state: 7 published items, numbers 01–07 with no gaps, index lists all of them with no Limit on the Notes page (Limit is OK on Home featured only).
4. Delete or unpublish any item whose slug is an id (contains “:” or looks like Jd2WAsZn3).
5. Every featured/index card must be a CMS list or bound fields — no hardcoded titles on top of the wrong item.

Report: collection fields, each of the 7 slugs, which Home cards bind to which items, and any leftover 404 links.
```

## Definition of done

- Click Home card 02 → `/notes/the-case-for-waiting` 200, título correcto.
- Ningún `href` con `:Jd2WAsZn3`.
- Card 01 título = artículo abierto.
- `/notes` muestra 7, números 01–07.

## No tocar

Look (`#F9F8F3`, Fraunces + Space Mono, overlay, 404). Extra breakpoint. Lorem. `/code`. Promo Framer. Publicar main.

## Verificación humana

Desktop 1440 · Tablet 768 · Phone 390. Click Home journal → nota real (no 404). Sin overflow.

## Siguiente

Chat nuevo → fase 02.
