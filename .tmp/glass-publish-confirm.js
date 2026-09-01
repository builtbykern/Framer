const result = await framer.agent.publish({
    action: "confirm_publish",
    confirmationHash: "1cypxn0",
})
console.log(JSON.stringify(result, null, 2).slice(0, 6000))
