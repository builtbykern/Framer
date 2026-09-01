const kids = async (id) => {
    const n = await framer.agent.getNode({ id }, { pagePath: "/" })
    if (!n) return { id, missing: true }
    const a = n.attributes || {}
    return {
        id: n.id,
        name: n.name || a.name,
        type: n.type,
        w: a.width,
        h: a.height,
        children: (n.children || []).map((c) => ({
            id: c.id,
            name: c.name || c.attributes?.name,
            type: c.type,
            vis: c.attributes?.visible,
            w: c.attributes?.width,
            h: c.attributes?.height,
            slot: c.attributes?.["$control__workList"],
            view: c.attributes?.["$control__view"],
            cl: c.attributes?.collectionList?.collection,
        })),
    }
}

const out = {
    desktop: await kids("augiA20Il"),
    tablet: await kids("BjqrvIntT"),
    phone: await kids("nyI5jW7lA"),
    surfaceD: await kids("URKicPmXy").catch((e) => String(e)),
    surfaceT: await kids("BjqrvIntTURKicPmXy").catch((e) => String(e)),
    surfaceP: await kids("nyI5jW7lAURKicPmXy").catch((e) => String(e)),
}

console.log(JSON.stringify(out, null, 2))
