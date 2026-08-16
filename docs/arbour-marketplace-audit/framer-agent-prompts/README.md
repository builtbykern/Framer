# Cómo correr este pack

Prompts para el **Agent tab** de Framer (no External Agents / Cursor). Cada archivo de fase = **un chat nuevo**.

Fuentes: [How to build with Agents](https://www.framer.com/help/articles/how-to-build-a-website-from-scratch-with-framer-agents/), [Agents toolkit](https://www.framer.com/agents/) (`/` skills, `@` pages/CMS/styles, context de layers, un chat por tarea, branch), [template best practices](https://www.framer.com/template-requirements/), [AI-ready template](https://www.framer.com/help/articles/build-ai-ready-template/).

Hallazgos: [`../AUDIT.md`](../AUDIT.md). Datos: [`00-source-of-truth.md`](00-source-of-truth.md). Picker: [`00-agent-decision.md`](00-agent-decision.md).

**Copia y pega (modelo + skill + prompt en un solo archivo):** [`PROMPTS.md`](PROMPTS.md).

## Cómo se usa (oficial, no negociable)

1. Crear branch **`marketplace-qa`** (los edits del Agent no van a main hasta Review Changes).
2. Pegar **[`00-constraints.md`](00-constraints.md)** al inicio de cada chat (o como Template Agent Instructions).
3. Un prompt de fase. Parar. Revisar canvas en Desktop / Tablet / Phone.
4. **New Chat** para la siguiente fase. Seleccionar layers y `@` páginas/CMS/collections que el prompt indique. Skills: `/cms`, `/component` (nunca `/code` en este pack).
5. No publicar **main** hasta terminar la fase 12.

No hay un prompt “haz el template perfecto”. Framer pide **un job por chat**.

## Orden de archivos

| # | Archivo | Trabajo |
|---|---|---|
| 00 | [`00-constraints.md`](00-constraints.md) + [`00-source-of-truth.md`](00-source-of-truth.md) | Guardrails + datos únicos |
| 01 | [`01-links-notes-cms.md`](01-links-notes-cms.md) | `/cms` Notes: waiting in; unpublish mews duplicate; no 8th item |
| 02 | [`02-contact-variables.md`](02-contact-variables.md) | Variables Header/Footer/Contact: email, tels, socials |
| 03 | [`03-copy-canon.md`](03-copy-canon.md) | 1999 vs 2018 vs 26 yrs; grammar; featured 01–03 |
| 04 | [`04-properties-cms-bind.md`](04-properties-cms-bind.md) | Coords, neighbourhood, rooms únicos por ítem |
| 05 | [`05-territories-cms.md`](05-territories-cms.md) | VIEW Neighbourhoods → `/properties` existente (sin detail pages) |
| 06 | [`06-assets-match-copy.md`](06-assets-match-copy.md) | Heroes Cheyne Walk / Bibury alineados al brief |
| 07 | [`07-site-settings-seo.md`](07-site-settings-seo.md) | `lang=en`, favicon, OG, alts |
| 08 | [`08-forms-labels.md`](08-forms-labels.md) | Labels, success/error, Form nativo **en Contact** |
| 09 | [`09-hover-pressed.md`](09-hover-pressed.md) | Hover/active; pressed; hover off en Phone |
| 10 | [`10-semantics-type.md`](10-semantics-type.md) | Tags `header`/`main`/`section`; line-height |
| 11 | [`11-legal-contrast.md`](11-legal-contrast.md) | Scrim + un acento; **sin** Privacy nueva |
| 12 | [`12-hygiene-ai-instructions.md`](12-hygiene-ai-instructions.md) | Hygiene (12A) + instrucciones AI del template (12B) |

## Verificación humana tras cada fase

Desktop **1440**, Tablet **768**, Phone **390**. Click del flujo tocado. Sin overflow. Sin 404 nuevos. Tras **01–02** el home ya no puede 404 ni mostrar tres teléfonos.

## Fuera de alcance

Listing de Marketplace (byline, screenshots, precio). Code components nuevos. Cuarto breakpoint. Cambiar el 404. **Páginas nuevas** (Privacy, Territories detail, rutas extra).

## Si el Agent se desvía

New Chat. No “sigue pero sin rediseñar” en el mismo hilo. Baja a Sonnet 5 + Light. Nunca Fable 5 / GPT 5.6 Sol / Fast Mode / `/code`.
