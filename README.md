# BuiltByKern

Studio repo for Framer Marketplace templates and components. Canvas work stays in Framer; this tree holds source, agent packs, and listing notes.

Marketplace truth as of 1 Sep 2026. Prices are listing prices only — no remix or sale counts.

## Layout

```
templates/     Live templates, plus the Drift Plane pack
components/    Live Marketplace components
```

## Live templates

| Listing | Price | Path | What lives here |
|---|---|---|---|
| **Arbour** | $59 | [`templates/arbour/`](templates/arbour/) | Marketplace audit, listing checklist, Framer Agent prompts, preview screenshots. Preview: https://arbour.framer.website |
| **Halden Photographer** | $29 | [`templates/halden/`](templates/halden/) | Photography portfolio (pannable plane, split project pages) plus a local Vite preview of the same structure. |

## Live components

| Listing | Path | What lives here |
|---|---|---|
| **Filling Point** | [`components/filling-point/`](components/filling-point/) | Live Marketplace component (`Kern_FillingPoint.tsx`) plus the exit-origin spec and plan. |
| **Drift Plane** | [`templates/drift/`](templates/drift/) | Live Marketplace component. This folder is the visual system, CMS CSVs, and in-canvas prompts around Drift Plane — not an unreleased template. |

## Local preview (Halden Photographer)

```bash
cd templates/halden
npm install
npm run dev
```
