# Configuración del Agent interno de Framer

Solo el **Agent tab** del editor (no External Agents / Cursor). Fuentes oficiales:

- [Choosing a model in the Framer Agent](https://www.framer.com/help/articles/choosing-a-model-in-the-framer-agent/)
- [Agents: Reasoning and Fast Mode](https://www.framer.com/updates/agent-reasoning-and-fast-mode) (12 ago 2026)
- [Opus 5](https://www.framer.com/updates/opus-5) (28 jul 2026)
- [Framer Agents](https://www.framer.com/agents/) — skills `/`, `@`, context, chats, branches
- [How to build with Agents](https://www.framer.com/help/articles/how-to-build-a-website-from-scratch-with-framer-agents/)
- [How to use branches](https://www.framer.com/help/articles/how-to-use-branches-in-framer/)
- [Template best practices](https://www.framer.com/template-requirements/)

Si el picker de tu build muestra un nombre más nuevo (p. ej. Opus 5 en vez de Opus 4.7), usa el **más reciente de la misma familia** indicado en la fase. No actives **Fast Mode**.

---

## Controles del panel (cada chat)

1. **New Chat** — un trabajo por conversación ([Agents](https://www.framer.com/agents/): *Start a new one for each task*).
2. **Branch** `marketplace-qa` — crear antes del primer prompt.
3. **Model** — ver matriz abajo.
4. **Reasoning** — Light o Higher (oficial). Si tu UI dice Low / Medium / High: Light = Low, Higher = High. No uses Medium.
5. **Fast Mode** — **OFF**. Oficial: acelera a costa de más tokens; aquí necesitamos plan, no prisa.
6. **Skill** — escribe `/` y elige la skill de la fase.
7. **@** — páginas / CMS / styles que lista la fase.
8. **Context** — selecciona layers en el canvas y añádelos al chat.
9. Pega `00-constraints.md` y luego el prompt de la fase.

---

## Modelos oficiales y cuándo usarlos en Arbour

Help lista: Sonnet 5, Opus 4.7, GPT 5.5, Fable 5, GPT 5.6 Sol / Terra / Luna. Updates posteriores añaden **Opus 5**.

| Modelo | Help dice | En este QA |
|---|---|---|
| **Sonnet 5** | Default. Layout, edits cotidianos, diseño original eficiente. | Edits acotados: hover, labels, type, favicon, copy puntual. |
| **Opus 4.7 / Opus 5** | Máxima calidad. Plan largo, juicio visual, ejecución multi-paso. Opus 5 ≈ calidad Fable a menos créditos. | Páginas nuevas que deben *parecer* Arbour (Territories, Contact form, Privacy). |
| **GPT 5.5** | Copy-heavy, perspectivas alternativas, páginas estructuradas. | Canon de copy (1999, grammar). No rediseña. |
| **GPT 5.6 Luna** | El más rápido. CMS masivo y find-replace cross-site. | Slugs, binds, find-replace de teléfonos/años. |
| **GPT 5.6 Terra** | Audits grandes, consistency passes, menor coste. | Audit SEO/a11y/links y hygiene final. |
| **Fable 5** | El más *proactive*. First drafts, detalles expresivos, sistemas nuevos. | **PROHIBIDO.** Va más allá del brief = rediseña. |
| **GPT 5.6 Sol** | Creativo más fuerte, poca guía. | **PROHIBIDO.** Misma razón. |

**Fast Mode (Opus 5):** no. Oficialmente “noticeably quicker” y “uses more tokens”. Para Marketplace QA queremos Higher reasoning, no Fast.

---

## Reasoning (oficial, 12 ago 2026)

| Valor | Oficial | Usar cuando |
|---|---|---|
| **Light** | Quick edits and refinements | Un dato, un bind, un find-replace, un hover en un componente. |
| **Higher** | More room to plan before building | CMS schema, páginas detalle, forms, semántica site-wide, audit+fix. |

No hay tercer nivel documentado. Si el picker tiene Medium, no lo uses en este pack.

---

## Skills `/` (oficial)

En [framer.com/agents](https://www.framer.com/agents/) el toolkit nombra:

| Skill | Label en UI | Para qué |
|---|---|---|
| `/cms` | Write content | Collections, fields, items, slugs, binds a páginas. |
| `/component` | With variants | Header/Footer, cards, hover/pressed, variants Desktop/Tablet/Phone. |
| `/code` | Custom component | React. **No usar** salvo que un Form nativo sea imposible. Help: native first. |

El mismo copy dice: *Type `/` to run AI actions for **layouts**, CMS, and more.* Al pulsar `/` pueden aparecer skills extra según el build. Úsalas así:

| Si aparece | Úsala en fases | No la uses para |
|---|---|---|
| `/layout` o Layout | 05 (detail page structure), 10 (tags/spacing), overflow check | Rediseñar el home |
| `/style` o Style | 09 (hover/pressed), 11 (acento, contrast scrim) | Nueva paleta / dark mode |
| `/seo` o SEO | 07 | Rewrites de H1 |
| `/audit` o Audit | 12 (solo al final) | Empezar el proyecto |

Si `/` no muestra layout/style/seo/audit, el prompt en lenguaje natural sigue valiendo: el Agent cubre esas áreas sin slash ([Agents → Fix and audit / SEO / CMS](https://www.framer.com/agents/)).

**Nunca** `/code` + Fable/Sol juntos.

---

## Matriz rápida por fase

| Fase | Modelo | Reasoning | Fast | Skill(s) | @ / context |
|---|---|---|---|---|---|
| 01 Notes CMS | GPT 5.6 Luna | Higher | Off | `/cms` | @Notes, @Home, collection Notes |
| 02 Contact vars | GPT 5.6 Luna | Light | Off | `/component` | Header overlay, Footer, @Contact |
| 03 Copy canon | GPT 5.5 | Light | Off | (ninguna o `/cms`) | @Home, @About, @Notes |
| 04 Properties bind | GPT 5.6 Luna | Higher | Off | `/cms` | Property layout template, collection Properties |
| 05 Territories | Opus 5 (o 4.7) | Higher | Off | `/cms` luego `/component` | @Neighbourhoods, collection Territories |
| 06 Assets | Sonnet 5 | Light | Off | `/cms` | 6 property items, Unsplash/stock |
| 07 SEO / lang / alt | GPT 5.6 Terra | Higher | Off | `/seo` si existe | Site Settings, todas las páginas |
| 08 Forms | Opus 5 (o 4.7) | Higher | Off | `/component` — **no** `/code` | @Contact, @Home newsletter, @Properties filters |
| 09 Hover | Sonnet 5 | Light | Off | `/component` | Nav links, cards, VIEW ALL |
| 10 Semantics / type | Sonnet 5 | Higher | Off | `/layout` si existe | Layout templates, text styles |
| 11 Legal / contrast | Opus 5 (o 4.7) | Higher | Off | `/component` + `/style` si existe | Footer, heroes, CLEAR button |
| 12 Hygiene + audit | GPT 5.6 Terra | Higher | Off | `/audit` si existe | Proyecto entero. No rediseñar. |

---

## Lo que el Agent no debe hacer (esencia)

- No cambiar Fraunces + Space Mono, cream, márgenes ~72px, rules 1px, overlay hamburguesa, 404 actual.
- No 4º breakpoint. Help/reviewers: 3.
- No lorem. No promo `framer.com/@builtbykern`.
- No code que duplique Forms, CMS o hover nativos.
