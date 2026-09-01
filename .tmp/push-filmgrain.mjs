import { readFileSync } from "node:fs"

const src = readFileSync(
    new URL("./BuiltByKern_FilmGrain.tsx", import.meta.url),
    "utf8"
)

const existing = await framer.getCodeFiles()
const names = existing.map((f) => f.name)
console.log("has Noiser", names.includes("BuiltByKern_Noiser.tsx"))
console.log("has FilmGrain", names.includes("BuiltByKern_FilmGrain.tsx"))

let file = existing.find((f) => f.name === "BuiltByKern_FilmGrain.tsx")
if (!file) {
    file = await framer.createCodeFile("BuiltByKern_FilmGrain.tsx", src)
    console.log("created", file?.id || file?.name)
} else {
    await file.setFileContent(src)
    console.log("updated FilmGrain")
}

try {
    const tc = await file.typecheck()
    console.log("typecheck", JSON.stringify(tc, null, 2).slice(0, 800))
} catch (e) {
    console.log("typecheck err", e.message)
}

const pagePath = "/"
const nodes = await framer.agent.getDescendantsOfTypes(
    { id: "augiA20Il", types: ["ComponentInstanceNode"] },
    { pagePath }
)
const hits = (nodes || []).filter((n) =>
    /Noiser|Film Grain|FilmGrain|Noise/i.test(
        `${n.$componentDisplayName || ""} ${n.name || ""} ${n.componentIdentifier || ""}`
    )
)
console.log(
    "hits",
    hits.map((n) => ({
        id: n.id,
        name: n.name,
        d: n.$componentDisplayName,
        ci: n.componentIdentifier,
    }))
)
