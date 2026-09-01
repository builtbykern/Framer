const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/halden-src"
fs.mkdirSync(dir, { recursive: true })
const stills = await framer.getCodeFile("Series_Stills.tsx")
fs.writeFileSync(`${dir}/Series_Stills.live.tsx`, stills.content)
console.log(
    JSON.stringify({
        len: stills.content.length,
        preferPaint: stills.content.includes("preferPaint"),
        height100: stills.content.includes('height: "100%"'),
        veilY: stills.content.includes("VEIL_Y = 48"),
    })
)
