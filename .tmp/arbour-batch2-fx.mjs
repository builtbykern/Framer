/**
 * Batch 2a retry: index= for create; no pagePath for CMS details
 */
const NL = String.fromCharCode(10)
const LOAD = "codeFile/QsH9B_M:default"
const SMOOTH = "codeFile/lKYHG0I:default"
const NOISE = "codeFile/IwchU7y:default"
const BLUR = "codeFile/fOrMtU2:default"
const CUE = "codeFile/GruqKYi:default"
const U = Date.now().toString(36)
const a = (n) => `${n}_${U}`

const pages = await framer.getNodesWithType("WebPageNode")
const byPath = {}
for (const p of pages || []) if (p.path) byPath[p.path] = p

async function getDesk(path) {
    const page = byPath[path]
    const ser = await framer.agent.serialize({ id: page.id, depth: 2 }, {})
    const desk = (ser.children || []).find((c) => c.name === "Desktop")
    return { page, desk }
}

async function apply(path, lines, opts = {}) {
    const dsl = lines.filter(Boolean).join(NL)
    const options = opts.noPath ? {} : { pagePath: path }
    try {
        const r = await framer.agent.applyChanges(dsl, options)
        return { path, ok: !(r.errors && Object.keys(r.errors).length), errors: r.errors || [], warnings: r.warnings || [] }
    } catch (e) {
        return { path, ok: false, err: String(e.message || e) }
    }
}

const results = []

// Check if Home already got partial creates
{
    const { desk } = await getDesk("/")
    const names = (desk.children || []).map((c) => c.name)
    results.push({ probeHomeTops: names })
    const hasLoad = names.includes("Arbour_LoadingScreen")
    const hasAtm = names.includes("Atmosphere")
    if (!hasLoad || !hasAtm) {
        const atm = a("homeAtm")
        const load = a("homeLoad")
        const smooth = a("homeSmooth")
        const noise = a("homeNoise")
        const lines = []
        if (!hasLoad) {
            lines.push(
                `+ComponentInstanceNode ${load} parent="${desk.id}" index="0" component="${LOAD}" position="relative" width="1fr" height="auto";`,
                `SET ${load} name="Arbour_LoadingScreen";`,
                `+ComponentInstanceNode ${smooth} parent="${desk.id}" index="1" component="${SMOOTH}" position="relative" width="1fr" height="auto";`,
                `SET ${smooth} name="Arbour_SmoothScroll";`,
            )
        }
        if (!hasAtm) {
            lines.push(
                `+FrameNode ${atm} parent="${desk.id}" index="2" position="absolute" left="0px" top="0px" width="100%" height="100%" overflow="clip" pointerEvents="none" zIndex="1";`,
                `SET ${atm} name="Atmosphere";`,
                `+ComponentInstanceNode ${noise} parent="${atm}" index="0" component="${NOISE}" position="absolute" left="0px" top="0px" width="100%" height="100%";`,
                `SET ${noise} name="Arbour_NoiseEffect";`,
            )
        }
        // footer rename always
        lines.push(`SET GRDC4z6MO name="Footer";`)
        results.push(await apply("/", lines))
    } else {
        results.push(await apply("/", [`SET GRDC4z6MO name="Footer";`]))
    }
}

