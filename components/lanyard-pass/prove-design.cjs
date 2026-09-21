const { chromium } = require("../alarm-clock/node_modules/playwright")
const path = require("path")
const fs = require("fs")

const VERSION = process.argv[2] || "4b3ed7d15"
const URL = `https://basic-quail-243157.framer.app/?v=${VERSION}`
const outDir = path.join(__dirname, "out")

async function waitForStage(page) {
    await page.waitForSelector("[data-lanyard-stage='true'] canvas", {
        timeout: 25000,
    })
    await page.waitForFunction(() => {
        const canvas = document.querySelector(
            "[data-lanyard-stage='true'] canvas"
        )
        return Boolean(canvas && canvas.width > 8 && canvas.height > 8)
    }, null, { timeout: 20000 })
    await page.waitForTimeout(700)
}

async function shotStage(page, name) {
    const stage = page.locator("[data-lanyard-stage='true']")
    await stage.screenshot({ path: path.join(outDir, name) })
}

async function fileDigest(filePath) {
    const buf = fs.readFileSync(filePath)
    let hash = 0
    for (let i = 0; i < buf.length; i += 64) hash = (hash + buf[i]) | 0
    return `${buf.length}:${hash}`
}

async function main() {
    fs.mkdirSync(outDir, { recursive: true })
    const browser = await chromium.launch()

    const live = await browser.newContext({
        viewport: { width: 1280, height: 860 },
        reducedMotion: "no-preference",
    })
    const page = await live.newPage()
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 25000 })
    await waitForStage(page)
    await shotStage(page, "design-front.png")
    await page.waitForTimeout(1300)
    await shotStage(page, "design-edge.png")
    await page.waitForTimeout(2400)
    await shotStage(page, "design-back.png")
    await live.close()

    const reduced = await browser.newContext({
        viewport: { width: 1280, height: 860 },
        reducedMotion: "reduce",
    })
    const rm = await reduced.newPage()
    await rm.goto(URL, { waitUntil: "domcontentloaded", timeout: 25000 })
    await waitForStage(rm)
    const aPath = path.join(outDir, "design-reduced-a.png")
    const bPath = path.join(outDir, "design-reduced.png")
    await shotStage(rm, "design-reduced-a.png")
    await rm.waitForTimeout(900)
    await shotStage(rm, "design-reduced.png")
    const before = await fileDigest(aPath)
    const after = await fileDigest(bPath)
    await reduced.close()
    await browser.close()

    const result = {
        url: URL,
        reducedUnchanged: before === after,
        before,
        after,
        shots: [
            "design-front.png",
            "design-edge.png",
            "design-back.png",
            "design-reduced.png",
        ],
    }
    console.log(JSON.stringify(result, null, 2))
    if (!result.reducedUnchanged) {
        process.exitCode = 2
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
