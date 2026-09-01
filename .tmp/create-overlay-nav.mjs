const pagePath = "/"
const burgerId = "codeFile/Qh_sncI:default"

// Build Overlay Nav as a canvas ComponentNode (Closed / Open).
// Only the burger 3D flip is a code component.

const dsl = [
  // --- Component definition ---
  `+ComponentNode ovnComp name="Overlay Nav"`,
  `+FrameNode ovnClosed parent="ovnComp" name="Closed"`,
  `SET ovnClosed width="1200px" height="800px" fill="#141414" overflow="clip" layout="absolute" transition="tween 0.77,0,0.175,1 1s 0s"`,

  // Overlay layer (behind page card)
  `+FrameNode ovnOverlay parent="ovnClosed" name="Menu Overlay"`,
  `SET ovnOverlay position="absolute" inset="0px" width="100%" height="100%" layout="stack" stackDirection="vertical" stackAlignment="center" stackDistribution="center" gap="28px" padding="80px 40px 120px" overflow="hidden" fill="#1a1a1a" opacity="0" transition="tween 0.77,0,0.175,1 0.8s 0.05s"`,

  // Close CTA
  `+FrameNode ovnClose parent="ovnOverlay" name="Close"`,
  `SET ovnClose width="48px" height="48px" layout="stack" stackAlignment="center" stackDistribution="center" radius="100px" border.width="1px" border.color="rgba(255,255,255,0.2)" border.style="solid" cursor="pointer" htmlTag="button"`,
  `SET ovnClose onTap.0.action="SET_VARIANT" onTap.0.controls.variant="ovnClosed"`,
  `+RichTextNode ovnCloseX parent="ovnClose" name="X"`,
  `SET ovnCloseX text="×" width="auto" height="auto" font="Inter" fontSize="22px" fontWeight="300" textColor="#FFFFFF" textAlign="center"`,

  // Main links
  `+FrameNode ovnLinks parent="ovnOverlay" name="Main Links"`,
  `SET ovnLinks layout="stack" stackDirection="vertical" stackAlignment="center" stackDistribution="center" gap="8px" width="auto" height="auto"`,

  ...["About", "Work", "Studio", "Journal", "Contact"].flatMap((label, i) => {
    const id = `ovnLink${i}`
    const delay = (0.35 + i * 0.05).toFixed(2)
    return [
      `+RichTextNode ${id} parent="ovnLinks" name="${label}"`,
      `SET ${id} text="${label}" width="auto" height="auto" font="Inter" fontSize="42px" fontWeight="400" letterSpacing="-0.03em" textColor="#FFFFFF" textAlign="center" opacity="0" y="40px" transition="tween 0.16,1,0.3,1 0.65s ${delay}s"`,
    ]
  }),

  // Sub links
  `+FrameNode ovnSub parent="ovnOverlay" name="Sub Links"`,
  `SET ovnSub layout="stack" stackDirection="horizontal" stackAlignment="center" stackDistribution="center" gap="12px" width="auto" height="auto" opacity="0" y="24px" transition="tween 0.16,1,0.3,1 0.55s 0.55s"`,
  `+RichTextNode ovnSub0 parent="ovnSub" name="News"`,
  `SET ovnSub0 text="News" width="auto" height="auto" font="Inter" fontSize="12px" fontWeight="400" textColor="rgba(255,255,255,0.55)"`,
  `+RichTextNode ovnSubDot1 parent="ovnSub"`,
  `SET ovnSubDot1 text="•" width="auto" height="auto" font="Inter" fontSize="12px" textColor="rgba(255,255,255,0.35)"`,
  `+RichTextNode ovnSub1 parent="ovnSub" name="Legal"`,
  `SET ovnSub1 text="Legal" width="auto" height="auto" font="Inter" fontSize="12px" fontWeight="400" textColor="rgba(255,255,255,0.55)"`,
  `+RichTextNode ovnSubDot2 parent="ovnSub"`,
  `SET ovnSubDot2 text="•" width="auto" height="auto" font="Inter" fontSize="12px" textColor="rgba(255,255,255,0.35)"`,
  `+RichTextNode ovnSub2 parent="ovnSub" name="LinkedIn"`,
  `SET ovnSub2 text="LinkedIn" width="auto" height="auto" font="Inter" fontSize="12px" fontWeight="400" textColor="rgba(255,255,255,0.55)"`,

  // Ghost
  `+RichTextNode ovnGhost parent="ovnOverlay" name="Credit"`,
  `SET ovnGhost text="Designed by Kern" width="auto" height="auto" font="Inter" fontSize="11px" fontWeight="400" textColor="rgba(255,255,255,0.35)" opacity="0" transition="tween 0.16,1,0.3,1 0.5s 0.65s"`,

  // Page card (scales/insets on open — header is OUTSIDE so it stays put)
  `+FrameNode ovnPage parent="ovnClosed" name="Page Card"`,
  `SET ovnPage position="absolute" left="0px" top="0px" width="100%" height="100%" fill="#000000" radius="0px" overflow="clip" layout="stack" stackDirection="vertical" stackAlignment="center" stackDistribution="center" padding="0px" transition="tween 0.77,0,0.175,1 1s 0s"`,

  `+RichTextNode ovnHero parent="ovnPage" name="Hero"`,
  `SET ovnHero text="Agence conseil en\\nréputation et influence" width="auto" height="auto" font="Inter" fontSize="40px" fontWeight="400" letterSpacing="-0.04em" lineHeight="1.15em" textColor="#FFFFFF" textAlign="center"`,

  // Header — fixed on root, does not dock to bottom
  `+FrameNode ovnHeader parent="ovnClosed" name="Header"`,
  `SET ovnHeader position="absolute" left="0px" top="0px" width="100%" height="72px" layout="stack" stackDirection="horizontal" stackAlignment="center" stackDistribution="space-between" padding="0px 40px" transition="tween 0.77,0,0.175,1 1s 0s"`,

  `+RichTextNode ovnLogo parent="ovnHeader" name="Logo"`,
  `SET ovnLogo text="BuiltByKern" width="auto" height="auto" font="Inter" fontSize="18px" fontWeight="600" letterSpacing="-0.03em" textColor="#FFFFFF"`,

  `+FrameNode ovnBurgerHit parent="ovnHeader" name="Burger Hit"`,
  `SET ovnBurgerHit width="auto" height="auto" layout="stack" stackAlignment="center" stackDistribution="center" cursor="pointer" padding="8px"`,
  `SET ovnBurgerHit onTap.0.action="SET_VARIANT" onTap.0.controls.variant="ovnOpen"`,
  `+ComponentInstanceNode ovnBurger parent="ovnBurgerHit" component="${burgerId}"`,
  `SET ovnBurger width="80px" height="29px" $control__color="#FFFFFF" $control__width="80" $control__thickness="1"`,

  // --- Open variant ---
  `CREATE_VARIANT ovnOpen from="ovnClosed"`,
  `SET ovnOpen name="Open" left="1280px" top="0px"`,

  // Overlay visible
  `SET ovnOpenovnOverlay opacity="1"`,

  // Links visible with stagger delays already on transitions
  `SET ovnOpenovnLink0 opacity="1" y="0px"`,
  `SET ovnOpenovnLink1 opacity="1" y="0px"`,
  `SET ovnOpenovnLink2 opacity="1" y="0px"`,
  `SET ovnOpenovnLink3 opacity="1" y="0px"`,
  `SET ovnOpenovnLink4 opacity="1" y="0px"`,
  `SET ovnOpenovnSub opacity="1" y="0px"`,
  `SET ovnOpenovnGhost opacity="1"`,

  // Page card compressed (header stays on root — does not scale with card)
  `SET ovnOpenovnPage left="4.16%" top="3%" width="91.68%" height="94%" radius="28px"`,

  // Re-wire open→close and close stays; burger on open still can close? keep burger opening only from closed; close button on overlay
  `SET ovnOpenovnClose onTap.0.action="SET_VARIANT" onTap.0.controls.variant="ovnClosed"`,
  // Optional: tapping burger while open closes
  `SET ovnOpenovnBurgerHit onTap.0.action="SET_VARIANT" onTap.0.controls.variant="ovnClosed"`,
].join("; ")

const result = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify(result, null, 2))
state.overlayNavDsl = result
