const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)
const file = await framer.getCodeFile("Series_Stills.tsx")
const c = String(file.content || "")
console.log(
    JSON.stringify(
        {
            project: info.name,
            bytes: c.length,
            hasAbsolute: c.includes("position: \"absolute\""),
            hasInset: c.includes("inset: 0"),
            hasRelativeCrop: c.includes("position: \"relative\""),
            figure32: c.includes('aspectRatio: isGrid ? "1 / 1" : "3 / 2"'),
            contain: c.includes("contain"),
        },
        null,
        2
    )
)
