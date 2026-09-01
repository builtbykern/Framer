const info = await framer.getProjectInfo()
if (info.name !== "Halden") throw new Error(info.name)

const listed = []
for (const k in framer) listed.push(k)
const own = Object.getOwnPropertyNames(framer)

const pageId = "fpoP3kuA4"
const attempts = []
for (const dsl of [
    `+GalleryVariable pageGal name="Lookbook Gallery" scope="${pageId}";`,
    `+GalleryVariable pageGal2 name="Lookbook Gallery" scope="rtJNTCNFr";`,
    `+Variable pageImg name="Still Image" type="image" scope="${pageId}";`,
]) {
    const r = await framer.agent.applyChanges(dsl, { pagePath: "/work/:Work" })
    attempts.push({
        dsl,
        errors: r.errors,
        message: r.message,
        renamedIds: r.renamedIds,
    })
}

const del = await framer.agent.applyChanges(`DEL V8E8Dw0jT;`, { pagePath: "/" })

console.log(
    JSON.stringify(
        {
            listed,
            own,
            attempts,
            del: { errors: del.errors, message: del.message },
        },
        null,
        2
    )
)
