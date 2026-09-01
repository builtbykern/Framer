const list = await framer.agent.serialize({
    id: "yAd2lMDSW",
    depth: 2,
})
console.log(JSON.stringify(list, null, 2).slice(0, 8000))
