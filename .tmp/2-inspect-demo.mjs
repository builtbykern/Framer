const pagePath = "/"
const desktopId = "WQLkyLRf1"
const ser = await framer.agent.serialize({ id: desktopId, depth: 5 }, { pagePath })
console.log(JSON.stringify(ser, null, 2))
