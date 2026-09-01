const token = await framer.agent.getNode({
    id: "38f71e00-788a-47bd-a813-10d6b48f262b",
})
if (token.attributes.light !== "rgb(247, 241, 232)") {
    throw new Error(`paper token ${token.attributes.light}`)
}

const files = await framer.getCodeFiles()
const menu = files.find((f) => f.name === "Menu_Paper_Reveal.tsx")
const grain = files.find((f) => f.name === "Paper_Grain.tsx")
if (!menu?.content.includes('data-halden-paper-grain="true"')) {
    throw new Error("menu missing frozen grain")
}
if (!menu.content.includes("0.05")) {
    throw new Error("menu grain not 5%")
}
if (!grain) throw new Error("Paper_Grain.tsx missing")

const info = await framer.agent.getNode({ id: "rT9WGdFVR" })
const grainKid = (info.children || []).find((c) => c.id === "i4aFUkETP")
if (!grainKid) throw new Error("Work info missing Paper Grain")
if (grainKid.attributes.pointerEvents !== "none") {
    throw new Error("grain captures pointer")
}
if (grainKid.attributes.position !== "absolute") {
    throw new Error(`grain position ${grainKid.attributes.position}`)
}

const menuInst = await framer.agent.getNode({ id: "YZqtWqBlB" })
const paper = String(menuInst.attributes["$control__paper"] || "")
if (!paper.includes("38f71e00-788a-47bd-a813-10d6b48f262b")) {
    throw new Error(`menu paper not token: ${paper}`)
}

const home = await framer.agent.getNode({ id: "WQLkyLRf1" })
function walk(node, acc) {
    acc.push({
        id: node.id,
        type: node.type,
        name: node.attributes?.name,
        component: node.attributes?.component,
    })
    for (const child of node.children || []) walk(child, acc)
}
const homeNodes = []
walk(home, homeNodes)
const homeGrain = homeNodes.filter(
    (n) =>
        n.name === "Paper Grain" ||
        String(n.component || "").includes("Qdi6E01")
)
if (homeGrain.length) throw new Error("grain on Home")

const drift = homeNodes.find((n) => n.name === "Drift Plane" || String(n.component || "").includes("Og5966a"))
console.log(
    JSON.stringify({
        ok: true,
        paper: token.attributes.light,
        workGrain: grainKid.id,
        homeGrain: homeGrain.length,
        drift: drift?.id || null,
    })
)
