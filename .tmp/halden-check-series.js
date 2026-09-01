const files = await framer.getCodeFiles()
const series = files.find((f) => f.id === "jeA2cvO")
const code = await series.content
console.log(
    JSON.stringify(
        {
            bytes: code.length,
            animate: code.includes("animate={"),
            hostFrozen: code.includes("hostFrozen"),
            wrapped: code.includes("wrapped.type"),
            snippet: code.includes("hostFrozen")
                ? code.slice(
                      code.indexOf("const hostFrozen"),
                      code.indexOf("const hostFrozen") + 80
                  )
                : "no hostFrozen",
        },
        null,
        2
    )
)
