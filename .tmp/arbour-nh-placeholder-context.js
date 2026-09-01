const { chromium } = require("playwright")

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } })
  await page.goto(
    "https://minimum-directions-600719-d5fb105c1.framer.app/neighbourhoods",
    { waitUntil: "networkidle", timeout: 90000 }
  )
  await page.waitForTimeout(1500)

  const info = await page.evaluate(() => {
    const img = [...document.querySelectorAll("img")].find((i) =>
      (i.currentSrc || i.src || "").includes("LbYhvKzw")
    )
    if (!img) return { missing: true }
    const r = img.getBoundingClientRect()
    // walk up for text context / data attributes
    const chain = []
    let el = img
    for (let i = 0; i < 12 && el; i++) {
      chain.push({
        tag: el.tagName,
        id: el.id,
        cls: (el.className || "").toString().slice(0, 80),
        data: [...el.attributes]
          .filter((a) => a.name.startsWith("data-"))
          .map((a) => `${a.name}=${a.value}`)
          .slice(0, 6),
        text: (el.innerText || "").slice(0, 100).replace(/\s+/g, " "),
      })
      el = el.parentElement
    }
    // scroll into view coords
    return {
      rect: {
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
      },
      chain,
      bodyH: document.body.scrollHeight,
    }
  })

  // screenshot the placeholder region
  const img = page.locator('img[srcset*="LbYhvKzw"], img[src*="LbYhvKzw"]').first()
  await img.scrollIntoViewIfNeeded()
  await img.screenshot({ path: ".tmp/arbour-nh-placeholder-crop.png" })
  console.log(JSON.stringify(info, null, 2))
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
