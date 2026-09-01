const shader = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
const c = shader?.content || ""
const lines = c.split("\n")
console.log(
    JSON.stringify(
        {
            lines: lines.length,
            hasSibling: c.includes("overlayHost.contains"),
            hasPageRootFilter: c.includes("pageRoot.style.filter = url"),
            line330: lines.slice(328, 340),
            typeErrors: await shader.typecheck({ strict: true }),
        },
        null,
        2
    )
)
