# Fase 13A — Hygiene audit

**Objetivo:** Links, layers, styles, 3 breakpoints, reduced motion. Fix mínimo. Sin rediseñar. Sin páginas nuevas.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **GPT 5.6 Terra** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/audit`**. Si no está: chat plano (Agents `#audit`) |
| @ | proyecto entero |
| No usar | Fable, Sol, `/code` nuevo, Index, Privacy, Lummi extra |

Terra: Help — *scans broken links, accessibility, inconsistencies, then fixes them.*

## Prompt (después de constraints)

```
/audit

Audit then fix only hygiene. Do not change art direction. Do not create pages.

Scan for:
- Broken internal links (only the real 404 page should 404)
- Plane cards that do not open /work/{slug}
- Empty CMS items; more or fewer than 7 published Work, 7 Tags, or 21 Credits
- Flattened Credit1 / Tag1 fields on Work (must not exist — credits live in Credits, chips in Tags)
- Default layer names (Frame 1, Rectangle 2) — rename
- Unused styles, unused pages (Index, Privacy, Journal must not exist — delete if you created them earlier)
- Hamburger, plus, X, Close, MENU, or Info/Contact sitting in the top bar (must be centered BrandRoll: one word VALE, auto-roll loop, no hover). Do not insert LetterRollMenu
- Missing reduced-motion
- Images without alt that are not decorative
- Hardcoded colors that should be the five color styles
- Leftover Unsplash or “My Framer Site”
- Creator promo / framer.com/@ links
- Do not add a 12px full-screen frost or Custom Code view-transition snippet. If leftover frost Custom Code is present, flag it for the human to delete (you cannot edit Site Settings Custom Code)
- Performance: uncompressed giants, blur >6 except the Scrim (6px)

Fix what you can without visual change. Report what you fixed and what needs a human.

Do not write Template Agent Instructions in this chat. Do not publish.
```

## Definition of done

- Informe en el chat. 7 Work, 7 Tags, 21 Credits. 3 breakpoints. Links del plane OK.

## No tocar

Look (Syne, paper, split, plane).

## Verificación humana

Walkthrough Desktop/Tablet/Phone. Form submit. 7 details.

## Siguiente

Chat nuevo → fase 13B.
