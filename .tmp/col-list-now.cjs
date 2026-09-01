const list = await framer.agent.serializeNodes({
    ids: ["Q6fE1RPzM", "WQLkyLRf1", "Fyj0MwAfG"],
    depth: 2,
})
console.log(JSON.stringify(list, null, 2).slice(0, 14000))
