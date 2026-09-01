const pages = [
  { path: "/", id: "augiA20Il" },
  { path: "/about", id: "OdFhPn9yz" },
  { path: "/properties-2", id: "uBAGmujMa" },
  { path: "/notes", id: "s8RpZIiJ8" },
  { path: "/neighbourhoods", id: "dZfxmFpqB" },
  { path: "/contact", id: "c7qpzB7hR" },
];
const needles = [
  "NoiseEffect",
  "ProgressiveBlur",
  "LoadingScreen",
  "SoftOrb",
  "ScrollBlur",
  "Noiser",
  "Preloader",
  "InertiaFrame",
];
for (const p of pages) {
  const comps = await framer.agent.getDescendantsOfTypes(
    { id: p.id, types: ["ComponentInstanceNode"] },
    { pagePath: p.path }
  );
  const hits = [];
  for (const c of comps || []) {
    const blob = `${c.name || ""} ${c.$componentDisplayName || ""} ${c.componentIdentifier || ""}`;
    for (const n of needles) {
      if (blob.includes(n)) {
        hits.push({
          n,
          id: c.id,
          name: c.name,
          dn: c.$componentDisplayName,
        });
        break;
      }
    }
  }
  console.log(p.path, "hits", hits.length, JSON.stringify(hits.slice(0, 20)));
}
