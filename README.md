# BuiltByKern

Studio repo for Framer templates and code components. Canvas work stays in Framer; this tree holds source, agent packs, and Marketplace notes for the live templates.

## Layout

```
templates/     Framer templates and agent packs
components/    Reusable Framer code components
```

## Templates

| Name | Path | What lives here |
|---|---|---|
| **Arbour** | [`templates/arbour/`](templates/arbour/) | Named live template. Marketplace audit, listing checklist, Framer Agent prompts, preview screenshots. Preview: https://arbour.framer.website |
| **Halden** | [`templates/halden/`](templates/halden/) | Named live template. Photography portfolio (pannable plane, split project pages) plus a local Vite preview of the same structure. |
| **Drift** | [`templates/drift/`](templates/drift/) | Template agent pack around Drift Plane: visual system, CMS CSVs, in-canvas prompts. |

Arbour and Halden are the named live templates. Drift is an agent pack in this repo, not another live listing name.

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
