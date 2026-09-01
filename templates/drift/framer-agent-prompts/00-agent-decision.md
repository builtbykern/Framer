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
| **`/component`** | Componentes, variants, Form nativo, Nav | 03, 03B, 03C, 03D, 07, 09A, 10A |
| **`/code`** | React code component | **Nunca.** El Plane ya está insertado. Phone Home = Collection List nativo. |

### Si el menú `/` las lista

| Skill | Fases | No usar para |
|---|---|---|
| `/layout` | 01, 04, **09B**, 10B | Rediseñar Home desktop con otro hero, 4º breakpoint |
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
| `/code` en cualquier fase | Native first. Gallery stack, Form, hover, Phone rows = canvas |
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
| **Opus 5** | Plan largo, juicio visual, multi-paso | 03 Home, 03B Nav, 03C Open, 03D Settle, 04 detail, 07 Form, 09B Phone rows |
| **GPT 5.6 Luna** | CMS + find-replace | 02 Tags/Work/Credits, 05 binds, 09A links |
| **GPT 5.6 Terra** | Audits, consistency | 11 SEO, 13A hygiene |
| **GPT 5.5** | Copy-heavy | No hay fase solo-copy; fallback de Luna |

---

## 5. Reasoning y Fast Mode

| Valor | Texto Framer | Usar |
|---|---|---|
| **Light** | Quick edits | Un bind, Info/404 copy, hover, Lummi bind, instructions |
| **Higher** | Plan before building | Schema CMS, páginas nuevas, Home, Open visual, split, Form, SEO, audit, `/code` |

Si la UI dice Low / Medium / High: Light = Low, Higher = High. **No uses Medium.**

**Fast Mode = Off en todas las fases.** Oficial: más tokens, peor plan.

---

## 6. Matriz (qué pulsar)

Fast Mode = Off. Branch = `template-build`. Chat = New Chat.

| Fase | Trabajo | Modelo | Reasoning | Skill |
|---|---|---|---|---|
| **01** | Color + 5 text styles + shells | **Sonnet 5** | **Higher** | **`/layout`** (o `/style`) |
| **02** | Tags + Work + Credits (7 / 7 / 21), sin Lummi | **Luna** | **Higher** | **`/cms`** |
| **03** | Home: Drift Plane + BrandRoll VALE auto-roll | **Opus 5** | **Higher** | **`/component`** |
| **03B** | BrandRoll centrado + instancias Nav | **Opus 5** | **Higher** | **`/component`** |
| **03C** | Open visual: split 33/67 + still a sangre | **Opus 5** | **Higher** | **`/component`** |
| **03D** | Settle: Scrim 6px + bg baja (inverso al salir) | **Opus 5** | **Higher** | **`/component`** |
| **04** | Work detail split paper/ink | **Opus 5** | **Higher** | **`/layout`** |
| **05** | Bind campos + Gallery stack | **Luna** | **Higher** | **`/cms`** |
| **06** | Info: bio + lista de títulos CMS | **Sonnet 5** | **Light** | **Ninguna** |
| **07** | Contact Form nativo | **Opus 5** | **Higher** | **`/component`** |
| **08** | 404 custom | **Sonnet 5** | **Light** | **Ninguna** |
| **09A** | Array del Plane → links CMS | **Luna** | **Light** | **`/component`** |
| **09B** | Home Phone: una fila por serie (ocultar Plane) | **Opus 5** | **Higher** | **`/layout`** |
| **10A** | Hover/pressed Nav y chips | **Sonnet 5** | **Light** | **`/component`** |
| **10B** | Tags header/main, reduced motion | **Sonnet 5** | **Higher** | **`/layout`** |
| **11** | lang, titles, OG, alts | **Terra** | **Higher** | **`/seo`** |
| **12** | Bind Lummi (humano elige antes) | **Sonnet 5** | **Light** | **`/cms`** |
| **13A** | Audit hygiene | **Terra** | **Higher** | **`/audit`** |
| **13B** | Template Agent Instructions | **Sonnet 5** | **Light** | **Ninguna** |

**03B, 03C, 03D, 09B, 10B, 13B = New Chat aparte.** No reciclar el hilo.

---

## 7. Esfuerzo (créditos, orden de magnitud)

Base Help: GPT 5.5 = 1×. Luna ~0.4×, Sonnet/Terra ~0.6×, Opus 5 ~1.2×. Higher gasta más que Light.

Ops típicas en base: small ~50 · large ~100 · página ~150–300.

| Fase | ≈ créditos | Banda |
|---|---|---|
| 01 | ~90–150 | Medio (Higher + shells) |
| 02 | ~60–90 | Medio (Luna, 3 collections) |
| 03 | ~150–240 | Alto (Opus Home) |
| 03B | ~80–140 | Alto (Opus Nav instancias) |
| 03C | ~120–180 | Alto (Opus Open visual) |
| 03D | ~80–140 | Alto (Opus Settle) |
| 04 | ~150–240 | Alto (Opus split) |
| 05 | ~40–60 | Bajo |
| 06 | ~30–50 | Bajo |
| 07 | ~120–240 | Alto (Form) |
| 08 | ~30 | Bajo |
| 09A | ~20–40 | Mínimo |
| 09B | ~80–140 | Alto (Opus Phone rows) |
| 10A | ~30–60 | Bajo |
| 10B | ~60–90 | Medio |
| 11 | ~60–90 | Medio |
| 12 | ~30–60 | Bajo (bind, no generar fotos) |
| 13A | ~60–120 | Medio |
| 13B | ~30 | Bajo |

Pack: **aprox. 1.100–1.900 créditos**. Lo caro es 03, 03B, 03C, 03D, 04, 07, 09B.

---

## 8. Si el Agent se desvía

| Síntoma | Qué hacer |
|---|---|
| Inventa Index, Privacy, vídeo, lightbox | Stop. New Chat. Constraints otra vez. |
| Inventa hamburger, plus, X, Close, MENU, o links Info/Contact en la barra | Stop. New Chat. Canon 00-gregor-nav: BrandRoll centrado, un VALE, auto-roll. |
| Open es dos palabras en paper vacío, o plus/Close en la barra | Stop. New Chat. Fase 03C. Still ~67% a sangre. BrandRoll centro, VALE. |
| Inserta LetterRollMenu o usa Hover para el roll | Stop. Quita el componente. Un texto VALE. Loop, no hover. |
| Fade negro, Wipe, Push, o Layout Template | Stop. New Chat. Settle nativo (Scrim 6px + Y −32). |
| Velo Gregor 12px / Custom Code frost | Stop. 03D: Scrim 6px, paper 16%, bg baja. Borrar Custom Code. |
| Open o Work sin bajar el bg | Stop. New Chat 03D. MenuSurface / PageSurface y −32. |
| Pone Unsplash o Lummi antes de 12 | Stop. Quita las fotos. Placeholders sólidos. |
| Reescribe el Drift Plane o usa `/code` | Stop. New Chat. Phone = filas CMS, no snap. |
| Phone Home sigue siendo el Plane, o el listado sale en 1440 | Stop. New Chat 09B. |
| Fable/Sol/Fast Mode | Apaga. New Chat con el modelo de la matriz. |
| Cambia Syne / paper / 3 breakpoints | Stop. New Chat. Sonnet 5 + Light. |
| Picker sin Opus 5 / Luna / Terra | Cadena §4. Nunca sustituyas por Sol/Fable. |
