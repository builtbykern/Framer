# Cómo correr este pack

Ficha de picker (modelo, reasoning, skill, por qué): [`00-agent-decision.md`](00-agent-decision.md).

## Orden

1. Lee [`00-agent-decision.md`](00-agent-decision.md) y confirma [`00-source-of-truth.md`](00-source-of-truth.md).
2. En Framer: **New Branch** → `marketplace-qa`.
3. Fases **01 → 12B**. Cada una = **New Chat**. 05 y 12 tienen dos chats (A luego B).
4. Por chat: modelo + reasoning + Fast Off → `/` skill → `@` + layers → constraints → prompt.
5. Revisa Desktop / Tablet / Phone. Luego la siguiente fase.
6. Al terminar 12B: Review Changes → Apply to main → publicar preview.

No lances dos fases en el mismo chat. Oficial: *Start a new one for each task to keep the agent focused.*

## Hallazgos que estos prompts cierran

Ver [`../AUDIT.md`](../AUDIT.md). Blockers primero (404, teléfonos, socials), luego CMS, assets, a11y.

## Si el Agent se desvía

- New Chat. No “sigue pero sin rediseñar” en el mismo hilo.
- Baja a Sonnet 5 + Light.
- Nunca Fable 5 / GPT 5.6 Sol / Fast Mode / `/code`.
