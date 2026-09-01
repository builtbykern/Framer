const appear =
    'appearEffect.trigger="onInView" appearEffect.replay="false" appearEffect.enter.opacity="0" appearEffect.enter.x="0" appearEffect.enter.y="0" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.4s 0s"'

const coverIds = [
    "QYwZhiOCq",
    "BZgqwOKfTQYwZhiOCq",
    "GLlag6b9RQYwZhiOCq",
    "S4aeyJLQaQYwZhiOCq",
]
const stillIds = [
    "aDU_xPLrv",
    "BZgqwOKfTaDU_xPLrv",
    "GLlag6b9RaDU_xPLrv",
    "S4aeyJLQaaDU_xPLrv",
]

const cmds = [
    'SET GiR6fF7o5 gap="12px";',
    'SET Nx5jccWgM gap="10px";',
    'SET tKUMOkWpP gap="8px";',
]
for (const id of coverIds) cmds.push(`SET ${id} ${appear};`)
for (const id of stillIds) cmds.push(`SET ${id} ${appear};`)

const motion = await framer.agent.applyChanges(cmds.join(" "), { pagePath: "/" })

const item = await framer.agent.serializeNodes({
    ids: ["lkZBIAg86", "GiR6fF7o5", "QYwZhiOCq"],
    depth: 0,
    attributeFilter: ["name", "gap", "appearEffect", "$control__cover", "$control__title"],
})

console.log(JSON.stringify({ motion, item }, null, 2))
