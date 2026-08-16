# Cómo configurar el Agent interno (resumen)

La decisión cerrada (modelo, reasoning, skill, por qué, fallback) está en [`00-agent-decision.md`](00-agent-decision.md). Este archivo es el recordatorio de panel.

Fuentes: [Choosing a model](https://www.framer.com/help/articles/choosing-a-model-in-the-framer-agent/) · [Reasoning y Fast Mode](https://www.framer.com/updates/agent-reasoning-and-fast-mode) · [Opus 5](https://www.framer.com/updates/opus-5) · [Agents](https://www.framer.com/agents/) · [Branches](https://www.framer.com/help/articles/how-to-use-branches-in-framer/) · [Template requirements](https://www.framer.com/template-requirements/)

---

## Cada chat

1. **New Chat** — un trabajo ([Agents](https://www.framer.com/agents/)).
2. Branch `marketplace-qa`.
3. Modelo + Reasoning de la fase. **Fast Mode Off.**
4. `/` → skill de la fase. No pegues `/seo` `/audit` `/layout` si no están en el menú.
5. `@` + layers al chat.
6. Constraints → prompt.

Fallback de modelo: Opus 5 → 4.8 → 4.7. Luna/Terra/5.5/Sonnet según [`00-agent-decision.md`](00-agent-decision.md) §4.1. Nunca Fable 5 ni GPT 5.6 Sol.

Reasoning: Light o Higher. Si la UI dice Low/Medium/High: Light=Low, Higher=High. Sin Medium.

---

## Skills que sí usamos

| Skill | Fases |
|---|---|
| **`/cms`** | 01, 04, 05A, 06 |
| **`/component`** | 02, 05B, 08, 09, 11 |
| **`/seo`** si el menú la tiene | 07 |
| **`/layout`** si el menú la tiene | 10 (y 05B solo si falta `/component`) |
| **`/audit`** si el menú la tiene | 12A |
| **Ninguna** | 03, 12B |

**`/code`:** no. **`/style`:** no (no cambia paleta). Dos skills ≠ un chat.

---

## Matriz

| Fase | Modelo | Reasoning | Skill |
|---|---|---|---|
| 01 Notes CMS | GPT 5.6 Luna | Higher | `/cms` |
| 02 Contact/social | GPT 5.6 Luna | Light | `/component` |
| 03 Copy canon | GPT 5.5 | Light | ninguna |
| 04 Properties bind | GPT 5.6 Luna | Higher | `/cms` |
| 05A Territories CMS | GPT 5.6 Luna | Higher | `/cms` |
| 05B Territories page | Opus 5 | Higher | `/component` |
| 06 Assets vs copy | Sonnet 5 | Light | `/cms` |
| 07 SEO / lang / OG / alt | GPT 5.6 Terra | Higher | `/seo` o plano |
| 08 Forms | Opus 5 | Higher | `/component` |
| 09 Hover | Sonnet 5 | Light | `/component` |
| 10 Semantics / type | Sonnet 5 | Higher | `/layout` o plano |
| 11 Legal / contrast | Opus 5 | Higher | `/component` |
| 12A Hygiene audit | GPT 5.6 Terra | Higher | `/audit` o plano |
| 12B Buyer Agent instructions | Sonnet 5 | Light | ninguna |
