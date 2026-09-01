const { chromium } = require("playwright")
const fs = require("fs")

const url =
  process.argv[2] ||
  "https://independent-information-038302-ca9581a3c.framer.app/neighbourhoods"

;(async () => {
  const browser = await chromium.launch()
  const results = []
  for (const [label, w, h] of [
    ["D", 1440, 900],
    ["T", 810, 1000],
    ["P", 390, 900],
  ]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } })
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 })
    await page.waitForTimeout(2000)

    const data = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll("img")].map((img) => ({
        src: (img.currentSrc || img.src || "").split("?")[0],
        w: img.naturalWidth,
        h: img.naturalHeight,
      }))
      const placeholder = imgs.filter((i) => i.src.includes("LbYhvKzw"))
      const bgUrls = []
      for (const el of document.querySelectorAll("*")) {
        const bg = getComputedStyle(el).backgroundImage || ""
        if (!bg.includes("framerusercontent.com")) continue
        const m = bg.match(/url\(["']?([^"')]+)/)
        if (m?.[1]) bgUrls.push(m[1].split("?")[0])
        if (bgUrls.length >= 20) break
      }
      return {
        imgCount: imgs.length,
        placeholderCount: placeholder.length,
        bgUrls: [...new Set(bgUrls)],
        hasChelsea: document.body.innerText.includes("Chelsea"),
        hasContentPlaceholder: /\bContent\b/.test(
          document.body.innerText.slice(0, 2000)
        ),
      }
    })

    const path = `.tmp/arbour-nh-live-${label}.png`
    await page.screenshot({ path, fullPage: false })
    results.push({ label, w, path, ...data })
    await page.close()
  }
  await browser.close()
  fs.writeFileSync(".tmp/arbour-nh-live-check.json", JSON.stringify(results, null, 2))
  console.log(JSON.stringify(results, null, 2))
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
