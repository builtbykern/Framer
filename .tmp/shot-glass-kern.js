const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp"
const card = await framer.screenshot("Ticm7kYDN", { format: "png", scale: 1 })
const desk = await framer.screenshot("WQLkyLRf1", { format: "png", scale: 1 })
fs.writeFileSync(`${dir}/glass-kern-card.png`, card.data)
fs.writeFileSync(`${dir}/glass-kern-desk.png`, desk.data)
console.log("card", card.data.length, "desk", desk.data.length)
