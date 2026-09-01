const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const nodes = [
    { id: "WQLkyLRf1", pagePath: "/", name: "homeD" },
    { id: "rtJNTCNFr", pagePath: "/work/:Work", name: "workD" },
    { id: "nyI5jW7lA", pagePath: "/", name: "homeP" },
    { id: "Tf2mbU7Bv", pagePath: "/work/:Work", name: "workP" },
    { id: "nACIEuvcP", pagePath: "/404", name: "errD" },
    { id: "BjqrvIntT", pagePath: "/", name: "homeT" },
    { id: "LSqc1L2WH", pagePath: "/work/:Work", name: "workT" },
]
const sizes = []
for (const n of nodes) {
    const node = await framer.agent.getNode({ id: n.id }, { pagePath: n.pagePath })
    const a = node?.attributes || {}
    sizes.push({
        name: n.name,
        id: n.id,
        w: a.width,
        h: a.height,
        type: node?.type,
    })
}

const homeKids = await framer.agent.serialize(
    { id: "nyI5jW7lA", depth: 2, attributeFilter: ["name", "componentId"] },
    { pagePath: "/" }
)

console.log(JSON.stringify({ sizes, homeKids }, null, 2))
