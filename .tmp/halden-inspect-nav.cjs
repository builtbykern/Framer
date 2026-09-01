const fs = require("fs")
const path = require("path")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const tree = await framer.agent.serializeNodes({
    ids: ["Ebz57iEJS"],
    depth: 5,
    attributeFilter: [
        "name",
        "width",
        "height",
        "layout",
        "gap",
        "padding",
        "fill",
        "visible",
        "overflow",
        "position",
        "stackDirection",
        "stackAlignment",
        "stackDistribution",
        "appearEffect",
        "onTap",
        "$control__variant",
        "$control__menuOpen",
        "$variants",
    ],
})
const dossier = await framer.agent.serializeNodes({
    ids: [
        "lHV5aHgaZO9K_hJDIm",
        "lHV5aHgaZXM4MY5kEq",
        "lHV5aHgaZjHiMr8b0s",
    ],
    depth: 8,
    attributeFilter: [
        "name",
        "text",
        "width",
        "height",
        "layout",
        "gap",
        "padding",
        "fill",
        "visible",
        "overflow",
        "position",
        "stackDirection",
        "stackAlignment",
        "stackDistribution",
        "font",
        "fontSize",
        "lineHeight",
        "textColor",
        "opacity",
        "border",
        "radius",
        "link",
        "appearEffect",
    ],
})

const variants = tree[0]?.children || []
const outputDir = "/Users/noel/Desktop/Framer/.tmp/halden-nav-shots"
fs.mkdirSync(outputDir, { recursive: true })
const shots = {}

for (const variant of variants) {
    const safeName = String(variant.name || variant.id)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
    try {
        const result = await framer.screenshot(variant.id, {
            format: "jpeg",
            scale: 1,
        })
        const filename = `${safeName}.jpg`
        fs.writeFileSync(path.join(outputDir, filename), result.data)
        shots[filename] = {
            id: variant.id,
            bytes: result.data.length,
        }
    } catch (error) {
        shots[safeName] = String(error)
    }
}
for (const id of [
    "lHV5aHgaZj8mC0qp88",
    "lHV5aHgaZO9K_hJDIm",
    "lHV5aHgaZXM4MY5kEq",
    "lHV5aHgaZjHiMr8b0s",
]) {
    const result = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    const filename = `${id}.jpg`
    fs.writeFileSync(path.join(outputDir, filename), result.data)
    shots[filename] = { id, bytes: result.data.length }
}

const codeFiles = {}
for (const filename of [
    "Logo_Menu_Roll.tsx",
    "Menu_Paper_Reveal.tsx",
]) {
    const file = await framer.getCodeFile(filename)
    if (!file) continue
    fs.writeFileSync(
        `/Users/noel/Desktop/Framer/.tmp/halden-src/${filename}`,
        file.content
    )
    codeFiles[filename] = {
        id: file.id,
        length: file.content.length,
        typeErrors: await file.typecheck({ strict: true }),
    }
}

console.log(
    JSON.stringify(
        {
            variants: variants.map((variant) => ({
                id: variant.id,
                name: variant.name,
                attributes: variant.attributes,
            })),
            tree,
            dossier,
            shots,
            codeFiles,
        },
        null,
        2
    ).slice(0, 24000)
)
