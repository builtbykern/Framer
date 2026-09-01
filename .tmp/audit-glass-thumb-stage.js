const stage = await framer.agent.serialize(
    { id: "MKhInCtAf", depth: 4 },
    { pagePath: "/thumbnail" }
)
console.log(JSON.stringify(stage, null, 2).slice(0, 8000))

const homeStage = await framer.agent.serialize(
    { id: "J6H0w3tE9", depth: 2 },
    { pagePath: "/" }
)
console.log(
    "home stage kids",
    (homeStage.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        w: c.attributes?.width,
        h: c.attributes?.height,
    }))
)

const pub = await framer.getPublishInfo()
console.log("publish", JSON.stringify(pub))
console.log("changes", typeof framer.getPendingChanges === "function" ? "fn" : "no")
