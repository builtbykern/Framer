const info = await framer.getProjectInfo()
const file = await framer.getCodeFile("Edge_Refraction_Shader.tsx")
const content = file?.content || ""

const ser = await framer.agent.serializeNodes(
    { ids: ["KU0iJd4nS", "WQLkyLRf1"], depth: 1 },
    { pagePath: "/" }
)
const inst = ser.find((n) => n.id === "KU0iJd4nS")
const desk = ser.find((n) => n.id === "WQLkyLRf1")

let shot = null
let shotErr = null
try {
    shot = await framer.agent.screenshot(
        { id: "WQLkyLRf1" },
        { pagePath: "/" }
    )
} catch (e) {
    shotErr = String(e && e.message ? e.message : e)
}

let review = null
try {
    review = await framer.agent.reviewChanges()
} catch (e) {
    review = { err: String(e) }
}

console.log(
    JSON.stringify(
        {
            project: info.name,
            lines: content.split("\n").length,
            hasStaticGuard: /useIsStaticRenderer/.test(content),
            skipsGlWhenStatic: /if \(isStatic\) return/.test(content),
            idleDefaultZero: /idleAmount:[\s\S]*?defaultValue:\s*0/.test(
                content
            ),
            fragAlphaFactor: /alpha \* 0\.28/.test(content),
            samplesTexture: /texture2D|sampler2D/.test(content),
            instance: inst
                ? {
                      id: inst.id,
                      name: inst.name,
                      type: inst.type,
                      rect: inst.$rect,
                      attrs: inst.attributes,
                  }
                : null,
            deskOverride: desk?.attributes?.codeOverride ?? null,
            deskChildCount: desk?.children?.length ?? null,
            screenshot: shot
                ? {
                      keys: Object.keys(shot),
                      url: shot.url || shot.imageUrl || shot.src || null,
                      dataLen: shot.data
                          ? String(shot.data).length
                          : shot.base64
                            ? String(shot.base64).length
                            : null,
                  }
                : null,
            shotErr,
            reviewErrors: review?.errors ?? review,
        },
        null,
        2
    )
)
