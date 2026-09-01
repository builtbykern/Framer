const files = await framer.getCodeFiles()
const drift = files.find((f) => f.name === "Drift_Plane.tsx")
console.log(JSON.stringify({ keys: Object.keys(drift || {}), id: drift?.id, name: drift?.name }))
