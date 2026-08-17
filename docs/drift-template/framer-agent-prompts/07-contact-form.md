# Fase 07 — Contact + Form nativo

**Objetivo:** Form nativo de Framer en `/contact`. No code component de formulario.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Opus 5** (fallback 4.8 → 4.7) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/component`** |
| @ | `@Contact` |
| No usar | Fable, Sol, **`/code`**, página nueva |

Opus: Help — forms nativos, multi-paso. Higher: labels + success/error.

## Prompt (después de constraints)

```
/component

Build Contact `/contact` only. Paper, Nav closedOnLight (centered BrandRoll VALE↔MENU). Native Framer Form — not a code component, not an embed.

Copy:
- Kicker (Label): Contact
- Lead (Lead style): Enquiries: studio@vale.work with mailto:studio@vale.work

Form fields (Label style for labels, Body for inputs, 1px line as border-bottom only, radius 0, no boxes, no fill):
- Name — text, required, autocomplete name
- Email — email, required, autocomplete email
- Inquiry — select: People, Place, Commission, Other (default Other)
- Message — textarea, required
- Submit button text: Send (Label style, no fill pill)

Success state: “Received. Vale will write back from the studio address.”
Error/empty: native validation is enough; do not invent a red theme.

Do not add a map, newsletter, or second form. Do not add Privacy.

Report: that the Form is the native Framer Form, field names, success copy.
```

## Definition of done

- Form nativo, 4 campos + Send.
- mailto en el lead.
- Success copy canon.

## No tocar

Home. Work. Info list. `/code`.

## Verificación humana

Submit vacío = validación. Submit OK = success. 390 usable.

## Siguiente

Chat nuevo → fase 08.
