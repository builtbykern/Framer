/**
 * Sill listing MP4 — run AFTER Noel publishes the current canvas.
 *
 *   SILL_RECORD=1 node sill/assets/listing/record-demo.mjs
 *
 * Needs Chrome (channel chrome) and ffmpeg in PATH.
 * Output: sill/assets/listing/Sill_demo_3s.mp4
 *
 * Do not invent remix/preview URLs. Do not submit.
 */
import { chromium } from "../../../components/alarm-clock/node_modules/playwright-core/index.mjs"
import { spawn } from "node:child_process"
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = __dirname
const RAW = path.join(OUT_DIR, "_raw.webm")
const MP4 = path.join(OUT_DIR, "Sill_demo_3s.mp4")
const PREVIEW = process.env.SILL_PREVIEW_URL || "https://sill.framer.website/"

async function main() {
    if (process.env.SILL_RECORD !== "1") {
        console.error(
            "Refusing: canvas may be ahead of production. Set SILL_RECORD=1 after Noel publishes."
        )
        process.exit(2)
    }

    await mkdir(OUT_DIR, { recursive: true })

    const browser = await chromium.launch({
        channel: "chrome",
        headless: true,
    })
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
        reducedMotion: "no-preference",
    })
    const page = await context.newPage()
    await page.goto(PREVIEW, { waitUntil: "networkidle" })
    await page.waitForTimeout(900)

    const arbour = page.getByRole("option", { name: /Arbour/i })
    await arbour.scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)
    const box = await arbour.boundingBox()
    if (!box) throw new Error("Arbour row not found")

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
        steps: 18,
    })
    await page.waitForTimeout(1400)

    await page.mouse.move(box.x + box.width / 2, box.y + box.height + 80, {
        steps: 12,
    })
    await page.waitForTimeout(400)

    const strip = page.locator("[data-sill-cursor=drag]").first()
    if (await strip.count()) {
        const sb = await strip.boundingBox()
        if (sb) {
            await page.mouse.move(sb.x + 40, sb.y + sb.height / 2, { steps: 8 })
            await page.mouse.down()
            await page.mouse.move(sb.x + 220, sb.y + sb.height / 2, {
                steps: 16,
            })
            await page.mouse.up()
        }
    }

    await page.waitForTimeout(800)
    await context.close()
    await browser.close()

    const { readdir } = await import("node:fs/promises")
    const files = (await readdir(OUT_DIR)).filter((f) => f.endsWith(".webm"))
    const latest = files
        .map((f) => path.join(OUT_DIR, f))
        .sort()
        .at(-1)
    if (!latest) throw new Error("No webm recorded")
    await unlink(RAW).catch(() => {})
    const { rename } = await import("node:fs/promises")
    await rename(latest, RAW)

    await new Promise((resolve, reject) => {
        const ff = spawn(
            "ffmpeg",
            [
                "-y",
                "-i",
                RAW,
                "-an",
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-movflags",
                "+faststart",
                "-t",
                "5",
                MP4,
            ],
            { stdio: "inherit" }
        )
        ff.on("exit", (code) =>
            code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}`))
        )
    })
    await unlink(RAW).catch(() => {})
    console.log("wrote", MP4)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
