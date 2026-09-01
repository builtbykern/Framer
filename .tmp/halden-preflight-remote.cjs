const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const codeFiles = await framer.getCodeFiles()
const codeResults = {}
for (const file of codeFiles) {
    const errors = await file.typecheck({ strict: true })
    codeResults[file.name] = {
        errors,
        ok: errors.length === 0,
    }
}

const pages = await framer.getNodesWithType("WebPageNode")
const pageTrees = await framer.agent.serializeNodes({
    ids: pages.map((page) => page.id),
    depth: 5,
})

const collectInstances = (componentId) => {
    const result = []
    const walk = (node, pageId, parentId = null) => {
        if (node.component === componentId) {
            result.push({
                pageId,
                parentId,
                id: node.id,
                name: node.name,
                attributes: node.attributes,
            })
        }
        for (const child of node.children || []) walk(child, pageId, node.id)
    }
    for (const tree of pageTrees) walk(tree, tree.id)
    return result
}

const drifts = collectInstances("codeFile/Og5966a:default")
const veils = collectInstances("codeFile/D6GDbcv:default")
const stills = collectInstances("codeFile/jeA2cvO:default")

const home = pageTrees.find((page) => page.id === "augiA20Il")
const workPage = pageTrees.find((page) => page.id === "fpoP3kuA4")
const homeWorkFeed = (home?.children || []).find(
    (node) => node.id === "xmBenkfAk" || node.name === "Work"
)
const homeSeoH1 = (home?.children || []).find(
    (node) => node.name === "SEO H1" && node.type === "RichTextNode"
)
const homeSeoH1Block = (homeSeoH1?.children || []).find(
    (node) => node.type === "TextBlock" && node.attributes?.tag === "h1"
)
const homeSeoH1Text = (homeSeoH1Block?.children || [])
    .filter((node) => node.type === "TextRun")
    .map((node) => node.attributes?.text || "")
    .join("")

const workCollection = await framer.getCollection("amTC8pcIG")
const workItems = await workCollection.getItems()

const valueOf = (value) =>
    value && typeof value === "object" && "value" in value
        ? value.value
        : value
const imageValue = (value) => valueOf(value)
const galleryRows = (value) => {
    const raw = valueOf(value)
    return Array.isArray(raw) ? raw : []
}
const formattedTextPresent = (value) => {
    const raw = valueOf(value)
    if (typeof raw === "string") return raw.trim().length > 0
    if (Array.isArray(raw)) return raw.length > 0
    return Boolean(raw)
}

const cmsItems = workItems.map((item) => {
    const data = item.fieldData || {}
    const cover = imageValue(data.KF94WDLfr)
    const rows = galleryRows(data.WTTAaEd5y)
    const gallery = rows.map((row) => {
        const image = imageValue(row.fieldData?.ZkP9UsFFL)
        return {
            image: Boolean(image?.url || image?.src),
            alt: String(image?.altText || image?.alt || "").trim(),
        }
    })
    return {
        id: item.id,
        slug: item.slug,
        title: String(valueOf(data.lmTMqy_0B) || "").trim(),
        year: valueOf(data.KKPJSa2Nk),
        type: valueOf(data.ZMWV4jFbG),
        description: String(valueOf(data.blc_46opK) || "").trim(),
        cover: Boolean(cover?.url || cover?.src),
        body: formattedTextPresent(data.GgZlSrsxB),
        gallery,
        complete:
            Boolean(item.slug) &&
            Boolean(String(valueOf(data.lmTMqy_0B) || "").trim()) &&
            Boolean(valueOf(data.KKPJSa2Nk)) &&
            Boolean(valueOf(data.ZMWV4jFbG)) &&
            Boolean(String(valueOf(data.blc_46opK) || "").trim()) &&
            Boolean(cover?.url || cover?.src) &&
            formattedTextPresent(data.GgZlSrsxB) &&
            rows.length >= 4 &&
            gallery.every((entry) => entry.image && entry.alt.length > 0),
    }
})

