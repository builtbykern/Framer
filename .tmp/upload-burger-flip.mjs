import fs from "node:fs"

const code = fs.readFileSync(
    new URL("../code-components/BurgerFlip.tsx", import.meta.url),
    "utf8",
)

const file = await framer.createCodeFile("BurgerFlip.tsx", code)
console.log(
    JSON.stringify(
        {
            id: file.id,
            name: file.name,
            path: file.path,
            exports: file.exports,
        },
        null,
        2,
    ),
)

const result = await file.typecheck()
console.log("typecheck", JSON.stringify(result, null, 2))
state.burgerFlip = {
    id: file.id,
    path: file.path,
    exports: file.exports,
}
