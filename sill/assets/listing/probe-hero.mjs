/**
 * Hero onMount frames — production Home.
 *   node sill/assets/listing/probe-hero.mjs
 */
import { chromium } from "../../../components/alarm-clock/node_modules/playwright-core/index.mjs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { mkdir } from "node:fs/promises"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const URL = process.env.SILL_PREVIEW_URL || "https://sill.framer.website/"

const browser = await chromium.launch({ channel: "chrome", headless: true })
const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
})
await mkdir(__dirname, { recursive: true })
await page.goto(URL, { waitUntil: "domcontentloaded" })
const times = [0, 180, 360, 700, 1100]
const frames = []
for (const t of times) {
    await page.waitForTimeout(t === 0 ? 40 : t - (times[times.indexOf(t) - 1] || 0))
    const shot = path.join(__dirname, `probe-hero-${String(t).padStart(4, "0")}.png`)
    await page.screenshot({ path: shot })
    const state = await page.evaluate(() => {
        const h1 = document.querySelector("h1")
        const line = document.querySelector("h2")
        const year = [...document.querySelectorAll("p, span, div")].find((el) =>
            /^\s*Studio\s*·\s*2026\s*$/.test(el.textContent || "")
        )
        const still = document.querySelector("img")
        const op = (el) => (el ? getComputedStyle(el).opacity : null)
        return {
            h1: op(h1),
            line: op(line),
            year: op(year),
            still: still
                ? {
                      op: op(still),
                      alt: still.alt.slice(0, 40),
                  }
                : null,
        }
    })
    frames.push({ t, state, shot })
}
console.log(JSON.stringify(frames, null, 2))
await browser.close()
