const { chromium } = require("../alarm-clock/node_modules/playwright")
const path = require("path")
const fs = require("fs")

function tx(transform) {
    const match = /translate3d\(([-\d.]+)px,\s*([-\d.]+)px/.exec(transform || "")
    if (match) return { x: Number(match[1]), y: Number(match[2]) }
    const match2 = /translate\(([-\d.]+)px,\s*([-\d.]+)px/.exec(transform || "")
    if (match2) return { x: Number(match2[1]), y: Number(match2[2]) }
    return { x: 0, y: 0, raw: transform }
}

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
        timeout: 20000,
    })
    await page.waitForSelector("[data-lanyard-stage='true']", { timeout: 20000 })
    await page.evaluate(() => {
        document.querySelectorAll("iframe").forEach((frame) => frame.remove())
        document.querySelectorAll("button, a").forEach((node) => {
            const text = (node.textContent || "").toLowerCase()
            if (text.includes("edit") || text.includes("made in framer")) {
                node.remove()
            }
        })
    })
    await page.waitForTimeout(600)

    const card = page.locator("article").first()
    const rest = await card.evaluate((el) => el.style.transform)
    await page.screenshot({ path: path.join(outDir, "preview-rest.png") })

    await page.evaluate(async () => {
        const stage = document.querySelector("[data-lanyard-stage='true']")
        const cardEl = document.querySelector("article")
        if (!stage || !cardEl) throw new Error("missing stage/card")
        const box = cardEl.getBoundingClientRect()
        const x0 = box.left + box.width / 2
        const y0 = box.top + 36
        const fire = (type, x, y) => {
            stage.dispatchEvent(
                new PointerEvent(type, {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    pointerId: 1,
                    pointerType: "mouse",
                    isPrimary: true,
                    clientX: x,
                    clientY: y,
                    buttons: type === "pointerup" ? 0 : 1,
                    button: 0,
                })
            )
        }
        fire("pointerdown", x0, y0)
        for (let i = 1; i <= 18; i++) {
            fire("pointermove", x0 + i * 10, y0 + i * 4)
            await new Promise((resolve) => requestAnimationFrame(resolve))
        }
    })
    await page.waitForTimeout(80)
    const pulled = await card.evaluate((el) => el.style.transform)
    await page.screenshot({ path: path.join(outDir, "preview-pull.png") })

    await page.evaluate(async () => {
        const stage = document.querySelector("[data-lanyard-stage='true']")
        const cardEl = document.querySelector("article")
        if (!stage || !cardEl) return
        const box = cardEl.getBoundingClientRect()
        const x = box.left + box.width / 2
        const y = box.top + 36
        for (let i = 1; i <= 8; i++) {
            stage.dispatchEvent(
                new PointerEvent("pointermove", {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    pointerId: 1,
                    pointerType: "mouse",
                    isPrimary: true,
                    clientX: x + 180 + i * 8,
                    clientY: y - i * 6,
                    buttons: 1,
                    button: 0,
                })
            )
            await new Promise((resolve) => requestAnimationFrame(resolve))
        }
        window.dispatchEvent(
            new PointerEvent("pointerup", {
                bubbles: true,
                cancelable: true,
                composed: true,
                pointerId: 1,
                pointerType: "mouse",
                isPrimary: true,
                buttons: 0,
                button: 0,
            })
        )
    })
    await page.waitForTimeout(140)
    const thrown = await card.evaluate((el) => el.style.transform)
    await page.screenshot({ path: path.join(outDir, "preview-throw.png") })
    await page.waitForTimeout(1100)
    const settled = await card.evaluate((el) => el.style.transform)
    await page.screenshot({
        path: path.join(outDir, "preview-after-swing.png"),
    })

    await context.close()
    await browser.close()

    const files = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"))
    if (!files.length) throw new Error("no webm recorded")
    const dest = path.join(outDir, "lanyard-throw.webm")
    fs.copyFileSync(path.join(videoDir, files[0]), dest)
    for (const f of fs.readdirSync(videoDir)) {
        fs.unlinkSync(path.join(videoDir, f))
    }
    fs.rmdirSync(videoDir)

    const restP = tx(rest)
    const pulledP = tx(pulled)
    const thrownP = tx(thrown)
    const dx = Math.hypot(pulledP.x - restP.x, pulledP.y - restP.y)
    if (dx < 40) {
        throw new Error(
            `grab did not pull far enough: rest=${rest} pulled=${pulled} dx=${dx}`
        )
    }
    console.log(
        JSON.stringify({
            dest,
            bytes: fs.statSync(dest).size,
            rest,
            pulled,
            thrown,
            settled,
            pullDistance: dx,
        })
    )
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
