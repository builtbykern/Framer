const comps = await framer.agent.getDescendantsOfTypes(
  { id: "dZfxmFpqB", types: ["ComponentInstanceNode"] },
  { pagePath: "/neighbourhoods" }
);
const imgs = [];
for (const n of comps || []) {
  const img = n.attributes?.["$control__image"];
  if (img) imgs.push({ id: n.id, name: n.name, comp: n.$componentDisplayName, img });
}
console.log("neighbourhoods", JSON.stringify(imgs.slice(0, 15), null, 2));

const home = await framer.agent.getDescendantsOfTypes(
  { id: "augiA20Il", types: ["ComponentInstanceNode"] },
  { pagePath: "/" }
);
const homeImg = (home || []).filter(
  (n) =>
    n.$componentDisplayName === "Arbour_InertiaFrame" ||
    n.attributes?.["$control__image"]
);
console.log(
  "home",
  JSON.stringify(
    homeImg.slice(0, 12).map((n) => ({
      id: n.id,
      comp: n.$componentDisplayName,
      img: n.attributes?.["$control__image"],
    })),
    null,
    2
  )
);
