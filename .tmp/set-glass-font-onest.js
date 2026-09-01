const onest = {
    fontSelector: "GF;Onest-regular",
    letterSpacing: [0, "em"],
    lineHeight: [1, "em"],
}
try {
    const r = await framer.setAttributes("SpJLywBKC", {
        $control__font: onest,
    })
    console.log("set $control__font", r && r.id)
} catch (e) {
    console.log("set $control__font fail", String(e).slice(0, 400))
}
try {
    const r2 = await framer.setAttributes("SpJLywBKC", { font: onest })
    console.log("set font", r2 && r2.id)
} catch (e) {
    console.log("set font fail", String(e).slice(0, 400))
}

const node = await framer.agent.serialize(
    { id: "SpJLywBKC", depth: 0 },
    { pagePath: "/" }
)
console.log(
    "font now",
    JSON.stringify(node.attributes?.["$control__font"]).slice(0, 400)
)
