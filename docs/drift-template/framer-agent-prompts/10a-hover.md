# Fase 10A — Hover / pressed

**Objetivo:** Variants hover y pressed en Nav, chips, filas de Info, Submit. Phone sin hover.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Sonnet 5** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **`/component`** |
| @ | Nav, Info list, Contact submit, chips, 404 links |
| No usar | Fable, Sol, `/code`, `/style` (no paleta nueva) |

## Prompt (después de constraints)

```
/component

Add hover and pressed variants only. Do not restyle the template.

- Plus (closed): hover opacity ~0.7. Phone: hover off
- Overlay links Info/Contact (variant open): hover opacity ~0.7. Pressed slightly lower
- Overlay Close and VALE: same
- Info title rows: hover opacity or underline
- Detail chips: no jump; optional opacity
- Contact Send: hover opacity
- 404 links: same as overlay links
- Plane cards: if the code component already has hover scale, leave it. Do not add CSS that fights the component

Interactive elements must look clickable. Do not add new colors outside the five styles.

Report: components/variants you added.
```

## Definition of done

- Hover visible en Desktop. Phone sin hover stuck.
- Links reconocibles.

## No tocar

Layout, CMS, fotos.

## Verificación humana

1440 hover Nav. 390 tap Info.

## Siguiente

Chat nuevo → fase 10B.
