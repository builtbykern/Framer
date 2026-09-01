/**
 * Inspect fills + widths for suspected non-adapted sections across all pages.
 */
const CONTENT = [
    "/",
    "/properties",
    "/neighbourhoods",
    "/notes",
    "/about",
    "/contact",
    "/properties/:slug",
    "/notes/:slug",
]

function fillOf(a = {}) {
    return {
        bg: a.backgroundColor ?? null,
        fill: a.fill ?? null,
        mw: a.maxWidth ?? null,
        w: a.width ?? null,
        h: a.height ?? null,
        pad: a.padding ?? null,
    }
}

const pages = await framer.getNodesWithType("WebPageNode")
const out = []

for (const path of CONTENT) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    // Desktop only for fill comparison; depth 3
    const ser = await framer.agent.serialize({ id: p.id, depth: 3 }, {})
    const desk = (ser.children || []).find((b) => /Desktop/i.test(b.name || ""))
    if (!desk) continue
    for (const top of desk.children || []) {
        if (/Atmosphere|Nav|Cue/i.test(top.name || "")) continue
        const row = {
            path,
            name: top.name,
            id: top.id,
            ...fillOf(top.attributes || {}),
            kids: (top.children || []).map((k) => ({
                name: k.name,
                id: k.id,
                ...fillOf(k.attributes || {}),
            })),
        }
        out.push(row)
    }
}

// PrincipalProfile detail
const comps = await framer.getNodesWithType("ComponentNode")
const pp = comps.find((c) => c.name === "Arbour_PrincipalProfile")
let ppDetail = null
if (pp) {
    const ser = await framer.agent.serialize({ id: pp.id, depth: 4 }, {})
    ppDetail = (ser.children || []).map((v) => ({
        name: v.name,
        id: v.id,
        ...fillOf(v.attributes || {}),
        kids: (v.children || []).map((k) => ({
            name: k.name,
            id: k.id,
            ...fillOf(k.attributes || {}),
        })),
    }))
}

return { sections: out, ppDetail }
