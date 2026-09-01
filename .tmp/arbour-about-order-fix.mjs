/**
 * Fix About:
 * 1) Tablet/Phone shell order → Loading, Smooth, Atmosphere, Nav, …, Footer
 * 2) Beat 2 before Beat 3 on all BPs
 */
const pages = await framer.getNodesWithType("WebPageNode")
const about = pages.find((p) => p.path === "/about")
const ser = await framer.agent.serialize({ id: about.id, depth: 2 }, {})

const notes = []

for (const bp of ser.children || []) {
    const kids = bp.children || []
    const byName = (name) => kids.find((c) => c.name === name)
    const load = byName("Arbour_LoadingScreen")
    const smooth = byName("Arbour_SmoothScroll")
    const atm = byName("Atmosphere")
    const nav = byName("Nav")
    const footer = byName("Footer")
    const beat1 = kids.find((c) => /Beat 1/i.test(c.name || ""))
    const beat2 = kids.find((c) => /Beat 2/i.test(c.name || ""))
    const beat3 = kids.find((c) => /Beat 3/i.test(c.name || ""))

    const parentId = bp.id

    // Shell gold order at front (T/P broken; Desktop already OK but re-apply safe)
    if (load && smooth && atm && nav) {
        await framer.setParent(load.id, parentId, 0)
        await framer.setParent(smooth.id, parentId, 1)
        await framer.setParent(atm.id, parentId, 2)
        await framer.setParent(nav.id, parentId, 3)
        notes.push(`${bp.name}: shell → Load/Smooth/Atm/Nav @ 0-3`)
    }

    // Re-read after shell moves
    const ser2 = await framer.agent.serialize({ id: about.id, depth: 2 }, {})
    const bp2 = (ser2.children || []).find((c) => c.id === bp.id) || bp
    const kids2 = bp2.children || []
    const b2 = kids2.find((c) => /Beat 2/i.test(c.name || ""))
    const b3 = kids2.find((c) => /Beat 3/i.test(c.name || ""))
    const b1 = kids2.find((c) => /Beat 1/i.test(c.name || ""))

    if (b1 && b2 && b3) {
        const i1 = kids2.findIndex((c) => c.id === b1.id)
        const i2 = kids2.findIndex((c) => c.id === b2.id)
        const i3 = kids2.findIndex((c) => c.id === b3.id)
        if (i2 > i3) {
            // Place Beat 2 right after Beat 1, Beat 3 after Beat 2
            await framer.setParent(b2.id, parentId, i1 + 1)
            // after move, Beat 3 should go to i1+2
            await framer.setParent(b3.id, parentId, i1 + 2)
            notes.push(`${bp.name}: Beat order → 1,2,3 (was 1,3,2)`)
        } else {
            notes.push(`${bp.name}: Beat order already 2 before 3`)
        }
    }

    // Footer last
    const ser3 = await framer.agent.serialize({ id: about.id, depth: 2 }, {})
    const bp3 = (ser3.children || []).find((c) => c.id === bp.id)
    const foot = (bp3?.children || []).find((c) => c.name === "Footer")
    if (foot) {
        const last = (bp3.children || []).length - 1
        await framer.setParent(foot.id, parentId, last)
        notes.push(`${bp.name}: Footer → last`)
    }
}

// Verify
const verify = await framer.agent.serialize({ id: about.id, depth: 2 }, {})
const check = (verify.children || []).map((bp) => ({
    bp: bp.name,
    tops: (bp.children || []).map((c) => c.name),
}))

return { notes, check }
