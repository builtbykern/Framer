const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const home = await framer.getNode("WQLkyLRf1")
const kids = []
for (const id of home.children || []) {
    const n = await framer.getNode(id)
    kids.push({ id, name: n?.name, type: n?.__class, visible: n?.visible })
}

const mark = await framer.getNode("YuQho50Zq")
const title = await framer.getNode("o7hTHauuw")
const year = await framer.getNode("ebjghUxzc")
const type = await framer.getNode("JN7M7ldcs")
const still = await framer.getNode("aDU_xPLrv")
const field = await framer.getColorStyle("14d41f00-d3b3-4455-b994-8566aa84333e")
const ink = await framer.getColorStyle("724c8003-5371-4e26-9bfa-187223cdcf10")

const tabletMark = await framer.getNode("t62LHpSTaYuQho50Zq")
const phoneMark = await framer.getNode("u75vHQkARYuQho50Zq")

console.log(
    JSON.stringify(
        {
            homeKids: kids,
            mark: mark
                ? {
                      name: mark.name,
                      fontSize: mark.fontSize,
                      width: mark.width,
                      text: mark.text,
                  }
                : null,
            square: {
                titleH: title?.height,
                yearH: year?.height,
                typeVisible: type?.visible,
                stillVisible: still?.visible,
            },
            tokens: {
                field: field?.light,
                ink: ink?.light,
            },
            replicaMarks: {
                tablet: tabletMark ? tabletMark.name : null,
                phone: phoneMark ? phoneMark.name : null,
            },
        },
        null,
        2
    )
)
