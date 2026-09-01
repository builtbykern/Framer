const pagePath = "/contact"
const s = await framer.agent.serialize({ id: "qB71RMXEV", depth: 4 }, { pagePath })
console.log(JSON.stringify(s, (k, v) => (typeof v === "string" && v.length > 180 ? v.slice(0, 180) : v), 2).slice(0, 6000))

const email = await framer.getNode("EuA2UleYw")
console.log("EuA2UleYw", email && { name: email.name, textColor: email.textColor, bg: email.backgroundColor })
if (email?.getText) console.log("text", await email.getText())
