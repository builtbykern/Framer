import { chromium } from "playwright"

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto("https://arbour.framer.website/contact", { waitUntil: "networkidle" })
await page.waitForTimeout(3000)

const info = await page.evaluate(() => {
  const h1s = [...document.querySelectorAll("h1")]
  const named = [...document.querySelectorAll('[data-framer-name="H1 Blend Wrap"]')]
  const styles = document.querySelectorAll("style")
  let blendCss = []
  for (const s of styles) {
    if (s.textContent && s.textContent.includes("H1 Blend Wrap")) {
      blendCss.push(s.textContent.slice(0, 1000))
    }
  }
  // also look for large text nodes
  const all = [...document.querySelectorAll("p, h1, h2, h3, span")]
    .filter((el) => {
      const t = (el.innerText || "").trim()
      return t.length > 20 && getComputedStyle(el).fontSize.replace("px", "") > 28
    })
    .slice(0, 8)
    .map((el) => {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        tag: el.tagName,
        text: el.innerText.slice(0, 100),
        color: cs.color,
        opacity: cs.opacity,
        mixBlendMode: cs.mixBlendMode,
        fontSize: cs.fontSize,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      }
    })

  return {
    h1Count: h1s.length,
    h1s: h1s.map((el) => {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        text: (el.innerText || "").slice(0, 120),
        color: cs.color,
        opacity: cs.opacity,
        visibility: cs.visibility,
        mixBlendMode: cs.mixBlendMode,
        textShadow: (cs.textShadow || "").slice(0, 160),
        fontSize: cs.fontSize,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      }
    }),
    wraps: named.map((el) => {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        mixBlendMode: cs.mixBlendMode,
        opacity: cs.opacity,
        color: cs.color,
        textShadow: (cs.textShadow || "").slice(0, 160),
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        text: (el.innerText || "").slice(0, 120),
      }
    }),
    largeText: all,
    blendCss,
  }
})

console.log(JSON.stringify(info, null, 2))
await page.screenshot({ path: ".tmp/arbour-contact-readable-d2.png", fullPage: false })
await browser.close()
