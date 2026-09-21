const { chromium } = require("../alarm-clock/node_modules/playwright")
const path = require("path")
const fs = require("fs")

const VERSION = process.argv[2] || "16682eb5a"
const URL = `https://basic-quail-243157.framer.app/?v=${VERSION}`
const outDir = path.join(__dirname, "out")

function digest(buf) {
    let hash = 0
    for (let i = 0; i < buf.length; i += 32) hash = (hash + buf[i]) | 0
    return `${buf.length}:${hash}`
}

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
    await page.waitForTimeout(500)
}

async function sampleCanvas(page) {
    return page.evaluate(() => {
        const canvas = document.querySelector(
            "[data-lanyard-stage='true'] canvas"
        )
        if (!canvas) return null
        const gl =
            canvas.getContext("webgl2") || canvas.getContext("webgl")
        if (!gl) return null
        const w = canvas.width
        const h = canvas.height
        const cx = Math.round(w * 0.52)
        const cy = Math.round(h * 0.48)
        const size = 48
        const x = Math.max(0, cx - size / 2)
        const y = Math.max(0, h - cy - size / 2)
        const pixels = new Uint8Array(size * size * 4)
        gl.readPixels(x, y, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
        let r = 0
        let g = 0
        let b = 0
        let n = 0
        for (let i = 0; i < pixels.length; i += 4) {
            r += pixels[i]
            g += pixels[i + 1]
            b += pixels[i + 2]
            n += 1
        }
        return {
            mean: [Math.round(r / n), Math.round(g / n), Math.round(b / n)],
            w,
            h,
        }
    })
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
    await waitForStage(page)

    const shots = ["holo-a.png", "holo-b.png", "holo-c.png"]
    const samples = []
    const hashes = []
    const stage = page.locator("[data-lanyard-stage='true']")
    for (let i = 0; i < shots.length; i++) {
        if (i > 0) await page.waitForTimeout(1100)
        const file = path.join(outDir, shots[i])
        await stage.screenshot({ path: file })
        hashes.push(digest(fs.readFileSync(file)))
        samples.push(await sampleCanvas(page))
    }

    await context.close()
    await browser.close()

    const shifted = hashes[0] !== hashes[1] || hashes[1] !== hashes[2]
    const means = samples.map((s) => (s ? s.mean.join(",") : "none"))
    const meanShifted = means[0] !== means[1] || means[1] !== means[2]

    const result = {
        url: URL,
        shifted,
        meanShifted,
        hashes,
        means,
        samples,
        shots,
    }
    fs.writeFileSync(
        path.join(outDir, "prove-holo.json"),
        JSON.stringify(result, null, 2)
    )
    console.log(JSON.stringify(result, null, 2))
    if (!shifted && !meanShifted) process.exit(2)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
