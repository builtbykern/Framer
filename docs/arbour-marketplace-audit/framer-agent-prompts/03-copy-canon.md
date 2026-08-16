# Fase 03 — Copy canon (1999, grammar, numeración)

Cierra **M1 / M2** y copy rota. Help Text: spelling/grammar; no placeholder; balanced text.

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **GPT 5.5** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | ninguna, o **`/cms`** si el copy vive en CMS |
| @ | `@Home` `@About` `@Properties` `@Notes` Site Settings |
| Context | About EST. 2018; Home stats 26 yrs; Home featured numbers; meta descriptions |
| No usar | Fable, Sol, Opus (no hace falta juicio visual), `/code` |

GPT 5.5: Help — *copy-heavy work*. Light: reemplazos de texto, no layout.

## Prompt (después de constraints)

```
Copy-only pass. Do not change layout, type sizes, colors, or images.

Canon:
- The agency was founded in 1999.
- The stat “26 yrs” / “INDEPENDENT 26 yrs” stays.
- Replace every “EST. 2018” and “Est. 2018” with “EST. 1999”.
- Site/page descriptions that say “since 1999” are correct; keep them.

Home featured residences:
- If the Home list is limited to 3, the label must say featured (e.g. “03 FEATURED — LONDON & COUNTRY”), not imply the whole stock.
- Card numbers must be ( 01 ) ( 02 ) ( 03 ) — never two cards labelled ( 02 ).
- Each featured card needs the same VIEW → treatment (Cheyne Walk already has it; Frognal and Bibury must match the component).

Fix remaining grammar without rewriting the brand voice. Known broken line on Home journal:
“Market that rewards speed, patience is the rarest luxury. Note on and the right address.”
must become the Contact version:
“A market that rewards speed makes patience the rarest luxury — the right address is worth the wait.”
(If phase 01 already bound this from CMS, verify the CMS excerpt — do not overlay static text.)

British English throughout. No American theater/judgment spelling where the site already uses theatre/judgement.

List every string you changed.
```

## Definition of done

- Cero “2018” como año de fundación.
- Home featured 01–03 únicos.
- Journal excerpt gramaticalmente correcto.

## Siguiente

Chat nuevo → fase 04.
