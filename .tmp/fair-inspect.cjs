const info = await framer.getProjectInfo()
const home = await framer.agent.serializeNodes({
    ids: ["augiA20Il"],
    depth: 3,
})
const fonts = await framer.agent.readProject(
    [
        { type: "font-search", name: "Syne" },
        { type: "font-search", name: "IBM Plex Mono" },
        { type: "font-search", name: "Inter" },
        { type: "implementation-guide-from-index", name: "CMS Collection Lists" },
    ],
    { pagePath: "/" }
)
console.log(
    JSON.stringify(
        {
            info,
            home: home[0]
                ? {
                      id: home[0].id,
                      name: home[0].name,
                      path: home[0].attributes?.path,
                      breakpoints: home[0].$breakpoints,
                      children: home[0].children?.map((c) => ({
                          id: c.id,
                          name: c.name,
                          type: c.type,
                          width: c.attributes?.width,
                          height: c.attributes?.height,
                          fill: c.attributes?.fill,
                          kids: c.children?.length ?? 0,
                      })),
                  }
                : home,
            fontKeys: fonts && typeof fonts === "object" ? Object.keys(fonts) : fonts,
        },
        null,
        2
    )
)
