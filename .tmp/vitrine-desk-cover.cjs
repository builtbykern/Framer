const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const deskLink = await framer.agent.serializeNodes(
    { ids: ["DZIMTQiKB", "FnQbHIoGD", "mRmEjTFrV"], depth: 3, attributeFilter: ["id", "name", "text", "link", "textStylePreset"] },
    { pagePath: "/contact" }
)

const cover = await framer.agent.serializeNodes({
    ids: ["QYwZhiOCq", "aDU_xPLrv", "g1ctSOgfg", "iR0ECI6Dz"],
    depth: 1,
    attributeFilter: ["id", "name", "appearEffect", "visible", "height"],
})

const pages = await framer.agent.serializeNodes({
    ids: ["augiA20Il", "FZFYEKdG1", "eT5aUzOXW", "pTPGQ4L6O", "GPILtKFJP"],
    depth: 1,
    attributeFilter: ["id", "name", "path", "layoutTemplate", "title", "description"],
})

console.log(JSON.stringify({ deskLink, cover, pages }, null, 2))
