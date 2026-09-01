const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const lint = await framer.agent.applyChanges(
    [
        'SET 14d41f00-d3b3-4455-b994-8566aa84333e light="rgb(10, 10, 10)";',
        'SET 724c8003-5371-4e26-9bfa-187223cdcf10 light="rgb(232, 230, 225)";',
        'SET 41c8b9ae-e604-40b6-9d37-a14c3803c179 light="rgb(138, 138, 134)";',
        'SET 2c57476b-49eb-4f39-af60-d016daa88256 light="rgb(48, 48, 46)";',
        'SET dPXgkd9PP fontName="IBM Plex Sans" fontWeight="500" textColor="rgb(232, 230, 225)" breakpoint.default.fontSize="20px" breakpoint.default.letterSpacing="-0.03em";',
        'SET nzsp03Fh5 fontName="IBM Plex Sans" fontWeight="500" textColor="rgb(232, 230, 225)" breakpoint.default.fontSize="16px" breakpoint.default.letterSpacing="-0.02em";',
        'SET t5y0e5eot fontName="IBM Plex Sans" fontWeight="400" textColor="rgb(138, 138, 134)" breakpoint.default.fontSize="13px" breakpoint.default.lineHeight="1.4em";',
        'SET BEFvspdZd textColor="rgb(138, 138, 134)" breakpoint.default.fontSize="10px" breakpoint.default.letterSpacing="0.12em";',
        'SET eGJAoz6x_ fill="rgb(48, 48, 46)";',
    ].join(" "),
    { pagePath: "/" }
)

const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
fs.mkdirSync(dir, { recursive: true })
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
    ["tVu2ncruf", "house-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
}

console.log(JSON.stringify({ lint: { message: lint.message, errors: lint.linter?.errors, warnings: lint.linter?.warnings } }, null, 2))
