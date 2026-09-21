const { chromium } = require("../alarm-clock/node_modules/playwright")
const path = require("path")
const fs = require("fs")

async function main() {
    const outDir = path.join(__dirname, "out")
    const videoDir = path.join(outDir, "video-tmp")
    fs.mkdirSync(videoDir, { recursive: true })

    const browser = await chromium.launch()
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        recordVideo: { dir: videoDir, size: { width: 1280, height: 800 } },
        reducedMotion: "no-preference",
    })
    const page = await context.newPage()
    await page.goto("https://basic-quail-243157.framer.app/", {
        waitUntil: "domcontentloaded",
    })
    await page.waitForSelector("[data-lanyard-stage='true']", { timeout: 20000 })
    const stage = page.locator("[data-lanyard-stage='true']")
    await stage.waitFor({ state: "visible", timeout: 15000 })
    const box = await stage.boundingBox()
    if (!box) throw new Error("no stage box")
    const cx = box.x + box.width / 2
    const cy = box.y + box.height * 0.45
    await page.waitForTimeout(400)
    await page.mouse.move(cx, cy)
    await page.mouse.down()
    await page.mouse.move(cx + 90, cy + 12, { steps: 18 })
    await page.waitForTimeout(180)
    await page.mouse.move(cx - 110, cy + 8, { steps: 22 })
    await page.waitForTimeout(160)
    await page.mouse.up()
    await page.waitForTimeout(900)
    await page.screenshot({
        path: path.join(outDir, "preview-after-swing.png"),
    })
    await context.close()
    await browser.close()

    const files = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"))
    if (!files.length) throw new Error("no webm recorded")
    const src = path.join(videoDir, files[0])
    const dest = path.join(outDir, "lanyard-swing.webm")
    fs.copyFileSync(src, dest)
    for (const f of fs.readdirSync(videoDir)) {
        fs.unlinkSync(path.join(videoDir, f))
    }
    fs.rmdirSync(videoDir)
    console.log(JSON.stringify({ dest, bytes: fs.statSync(dest).size }))
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
