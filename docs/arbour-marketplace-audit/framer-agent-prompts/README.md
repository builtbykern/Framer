# Cómo correr este pack

## Orden

1. Lee [`00-agent-setup.md`](00-agent-setup.md) (modelo, reasoning, skills).
2. Confirma [`00-source-of-truth.md`](00-source-of-truth.md).
3. En Framer: **New Branch** → `marketplace-qa`.
4. Fases **01 → 12**. Cada una = **New Chat**.
5. Por chat: picker (modelo + reasoning + Fast Off) → `/` skill → `@` + layers → pega constraints → pega el prompt.
6. Revisa Desktop / Tablet / Phone. Luego la siguiente fase.
7. Al terminar 12: Review Changes → Apply to main → publicar preview.

No lances dos fases en el mismo chat. Oficial: *Start a new one for each task to keep the agent focused.*

## Hallazgos que estos prompts cierran

Ver [`../AUDIT.md`](../AUDIT.md). Blockers primero (404, teléfonos, socials), luego CMS, assets, a11y.

## Si el Agent se desvía

- New Chat. No “sigue pero sin rediseñar” en el mismo hilo.
- Baja a Sonnet 5 + Light si se puso creativo.
- Nunca cambies a Fable 5 / GPT 5.6 Sol para “arreglar” un fallo.
