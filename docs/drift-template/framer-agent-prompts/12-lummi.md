# Fase 12 — Lummi (humano primero, luego bind)

**No correr esta fase** hasta que Home, detail, Info, Contact y 404 se recorran bien con placeholders.

**Objetivo:** Un set cinematográfico coherente (stills, no ilustración 3D genérica). Plugin Lummi. Luego bind Cover + Gallery + array del Plane. Cero Unsplash.

Licencia: Lummi permite uso en templates Framer comerciales ([license](https://www.lummi.ai/license), [Framer app](https://www.lummi.ai/apps/framer)). No revendidas como stock.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Parte humana (antes del chat)

1. Plugins → Lummi.
2. Para **cada** uno de los 7, 1 Cover + 4–6 Gallery stills. Misma temperatura: cine, luz, poca cara de stock corporate.
   - Salt Light — costa, hora azul
   - The Waiting Room — interior institucional
   - Glass Hours — arquitectura / cielo
   - Inland Signal — interior / carretera
   - After the Sitting — retrato quieto (foto)
   - Red Room Brief — interior / tela (identity)
   - Night Atlas — noche, niebla, carretera
3. Nombres de archivo claros: `salt-light-cover`, `salt-light-01`…
4. No mezclar ilustración cartoon ni 3D toy.

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
| No usar | Unsplash, Visual Electric, cambiar layout, Fable, Sol |

Sonnet: juicio visual al asignar. Light: no rediseñar.

## Prompt (después de constraints)

```
/cms

The human has imported Lummi stills into the project. Bind them. Do not change layout. Do not use Unsplash.

For each Work item, set Cover and Gallery (4–6 images, stacked). Use the assets named for that slug. Then set the Drift Plane array images to the same Covers, keeping the seven CMS detail links.

Alts: short, factual, English, e.g. “Still from Salt Light, coastal hour.” Not “image1”.

All 7 Featured remain true. Do not add items.

Report: each slug → cover asset name → gallery count → plane card link.
```

## Definition of done

- Plane y detail muestran las mismas covers Lummi.
- Gallery 4–6 por serie, stack.
- Cero Unsplash en Assets si puedes limpiar leftovers.

## No tocar

Split, Nav, Form, copy.

## Verificación humana

Los 7 details. Plane click. Performance panel (imágenes no gigantes).

## Siguiente

Chat nuevo → fase 13A.
