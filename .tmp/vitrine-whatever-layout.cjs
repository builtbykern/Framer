const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const lint = await framer.agent.applyChanges(
    [
        'SET 14d41f00-d3b3-4455-b994-8566aa84333e light="rgb(255, 255, 255)";',
        'SET 724c8003-5371-4e26-9bfa-187223cdcf10 light="rgb(10, 10, 10)";',
        'SET 41c8b9ae-e604-40b6-9d37-a14c3803c179 light="rgb(120, 120, 120)";',
        'SET 2c57476b-49eb-4f39-af60-d016daa88256 light="rgb(228, 228, 226)";',
        'SET dPXgkd9PP textColor="rgb(10, 10, 10)" breakpoint.default.fontSize="15px";',
        'SET nzsp03Fh5 textColor="rgb(10, 10, 10)" breakpoint.default.fontSize="13px" breakpoint.default.letterSpacing="-0.02em";',
        'SET t5y0e5eot textColor="rgb(120, 120, 120)";',
        'SET BEFvspdZd textColor="rgb(120, 120, 120)" breakpoint.default.fontSize="10px";',
        'SET MmqIQ0wEw link.textColor="rgb(120, 120, 120)" link.hover.textColor="rgb(10, 10, 10)" link.current.textColor="rgb(10, 10, 10)";',
        'SET eGJAoz6x_ fill="rgb(228, 228, 226)";',
        'SET JN7M7ldcs visible="false";',
        'SET BZgqwOKfTJN7M7ldcs visible="false";',
        'SET GLlag6b9RJN7M7ldcs visible="false";',
        'SET S4aeyJLQaJN7M7ldcs visible="false";',
        'SET aDU_xPLrv visible="false";',
        'SET BZgqwOKfTaDU_xPLrv visible="false";',
        'SET GLlag6b9RaDU_xPLrv visible="false";',
        'SET S4aeyJLQaaDU_xPLrv visible="false";',
        'MOVE o7hTHauuw parent="omF0gODuR" index="0";',
        'MOVE ebjghUxzc parent="omF0gODuR" index="1";',
        'MOVE BZgqwOKfTo7hTHauuw parent="BZgqwOKfT" index="0";',
        'MOVE BZgqwOKfTebjghUxzc parent="BZgqwOKfT" index="1";',
        'MOVE GLlag6b9Ro7hTHauuw parent="GLlag6b9R" index="0";',
        'MOVE GLlag6b9RebjghUxzc parent="GLlag6b9R" index="1";',
        'MOVE S4aeyJLQao7hTHauuw parent="S4aeyJLQa" index="0";',
        'MOVE S4aeyJLQaebjghUxzc parent="S4aeyJLQa" index="1";',
        'SET omF0gODuR gap="6px";',
        'SET BZgqwOKfT gap="6px";',
        'SET GLlag6b9R gap="6px";',
        'SET S4aeyJLQa gap="6px";',
        'SET yAd2lMDSW gap="20px" padding="72px 32px 24px 32px";',
        'SET t62LHpSTayAd2lMDSW gap="24px" padding="48px 22px 20px 22px";',
        'SET u75vHQkARyAd2lMDSW gap="28px" padding="36px 16px 16px 16px";',
        'SET WQLkyLRf1 gap="0px" stackDistribution="start";',
        '+RichTextNode markFloor parent="WQLkyLRf1" name="Mark" text="vitrine" fontName="IBM Plex Sans" fontWeight="500" fontSize="auto-fit(100%)" letterSpacing="-0.07em" lineHeight="1" textColor="rgb(10, 10, 10)" width="100%" height="auto" padding="48px 28px 40px 28px";',
    ].join(" "),
    { pagePath: "/" }
)

const markId = lint.renamedIds?.markFloor || "markFloor"
const replicaSets = await framer.agent.applyChanges(
    [
        `SET t62LHpSTa${markId} padding="32px 22px 32px 22px";`,
        `SET u75vHQkAR${markId} padding="24px 16px 28px 16px";`,
    ].join(" "),
    { pagePath: "/" }
)

const fs = require("fs")
const dir = "/Users/noel/Desktop/Framer/.tmp/vitrine-shots"
for (const [id, name] of [
    ["WQLkyLRf1", "home-desktop.jpg"],
    ["t62LHpSTa", "home-tablet.jpg"],
    ["u75vHQkAR", "home-phone.jpg"],
    ["dKIZmzj_1", "piece-desktop.jpg"],
]) {
    const r = await framer.screenshot(id, { format: "jpeg", scale: 1 })
    fs.writeFileSync(`${dir}/${name}`, r.data)
}

console.log(
    JSON.stringify(
        {
            lint: { message: lint.message, errors: lint.linter?.errors, renamed: lint.renamedIds },
            replica: { message: replicaSets.message, errors: replicaSets.linter?.errors },
            markId,
        },
        null,
        2
    )
)
