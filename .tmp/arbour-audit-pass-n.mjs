/**
 * Arbour coherence audit pass N — hero air under fixed Nav,
 * hero image reuse, padding outliers vs L scale, Noise shell.
 * READ ONLY.
 */
const fs = require("fs")

const L_TOP = { Desktop: 128, Tablet: 96, Phone: 64 }
const CONTENT = [
    "/",
    "/properties",
    "/neighbourhoods",
    "/notes",
    "/about",
    "/contact",
    "/properties/:slug",
    "/notes/:slug",
]

const HERO_NAME =
    /^(Hero|Hero Copy|Opening|Opening Copy|Opening Image|Beat 1|Chapter Intro|Page Hero|Journal Hero)/i

function parsePad(p) {
    if (!p || typeof p !== "string") return null
    const parts = p.trim().split(/\s+/)
    const n = (x) => {
        const m = String(x).match(/^([\d.]+)/)
        return m ? Number(m[1]) : null
    }
    if (parts.length === 1) {
        const v = n(parts[0])
        return { t: v, r: v, b: v, l: v, raw: p }
    }
    if (parts.length === 2) {
        const v = n(parts[0])
        const h = n(parts[1])
        return { t: v, r: h, b: v, l: h, raw: p }
    }
    if (parts.length === 3) {
        return { t: n(parts[0]), r: n(parts[1]), b: n(parts[2]), l: n(parts[1]), raw: p }
    }
    if (parts.length >= 4) {
        return { t: n(parts[0]), r: n(parts[1]), b: n(parts[2]), l: n(parts[3]), raw: p }
    }
    return null
}

function imgKey(fill) {
    const s = String(fill || "")
    const m = s.match(/framerusercontent\.com\/images\/([^"?]+)/)
    return m ? m[1] : null
}

const pages = await framer.getNodesWithType("WebPageNode")
const heroAir = []
const heroImgs = []
const padOutliers = []
const noise = []
const hardButtons = []

for (const p of pages || []) {
    if (!CONTENT.includes(p.path)) continue
    const ser = await framer.agent.serialize({ id: p.id, depth: 7 }, {})

    for (const bp of ser.children || []) {
        const bpName = bp.name || "?"
        const expectTop = L_TOP[bpName] ?? 128

        // Noise presence
        let hasNoise = false
        function deep(n, depth, pathNames) {
            if (!n || depth > 8) return
            const name = n.name || ""
            const a = n.attributes || {}
            const display = a.$componentDisplayName || ""
            if (/NoiseEffect/i.test(name + display)) hasNoise = true

            const chain = pathNames.concat([name])
            const isHeroish =
                HERO_NAME.test(name) ||
                (depth <= 2 && /Hero|Opening|Beat 1/i.test(name))

            // image fills on hero-ish
            const fill = a.fill || a.backgroundImage || ""
            const ik = imgKey(fill)
            if (ik && (isHeroish || /Image Field|Hero Image|Media/i.test(name))) {
                heroImgs.push({
                    path: p.path,
                    bp: bpName,
                    id: n.id,
                    name,
                    img: ik,
                })
            }

            const pad = parsePad(a.padding)
            if (pad && isHeroish && depth <= 4) {
                const parentHero = chain.some((x) => /Hero|Opening|Beat 1/i.test(x))
                if (parentHero || isHeroish) {
                    heroAir.push({
                        path: p.path,
                        bp: bpName,
                        id: n.id,
                        name,
                        depth,
                        top: pad.t,
                        expectTop,
                        short: pad.t != null && pad.t < expectTop - 8,
                        raw: pad.raw,
                        chain: chain.slice(-4).join(" > "),
                    })
                }
            }

            // section pad top outliers: named sections with top < 40 on desktop content (skip fullbleed 0)
            if (
                pad &&
                pad.t === 0 &&
                pad.l === 0 &&
                pad.r === 0 &&
                /Section|Band|Grid|Chapter|Enquiry|Journal|Portfolio|Market|Closing/i.test(name) &&
                !/Hero|Opening|Nav|Footer|Blur|Noise|Scroll|Atmosphere|Loading|Smooth/i.test(name)
            ) {
                // full-bleed vertical-only ok — skip
            }

            // Primary / CTA buttons with raw hex
            if (
                /Button|CTA|Enquire|Subscribe|Primary/i.test(name + display) ||
                a.$component === "codeFile" ||
                /PrimaryButton/i.test(display)
            ) {
                const bg = String(a.backgroundColor || a.$control__background || "")
                if (bg && !/token-|var\(--token/i.test(bg) && /#|rgb/i.test(bg)) {
                    hardButtons.push({
                        path: p.path,
                        bp: bpName,
                        id: n.id,
                        name: name || display,
                        bg: bg.slice(0, 80),
                    })
                }
            }

            for (const c of n.children || []) deep(c, depth + 1, chain)
        }
        deep(bp, 0, [])
        noise.push({ path: p.path, bp: bpName, noise: hasNoise })
    }
}

// Aggregate short hero air: prefer nodes named Hero / Hero Copy / Opening Copy
const airShort = heroAir
    .filter((h) => h.short && /Hero|Opening Copy|Hero Copy|Chapter Intro/i.test(h.name))
    .sort((a, b) => a.path.localeCompare(b.path) || a.bp.localeCompare(b.bp))

// Image reuse: same img on 2+ different paths (hero-ish)
const byImg = {}
for (const h of heroImgs) {
    if (!byImg[h.img]) byImg[h.img] = []
    byImg[h.img].push(h)
}
const reused = Object.entries(byImg)
    .map(([img, hits]) => {
        const paths = [...new Set(hits.map((x) => x.path))]
        return { img, paths, hits: hits.map((x) => `${x.path}|${x.bp}|${x.name}`) }
    })
    .filter((x) => x.paths.length >= 2)

const out = {
    collectedAt: new Date().toISOString(),
    expectLTop: L_TOP,
    heroAirShort: airShort,
    heroAirAllHeroish: heroAir.filter((h) => /Hero|Opening|Chapter Intro/i.test(h.name)),
    imageReuseAcrossPages: reused,
    noiseByPage: noise,
    hardButtons: hardButtons.slice(0, 40),
    counts: {
        airShort: airShort.length,
        reuse: reused.length,
        hardButtons: hardButtons.length,
    },
}

fs.writeFileSync(
    "/Users/noel/Desktop/Framer/.tmp/arbour-audit-pass-n.json",
    JSON.stringify(out, null, 2)
)
return {
    counts: out.counts,
    airShort: airShort.slice(0, 40),
    reuse: reused.slice(0, 15),
    noiseHomeVsOthers: noise.filter((n) => n.path === "/" || n.bp === "Desktop"),
    hardButtonsSample: hardButtons.slice(0, 15),
}
