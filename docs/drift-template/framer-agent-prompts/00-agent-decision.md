# Decisión — Agent interno de Framer (Drift)

Solo el **Agent tab** del editor. No External Agents, no Cursor, no `@framer/agent` CLI.

Este archivo es la ficha del picker. Los prompts 01–13B están alineados con ella.

Fuentes: [How to build with Agents](https://www.framer.com/help/articles/how-to-build-a-website-from-scratch-with-framer-agents/), [Choosing a model](https://www.framer.com/help/articles/choosing-a-model-in-the-framer-agent/) (7 ago 2026), [Reasoning and Fast Mode](https://www.framer.com/updates/agent-reasoning-and-fast-mode) (12 ago 2026), [CMS with Agents](https://www.framer.com/help/articles/how-to-add-content-to-your-cms-with-framer-agents/), [AI-ready template](https://www.framer.com/help/articles/build-ai-ready-template/), [Template requirements](https://www.framer.com/template-requirements/), [Agents toolkit](https://www.framer.com/agents/).

---

## 1. Qué es este Agent

El Agent interno edita el proyecto en el canvas: layers, componentes, CMS, estilos, SEO. Todo lo que hace queda como Framer nativo.

| Hecho | Fuente |
|---|---|
| Vive en el tab Agent | [framer.com/agents](https://www.framer.com/agents/) |
| Un chat = un trabajo | *Start a new one for each task to keep the agent focused.* |
| `@` = páginas, CMS, styles, assets | Mentions |
| Layers seleccionados = context | Add to Agent |
| Branch antes de tocar | [Branches](https://www.framer.com/help/articles/how-to-use-branches-in-framer/) |
| Skills = menú `/` | `/cms` `/component` `/code` y las que liste el menú |
| Modelo + reasoning en el picker | Help choosing a model; Updates 12 ago 2026 |

**No usar:** Claude Code / Cursor / Codex vía [External Agents](https://www.framer.com/agents/external/).

---

## 2. Orden de clics (cada fase)

1. Branch **`template-build`** (una vez). Insertar a mano el code component **Drift Plane** antes de la fase 03.
2. **New Chat**.
3. **Modelo** de la matriz.
4. **Reasoning** Light o Higher.
5. **Fast Mode = Off**.
6. `/` → solo la skill de la fase. Si no está en el menú, no inventes el slash; pega el prompt en chat plano.
7. `@` → páginas / collections de la fase. Selecciona layers → Add to Agent.
8. Pega [`00-constraints.md`](00-constraints.md). El look está en [`00-visual-system.md`](00-visual-system.md).
9. Pega el prompt de la fase.
10. Revisa Desktop 1440 / Tablet 768 / Phone 390. Si se desvía: **New Chat**. No “sigue pero sin rediseñar”.

---

## 3. Skills

### Oficiales

| Escribes | Oficio | En Drift |
|---|---|---|
| **`/cms`** | Collections, fields, items, slugs, bind | 02, 05, 12 |
| **`/component`** | Componentes, variants, Form nativo, Nav | 03, 07, 09A, 10A |
| **`/code`** | React code component | **Solo 09B.** Snap en el Plane existente. Nunca reescribir el pan. |

### Si el menú `/` las lista

| Skill | Fases | No usar para |
|---|---|---|
| `/layout` | 01, 04, 10B | Rediseñar Home con otro hero, 4º breakpoint |
| `/style` | 01 (si no hay `/layout`) | Nueva paleta después de 01 |
| `/seo` | 11 | Reescribir H1 de marca |
| `/audit` | 13A | Empezar el proyecto, pass creativo |

Nunca pegues un slash que no viste en el menú de ese chat.

### Sin skill

| Fase | Por qué |
|---|---|
| 06, 08 | Copy + layout menor en páginas ya creadas |
| 13B | Template Agent Instructions, no canvas look |

### Veto de skills

| Veto | Motivo |
|---|---|
| `/code` en 01–08, 10–13 | Native first. Gallery stack, Form, hover = canvas |
| Dos skills en el mismo chat | Un trabajo por chat. 09, 10 y 13 van partidos |
| `/audit` o `/seo` al inicio | Reescriben el sitio |

---

## 4. Modelos

Help (7 ago 2026): **Sonnet 5, Opus 4.7, GPT 5.5, Fable 5, GPT 5.6 Sol / Terra / Luna**. Updates: **Opus 5** (28 jul 2026).

### Cadena de fallback

| Pedimos | Si no está |
|---|---|
| **Opus 5** | Opus 4.8 → Opus 4.7. Nunca Fable. |
| **GPT 5.6 Luna** | GPT 5.5 (más lento, mismo tipo de edit) |
| **GPT 5.6 Terra** | Sonnet 5 + Higher |
| **GPT 5.5** | Sonnet 5 + Light |
| **Sonnet 5** | Default oficial. Siempre debería estar. |

### Veto absoluto

| Modelo | Por qué no en Drift |
|---|---|
| **Fable 5** | *Goes beyond the brief.* Inventa Index, vídeo, otro home. |
| **GPT 5.6 Sol** | Creativo con poca guía. Cambia la esencia (split, paleta). |

### Oficio en este pack

| Modelo | Help | Aquí |
|---|---|---|
| **Sonnet 5** | Layout, edits cotidianos | 01 styles/shells, 06 Info, 08 404, 10, 12 bind Lummi, 13B |
| **Opus 5** | Plan largo, juicio visual, multi-paso | 03 Home (plane+nav), 04 detail split, 07 Form, 09B code |
| **GPT 5.6 Luna** | CMS + find-replace | 02 Tags/Work/Credits, 05 binds, 09A links |
| **GPT 5.6 Terra** | Audits, consistency | 11 SEO, 13A hygiene |
| **GPT 5.5** | Copy-heavy | No hay fase solo-copy; fallback de Luna |

---

## 5. Reasoning y Fast Mode

| Valor | Texto Framer | Usar |
|---|---|---|
| **Light** | Quick edits | Un bind, Info/404 copy, hover, Lummi bind, instructions |
| **Higher** | Plan before building | Schema CMS, páginas nuevas, Home, split, Form, SEO, audit, `/code` |

Si la UI dice Low / Medium / High: Light = Low, Higher = High. **No uses Medium.**

**Fast Mode = Off en todas las fases.** Oficial: más tokens, peor plan.

---

## 6. Matriz (qué pulsar)

Fast Mode = Off. Branch = `template-build`. Chat = New Chat.

| Fase | Trabajo | Modelo | Reasoning | Skill |
|---|---|---|---|---|
| **01** | Color + 5 text styles + shells | **Sonnet 5** | **Higher** | **`/layout`** (o `/style`) |
| **02** | Tags + Work + Credits (7 / 7 / 21), sin Lummi | **Luna** | **Higher** | **`/cms`** |
| **03** | Home: Drift Plane + Nav onDark | **Opus 5** | **Higher** | **`/component`** |
| **04** | Work detail split paper/ink | **Opus 5** | **Higher** | **`/layout`** |
| **05** | Bind campos + Gallery stack | **Luna** | **Higher** | **`/cms`** |
| **06** | Info: bio + lista de títulos CMS | **Sonnet 5** | **Light** | **Ninguna** |
| **07** | Contact Form nativo | **Opus 5** | **Higher** | **`/component`** |
| **08** | 404 custom | **Sonnet 5** | **Light** | **Ninguna** |
| **09A** | Array del Plane → links CMS | **Luna** | **Light** | **`/component`** |
| **09B** | Solo si no hay snap: `/code` layout plane\|snap | **Opus 5** | **Higher** | **`/code`** |
| **10A** | Hover/pressed Nav y chips | **Sonnet 5** | **Light** | **`/component`** |
| **10B** | Tags header/main, reduced motion | **Sonnet 5** | **Higher** | **`/layout`** |
| **11** | lang, titles, OG, alts | **Terra** | **Higher** | **`/seo`** |
| **12** | Bind Lummi (humano elige antes) | **Sonnet 5** | **Light** | **`/cms`** |
| **13A** | Audit hygiene | **Terra** | **Higher** | **`/audit`** |
| **13B** | Template Agent Instructions | **Sonnet 5** | **Light** | **Ninguna** |

**09B, 10B, 13B = New Chat aparte.** No reciclar el hilo anterior.

---

## 7. Esfuerzo (créditos, orden de magnitud)

Base Help: GPT 5.5 = 1×. Luna ~0.4×, Sonnet/Terra ~0.6×, Opus 5 ~1.2×. Higher gasta más que Light.

Ops típicas en base: small ~50 · large ~100 · página ~150–300.

| Fase | ≈ créditos | Banda |
|---|---|---|
| 01 | ~90–150 | Medio (Higher + shells) |
| 02 | ~60–90 | Medio (Luna, 3 collections) |
| 03 | ~150–240 | Alto (Opus Home) |
| 04 | ~150–240 | Alto (Opus split) |
| 05 | ~40–60 | Bajo |
| 06 | ~30–50 | Bajo |
| 07 | ~120–240 | Alto (Form) |
| 08 | ~30 | Bajo |
| 09A | ~20–40 | Mínimo |
| 09B | ~120–200 | Alto, **solo si hace falta** |
| 10A | ~30–60 | Bajo |
| 10B | ~60–90 | Medio |
| 11 | ~60–90 | Medio |
| 12 | ~30–60 | Bajo (bind, no generar fotos) |
| 13A | ~60–120 | Medio |
| 13B | ~30 | Bajo |

Pack sin 09B: **aprox. 900–1.600 créditos**. Lo caro es 03, 04, 07.

---

## 8. Si el Agent se desvía

| Síntoma | Qué hacer |
|---|---|
| Inventa Index, Privacy, vídeo, lightbox | Stop. New Chat. Constraints otra vez. |
| Pone Unsplash o Lummi antes de 12 | Stop. Quita las fotos. Placeholders sólidos. |
| Reescribe el Drift Plane | Stop. New Chat. Prohibido `/code` hasta 09B. |
| Fable/Sol/Fast Mode | Apaga. New Chat con el modelo de la matriz. |
| Cambia Syne / paper / 3 breakpoints | Stop. New Chat. Sonnet 5 + Light. |
| Picker sin Opus 5 / Luna / Terra | Cadena §4. Nunca sustituyas por Sol/Fable. |
