const fs = require("fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const logoFile = await framer.getCodeFile("Logo_Menu_Roll.tsx")
if (!logoFile) throw new Error("Logo_Menu_Roll.tsx not found")

const sourcePath =
    "/Users/noel/Desktop/Framer/.tmp/halden-src/Logo_Menu_Roll.tsx"
const source = fs.readFileSync(sourcePath, "utf8")
await logoFile.setFileContent(source)

const typeErrors = await logoFile.typecheck({ strict: true })
if (typeErrors.length > 0) {
    throw new Error(`Logo typecheck failed: ${JSON.stringify(typeErrors)}`)
}

const home = (
    await framer.agent.serializeNodes({
        ids: ["augiA20Il"],
        depth: 1,
    })
)[0]
const existingH1 = (home?.children || []).find(
    (child) => child.name === "SEO H1"
)

const h1Dsl = existingH1
    ? `SET ${existingH1.id} name="SEO H1" text="Halden — Photography and commissioned stills" tag="h1" position="absolute" left="-10000px" top="0px" width="1px" height="1px" overflow="hidden" opacity="0" pointerEvents="none";`
    : `+RichTextNode haldenHomeH1 parent="augiA20Il" index="4";
SET haldenHomeH1 name="SEO H1" text="Halden — Photography and commissioned stills" tag="h1" position="absolute" left="-10000px" top="0px" width="1px" height="1px" overflow="hidden" opacity="0" pointerEvents="none" fontName="IBM Plex Sans" fontWeight="600" fontSize="16px" lineHeight="1em";`

const dsl = `
SET VBfODp8Ml onTap="null";
SET VBfODp8Ml onTap.0.action="SET_VARIANT" onTap.0.controls.variant="lHV5aHgaZ" onTap.0.delay="0s";
SET lHV5aHgaZVBfODp8Ml onTap="null";
SET lHV5aHgaZVBfODp8Ml onTap.0.action="SET_VARIANT" onTap.0.controls.variant="QZInDjV1k" onTap.0.delay="0s";
SET Gz9TsJWVA onTap.0="null";
SET lHV5aHgaZGz9TsJWVA onTap.0="null" onTap.1="null";
${h1Dsl}
`

const applied = await framer.agent.applyChanges(dsl)

console.log(
    JSON.stringify(
        {
            ok: true,
            typeErrors,
            applied,
            h1Mode: existingH1 ? "updated" : "created",
        },
        null,
        2
    )
)
