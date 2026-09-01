const title = await framer.agent.getNode({ id: "GAokM9PPJ" }, { pagePath: "/" })
const a = title?.attributes || {}
const info = await framer.getProjectInfo()
console.log(
    JSON.stringify(
        {
            project: info.name,
            text: a.text,
            html: a.html,
            bind: a.textContent || a.$text,
            keys: Object.keys(a).filter((k) => /text|html|variable|bind/i.test(k)),
        },
        null,
        2
    )
)