{
    const { desk } = await getDesk("/notes")
    const names = (desk.children || []).map((c) => c.name)
    results.push({ probeNotesTops: names })
    const foot = (desk.children || []).find(
        (c) => c.name === "Footer Container" || c.component === "pXUahiblU",
    )
    const hasLoad = names.includes("Arbour_LoadingScreen")
    const hasAtm = names.includes("Atmosphere")
    const atm = a("notesAtm")
    const load = a("notesLoad")
    const smooth = a("notesSmooth")
    const noise = a("notesNoise")
    const blur = a("notesBlur")
    const lines = []
    if (!hasLoad) {
        lines.push(
            `+ComponentInstanceNode ${load} parent="${desk.id}" index="0" component="${LOAD}" position="relative" width="1fr" height="auto";`,
            `SET ${load} name="Arbour_LoadingScreen";`,
            `+ComponentInstanceNode ${smooth} parent="${desk.id}" index="1" component="${SMOOTH}" position="relative" width="1fr" height="auto";`,
            `SET ${smooth} name="Arbour_SmoothScroll";`,
        )
    }
    if (!hasAtm) {
        lines.push(
            `+FrameNode ${atm} parent="${desk.id}" index="2" position="absolute" left="0px" top="0px" width="100%" height="100%" overflow="clip" pointerEvents="none" zIndex="1";`,
            `SET ${atm} name="Atmosphere";`,
            `+ComponentInstanceNode ${noise} parent="${atm}" index="0" component="${NOISE}" position="absolute" left="0px" top="0px" width="100%" height="100%";`,
            `SET ${noise} name="Arbour_NoiseEffect";`,
            `+ComponentInstanceNode ${blur} parent="${atm}" index="1" component="${BLUR}" position="absolute" left="0px" bottom="0px" width="100%" height="120px";`,
            `SET ${blur} name="Arbour_ProgressiveBlur";`,
        )
    }
    if (foot && foot.name !== "Footer") lines.push(`SET ${foot.id} name="Footer";`)
    if (lines.length) results.push(await apply("/notes", lines))
    else results.push({ path: "/notes", ok: true, skipped: true })
}

{
    const { desk } = await getDesk("/neighbourhoods")
    const names = (desk.children || []).map((c) => c.name)
    results.push({ probeNhTops: names })
    if (!names.includes("Arbour_LoadingScreen")) {
        const load = a("nhLoad")
        const smooth = a("nhSmooth")
        results.push(
            await apply("/neighbourhoods", [
                `+ComponentInstanceNode ${load} parent="${desk.id}" index="0" component="${LOAD}" position="relative" width="1fr" height="auto";`,
                `SET ${load} name="Arbour_LoadingScreen";`,
                `+ComponentInstanceNode ${smooth} parent="${desk.id}" index="1" component="${SMOOTH}" position="relative" width="1fr" height="auto";`,
                `SET ${smooth} name="Arbour_SmoothScroll";`,
                `SET DRglThXCl name="Footer";`,
            ]),
        )
    }
}

// Contact cue
{
    const ser = await framer.agent.serialize({ id: byPath["/contact"].id, depth: 6 }, {})
    let hasCue = false
    function walk(n) {
        if (!n || hasCue) return
        if ((n.name || "").includes("ScrollCue") || String(n.component || "").includes("GruqKYi"))
            hasCue = true
        for (const c of n.children || []) walk(c)
    }
    walk(ser)
    if (!hasCue) {
        const cue1 = a("contactCue")
        results.push(
            await apply("/contact", [
                `+ComponentInstanceNode ${cue1} parent="AATw4pip9" index="2" component="${CUE}" position="relative" width="1fr" height="auto";`,
                `SET ${cue1} name="Arbour_ScrollCue";`,
            ]),
        )
    } else results.push({ path: "/contact", ok: true, skipped: "cue exists" })
}

// Detail cues — no pagePath
{
    const hero = await framer.agent.serialize({ id: "lODMk6Egu", depth: 3 }, {})
    const copy = (hero.children || []).find((c) =>
        (c.children || []).some((k) => (k.name || "").includes("Back to Properties")),
    )
    const cue2 = a("propCue")
    if (copy) {
        results.push(
            await apply(
                "/properties/:slug",
                [
                    `+ComponentInstanceNode ${cue2} parent="${copy.id}" index="0" component="${CUE}" position="relative" width="1fr" height="auto";`,
                    `SET ${cue2} name="Arbour_ScrollCue";`,
                ],
                { noPath: true },
            ),
        )
    }
}
{
    const cue3 = a("noteCue")
    results.push(
        await apply(
            "/notes/:slug",
            [
                `+ComponentInstanceNode ${cue3} parent="rTmLLnGhQ" index="2" component="${CUE}" position="relative" width="auto" height="auto";`,
                `SET ${cue3} name="Arbour_ScrollCue";`,
            ],
            { noPath: true },
        ),
    )
}

console.log(JSON.stringify(results, null, 2))