const duplicateSlugs = cmsItems
    .map((item) => item.slug)
    .filter((slug, index, all) => all.indexOf(slug) !== index)

const pageSummary = pageTrees.map((page) => ({
    id: page.id,
    name: page.name,
    attributes: page.attributes,
    breakpoints: (page.children || [])
        .filter((child) => child.type === "FrameNode")
        .map((child) => ({
            id: child.id,
            name: child.name,
            width: child.attributes?.width,
            height: child.attributes?.height,
            overflow: child.attributes?.overflow,
        })),
}))

const checks = {
    allCodeTypechecks: Object.values(codeResults).every((result) => result.ok),
    expectedPages:
        pageSummary.some((page) => page.attributes?.path === "/") &&
        pageSummary.some((page) => page.attributes?.path === "/work/:Work") &&
        pageSummary.some(
            (page) =>
                page.attributes?.path === "/404" ||
                page.name === "404"
        ),
    homeThreeBreakpoints:
        home?.children?.filter((node) =>
            ["Desktop", "Tablet", "Phone"].includes(node.name)
        ).length === 3,
    workThreeBreakpoints:
        workPage?.children?.filter((node) =>
            ["Desktop", "Tablet", "Phone"].includes(node.name)
        ).length === 3,
    driftThreeBreakpoints: drifts.length === 3,
    driftBindings: drifts.every(
        (node) =>
            node.attributes?.["$control__workList"]?.[0] === "xmBenkfAk"
    ),
    noLegacyDriftControls: drifts.every((node) =>
        [
            "$control__padTop",
            "$control__padBottom",
            "$control__cMS",
            "$control__view",
        ].every((key) => node.attributes?.[key] == null)
    ),
    feedDirectPageChild: Boolean(homeWorkFeed),
    feedOffCanvas:
        Number.parseFloat(homeWorkFeed?.attributes?.left || "0") >= 3000,
    homeSemanticH1:
        homeSeoH1Text === "Halden — Photography and commissioned stills",
    veilBlurFour: veils.every(
        (node) => node.attributes?.["$control__blur"] === "4"
    ),
    veilStaticAndReduced:
        codeFiles
            .find((file) => file.name === "Page_Veil.tsx")
            ?.content.includes("useIsStaticRenderer") &&
        codeFiles
            .find((file) => file.name === "Page_Veil.tsx")
            ?.content.includes("prefersReducedMotion"),
    stillsBound:
        stills.length === 3 &&
        stills.every(
            (node) =>
                node.attributes?.["$control__images"] != null ||
                node.attributes?.["$control__gallery"] != null ||
                node.attributes?.["$control__items"] != null
        ),
    cmsCountTwelve: cmsItems.length === 12,
    cmsUniqueSlugs: duplicateSlugs.length === 0,
    cmsComplete: cmsItems.every((item) => item.complete),
}

const outputDir = "/Users/noel/Desktop/Framer/.tmp/halden-preflight"
fs.mkdirSync(outputDir, { recursive: true })
const screenshots = {}
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["BjqrvIntT", "home-tablet.jpg"],
    ["nyI5jW7lA", "home-phone.jpg"],
    ["rtJNTCNFr", "work-desktop.jpg"],
    ["LSqc1L2WH", "work-tablet.jpg"],
    ["Tf2mbU7Bv", "work-phone.jpg"],
]) {
    const result = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    const outputPath = path.join(outputDir, name)
    fs.writeFileSync(outputPath, result.data)
    screenshots[name] = {
        path: outputPath,
        bytes: result.data.length,
    }
}

console.log(
    JSON.stringify(
        {
            checks,
            failed: Object.entries(checks)
                .filter(([, ok]) => !ok)
                .map(([name]) => name),
            codeResults,
            pages: pageSummary,
            homeWorkFeed,
            drifts,
            veils,
            stills,
            cmsItems,
            duplicateSlugs,
            screenshots,
        },
        null,
        2
    )
)
