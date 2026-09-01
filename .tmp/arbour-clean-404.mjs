/**
 * Clean /404 desktop: remove duplicate shell instances; keep one Loading/Smooth/Atm/Nav/Footer.
 */
const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const p404 = pages.find((p) => p.path === "/404")
const ser = await framer.agent.serialize({ id: p404.id, depth: 3 }, {})

const keep = new Set([
    "mKKaHzn9C", // Loading
    "G9YpPymMA", // Smooth
    "NPRuv9IlG", // Atmosphere
    "P1XxzxZfp", // Nav Desktop
    "j4N1jForf", // content
    "WPVQdpynK", // Footer Desktop
])

const desktop = (ser.children || []).find((c) => c.name === "Desktop")
const del = []
for (const c of desktop.children || []) {
    if (!keep.has(c.id) && c.name !== "404 — Lost Address") {
        // only delete shell-ish duplicates
        if (
            /Loading|Smooth|Atmosphere|^Nav$|^Footer$/i.test(c.name || "")
        ) {
            del.push(c.id)
        }
    }
}

// Also fix keep Nav/Footer variants
const lines = del.map((id) => `DEL ${id};`)
lines.push(`SET P1XxzxZfp $control__variant="Desktop" position="fixed" top="0px" left="0px" width="100%" height="auto" zIndex="10";`)
lines.push(`SET WPVQdpynK $control__variant="Desktop";`)

// Reorder: Loading, Smooth, Atmosphere, Nav, content, Footer
lines.push(`MOVE mKKaHzn9C parent="${desktop.id}" index="0";`)
lines.push(`MOVE G9YpPymMA parent="${desktop.id}" index="1";`)
lines.push(`MOVE NPRuv9IlG parent="${desktop.id}" index="2";`)
lines.push(`MOVE P1XxzxZfp parent="${desktop.id}" index="3";`)
lines.push(`MOVE j4N1jForf parent="${desktop.id}" index="4";`)
lines.push(`MOVE WPVQdpynK parent="${desktop.id}" index="5";`)

const result = await framer.agent.applyChanges(lines.join(NL), { pagePath: "/404" })

// Re-serialize tablet/phone — if duplicated similarly, clean too
const ser2 = await framer.agent.serialize({ id: p404.id, depth: 3 }, {})
const extra = []
for (const bp of ser2.children || []) {
    const shells = (bp.children || []).filter((c) =>
        /Loading|Smooth|Atmosphere|^Nav$|^Footer$/i.test(c.name || ""),
    )
    extra.push({
        bp: bp.name,
        shells: shells.map((c) => ({
            name: c.name,
            id: c.id,
            variant: c.attributes?.["$control__variant"],
        })),
        content: (bp.children || []).map((c) => c.name),
    })
}

return { deleted: del, result, after: extra }
