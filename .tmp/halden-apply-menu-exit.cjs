const fs = require("node:fs")

const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(`Wrong project: ${info.name}`)

const typeErrors = []
for (const filename of ["Menu_Paper_Reveal.tsx", "Logo_Menu_Roll.tsx"]) {
    const file = await framer.getCodeFile(filename)
    if (!file) throw new Error(`${filename} not found`)

    const source = fs.readFileSync(
        `/Users/noel/Desktop/Framer/.tmp/halden-src/${filename}`,
        "utf8"
    )
    const updated = await file.setFileContent(source)
    const errors = await updated.typecheck({ strict: true })
    typeErrors.push(...errors.map((error) => ({ filename, error })))
}

if (typeErrors.length > 0) throw new Error(JSON.stringify(typeErrors))

const applied = await framer.agent.applyChanges(`
SET lHV5aHgaZVBfODp8Ml onTap.0="null" onTap.1="null" onTap.2="null";
SET lHV5aHgaZVBfODp8Ml onTap.0.action="SET_VARIABLE_VALUE" onTap.0.controls.variable="var(--variable-w1Hbz14bi)" onTap.0.controls.value="false";
SET lHV5aHgaZVBfODp8Ml onTap.1.action="SET_VARIANT" onTap.1.controls.variant="QZInDjV1k" onTap.1.delay="0.28s";
`)
if (applied.errors) throw new Error(JSON.stringify(applied.errors))

console.log(JSON.stringify({ typeErrors, applied }, null, 2))
