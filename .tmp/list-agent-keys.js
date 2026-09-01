console.log("agent", Object.keys(framer.agent || {}).sort().join(", "))
console.log("framer", Object.keys(framer).filter((k) => typeof framer[k] === "function" || typeof framer[k] === "object").slice(0, 40).join(", "))
