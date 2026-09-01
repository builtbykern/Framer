/**
 * 174–176 chrome + strip Noise added on Home/Notes (user request)
 */
const NL = String.fromCharCode(10)
const pages = await framer.getNodesWithType("WebPageNode")
const byPath = {}
for (const p of pages || []) if (p.path) byPath[p.path] = p

async function apply(label, lines, pagePath) {
    if (!lines.length) return { label, skipped: true }
    try {
        const r = await framer.agent.applyChanges(lines.join(NL), pagePath ? { pagePath } : {})
        return { label, ok: true, errors: r.errors || [] }
    } catch (e) {
        return { label, ok: false, err: String(e.message || e) }
    }
}

const results = []

// --- Strip Noise on / and /notes ---
for (const path of ["/", "/notes"]) {
    const ser = await framer.agent.serialize({ id: byPath[path].id, depth: 5 }, {})
    const desk = (ser.children || []).find((c) => c.name === "Desktop")
    const dels = []
    const noiseIds = []
    function findNoise(n) {
        if (!n) return
        const isNoise =
            (n.name || "").includes("NoiseEffect") || String(n.component || "").includes("IwchU7y")
        if (isNoise && n.id && !String(n.id).includes(desk?.id) === false) {
            // collect primary ids only (skip obvious replicas later via unique)
            noiseIds.push(n.id)
        }
        for (const c of n.children || []) findNoise(c)
    }
    findNoise(desk)
    // Prefer non-replica ids (no long prefix patterns) — actually DEL primary and replicas may need both
    // Framer replicas: Tablet id often prefixes original. DEL original usually cascades; try unique set
    const unique = [...new Set(noiseIds)].filter((id) => {
        // keep shortest / original: not containing another id as suffix awkwardly — keep all primary-looking
        return true
    })
    // Only DEL ids that appear as direct Atmosphere children or named Noise on desk tree — prefer Atmosphere children
    const atm = (desk?.children || []).find((c) => c.name === "Atmosphere")
    const noiseKids = (atm?.children || []).filter(
        (c) =>
            (c.name || "").includes("NoiseEffect") || String(c.component || "").includes("IwchU7y"),
    )
    for (const k of noiseKids) dels.push(`DEL ${k.id};`)
    // If Atmosphere empty after (Home), delete Atmosphere
    const blurKids = (atm?.children || []).filter(
        (c) =>
            (c.name || "").includes("ProgressiveBlur") ||
            String(c.component || "").includes("fOrMtU2"),
    )
    const otherKids = (atm?.children || []).filter(
        (c) => !noiseKids.includes(c) && !blurKids.includes(c),
    )
    // After deleting noise, if only noise was present (Home), DEL atmosphere
    if (atm && noiseKids.length && blurKids.length === 0 && otherKids.length === 0) {
        // DEL noise first then atmosphere — if we DEL atm it removes kids
        results.push(
            await apply("strip-noise-" + path, [`DEL ${atm.id};`], path),
        )
    } else if (dels.length) {
        results.push(await apply("strip-noise-" + path, dels, path))
    } else {
        results.push({ label: "strip-noise-" + path, skipped: true, found: unique })
    }
}

// --- Footer names ---
{
    const ids = ["wssGwbNHc", "EnLRF_D_f", "R1UwW27g3"]
    // include BP replicas by walking pages
    const lines = []
    for (const path of ["/properties", "/about", "/contact"]) {
        const ser = await framer.agent.serialize({ id: byPath[path].id, depth: 3 }, {})
        function walk(n) {
            if (!n) return
            if (
                n.type === "ComponentInstanceNode" &&
                n.component === "pXUahiblU" &&
                !n.name
            ) {
                lines.push(`SET ${n.id} name="Footer";`)
            }
            // also force named ids from audit
            if (ids.includes(n.id)) lines.push(`SET ${n.id} name="Footer";`)
            for (const c of n.children || []) walk(c)
        }
        walk(ser)
    }
    results.push(await apply("footer-names", [...new Set(lines)], null))
}

// --- Closing Chapter pad ---
{
    const lines = [`SET VeGntwuIg padding="96px 48px 96px 48px";`]
    // phone replica
    const ser = await framer.agent.serialize({ id: byPath["/notes/:slug"].id, depth: 3 }, {})
    const phone = (ser.children || []).find((c) => c.name === "Phone")
    function findClosing(n) {
        if (!n) return null
        if (n.name === "Closing Chapter" || n.id === "VeGntwuIg" || n.id?.endsWith("VeGntwuIg"))
            return n
        for (const c of n.children || []) {
            const h = findClosing(c)
            if (h) return h
        }
        return null
    }
    const phoneClosing = findClosing(phone)
    if (phoneClosing && phoneClosing.id !== "VeGntwuIg") {
        const pad = String(phoneClosing.attributes?.padding || "")
        if (pad.includes("80px")) {
            lines.push(`SET ${phoneClosing.id} padding="64px 16px 64px 16px";`)
        }
    }
    results.push(await apply("closing-pad", lines, null))
}

// --- Shell order ---
for (const path of ["/about", "/contact", "/notes/:slug"]) {
    const ser = await framer.agent.serialize({ id: byPath[path].id, depth: 2 }, {})
    const desk = (ser.children || []).find((c) => c.name === "Desktop")
    const byName = {}
    for (const c of desk?.children || []) if (c.name) byName[c.name] = c
    const lines = []
    let idx = 0
    for (const n of ["Arbour_LoadingScreen", "Arbour_SmoothScroll", "Atmosphere", "Nav"]) {
        if (byName[n]) {
            lines.push(`MOVE ${byName[n].id} parent="${desk.id}" index="${idx}";`)
            idx++
        }
    }
    results.push(
        await apply("shell-" + path, lines, path.includes(":") ? null : path),
    )
}

console.log(JSON.stringify(results, null, 2))
