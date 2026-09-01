const pagePath = "/"
const blurId = "lpuQSsTX0"

const dsl = [
  // Nav type — quiet, no tracking tricks
  `SET htkVUdZRb text="Scroll Blur" tag="p" font="Inter" fontSize="15px" fontWeight="600" color="rgb(28, 25, 23)" width="auto" height="auto"`,
  `SET y01mdUXgT text="Work" tag="p" font="Inter" fontSize="14px" fontWeight="500" color="rgb(87, 83, 78)" width="auto" height="auto"`,
  `SET vIGTB_oqt text="Studio" tag="p" font="Inter" fontSize="14px" fontWeight="500" color="rgb(87, 83, 78)" width="auto" height="auto"`,
  `SET iTxVmpACT text="Contact" tag="p" font="Inter" fontSize="14px" fontWeight="500" color="rgb(87, 83, 78)" width="auto" height="auto"`,

  // Hairline under nav (no glow/shadow)
  `SET RoOfpsBVb borderBottom="1px solid rgb(231, 229, 228)"`,

  // Confirm blur: Soft + Top + Always On, under nav
  `SET ${blurId} name="Scroll Blur" position="fixed" left="0px" right="0px" top="64px" bottom="null" width="100%" height="140px" zIndex="4" $control__shape="soft" $control__position="top" $control__blur="12"`,
].join("; ")

const result = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify(result, null, 2))

const node = await framer.agent.getNode(blurId)
console.log("blur", JSON.stringify(node?.attributes ?? node, null, 2)?.slice(0, 2000))

const review = await framer.agent.reviewChanges()
console.log("review", JSON.stringify(review, null, 2).slice(0, 4000))
