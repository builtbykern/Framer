const { chromium } = require("../alarm-clock/node_modules/playwright")
const path = require("path")
const fs = require("fs")

async function digest(filePath) {
    const buf = fs.readFileSync(filePath)
    let hash = 0
    for (let i = 0; i < buf.length; i += 64) hash = (hash + buf[i]) | 0
    return `${buf.length}:${hash}`
}

async function main() {
    const outDir = path.join(__dirname, "out")
    fs.mkdirSync(outDir, { recursive: true })
    const browser = await chromium.launch()
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        reducedMotion: "reduce",
    })
    const page = await context.newPage()
    await page.goto("https://basic-quail-243157.framer.app/", {
        waitUntil: "domcontentloaded",
    })
    await page.waitForSelector("[data-lanyard-stage='true'] canvas", {
        timeout: 20000,
    })
    const stage = page.locator("[data-lanyard-stage='true']").first()
    const a = path.join(outDir, "reduced-motion-a.png")
    const b = path.join(outDir, "reduced-motion.png")
    await stage.screenshot({ path: a })
    await page.waitForTimeout(800)
    await stage.screenshot({ path: b })
    const before = await digest(a)
    const after = await digest(b)
    console.log(
        JSON.stringify({
            before,
            after,
            unchanged: before === after,
        })
    )
    await browser.close()
    if (before !== after) process.exit(2)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
