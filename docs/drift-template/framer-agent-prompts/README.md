# Cómo correr el pack Drift

Prompts para el **Agent tab** de Framer (no External Agents / Cursor). Cada archivo de fase = **un chat nuevo**.

Fuentes: [How to build with Agents](https://www.framer.com/help/articles/how-to-build-a-website-from-scratch-with-framer-agents/), [Agents toolkit](https://www.framer.com/agents/), [Choosing a model](https://www.framer.com/help/articles/choosing-a-model-in-the-framer-agent/), [Reasoning / Fast Mode](https://www.framer.com/updates/agent-reasoning-and-fast-mode), [CMS + Agents](https://www.framer.com/help/articles/how-to-add-content-to-your-cms-with-framer-agents/), [AI-ready template](https://www.framer.com/help/articles/build-ai-ready-template/), [Template requirements](https://www.framer.com/template-requirements/).

Picker: [`00-agent-decision.md`](00-agent-decision.md). Datos: [`00-source-of-truth.md`](00-source-of-truth.md). CMS: [`00-cms.md`](00-cms.md). Look: [`00-visual-system.md`](00-visual-system.md). Nav: [`00-gregor-nav.md`](00-gregor-nav.md). Lummi (fase 12): [`12-lummi-prompts.md`](12-lummi-prompts.md). **Copia y pega:** [`PROMPTS.md`](PROMPTS.md).

## Cómo se usa (no negociable)

1. Proyecto Framer **nuevo**. Branch **`template-build`**.
2. Insertar a mano el code component **Drift Plane** (antes de la fase 03).
3. Pegar **[`00-constraints.md`](00-constraints.md)** al inicio de cada chat.
4. Un prompt de fase. Parar. Revisar **1440 / 768 / 390**. Afinar a mano si hace falta.
5. Tras 03C: fase **03D** Settle nativo (Scrim 6px + bg baja). Si pegaste frost-view-transition.html, bórralo.
6. **New Chat** para la siguiente fase. `@` páginas/CMS. Skills: las de la matriz. **`/code` solo en 09B**.
7. **Lummi en la fase 12**, cuando el sitio ya se recorre. Cero Unsplash.
8. No publicar **main** hasta 13B.

No hay un prompt “haz la template perfecta”. Un job por chat.

## Orden

| # | Archivo | Trabajo |
|---|---|---|
| 00 | [`00-constraints.md`](00-constraints.md) + [`00-source-of-truth.md`](00-source-of-truth.md) + [`00-visual-system.md`](00-visual-system.md) + [`00-cms.md`](00-cms.md) + [`00-gregor-nav.md`](00-gregor-nav.md) | Guardrails + VALE + look + schema CMS + nav |
| 01 | [`01-system-shells.md`](01-system-shells.md) | Styles + páginas vacías |
| 02 | [`02-cms-work.md`](02-cms-work.md) | Tags, Work, Credits (7 / 7 / 21), placeholders |
| 03 | [`03-home-plane.md`](03-home-plane.md) | Drift Plane + Nav VALE + plus derecha |
| 03B | [`03b-nav-veil.md`](03b-nav-veil.md) | Instancias Nav (Open stub) |
| 03C | [`03c-nav-open-visual.md`](03c-nav-open-visual.md) | Open visual: Coad 33/67 + still |
| 03D | [`03d-page-frost.md`](03d-page-frost.md) | Settle: blur 6px + bg baja (inverso al salir) |
| 04 | [`04-detail-split.md`](04-detail-split.md) | Split paper, gallery stack |
| 05 | [`05-bind-detail.md`](05-bind-detail.md) | Binds CMS |
| 06 | [`06-info.md`](06-info.md) | Bio + lista de títulos |
| 07 | [`07-contact-form.md`](07-contact-form.md) | Form nativo |
| 08 | [`08-404.md`](08-404.md) | 404 |
| 09A | [`09a-plane-links.md`](09a-plane-links.md) | Array → `/work/{slug}` |
| 09B | [`09b-plane-snap.md`](09b-plane-snap.md) | `/code` snap Phone **si hace falta** |
| 10A | [`10a-hover.md`](10a-hover.md) | Hover/pressed |
| 10B | [`10b-semantics.md`](10b-semantics.md) | Tags, H1, reduced motion |
| 11 | [`11-seo.md`](11-seo.md) | lang, titles, OG |
| 12 | [`12-lummi.md`](12-lummi.md) + [`12-lummi-prompts.md`](12-lummi-prompts.md) | Humano genera 1+5 stills/serie, Agent bindea |
| 13A | [`13a-audit.md`](13a-audit.md) | Hygiene |
| 13B | [`13b-ai-instructions.md`](13b-ai-instructions.md) | Instructions del comprador |

## Verificación humana tras cada fase

Desktop **1440**, Tablet **768**, Phone **390**. Click del flujo tocado. Sin overflow. Sin rutas nuevas (Index, Privacy, Journal).

## Fuera de alcance

Listing Marketplace. Privacy. Vídeo. Light/dark switch. Cuarto breakpoint. Regenerar el Plane. Fotos antes de que el sitio se recorra.

## Si el Agent se desvía

New Chat. Baja a Sonnet 5 + Light. Nunca Fable 5 / GPT 5.6 Sol / Fast Mode. `/code` solo 09B.
