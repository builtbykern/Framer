/**
 * 1) About Beat 1 Opening Image — replace Home terrace dupe with office atlas image
 * 2) Properties Hero Copy — L top air under fixed Nav (align Contact)
 */
const NL = String.fromCharCode(10)
const ABOUT_HERO_IMG =
    "https://framerusercontent.com/images/OGqGIs0ySta1iznVWkCeDYSBw.jpg"

const pages = await framer.getNodesWithType("WebPageNode")
const about = pages.find((p) => p.path === "/about")
const serA = await framer.agent.serialize({ id: about.id, depth: 6 }, {})

const lines = []
const notes = []

for (const bp of serA.children || []) {
    function walk(n) {
        if (!n) return
        if (n.name === "Opening Image Field") {
            const fill = n.attributes?.fill || ""
            if (String(fill).includes("5Ytxn8avZFwlwp4Ng3t8PDU56Lk")) {
                lines.push(`SET ${n.id} fill="${ABOUT_HERO_IMG}";`)
                notes.push(`${bp.name} Opening Image Field → office atlas`)
            }
        }
        for (const c of n.children || []) walk(c)
    }
    walk(bp)
}

// Properties Hero Copy air
const propsPads = [
    { id: "L9uNRqah7", pad: "128px 48px 64px 48px", note: "Properties Hero Copy Desktop" },
    { id: "SScKalu3BL9uNRqah7", pad: "96px 40px 48px 40px", note: "Properties Hero Copy Tablet" },
    { id: "EK6d5SyWLL9uNRqah7", pad: "64px 16px 48px 16px", note: "Properties Hero Copy Phone" },
]
for (const p of propsPads) {
    lines.push(`SET ${p.id} padding="${p.pad}";`)
    notes.push(p.note)
}

const result = await framer.agent.applyChanges(lines.join(NL), {})
return { notes, lines, result }
