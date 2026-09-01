// Try richer attribute dump for ScrollBlurEssential
const s = await framer.agent.serialize({ id: "FhovjwkxY", depth: 2 }, { pagePath: "/" });
console.log(JSON.stringify(s, null, 2).slice(0, 4000));
