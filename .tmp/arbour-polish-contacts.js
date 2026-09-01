/**
 * Soft polish: unify mailto → arbour.london + demo social profile URLs.
 * Canonical email matches Nav; Contact was on .estate.
 */
const EMAIL = "enquiries@arbour.london"
const MAILTO = `mailto:${EMAIL}`
const EMAIL_DISPLAY = "ENQUIRIES@ARBOUR.LONDON"
const EMAIL_LOWER = EMAIL

const SOCIAL = {
  ig: "https://www.instagram.com/arbour.london",
  li: "https://www.linkedin.com/company/arbour",
  x: "https://x.com/arbourlondon",
}

const contactDsl = [
  // Desktop primaries
  `SET uONXSHosa link.href="${MAILTO}"`,
  `SET qB71RMXEV link.href="${MAILTO}"`,
  `SET BMhLvwqld $control__link="${MAILTO}"`,
  `SET WDu0pxZr4 link.href="${MAILTO}"`,
  `SET jFTgrH9Eq text="${EMAIL_DISPLAY}"`,
  `SET WDu0pxZr4 text="${EMAIL_LOWER}"`,
  // Tablet replicas
  `SET qjv2S9WpauONXSHosa link.href="${MAILTO}"`,
  `SET qjv2S9WpaqB71RMXEV link.href="${MAILTO}"`,
  `SET qjv2S9WpaBMhLvwqld $control__link="${MAILTO}"`,
  `SET qjv2S9WpaWDu0pxZr4 link.href="${MAILTO}"`,
  `SET qjv2S9WpajFTgrH9Eq text="${EMAIL_DISPLAY}"`,
  `SET qjv2S9WpaWDu0pxZr4 text="${EMAIL_LOWER}"`,
  // Phone replicas
  `SET jEM0wBo2vuONXSHosa link.href="${MAILTO}"`,
  `SET jEM0wBo2vqB71RMXEV link.href="${MAILTO}"`,
  `SET jEM0wBo2vBMhLvwqld $control__link="${MAILTO}"`,
  `SET jEM0wBo2vWDu0pxZr4 link.href="${MAILTO}"`,
  `SET jEM0wBo2vjFTgrH9Eq text="${EMAIL_DISPLAY}"`,
  `SET jEM0wBo2vWDu0pxZr4 text="${EMAIL_LOWER}"`,
].join(";\n")

const navDsl = [
  // Primary variant socials
  `SET czYnPBVB2 link.href="${SOCIAL.ig}"`,
  `SET EHoSN46Wx link.href="${SOCIAL.li}"`,
  `SET CQFoFPqQb link.href="${SOCIAL.x}"`,
  // Ensure mailto stays london (noop if already)
  `SET CHYXZMgW2 link.href="${MAILTO}"`,
  `SET CHYXZMgW2 text="${EMAIL_LOWER}"`,
  // Variant replicas (I3SpHi24v / rL2ZHlVqg / GBmgkcS5c / WLQAqm0Qz / dzeGSJmBB)
  ...["I3SpHi24v", "rL2ZHlVqg", "GBmgkcS5c", "WLQAqm0Qz", "dzeGSJmBB"].flatMap((p) => [
    `SET ${p}czYnPBVB2 link.href="${SOCIAL.ig}"`,
    `SET ${p}EHoSN46Wx link.href="${SOCIAL.li}"`,
    `SET ${p}CQFoFPqQb link.href="${SOCIAL.x}"`,
    `SET ${p}CHYXZMgW2 link.href="${MAILTO}"`,
    `SET ${p}CHYXZMgW2 text="${EMAIL_LOWER}"`,
  ]),
].join(";\n")

const contactRes = await framer.agent.applyChanges(contactDsl, { pagePath: "/contact" })
const navRes = await framer.agent.applyChanges(navDsl, { pagePath: "/" })

console.log(
  JSON.stringify(
    {
      contact: contactRes,
      nav: navRes,
      targets: { MAILTO, SOCIAL },
    },
    null,
    2
  )
)
