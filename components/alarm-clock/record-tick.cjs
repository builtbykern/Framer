const { chromium } = require("playwright")
const path = require("path")
const fs = require("fs")

async function main() {
    const outDir = path.join(__dirname, "out")
    const html = path.join(outDir, "tick-demo.html")
    const videoDir = path.join(outDir, "video-tmp")
    fs.mkdirSync(videoDir, { recursive: true })

    const browser = await chromium.launch()
    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 },
        recordVideo: { dir: videoDir, size: { width: 1200, height: 800 } },
    })
    const page = await context.newPage()
    await page.goto("file://" + html)
    await page.waitForTimeout(4500)
    await context.close()
    await browser.close()

    const files = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"))
    if (!files.length) throw new Error("no webm recorded")
    const src = path.join(videoDir, files[0])
    const dest = path.join(outDir, "alarm-clock-tick-4s.webm")
    fs.copyFileSync(src, dest)
    for (const f of fs.readdirSync(videoDir)) fs.unlinkSync(path.join(videoDir, f))
    fs.rmdirSync(videoDir)
    console.log(JSON.stringify({ dest, bytes: fs.statSync(dest).size }))
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
