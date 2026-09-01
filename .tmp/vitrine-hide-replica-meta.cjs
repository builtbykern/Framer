const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const r = await framer.agent.applyChanges(
    [
        'SET BZgqwOKfTJN7M7ldcs visible="false";',
        'SET GLlag6b9RJN7M7ldcs visible="false";',
        'SET S4aeyJLQaJN7M7ldcs visible="false";',
        'SET BZgqwOKfTaDU_xPLrv visible="false";',
        'SET GLlag6b9RaDU_xPLrv visible="false";',
        'SET S4aeyJLQaaDU_xPLrv visible="false";',
    ].join(" "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ message: r.message, errors: r.linter?.errors, warnings: r.linter?.warnings }, null, 2))
