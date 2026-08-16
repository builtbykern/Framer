# Fase 02 — Teléfonos, email, socials (component variables)

Cierra **B2 / B3**. Help Links: `mailto:` / `tel:`; no broken/inactive. Help Support: *Advertisements and unrelated promotions have been removed.*

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **GPT 5.6 Luna** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **`/component`** |
| @ | Header / Nav overlay component, Footer, `@Contact` |
| Context | Overlay (open Menu), footer LEGAL/NAVIGATE/OFFICES, Contact tel/mailto |
| No usar | Fable, Sol, `/code` |

Light: find-replace de datos en componentes existentes. Luna: cross-site replacement.

## Prompt (después de constraints)

```
/component

Unify contact data across Header overlay, Footer, and Contact. Use component variables (or shared text) so buyers change this once.

Set exactly:
- Email enquiries@arbour.london with mailto:enquiries@arbour.london
- Mayfair +44 20 7946 0810 with tel:+442079460810
- Cotswolds +44 1608 649 220 with tel:+441608649220
- Overlay / header phone = Mayfair only. Remove +44 20 7351 8800 everywhere.
- Overlay labels Instagram, LinkedIn, X (Twitter) must link to:
  https://www.instagram.com/arbour.london
  https://www.linkedin.com/company/arbour-london
  https://x.com/arbourlondon
- Remove every href to https://www.framer.com/@builtbykern/

Do not restyle the overlay. Keep ARBOUR ©, menu items, and layout.
If socials cannot be real demo URLs, remove the three labels rather than pointing at Framer.

Scan the whole project for leftover 7351 8800 and @builtbykern. List remaining tel: and social hrefs.
```

## Definition of done

- Menu phone = 7946 0810 = Contact Mayfair.
- Tres socials ≠ framer.com.
- `tel:` y `mailto:` vivos.

## Siguiente

Chat nuevo → fase 03.
