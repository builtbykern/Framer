const s = await framer.agent.serialize({ id: "KraraKF0A", depth: 2 }, {})
const a = s.attributes || {}
const all = await framer.getNodesWithType("ComponentInstanceNode")
const hits = []
for (const n of all) {
    const name = String(n.name || "")
    const cid = String(n.componentIdentifier || "")
    if (/Principal|Profile/i.test(name) || /PrincipalProfile|N3JdxU0gM/i.test(cid)) {
        const ser = await framer.agent.serialize({ id: n.id, depth: 1 }, {})
        hits.push({
            id: n.id,
            name,
            cid: cid.slice(0, 80),
            w: ser.attributes?.width ?? null,
            mw: ser.attributes?.maxWidth ?? null,
        })
    }
}

// Also search component id from pp
const pp = (await framer.getNodesWithType("ComponentNode")).find((c) => c.name === "Arbour_PrincipalProfile")
const ppId = pp?.id
for (const n of all) {
    if (String(n.componentIdentifier || "").includes(ppId)) {
        const ser = await framer.agent.serialize({ id: n.id, depth: 1 }, {})
        hits.push({
            id: n.id,
            name: n.name,
            via: "ppId",
            w: ser.attributes?.width ?? null,
            mw: ser.attributes?.maxWidth ?? null,
        })
    }
}

return {
    howWeRead: {
        keys: Object.keys(a).sort(),
        stackDirection: a.stackDirection ?? null,
        justifyContent: a.justifyContent ?? null,
        alignItems: a.alignItems ?? null,
        gap: a.gap ?? null,
        width: a.width ?? null,
        maxWidth: a.maxWidth ?? null,
        pad: a.padding ?? null,
        kids: (s.children || []).map((c) => ({
            name: c.name,
            id: c.id,
            w: c.attributes?.width ?? null,
            mw: c.attributes?.maxWidth ?? null,
        })),
    },
    ppId,
    hits,
}
