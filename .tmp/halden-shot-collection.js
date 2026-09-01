const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const shots = await framer.agent.screenshot({
    nodeIds: ["BjqrvIntT", "gSGwySyKV"],
    pagePath: "/",
})
console.log(JSON.stringify(shots, null, 2))
