/**
 * About T/P: MOVE replicas within BP parent to gold shell + Beat 1→2→3 order.
 * Desktop Beats already fixed via setParent.
 */
const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const about = pages.find((p) => p.path === "/about")
const ser = await framer.agent.serialize({ id: about.id, depth: 2 }, {})

const lines = []
const notes = []

for (const bp of ser.children || []) {
    if (bp.name === "Desktop") {
        notes.push("Desktop: skip shell (ok); Beats already fixed")
        continue
    }
    const kids = bp.children || []
    const idOf = (pred) => kids.find((c) => pred(c.name || ""))?.id
    const load = idOf((n) => /LoadingScreen/i.test(n))
    const smooth = idOf((n) => /SmoothScroll/i.test(n))
    const atm = idOf((n) => n === "Atmosphere")
    const nav = idOf((n) => n === "Nav")
    const beat1 = idOf((n) => /Beat 1/i.test(n))
    const beat2 = idOf((n) => /Beat 2/i.test(n))
    const beat3 = idOf((n) => /Beat 3/i.test(n))
    const editorial = idOf((n) => /Editorial Pause/i.test(n))
    const principals = idOf((n) => /Principals/i.test(n))
    const offices = idOf((n) => /Two Offices/i.test(n))
    const enquiry = idOf((n) => /Enquiry CTA/i.test(n))
    const footer = idOf((n) => n === "Footer")

    const parent = bp.id
    // Desired: 0 Load, 1 Smooth, 2 Atm, 3 Nav, 4 Beat1, 5 Beat2, 6 Beat3,
    // 7 Editorial, 8 Principals, 9 Offices, 10 Enquiry, 11 Footer
    const order = [
        load,
        smooth,
        atm,
        nav,
        beat1,
        beat2,
        beat3,
        editorial,
        principals,
        offices,
        enquiry,
        footer,
    ].filter(Boolean)

    order.forEach((id, index) => {
        lines.push(`MOVE ${id} parent="${parent}" index="${index}";`)
    })
    notes.push(`${bp.name}: MOVE ${order.length} layers to gold order`)
}

const result = await framer.agent.applyChanges(lines.join(NL), {})

const verify = await framer.agent.serialize({ id: about.id, depth: 2 }, {})
const check = (verify.children || []).map((bp) => ({
    bp: bp.name,
    tops: (bp.children || []).map((c) => c.name),
}))

return { notes, lineCount: lines.length, result: result?.message || result, check }
