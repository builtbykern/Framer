const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const root = await framer.agent.getNode({ id: "fpoP3kuA4" }, { pagePath: "/work/:Work" })
const children = (root?.children || []).map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    width: c.attributes?.width,
    height: c.attributes?.height,
}))

const home = await framer.agent.getNode({ id: "augiA20Il" }, { pagePath: "/" })
const homeKids = (home?.children || []).map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
}))

console.log(
    JSON.stringify({ project: info.name, work: children, homeKids }, null, 2)
)
