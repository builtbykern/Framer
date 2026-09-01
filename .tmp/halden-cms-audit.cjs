const pick = (n) => {
    if (!n) return null
    const a = n.attributes || n
    return {
        id: n.id,
        name: n.name || a.name,
        type: n.type,
        w: a.width,
        h: a.height,
        vis: a.visible,
        controls: {
            view: a["$control__view"],
            workList: a["$control__workList"],
            cMS: a["$control__cMS"],
        },
        fills: a.backgrounds || a.fill || a.background,
        text: typeof a.text === "string" ? a.text.slice(0, 80) : a.text,
        vars: Object.fromEntries(
            Object.entries(a).filter(
                ([k, v]) =>
                    k.includes("variable") ||
                    (typeof v === "string" && String(v).includes("var(--"))
            )
        ),
        children: (n.children || []).map((c) => ({
            id: c.id,
            name: c.name || c.attributes?.name,
            type: c.type,
            w: c.attributes?.width,
            h: c.attributes?.height,
            vis: c.attributes?.visible,
        })),
    }
}

const ids = {
    desktopBp: "augiA20Il",
    tabletBp: "BjqrvIntT",
    phoneBp: "nyI5jW7lA",
    plane: "RV7bjlgdh",
    surface: "URKicPmXy",
    list: "H9TnltXVB",
}

const out = { instances: {}, list: null, card: null, cover: null, title: null, year: null, type: null, stills: null }

for (const [label, id] of [
    ["desktopPlane", "augiA20IlRV7bjlgdh"],
    ["tabletPlane", "BjqrvIntTRV7bjlgdh"],
    ["phonePlane", "nyI5jW7lARV7bjlgdh"],
    ["desktopList", "augiA20IlH9TnltXVB"],
    ["tabletList", "BjqrvIntTH9TnltXVB"],
    ["phoneList", "nyI5jW7lAH9TnltXVB"],
    ["primaryList", "H9TnltXVB"],
    ["primaryPlane", "RV7bjlgdh"],
]) {
    try {
        const n = await framer.agent.getNode({ id }, { pagePath: "/" })
        out.instances[label] = pick(n)
    } catch (e) {
        out.instances[label] = String(e)
    }
}

const dumpVars = (node) => {
    if (!node) return null
    const a = node.attributes || {}
    const interesting = {}
    for (const [k, v] of Object.entries(a)) {
        if (
            k.startsWith("$control") ||
            k.includes("variable") ||
            k === "text" ||
            k === "backgrounds" ||
            k === "fill" ||
            k === "visible" ||
            k === "width" ||
            k === "height" ||
            k === "name" ||
            k === "collectionList" ||
            (typeof v === "string" && v.includes("var(--"))
        ) {
            interesting[k] = v
        }
    }
    return { id: node.id, type: node.type, name: node.name, interesting, kids: node.children?.length }
}

try {
    const list = await framer.agent.getNode({ id: "H9TnltXVB" }, { pagePath: "/" })
    out.list = dumpVars(list)
    out.listKids = (list?.children || []).map((c) => ({
        id: c.id,
        name: c.name || c.attributes?.name,
        type: c.type,
        vis: c.attributes?.visible,
        collectionItem: c.attributes?.collectionItem || c.attributes?.link,
    }))
} catch (e) {
    out.list = String(e)
}

const hunt = ["nt9Gs3MMs", "gSGwySyKV", "XwtyrQVdF", "FddpNYFNF", "KSgxSNQ22"]
out.named = {}
for (const id of hunt) {
    try {
        const n = await framer.agent.getNode({ id }, { pagePath: "/" })
        out.named[id] = dumpVars(n)
    } catch (e) {
        out.named[id] = String(e)
    }
}

console.log(JSON.stringify(out, null, 2))
