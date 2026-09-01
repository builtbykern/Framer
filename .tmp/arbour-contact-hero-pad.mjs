const pages = await framer.getNodesWithType("WebPageNode")
const paths = ["/", "/contact", "/properties", "/notes", "/about", "/neighbourhoods"]
const rows = []

for (const path of paths) {
    const p = pages.find((x) => x.path === path)
    if (!p) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 5 }, {})
    for (const bp of ser.children || []) {
        function walk(n, depth) {
            if (!n || depth > 3) return
            const name = n.name || ""
            if (
                /^(Hero Section|Contact Hero|Properties Hero|Notes Hero|Neighbourhoods Hero|Beat 1|Property Hero)$/i.test(
                    name,
                ) ||
                (name.includes("Hero") && depth <= 2)
            ) {
                rows.push({
                    path,
                    bp: bp.name,
                    id: n.id,
                    name,
                    padding: n.attributes?.padding || null,
                    gap: n.attributes?.gap || null,
                    maxWidth: n.attributes?.maxWidth || null,
                    height: n.attributes?.height || null,
                    minHeight: n.attributes?.minHeight || null,
                })
            }
            for (const c of n.children || []) walk(c, depth + 1)
        }
        walk(bp, 0)
    }
}

// deeper contact hero children
const contact = pages.find((p) => p.path === "/contact")
const serC = await framer.agent.serialize({ id: contact.id, depth: 5 }, {})
const contactDeep = []
for (const bp of serC.children || []) {
    const hero = (bp.children || []).find((c) => c.name === "Contact Hero")
    if (!hero) continue
    contactDeep.push({
        bp: bp.name,
        hero: {
            id: hero.id,
            padding: hero.attributes?.padding,
            gap: hero.attributes?.gap,
            kids: (hero.children || []).map((c) => ({
                name: c.name,
                id: c.id,
                padding: c.attributes?.padding,
                gap: c.attributes?.gap,
            })),
        },
    })
}

return { rows, contactDeep }
