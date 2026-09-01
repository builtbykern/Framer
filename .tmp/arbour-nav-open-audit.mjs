/**
 * Audit Nav open/close variants — structure, width 90%, padding, drawer layout.
 */
const comps = await framer.getNodesWithType("ComponentNode")
const nav = comps.find((c) => c.name === "Nav")
if (!nav) return { err: "no Nav" }

function slim(n, d = 0) {
    if (!n || d > 5) return null
    const a = n.attributes || {}
    return {
        name: n.name || "(x)",
        id: n.id,
        w: a.width ?? null,
        mw: a.maxWidth ?? null,
        h: a.height ?? null,
        pad: a.padding ?? null,
        pos: a.position ?? null,
        fill: a.fill ? String(a.fill).slice(0, 48) : null,
        opacity: a.opacity ?? null,
        visible: a.visible ?? null,
        align: a.stackAlignment ?? null,
        dist: a.stackDistribution ?? null,
        dir: a.stackDirection ?? null,
        gap: a.gap ?? null,
        kids: (n.children || []).map((c) => slim(c, d + 1)),
    }
}

const ser = await framer.agent.serialize({ id: nav.id, depth: 6 }, {})
const variants = (ser.children || []).map((v) => slim(v))

// Flag issues on open variants
const issues = []
for (const v of variants) {
    const isOpen = /open/i.test(v.name || "")
    const top = (v.kids || []).find((k) => k.name === "top")
    const container = (v.kids || []).find((k) => k.name === "container")
    if (top) {
        if (top.w === "90%" || top.mw === "90%") {
            const pad = String(top.pad || "")
            if (/\s(48|40|16|24|32)px\s|\s(48|40|16|24|32)px$/.test(pad) && !/0px/.test(pad.split(/\s+/)[1] || "")) {
                // crude: if second token isn't 0
                const parts = pad.trim().split(/\s+/)
                const r = parts.length >= 2 ? parts[1] : parts[0]
                if (r && r !== "0px" && r !== "0") {
                    issues.push({ variant: v.name, kind: "top-hpad", pad, w: top.w })
                }
            }
        }
        if (isOpen && top.w !== "90%" && top.mw !== "90%") {
            issues.push({ variant: v.name, kind: "top-not-90", w: top.w, mw: top.mw })
        }
    }
    if (isOpen && container) {
        issues.push({
            variant: v.name,
            kind: "container-snapshot",
            w: container.w,
            mw: container.mw,
            h: container.h,
            pad: container.pad,
            kids: (container.kids || []).map((k) => k.name),
        })
    }
}

return { variantNames: variants.map((v) => v.name), variants, issues }
