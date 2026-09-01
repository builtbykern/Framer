const pages = await framer.getNodesWithType("WebPageNode")
const notes = pages.find((p) => p.path === "/notes")
const ser = await framer.agent.serialize({ id: notes.id, depth: 4 }, {})
const desk = (ser.children || []).find((c) => c.name === "Desktop")
const tops = (desk.children || []).map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
}))
const atmSer = (desk.children || []).find((c) => c.name === "Atmosphere")

let viaFramer = null
try {
    viaFramer = await framer.getNode(atmSer.id)
} catch (e) {
    viaFramer = String(e).slice(0, 200)
}

let viaAgent = null
try {
    viaAgent = await framer.agent.getNode({ id: atmSer.id }, {})
} catch (e) {
    viaAgent = String(e).slice(0, 200)
}

// Try DUPE from properties noise into notes via applyChanges
const props = pages.find((p) => p.path === "/properties")
const propsSer = await framer.agent.serialize({ id: props.id, depth: 3 }, {})
const propsDesk = (propsSer.children || []).find((c) => c.name === "Desktop")
const propsAtm = (propsDesk.children || []).find((c) => c.name === "Atmosphere")
const goldNoise = (propsAtm?.children || []).find((c) => c.name === "Arbour_NoiseEffect")

return {
    tops,
    atmSer: {
        id: atmSer?.id,
        kids: (atmSer?.children || []).map((c) => ({ id: c.id, name: c.name })),
    },
    viaFramer:
        viaFramer && typeof viaFramer === "object"
            ? { id: viaFramer.id, name: viaFramer.name, cls: viaFramer.__class }
            : viaFramer,
    viaAgent: viaAgent && typeof viaAgent === "object" ? { id: viaAgent.id, name: viaAgent.name } : viaAgent,
    goldNoiseId: goldNoise?.id,
    notesPageId: notes.id,
    deskId: desk.id,
}
