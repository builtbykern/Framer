# BuiltByKern

Studio repo for Framer templates and code components. Canvas work stays in Framer; this tree holds source, agent packs, and the Marketplace checklist for the live Arbour template.

## Layout

```
templates/     Framer template packs and prototypes
components/    Reusable Framer code components
```

## Templates

| Name | Path | What lives here |
|---|---|---|
| **Arbour** | [`templates/arbour/`](templates/arbour/) | Named live template. Marketplace audit, listing checklist, Framer Agent prompts, preview screenshots. Preview: https://arbour.framer.website |
| **Halden** | [`templates/halden/`](templates/halden/) | Photography portfolio prototype (pannable plane, split project pages). |
| **Drift** | [`templates/drift/`](templates/drift/) | Template agent pack around Drift Plane: visual system, CMS CSVs, in-canvas prompts. |

Arbour is the named live template. Halden and Drift are packs/prototypes in this repo, not extra live listing names.

## Components

| Name | Path | What lives here |
|---|---|---|
| **Kern Filling Point** | [`components/filling-point/`](components/filling-point/) | Framer code component (`Kern_FillingPoint.tsx`) plus the exit-origin spec and plan. |

## Local preview (Halden)

```bash
cd templates/halden
npm install
npm run dev
```
