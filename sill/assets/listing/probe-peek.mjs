/**
 * Peek visual probe — production Home, real pointer.
 *   node sill/assets/listing/probe-peek.mjs
 */
import { chromium } from "../../../components/alarm-clock/node_modules/playwright-core/index.mjs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { mkdir } from "node:fs/promises"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, "probe-peek.png")
const URL = process.env.SILL_PREVIEW_URL || "https://sill.framer.website/"

const browser = await chromium.launch({ channel: "chrome", headless: true })
const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
})
await page.goto(URL, { waitUntil: "networkidle" })
await page.waitForTimeout(800)
const arbour = page.getByRole("option", { name: /Arbour/i })
await arbour.scrollIntoViewIfNeeded()
await page.waitForTimeout(300)
const box = await arbour.boundingBox()
if (!box) throw new Error("no Arbour")
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
    steps: 16,
})
await page.waitForTimeout(500)
await mkdir(__dirname, { recursive: true })
await page.screenshot({ path: OUT })
const peek = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")].filter((i) =>
        /grape|lemon|mug/i.test(i.alt || "")
    )
    return imgs.map((i) => {
        const s = getComputedStyle(i)
        const r = i.getBoundingClientRect()
        return {
            alt: i.alt.slice(0, 48),
            opacity: s.opacity,
            w: Math.round(r.width),
            h: Math.round(r.height),
            x: Math.round(r.x),
            y: Math.round(r.y),
        }
    })
})
console.log(JSON.stringify({ out: OUT, peek }, null, 2))
await browser.close()
