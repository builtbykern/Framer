const { chromium } = require("../alarm-clock/node_modules/playwright")

async function main() {
    const browser = await chromium.launch()
    const page = await (await browser.newContext({
        viewport: { width: 1280, height: 800 },
        reducedMotion: "no-preference",
    })).newPage()
    await page.goto("https://basic-quail-243157.framer.app/", {
        waitUntil: "domcontentloaded",
    })
    await page.waitForTimeout(1200)
    const info = await page.evaluate(() => {
        const frames = Array.from(document.querySelectorAll("iframe")).map((f) => ({
            src: f.src,
            w: f.clientWidth,
            h: f.clientHeight,
        }))
        const articles = Array.from(document.querySelectorAll("article")).map((el) => {
            const r = el.getBoundingClientRect()
            return {
                label: el.getAttribute("aria-label"),
                transform: el.style.transform,
                cursor: getComputedStyle(el).cursor,
                x: r.x,
                y: r.y,
                w: r.width,
                h: r.height,
            }
        })
        const stage = document.querySelector("[data-lanyard-stage='true']")
        const stageBox = stage ? stage.getBoundingClientRect() : null
        const hit = document.elementFromPoint(640, 400)
        return {
            frames,
            articles,
            stage: stageBox
                ? { x: stageBox.x, y: stageBox.y, w: stageBox.width, h: stageBox.height }
                : null,
            hit: hit
                ? { tag: hit.tagName, cls: hit.className, text: (hit.textContent || "").slice(0, 80) }
                : null,
        }
    })
    console.log(JSON.stringify(info, null, 2))
    await browser.close()
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
