# Decisión — Agent interno de Framer (Arbour)

Solo el **Agent tab** del editor. No External Agents, no Cursor, no `@framer/agent` CLI.

Este archivo es la ficha que se usa en el picker. Los prompts 01–12 ya están alineados con ella.

---

## 1. Qué es este Agent

El Agent interno edita el proyecto en el canvas: layers, componentes, CMS, estilos, SEO y publish. Todo lo que hace queda como Framer nativo.

| Hecho | Fuente |
|---|---|
| Vive en el tab Agent, mismo canvas | [framer.com/agents](https://www.framer.com/agents/), [Help: build from scratch](https://www.framer.com/help/articles/how-to-build-a-website-from-scratch-with-framer-agents/) |
| Un chat = un trabajo | Agents: *Start a new one for each task to keep the agent focused.* |
| `@` = páginas, CMS, styles, assets | Agents → Mentions |
| Layers seleccionados = context | Agents → Contexts; Academy: context tool + @mentions |
| Branch antes de tocar | [Help: branches](https://www.framer.com/help/articles/how-to-use-branches-in-framer/) — *AI-generated changes* |
| Skills = menú `/` | Agents: *Type `/` to run AI actions for layouts, CMS, and more.* |
| Modelo se elige en el picker | [Help: choosing a model](https://www.framer.com/help/articles/choosing-a-model-in-the-framer-agent/) (act. 7 ago 2026) |
| Reasoning + Fast Mode | [Updates: 12 ago 2026](https://www.framer.com/updates/agent-reasoning-and-fast-mode) |

**No usar en este pack:** Claude Code / Cursor / Codex vía [External Agents](https://www.framer.com/agents/external/). Eso es otro producto.

---

## 2. Orden de clics (cada fase)

1. Branch `marketplace-qa` (una vez).
2. **New Chat**.
3. **Modelo** de la matriz.
4. **Reasoning** Light o Higher.
5. **Fast Mode = Off** (aunque el modelo lo ofrezca).
6. Escribe `/` → elige **solo** la skill de la fase.
7. Escribe `@` → páginas / collections de la fase.
8. Selecciona layers → Add to Agent.
9. Pega `00-constraints.md`.
10. Pega el prompt de la fase.
11. Revisa Desktop / Tablet / Phone. Si se desvía: New Chat, no “sigue pero sin rediseñar”.

---

## 3. Skills — inventario y decisión

### 3.1 Oficiales (siempre existen)

Nombradas en el toolkit de [framer.com/agents](https://www.framer.com/agents/) y [framer.com/ai](https://www.framer.com/ai/):

| Escribes | Label en UI | Oficio | En Arbour |
|---|---|---|---|
| **`/cms`** | Write content | Collections, fields, items, slugs, import, bind a lists/detail pages | 01, 04, 05A, 06 |
| **`/component`** | With variants | Componentes reutilizables, variants (Hover/Pressed/breakpoint), overlay, forms nativos | 02, 05B, 08, 09, 11 |
| **`/code`** | Custom component | React code component | **Veto.** Help Code + Academy: nativo primero. Forms, hover, CMS y filtros no son código. |

Help CMS+Agents ([add content with Agents](https://www.framer.com/help/articles/how-to-add-content-to-your-cms-with-framer-agents/)): el Agent es fuerte creando collections e items; el bind a detail pages con filtros/condicionales hay que **revisar a mano**. Por eso 05 está partido en A (`/cms`) y B (`/component`).

### 3.2 Extendidas (el menú `/` puede listarlas)

Framer no publica un catálogo Help con más nombres. El copy oficial sí dice que `/` cubre **layouts, CMS, and more**. Las áreas de producto oficiales son Style, SEO, Audit, CMS, Components ([agents](https://www.framer.com/agents/) anchors `#design` `#seo` `#audit` `#cms` `#components`). Update de julio 2026: *Fixed Skills menu positioning between Chats*.

**Regla:** escribe `/`. Si ves un nombre de la columna izquierda, úsalo. Si no está, **no lo inventes en el prompt**. El Agent hace esa área en lenguaje natural (páginas oficiales SEO / Audit).

| Si el menú muestra | Úsala solo en | No la uses para |
|---|---|---|
| Layout / `/layout` | **10**, y **05B** si no hay `/component` suficiente para la detail page | Rediseñar Home, grids nuevos, 4º breakpoint |
| Style / `/style` | **ninguna fase como primaria.** Arbour no cambia paleta ni typeface | Dark mode, nueva paleta, motion extra |
| SEO / `/seo` | **07** | Reescribir H1, “mejorar el copy” |
| Audit / `/audit` | **12A** (último) | Empezar el proyecto, “hacer un pass creativo” |

**Nunca** pegues `/seo` `/audit` `/layout` `/style` si no los viste en el menú de ese chat. Un slash inventado no dispara la skill.

### 3.3 Sin skill (chat plano)

Usar **ninguna** cuando el trabajo es texto o settings, no CMS schema ni componentes:

| Fase | Por qué sin `/` |
|---|---|
| **03** | Copy estático / meta. GPT 5.5. `/cms` tentaría a tocar schema. |
| **12B** | Template Agent Instructions (Help: [AI-ready template](https://www.framer.com/help/articles/build-ai-ready-template/)). Es un bloque de instrucciones, no una skill de canvas. |

### 3.4 Veto de skills

| Veto | Motivo |
|---|---|
| **`/code`** en 01–12 | Template requirements: native first. Contact = Form nativo o mailto; hover = variants; filtros = CMS. |
| Dos skills en el mismo chat | Oficial: un trabajo por chat. 05 y 12 se parten. |
| Skill de otra fase | `/audit` en el 01 reescribe el sitio. `/cms` en el 09 rompe binds. |
| Skills de template del comprador | Help dice que *soon* habrá skills empaquetadas en el template. No existen aún para este pack. 12B escribe **instructions**, no skills. |

---

## 4. Modelos — inventario y veto

Help (7 ago 2026) lista: **Sonnet 5, Opus 4.7, GPT 5.5, Fable 5, GPT 5.6 Sol / Terra / Luna**.

Updates posteriores (siguen en el picker si tu build las tiene):

| Extra | Fecha | Qué dice Framer |
|---|---|---|
| **Opus 5** | 28 jul 2026 | Misma calidad que Fable 5 en Navigation Benchmark, ~0.5× créditos vs Fable; 1.2× créditos vs Sol. Más rápido que Opus 4.8. |
| **GPT 5.6 Sol / Terra / Luna** | 9 jul 2026 | Sol = creativo máximo. Terra = audit/consistency a 0.6× créditos vs 5.5. Luna = 2× más rápido, 0.4× créditos; CMS y find-replace. |
| Fast Mode (Opus 5) | 12 ago 2026 | Generaciones más rápidas, **más tokens**. |

### 4.1 Cadena de fallback (mismo oficio)

| Pedimos | Si no está en el picker |
|---|---|
| **Opus 5** | Opus 4.8 → Opus 4.7. Nunca Fable. |
| **GPT 5.6 Luna** | GPT 5.5 solo si Luna no existe (más lento, mismo tipo de edit). |
| **GPT 5.6 Terra** | Sonnet 5 + Higher (audit más caro, menos “consistency”). |
| **GPT 5.5** | Sonnet 5 + Light (copy peor; no pases a Sol). |
| **Sonnet 5** | Siempre debería estar. Es el default oficial. |

### 4.2 Veto absoluto

| Modelo | Help / Update | Por qué no en Arbour QA |
|---|---|---|
| **Fable 5** | *Most proactive. Goes beyond the brief.* First drafts, sistemas nuevos. | Rediseña. Opus 5 ya iguala su score de nav a mitad de créditos. |
| **GPT 5.6 Sol** | *Refined creative output with minimal guidance.* 100% en el benchmark más duro. | Mínima guía = cambia la esencia. |
| Cualquier “proactive / creative / uncensored” que aparezca | — | Mismo riesgo. |

### 4.3 Por qué cada modelo permitido

| Modelo | Oficio oficial | Oficio en este pack |
|---|---|---|
| **GPT 5.6 Luna** | CMS grande + find-replace cross-site | Schema, slugs, binds, teléfonos/URLs en componentes |
| **GPT 5.5** | Copy-heavy | Canon 1999 / grammar / numeración. No layout. |
| **GPT 5.6 Terra** | Audits grandes, consistency, menor coste | SEO/a11y metadata + hygiene final |
| **Sonnet 5** | Default. Layout, edits cotidianos, diseño eficiente | Hover, type tags, swap de 6 fotos (juicio visual barato) |
| **Opus 5** | Plan largo, juicio visual, multi-paso | Detail page Territories, Form nativo, páginas legales que deben *parecer* Arbour |

---

## 5. Reasoning y Fast Mode

Oficial (12 ago 2026): el picker incluye **reasoning**. Solo dos valores documentados.

| Valor oficial | Texto Framer | Usar |
|---|---|---|
| **Light** | *Quick edits and refinements* | Un dato, un hover, un find-replace, copy puntual, 6 imágenes |
| **Higher** | *More room to plan before building* | Schema CMS, páginas nuevas, forms, semántica site-wide, audit+fix |

Si tu UI dice **Low / Medium / High**: Light = Low, Higher = High. **No uses Medium.**

**Fast Mode = Off en las 12 fases.** Oficial: más rápido y más tokens. Aquí el coste de un mal plan (rediseño, `/code`, 404 nuevos) es peor que esperar. Higher reasoning + Fast Mode no se combinan en este pack.

---

## 6. Matriz cerrada (qué pulsar)

Fast Mode = Off en todas. Branch = `marketplace-qa`. Chat = New Chat.

| Fase | Trabajo | Modelo | Reasoning | Skill | Si la skill no está | @ / context | Prohibido extra |
|---|---|---|---|---|---|---|---|
| **01** | Notes: slugs humanos, 7 items, 404 del journal | **GPT 5.6 Luna** | **Higher** | **`/cms`** | No aplica (oficial) | @Notes @Home @Contact + collection Notes | `/code` |
| **02** | Teléfonos + socials en overlay/footer | **GPT 5.6 Luna** | **Light** | **`/component`** | No aplica | Overlay, Footer, @Contact | `/cms` (no son collections) |
| **03** | Copy canon 1999 / grammar / números | **GPT 5.5** | **Light** | **Ninguna** | — | @Home @About @Properties @Notes | `/cms` `/component` `/code` |
| **04** | Properties: coords, rooms, featured vs index | **GPT 5.6 Luna** | **Higher** | **`/cms`** | No aplica | Property detail template + collection | `/code` |
| **05A** | Territories collection + 4 items | **GPT 5.6 Luna** | **Higher** | **`/cms`** | No aplica | @Neighbourhoods, Properties (refs) | Canvas layout en este chat |
| **05B** | Detail page Territories (look Arbour) | **Opus 5** | **Higher** | **`/component`** | `/layout` si existe; si no, chat plano + Opus | Property detail como *referencia* visual | `/code` Fable Sol |
| **06** | Heroes/fotos = copy (no Manhattan, no garage) | **Sonnet 5** | **Light** | **`/cms`** | No aplica | 6 property items + 4 territories | Luna (va rápido y elige mal la foto) |
| **07** | `lang`, favicon, OG, alts, titles únicos | **GPT 5.6 Terra** | **Higher** | **`/seo`** | Chat plano (Agents `#seo`) | Site Settings + todas las páginas | `/cms` (no mutar schema) |
| **08** | Form Contact, newsletter labels, filtros | **Opus 5** | **Higher** | **`/component`** | Chat plano + Opus | @Contact, Home newsletter, Properties filters | **`/code`** |
| **09** | Hover / pressed en links y cards | **Sonnet 5** | **Light** | **`/component`** | Chat plano + Sonnet | Nav, cards, VIEW ALL | `/style` (no retocar paleta) |
| **10** | Tags header/nav/main/footer, H1, line-height | **Sonnet 5** | **Higher** | **`/layout`** | Chat plano + Sonnet | Layout templates, text styles | Nueva typeface, 4º breakpoint |
| **11** | Privacy/Cookies + contraste AA | **Opus 5** | **Higher** | **`/component`** | Chat plano + Opus | Footer, heroes, CLEAR | `/style` como paleta nueva |
| **12A** | Audit links/a11y/hygiene y fix mínimo | **GPT 5.6 Terra** | **Higher** | **`/audit`** | Chat plano (Agents `#audit`) | Proyecto entero | Rediseño, `/code` nuevo |
| **12B** | Template Agent Instructions para el comprador | **Sonnet 5** | **Light** | **Ninguna** | — | Site Settings / Template instructions | Cambiar el look “para el Agent” |

**05B y 12B son New Chat aparte.** No reciclar 05A ni 12A.

---

## 7. Por qué esa terna (fase a fase)

**01 Luna + Higher + `/cms`** — Help Luna: CMS updates. Higher: hay que planear slug/bind antes de borrar el item del 404.

**02 Luna + Light + `/component`** — Help Luna: find-replace cross-site (tres teléfonos, tres socials). Light: no hay schema. Overlay = componente con variants.

**03 GPT 5.5 + Light + ninguna** — Help 5.5: copy-heavy. Sin skill para no abrir CMS/componentes. Si un string está bound a CMS, **no lo reescribas aquí**: anótalo y déjalo a 01/04.

**04 Luna + Higher + `/cms`** — Seis detalles con coords/rooms hardcodeados. Schema + bind, no copy.

**05A Luna + Higher + `/cms`** — Help: collection + items primero, páginas después.

**05B Opus 5 + Higher + `/component`** — Help Opus: juicio visual multi-paso. La detail page tiene que parecer Arbour, no un blog genérico. Fable vetado aunque el benchmark de nav sea similar.

**06 Sonnet 5 + Light + `/cms`** — Seis (más four) swaps. El cuello es visual (Chelsea ≠ skyline), no throughput. Luna elegiría Unsplash rápido y mal. Opus sobra y retoca layout.

**07 Terra + Higher + `/seo`** — Help Terra: audits/consistency. Agents `#seo`: titles, descriptions, OG, alt. Higher: site-wide sin picar H1.

**08 Opus 5 + Higher + `/component`** — Form nativo + estados + labels + filtros. Academy: código solo si el canvas no puede. Canvas puede.

**09 Sonnet 5 + Light + `/component`** — Hover = variants. Edit cotidiano. Higher no hace falta.

**10 Sonnet 5 + Higher + `/layout`** — Help Sonnet: layout direction. Higher: mapa de tags sin romper stacks. No Opus: no es página nueva.

**11 Opus 5 + Higher + `/component`** — Páginas legales nuevas + scrim de contraste. Deben heredar Header/Footer/type. Opus planifica; Fable las haría “más expresivas”.

**12A Terra + Higher + `/audit`** — Copy oficial: *scans … broken links, accessibility, inconsistencies, then fixes them.* Terra es el modelo de audit.

**12B Sonnet 5 + Light + ninguna** — Instructions para el Agent del comprador. No es un audit y no debe reabrir el canvas.

---

## 8. Si el Agent se desvía

| Síntoma | Qué hacer |
|---|---|
| Cambia Fraunces, cream, padding, 404 | Stop. New Chat. No continues. Baja a **Sonnet 5 + Light**. Nunca Fable/Sol “para arreglarlo”. |
| Escribe un code component | Stop. New Chat. **`/component`** + “native Form / native variant only”. |
| Toca páginas de otra fase | Stop. New Chat. Solo `@` de esa fase. |
| Fast Mode se encendió solo | Apágalo. Re-lanza el mismo prompt en chat nuevo. |
| Picker sin Luna / Terra / Opus 5 | Usa la cadena de la §4.1. No sustituyas por Sol/Fable. |

---

## 9. Fuentes (oficiales primero)

1. [Choosing a model](https://www.framer.com/help/articles/choosing-a-model-in-the-framer-agent/) — 7 ago 2026  
2. [Agents: Reasoning and Fast Mode](https://www.framer.com/updates/agent-reasoning-and-fast-mode) — 12 ago 2026  
3. [Opus 5](https://www.framer.com/updates/opus-5) — 28 jul 2026  
4. [GPT 5.6 Sol, Terra, Luna](https://www.framer.com/updates/gpt-5-6) — 9 jul 2026  
5. [framer.com/agents](https://www.framer.com/agents/) — skills `/cms` `/component` `/code`, `@`, chats, branches  
6. [CMS with Agents](https://www.framer.com/help/articles/how-to-add-content-to-your-cms-with-framer-agents/)  
7. [Build from scratch](https://www.framer.com/help/articles/how-to-build-a-website-from-scratch-with-framer-agents/)  
8. [Branches](https://www.framer.com/help/articles/how-to-use-branches-in-framer/)  
9. [AI-ready template](https://www.framer.com/help/articles/build-ai-ready-template/)  
10. [Template requirements](https://www.framer.com/template-requirements/)  
11. Academy: [layout/style](https://www.framer.com/academy/lessons/framer-agents-generation-layout-style), [content/CMS](https://www.framer.com/academy/lessons/framer-agents-content-scale)

Comunidad (no manda, solo confirma el menú `/`): [Bright Method](https://bybrightstudios.com/thebrightmethod/framer-agents-a-practical-guide-for-2026), [yoframer](https://yoframer.com/framer-updates/framer-agents-branching-community-update/).
