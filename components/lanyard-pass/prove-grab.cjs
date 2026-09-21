const { chromium } = require("../alarm-clock/node_modules/playwright")
const path = require("path")
const fs = require("fs")

const VERSION = process.argv[2] || "b467ec366"
const URL = `https://basic-quail-243157.framer.app/?v=${VERSION}`
const outDir = path.join(__dirname, "out")

function digest(filePath) {
    const buf = fs.readFileSync(filePath)
    let hash = 0
    for (let i = 0; i < buf.length; i += 47) hash = (hash + buf[i]) | 0
    return `${buf.length}:${hash}`
}

async function main() {
    fs.mkdirSync(outDir, { recursive: true })
    const browser = await chromium.launch()
    const context = await browser.newContext({
        viewport: { width: 1280, height: 860 },
        reducedMotion: "no-preference",
    })
    const page = await context.newPage()
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 25000 })
    await page.waitForSelector("[data-lanyard-stage='true'] canvas", {
        timeout: 25000,
    })
    await page.waitForTimeout(1200)
    const stage = page.locator("[data-lanyard-stage='true']").first()
    const box = await stage.boundingBox()
    if (!box) throw new Error("no stage box")
    const rest = path.join(outDir, "grab-rest.png")
    const pull = path.join(outDir, "grab-pull.png")
    const thrown = path.join(outDir, "grab-throw.png")
    await stage.screenshot({ path: rest })

    const x0 = box.x + box.width * 0.52
    const y0 = box.y + box.height * 0.62
    await page.mouse.move(x0, y0)
    await page.mouse.down()
    for (let i = 1; i <= 16; i++) {
        await page.mouse.move(x0 + i * 14, y0 + i * 10)
        await page.waitForTimeout(16)
    }
    await stage.screenshot({ path: pull })
    await page.mouse.up()
    await page.waitForTimeout(700)
    await stage.screenshot({ path: thrown })
    await browser.close()

    const dRest = digest(rest)
    const dPull = digest(pull)
    const dThrow = digest(thrown)
    const moved = dRest !== dPull
    const result = { url: URL, rest: dRest, pull: dPull, thrown: dThrow, moved }
    console.log(JSON.stringify(result, null, 2))
    if (!moved) process.exit(2)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
