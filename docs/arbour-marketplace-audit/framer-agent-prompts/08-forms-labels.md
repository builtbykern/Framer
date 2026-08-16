# Fase 08 — Forms, labels, success/error

**Objetivo (Help):** Accessibility + Links. Cierra **M6**. Form fields clearly labeled; interactive elements recognizable. Labels en newsletter + filtros; success/error; **Form nativo** en Contact (name, email, message, property interest). Native Form — no `/code`.

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **Opus 5** (si no: **Opus 4.8**, luego **4.7**. Nunca Fable) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/component`** |
| @ | `@Contact` `@Home` `@Properties` |
| Context | Newsletter block; Properties filters; Contact hero |
| **Prohibido** | **`/code`**, Fable, Sol, Fast Mode |

Opus: form + estados success/error + encaje visual. Native Framer Form.

## Prompt (después de constraints)

```
/component

Forms and labels only. Use native Framer Form. Do not write a code component.

1. Home newsletter: visible label (or aria-label) for the email field — not placeholder-only. Placeholder may stay “your@email.com”. Submit needs a success state and an error state (invalid/empty). Keep SUBSCRIBE → styling.

2. Properties filters: STATUS, AREA, BUDGET FROM, BUDGET TO, BEDROOMS, CLEAR must have associated labels (the existing small caps labels can be the real labels). Do not break filter logic.

3. Contact page currently has mailto only. Add a native enquiry form in the existing cream editorial language:
   - Name, Email, Message, optional Property interest
   - Labels on every field
   - Submit in existing button style
   - Success + error states
   Keep the mailto / tel blocks. Do not replace the headline “The first conversation stays between us.”

British English. No extra sections, no new colors except existing olive/charcoal/cream/lime if already used.

List components created and which pages they sit on.
```

## Definition of done

- Newsletter: label + success visible al enviar test.
- Contact: form nativo, no solo mailto.
- Filtros siguen funcionando (fase 04).

## No tocar

Headline de Contact, paleta nueva, `/code`, extra breakpoint, 404. Publicar main.

## Verificación humana

Desktop 1440 · Tablet 768 · Phone 390. Newsletter: label + success. Contact: form nativo. Filtros intactos.

## Siguiente

Chat nuevo → fase 09.
