const controls = await framer.agent.readComponentControls({
    componentIds: ["codeFile/JSNhsqh:default"],
})
console.log(JSON.stringify(controls, null, 2).slice(0, 5000))
