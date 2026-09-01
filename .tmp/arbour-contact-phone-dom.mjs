import { chromium } from "playwright"

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto("https://arbour.framer.website/contact", { waitUntil: "networkidle" })
await page.waitForTimeout(3500)

const info = await page.evaluate(() => {
  const h1s = [...document.querySelectorAll("h1")]
  const named = [...document.querySelectorAll('[data-framer-name]')]
    .filter((el) => /H1|Enquiry|PRIVATE|Hero|Blend/i.test(el.getAttribute("data-framer-name") || ""))
    .map((el) => {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        name: el.getAttribute("data-framer-name"),
        text: (el.innerText || "").slice(0, 80),
        color: cs.color,
        opacity: cs.opacity,
        visibility: cs.visibility,
        mixBlendMode: cs.mixBlendMode,
        fontSize: cs.fontSize,
        display: cs.display,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      }
    })
  return {
    h1s: h1s.map((el) => {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return {
        text: (el.innerText || "").slice(0, 120),
        color: cs.color,
        opacity: cs.opacity,
        visibility: cs.visibility,
        mixBlendMode: cs.mixBlendMode,
        textShadow: (cs.textShadow || "").slice(0, 100),
        webkitTextStroke: cs.webkitTextStroke || cs.getPropertyValue("-webkit-text-stroke"),
        fontSize: cs.fontSize,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      }
    }),
    named,
  }
})

console.log(JSON.stringify(info, null, 2))
await page.screenshot({ path: ".tmp/arbour-contact-contrast-p2.png", fullPage: false })
await browser.close()
