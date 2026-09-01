function walk(n, fn) {
    fn(n)
    for (const c of n.children || []) walk(c, fn)
}

const files = await framer.getCodeFiles()
const stills = files.find((f) => f.name === "Series_Stills.tsx")
const pageVeil = files.find((f) => f.name === "Page_Veil.tsx")
const stillVeil = files.find((f) => f.name === "Still_Veil.tsx")
if (!stills || !pageVeil || !stillVeil) throw new Error("missing code files")

if (!stills.content.includes("[coverImage, ...gallery]") && !stills.content.includes("withCover(")) {
    throw new Error("Series_Stills does not prepend cover into the lookbook")
}
if (/!isCover \? \(/.test(stills.content) || /&& !isCover \?/.test(stills.content)) {
    throw new Error("Series_Stills still skips caption on cover")
}
if (!pageVeil.content.includes("useReducedMotion")) {
    throw new Error("Page_Veil missing useReducedMotion")
}
if (!stillVeil.content.includes("useReducedMotion")) {
    throw new Error("Still_Veil missing useReducedMotion")
}

const year = await framer.agent.serialize(
    { id: "IbckjcWn0", depth: 4 },
    { pagePath: "/work/:Work" }
)
let yearText = ""
walk(year, (n) => {
    const t = n.attributes?.text
    if (typeof t === "string") yearText += t
})
if (yearText.trim() !== "YEAR") throw new Error(`year label is "${yearText}"`)

const h1 = await framer.agent.getNode({ id: "TRSPZ1XN3" }, { pagePath: "/" })
if (String(h1.attributes?.opacity) === "0") {
    throw new Error("SEO H1 still opacity 0")
}

const cover = await framer.agent.getNode({ id: "lgPBjlVA8" }, { pagePath: "/work/:Work" })
if (cover.attributes?.visible !== false && cover.attributes?.visible !== "false") {
    throw new Error("native Cover frame still visible (uncaptioned hero)")
}

console.log(JSON.stringify({ ok: true, yearText, h1Opacity: h1.attributes?.opacity }))
