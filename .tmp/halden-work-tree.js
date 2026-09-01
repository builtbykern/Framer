const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

function slim(n, depth = 0) {
    if (!n || depth > 4) return n
    const kids = (n.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        vis: c.attributes?.visible,
        w: c.attributes?.width,
        h: c.attributes?.height,
        componentId: c.componentIdentifier || c.attributes?.componentIdentifier,
        controls: c.controls
            ? Object.fromEntries(
                  Object.entries(c.controls)
                      .filter(([k]) =>
                          /image|still|cover|gallery|max|file/i.test(k)
                      )
                      .slice(0, 12)
              )
            : undefined,
        children: depth < 3 ? (c.children || []).slice(0, 12).map((k) => slim(k, depth + 1)) : undefined,
    }))
    return {
        id: n.id,
        name: n.name,
        type: n.type,
        vis: n.attributes?.visible,
        w: n.attributes?.width,
        h: n.attributes?.height,
        children: kids,
    }
}

const desktop = await framer.agent.getNode(
    { id: "rtJNTCNFr", depth: 5 },
    { pagePath: "/work/:Work" }
)
const phone = await framer.agent.getNode(
    { id: "Tf2mbU7Bv", depth: 4 },
    { pagePath: "/work/:Work" }
)

console.log(
    JSON.stringify(
        {
            project: info.name,
            desktop: slim(desktop),
            phoneTop: (phone?.children || []).map((c) => ({
                id: c.id,
                name: c.name,
                type: c.type,
                vis: c.attributes?.visible,
                h: c.attributes?.height,
                w: c.attributes?.width,
            })),
        },
        null,
        2
    )
)
