const pagePath = "/work/:Work"
const infoIds = [
    "rT9WGdFVR",
    "LSqc1L2WHrT9WGdFVR",
    "Tf2mbU7BvrT9WGdFVR",
]

const infos = await framer.agent.serializeNodes(
    { ids: infoIds, depth: 4 },
    { pagePath }
)

const readText = (node) =>
    [node?.attributes?.text, ...(node?.children || []).map(readText)]
        .filter((value) => typeof value === "string")
        .join("")

const checks = infos.map((info) => {
    const returnRow = info.children?.[0]
    const link = returnRow?.children?.find(
        (child) => child.name === "Back to Index"
    )
    const pager = info.children?.find((child) => child.name === "Pager")
    const stalePagerIndex = (pager?.children || []).some(
        (child) => child.name === "Index" || child.name === "Index Center"
    )

    return {
        info: info.id,
        firstChild: returnRow?.name,
        text: readText(link),
        href: link?.attributes?.link?.href,
        style: link?.attributes?.linkStylePreset,
        noPagerCollision: !stalePagerIndex,
        pass:
            returnRow?.name === "Index Return" &&
            link?.type === "RichTextNode" &&
            readText(link) === "← INDEX" &&
            link.attributes?.link?.href === "/" &&
            link.attributes?.linkStylePreset === "Info Link" &&
            link.attributes?.fontName === "IBM Plex Mono" &&
            link.attributes?.fontSize === "11px" &&
            !stalePagerIndex,
    }
})

console.log(JSON.stringify(checks, null, 2))
if (checks.length !== infoIds.length || checks.some((check) => !check.pass)) {
    throw new Error("Work INDEX return is not correctly separated")
}
