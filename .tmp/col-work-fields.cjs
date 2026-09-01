const work = await framer.agent.serializeNodes({
    ids: ["RPl1HxehC"],
    depth: 0,
})
console.log(JSON.stringify(work[0]?.variables, null, 2))
