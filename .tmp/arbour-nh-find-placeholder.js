const { chromium } = require("playwright")

const url =
  process.argv[2] ||
  "https://minimum-directions-600719-d5fb105c1.framer.app/neighbourhoods"

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 })
  await page.waitForTimeout(2000)

  const hits = await page.evaluate(() => {
    const out = []
    for (const img of document.querySelectorAll("img")) {
      const src = img.currentSrc || img.src || ""
      if (!src.includes("LbYhvKzw")) continue
      const r = img.getBoundingClientRect()
      const cs = getComputedStyle(img)
      out.push({
        kind: "img",
        src: src.split("?")[0],
        display: cs.display,
        visibility: cs.visibility,
        opacity: cs.opacity,
        w: Math.round(r.width),
        h: Math.round(r.height),
        parent: img.parentElement?.className || img.parentElement?.tagName,
        grand: img.parentElement?.parentElement?.className || "",
        outer: img.outerHTML.slice(0, 300),
      })
    }
    // source/srcset
    for (const el of document.querySelectorAll("[srcset], source")) {
      const ss = el.getAttribute("srcset") || ""
      if (!ss.includes("LbYhvKzw")) continue
      out.push({ kind: "srcset", tag: el.tagName, ss: ss.slice(0, 200) })
    }
    // inline styles / attributes
    const html = document.documentElement.innerHTML
    const idx = html.indexOf("LbYhvKzw")
    out.push({
      kind: "html-index",
      idx,
      context: idx >= 0 ? html.slice(Math.max(0, idx - 120), idx + 180) : null,
      count: (html.match(/LbYhvKzw/g) || []).length,
    })
    return out
  })

  console.log(JSON.stringify(hits, null, 2))
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
