/**
 * Playwright screenshots for Sill Skin A preview.
 * Overwrites Project Context media/sill/preview-*.png
 */
import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const BASE = process.env.SILL_PREVIEW_URL ?? "http://127.0.0.1:5173"
const OUT_DIR =
  process.env.SILL_SHOT_DIR ??
  "/cursor/stores/bc-29d6bad1-a55c-4d30-894f-21c701117555/media/sill"

async function waitReady(page) {
  await page.goto(BASE, { waitUntil: "networkidle" })
  await page.waitForSelector(".sill__still img")
  await page.waitForFunction(() => {
    const img = document.querySelector(".sill__still img")
    return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0
  })
  // Settle fonts + layout
  await page.waitForTimeout(400)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })

  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })
  await waitReady(desktop)
  const desktopPath = path.join(OUT_DIR, "preview-desktop.png")
  await desktop.screenshot({ path: desktopPath, fullPage: false })
  console.log("wrote", desktopPath)

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  })
  await waitReady(mobile)
  const mobilePath = path.join(OUT_DIR, "preview-mobile.png")
  await mobile.screenshot({ path: mobilePath, fullPage: false })
  console.log("wrote", mobilePath)

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
