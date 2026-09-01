const pagerIds = [
    "r7a29NJU9",
    "LSqc1L2WHr7a29NJU9",
    "Tf2mbU7Bvr7a29NJU9",
]
const pagers = await framer.agent.serializeNodes({
    ids: pagerIds,
    depth: 4,
    attributeFilter: [
        "name",
        "text",
        "link",
        "linkStylePreset",
        "fontName",
        "fontSize",
        "textTransform",
        "position",
        "left",
        "centerAnchorX",
    ],
})

const checks = pagers.map((pager) => {
    const descendants = []
    const walk = (node, parent) => {
        descendants.push({ node, parent })
        for (const child of node.children || []) walk(child, node)
    }
    for (const child of pager.children || []) walk(child, pager)
    const indexLinks = descendants.filter(
        (entry) => entry.node.name === "Index"
    )
    const entry = indexLinks[0]
    const link = entry?.node
    const readText = (node) =>
        [node.attributes?.text, ...(node.children || []).map(readText)]
            .filter(Boolean)
            .join("")
    return {
        pager: pager.id,
        count: indexLinks.length,
        pass:
            indexLinks.length === 1 &&
            link.type === "RichTextNode" &&
            readText(link) === "INDEX" &&
            link.attributes?.link?.href === "/" &&
            link.attributes?.linkStylePreset === "Info Link" &&
            link.attributes?.fontName === "IBM Plex Mono" &&
            link.attributes?.fontSize === "11px" &&
            link.attributes?.textTransform === "uppercase" &&
            entry.parent?.name === "Index Center" &&
            entry.parent?.attributes?.position === "absolute",
    }
})

console.log(JSON.stringify(checks, null, 2))
if (checks.length !== pagerIds.length || checks.some((check) => !check.pass)) {
    throw new Error("Work Home return is incomplete")
}
