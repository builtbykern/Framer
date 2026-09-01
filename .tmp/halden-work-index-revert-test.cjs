const pagePath = "/work/:Work"
const pagerIds = [
    "r7a29NJU9",
    "LSqc1L2WHr7a29NJU9",
    "Tf2mbU7Bvr7a29NJU9",
]

const pagers = await framer.agent.serializeNodes(
    { ids: pagerIds, depth: 3 },
    { pagePath }
)

const checks = pagers.map((pager) => {
    const children = pager.children || []
    const previous = children.find((child) => child.name === "Previous")
    const next = children.find((child) => child.name === "Next")
    const staleIndex = children.some(
        (child) => child.name === "Index" || child.name === "Index Center"
    )

    return {
        pager: pager.id,
        noStaleIndex: !staleIndex,
        previousIntact:
            previous?.attributes?.link?.href === "/work/:slug" &&
            Boolean(previous.attributes.link.collectionItem),
        nextIntact:
            next?.attributes?.link?.href === "/work/:slug" &&
            Boolean(next.attributes.link.collectionItem),
    }
})

console.log(JSON.stringify(checks, null, 2))
if (
    checks.length !== pagerIds.length ||
    checks.some(
        (check) =>
            !check.noStaleIndex ||
            !check.previousIntact ||
            !check.nextIntact
    )
) {
    throw new Error("The failed Work INDEX pattern is still present")
}
