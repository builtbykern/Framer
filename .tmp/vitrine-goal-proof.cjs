const fs = require("fs")
const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const pages = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "FZFYEKdG1", "eT5aUzOXW", "pTPGQ4L6O", "GPILtKFJP"],
    depth: 1,
    attributeFilter: ["id", "name", "path", "layoutTemplate"],
})

const phone = await framer.agent.serializeNodes(
    {
        ids: ["u75vHQkAR"],
        depth: 2,
        attributeFilter: ["id", "name", "__class", "stackDirection", "overflow", "hideScrollbars", "codeFile", "component"],
    },
    { pagePath: "/" }
)

const homeDesktop = await framer.agent.serializeNodes(
    {
        ids: ["WQLkyLRf1"],
        depth: 2,
        attributeFilter: ["id", "name", "__class", "codeFile", "component", "stackDirection", "overflow"],
    },
    { pagePath: "/" }
)

const hay = JSON.stringify({ pages, phone, homeDesktop })
const leftovers = ["Glass Hours", "Halden", "lorem", "Lorem", "Quarto", "Shopify"].filter((n) => hay.includes(n))

const proof = {
    project: info.name,
    sessionNote: "Fair Platform bound as session 2 (goal said 5; 5 expired)",
    pages: pages.map((p) => ({
        id: p.id,
        name: p.name,
        path: p.attributes?.path,
        layoutTemplate: p.attributes?.layoutTemplate ?? null,
    })),
    phoneChildren: phone[0]?.children?.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        component: c.component,
        stackDirection: c.attributes?.stackDirection,
        overflow: c.attributes?.overflow,
    })),
    homeDesktopChildren: homeDesktop[0]?.children?.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        codeFile: c.attributes?.codeFile ?? null,
        component: c.component,
    })),
    leftoversInThisSerialize: leftovers,
    shots: [
        "home-desktop.jpg",
        "home-tablet.jpg",
        "home-phone.jpg",
        "piece-desktop.jpg",
        "piece-tablet.jpg",
        "piece-phone.jpg",
        "house-desktop.jpg",
        "desk-desktop.jpg",
        "404-desktop.jpg",
    ],
}

fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/vitrine-goal-proof.json", JSON.stringify(proof, null, 2))
console.log(JSON.stringify(proof, null, 2))
