const instIds = ["lG0XIx4Ew", "VRBMO9k6V"]
const insts = []
for (const id of instIds) {
    const n = await framer.getNode(id)
    insts.push(
        n
            ? {
                  id: n.id,
                  name: n.name,
                  cls: n.__class,
                  comp: n.componentIdentifier,
                  insertURL: n.insertURL,
                  controls: n.controls,
                  w: n.width,
                  h: n.height,
                  position: n.position,
              }
            : { id, missing: true },
    )
}

// component variables on PrincipalProfile
const vars = await framer.agent.serialize({ id: "GViAPxZ97", depth: 2 }, {})
const desk = (vars.children || []).find((c) => c.name === "Desktop")

// Agents CMS
const collections = await framer.getCollections?.() || []
let agents = null
try {
    const cols = await framer.getCollections()
    agents = cols
        .filter((c) => /agent|principal|team/i.test(c.name || ""))
        .map((c) => ({ id: c.id, name: c.name, fields: c.fields?.map((f) => f.name) }))
} catch (e) {
    agents = String(e)
}

// read component variables API
let componentVars = null
try {
    const comp = await framer.getNode("GViAPxZ97")
    componentVars = {
        id: comp?.id,
        name: comp?.name,
        keys: comp ? Object.keys(comp) : [],
    }
} catch (e) {
    componentVars = String(e)
}

return {
    insts,
    deskDir: desk?.attributes?.stackDirection,
    deskGap: desk?.attributes?.gap,
    agents,
    componentVars,
}
