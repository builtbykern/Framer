const pagePath = "/"
const pages = await framer.agent.getNodesOfTypes({ types: ["WebPageNode"] })
const page = await framer.agent.serialize({ id: "augiA20Il", depth: 4 }, { pagePath })
const instances = await framer.agent.getDescendantsOfTypes(
    { id: "augiA20Il", types: ["ComponentInstanceNode", "ShaderNode", "FrameNode", "RichTextNode"] },
    { pagePath }
)
const controls = await framer.agent.readComponentControls({
    componentIds: ["codeFile/NRC55li:default"],
})
console.log(
    JSON.stringify(
        {
            pages: pages.map((p) => ({ id: p.id, name: p.name, path: p.path })),
            pageBreakpoints: page?.$breakpoints ?? page?.attributes?.$breakpoints,
            pageKeys: Object.keys(page || {}),
            pageName: page?.name,
            pageAttrs: page?.attributes
                ? Object.keys(page.attributes).slice(0, 40)
                : null,
            children: (page?.children || []).map((c) => ({
                id: c.id,
                type: c.type,
                name: c.name,
                attrs: c.attributes
                    ? {
                          width: c.attributes.width,
                          height: c.attributes.height,
                          fill: c.attributes.fill,
                          layout: c.attributes.layout,
                          name: c.attributes.name,
                      }
                    : null,
                childCount: (c.children || []).length,
                kids: (c.children || []).slice(0, 12).map((k) => ({
                    id: k.id,
                    type: k.type,
                    name: k.name,
                    component: k.attributes?.component,
                    width: k.attributes?.width,
                    height: k.attributes?.height,
                    fill: k.attributes?.fill,
                })),
            })),
            instanceSummary: (instances || []).slice(0, 40).map((n) => ({
                id: n.id,
                type: n.type,
                name: n.name,
                component: n.attributes?.component,
            })),
            controlKeys: Object.keys(controls?.["codeFile/NRC55li:default"] || controls || {}).slice(0, 30),
        },
        null,
        2
    )
)
