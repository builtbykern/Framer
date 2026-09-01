const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const out = { project: info.name, typeErrors: {} }
for (const name of ["Drift_Plane.tsx", "Series_Stills.tsx"]) {
    const file = await framer.getCodeFile(name)
    out.typeErrors[name] = await file.typecheck({ strict: true })
}

try {
    out.review = await framer.agent.reviewChanges()
} catch (e) {
    out.review = String(e)
}

console.log(JSON.stringify(out, null, 2))
