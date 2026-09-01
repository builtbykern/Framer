const h = await framer.agent.serialize(
    { id: "SpJLywBKC", depth: 0 },
    { pagePath: "/" }
)
console.log(
    JSON.stringify({
        name: h.name,
        content: h.attributes?.["$control__content"],
        look: h.attributes?.["$control__look"],
        layout: h.attributes?.["$control__layout"],
        motion: h.attributes?.["$control__motion"],
        w: h.attributes?.width,
        ht: h.attributes?.height,
    }).slice(0, 1500)
)
