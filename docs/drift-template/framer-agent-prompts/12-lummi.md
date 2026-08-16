# Fase 12 — Lummi (humano primero, luego bind)

**No correr esta fase** hasta que Home, detail, Info, Contact y 404 se recorran bien con placeholders.

**Objetivo:** Un set de **production stills** coherente. Look y prompts: [`00-visual-system.md`](00-visual-system.md) §6. Plugin Lummi. Bind Cover + Gallery + Plane. Cero Unsplash.

Licencia: Lummi permite templates Framer comerciales ([license](https://www.lummi.ai/license), [Framer app](https://www.lummi.ai/apps/framer)).

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Parte humana (antes del chat)

1. Plugins → Lummi. Photoreal cinematic stills, muted colour, no illustration, no 3D toy, no HDR tourist, no smile-to-camera headshots.
2. Por slug: **1 cover** + **4–6 gallery**. Color en las 7 (nada de mezclar B&W). Cover landscape 3:2 o 16:9 excepto After the Sitting (portrait 4:5). Gallery aspectos mezclados. ~2400px max.
3. Prompts (pegar tal cual):

**Salt Light**  
`Cinematic production still, 35mm, coastal hour, Atlantic concrete terrace and sea, blue hour turning to night, muted colour, no people looking at camera, no text, wide still from a short film`

**The Waiting Room**  
`Cinematic production still, municipal lobby after hours, fluorescent lights, empty chairs, wrong wall clock, institutional beige-green, photoreal, muted, no stock smile`

**Glass Hours**  
`Cinematic still, contemporary house that is mostly sky, glass interior, daylight as weather not furniture, architecture photography mood, muted colour, no cars, no logos`

**Inland Signal**  
`Cinematic still, inland heat, empty two-lane road, dry grass, long afternoon, photoreal muted, no billboards, no tourists`

**After the Sitting**  
`Quiet portrait still, person not posing for a brand, after a sitting, window light, clothes they chose, photoreal, muted colour, no beauty retouch, no studio cyclorama`

**Red Room Brief**  
`Fashion still as a private afternoon, fabric in a rented room, daylight, not a campaign set, photoreal muted, no logos, no runway`

**Night Atlas**  
`Night still, fog on a closed roadside café, last cars, sodium and fog, photoreal cinematic, muted, no horror tropes, no text`

4. Archivos: `salt-light-cover`, `salt-light-01`… folder `Work/{slug}/`.
5. En el detail: stills **sin crop**. En el plane: cover-crop del componente.

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

For each Work item: Cover + Gallery 4–6. Then set the Drift Plane array images to the same Covers; keep the seven CMS detail links.

Alts: “Still from {Title}, {one factual noun phrase}.” Not “image1”.

All 7 Featured remain true.

Report: each slug → cover asset → gallery count → plane href.
```

## Definition of done

- Mismo cover en plane y CMS.
- Gallery stack, sin crop, 4–6 stills, look de still (no 3D).

## Verificación humana

Las 7. ¿Alguna parece stock sonriente o render? Regenerar esa serie.

## Siguiente

Chat nuevo → fase 13A.
