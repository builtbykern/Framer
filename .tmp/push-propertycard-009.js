const fs = require("node:fs")

const code = fs.readFileSync(
    "/Users/noel/Desktop/Framer/.tmp/Arbour_PropertyCard.tsx",
    "utf8"
)

const file = await framer.getCodeFile("Arbour_PropertyCard.tsx")
const updated = await file.setFileContent(code)
const errors = await updated.typecheck({ strict: true })

console.log(
    JSON.stringify(
        {
            ok: errors.length === 0,
            typeErrors: errors,
            checks: {
                noMotion: !code.includes("framer-motion"),
                noHoverState: !code.includes("imageHovered"),
                pureCssHover: code.includes("@media (hover: hover)"),
                layerPromote: code.includes("translateZ(0)"),
                hasSrcSet: code.includes("srcSet"),
            },
        },
        null,
        2
    )
)
