# Fase 12 — Lummi (humano primero, luego bind)

**No correr esta fase** hasta que Home, detail, Info, Contact y 404 se recorran bien con placeholders.

**Objetivo:** Un set de **production stills** coherente. Shot list: [`12-lummi-prompts.md`](12-lummi-prompts.md). Look: [`00-visual-system.md`](00-visual-system.md) §6. Plugin Lummi. Bind Cover + Gallery + Plane. Cero Unsplash.

Licencia: Lummi permite templates Framer comerciales ([license](https://www.lummi.ai/license), [Framer app](https://www.lummi.ai/apps/framer)).

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Parte humana (antes del chat)

1. Plugins → Lummi. Photoreal only.
2. Abrir [`12-lummi-prompts.md`](12-lummi-prompts.md). Por slug: **1 cover + 5 gallery**. Pegar PREFIX + LOOK + SHOT + NEGATIVE. Un still por generación. Aspecto del shot. No un prompt genérico por serie.
3. Cover 16:9 excepto After the Sitting y Red Room Brief (4:5). Gallery: no repetir el cover. ~2400px lado largo.
4. Archivos: `Work/{slug}/{slug}-cover`, `{slug}-01` … `{slug}-05`.
5. En el detail: stills **sin crop**. En el plane: cover-crop del componente.
6. Si un still parece stock, beauty o CGI: regenerar esa toma, no la serie entera.

## Configuración del chat

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Sonnet 5** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **`/cms`** |
| @ | Work items, Drift Plane on Home |
| No usar | Unsplash, Visual Electric, cambiar layout, Fable, Sol, object-fit cover en la gallery del detail |

## Prompt (después de constraints)

```
/cms

The human has imported Lummi stills into Work/{slug}/. Bind them. Do not change layout. Do not use Unsplash. Do not crop the detail gallery (height auto).

For each Work item: Cover + Gallery of 5 stills (plus cover). Then set the Drift Plane array images to the same Covers; keep the seven CMS detail links.

Alts: “Still from {Title}, {one factual noun phrase}.” Not “image1”.

All 7 Featured remain true. Do not add Work items. Do not edit Tags or Credits.

Report: each slug → cover asset → gallery count (must be 5) → plane href.
```

## Definition of done

- Mismo cover en plane y CMS.
- Gallery stack, sin crop, 5 stills, look de still (no 3D).
- 42 archivos: 7 covers + 35 gallery.

## Verificación humana

Las 7. ¿Alguna parece stock sonriente o render? Regenerar esa toma.

## Siguiente

Chat nuevo → fase 13A.
