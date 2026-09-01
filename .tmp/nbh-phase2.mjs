const pagePath = "/neighbourhoods";

const CREAM = "rgb(252, 250, 244)";
const CREAM_DIM = "rgba(252, 250, 244, 0.72)";
const ACCENT = "rgb(214, 224, 74)";
const SCRIM = "var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)";
const IMG =
  "https://framerusercontent.com/images/rOIRMIaf6SStQx5iI01lIa7bzK0.png";

const hero = "ycUqIc8V3";
const inertia = "G6gOIL1iW";
const overlay = "I1ekolXeW";

const r2 = await framer.agent.applyChanges(
  `
SET ${inertia} name="Territory Cinematic" width="100%" height="100%" position="absolute" top="0px" left="0px" right="0px" bottom="0px" $control__image.src="${IMG}" $control__image.alt="London streets at dusk — Arbour territories" $control__aspect="3:2" $control__fit="Cover" $control__grain="true" $control__grainOpacity="0.05" $control__radius="0" $control__intensity="5" $control__parallax="Scroll" $control__scrollY="32" $control__bottomScrim="true" $control__scrimColor="${SCRIM}" $control__textSafeZone="0.68" $control__scrimHeight="52";

SET ${overlay} name="Territory Overlay" layout="stack" stackDirection="vertical" stackDistribution="end" stackAlignment="start" gap="24px" padding="72px 48px 40px 48px" width="100%" height="100%" position="relative" zIndex="1";

+RichTextNode nbhKicker parent="${overlay}" position="0";
SET nbhKicker text="TERRITORY — LONDON & COUNTRY" fontName="Space Mono" fontSize="12px" fontWeight="400" textColor="${ACCENT}" width="auto" height="auto";

+RichTextNode nbhTitle parent="${overlay}" position="1";
SET nbhTitle text="Places we know by heart." fontName="Fraunces" fontSize="80px" fontWeight="400" textColor="${CREAM}" width="1fr" height="auto" maxWidth="900px" textWrapBalance=true;

+FrameNode nbhHeroBottom parent="${overlay}" position="2";
SET nbhHeroBottom name="Hero Bottom" layout="stack" stackDirection="horizontal" stackAlignment="end" stackDistribution="space-between" gap="48px" width="1fr" height="auto";

+RichTextNode nbhDeck parent="nbhHeroBottom" position="0";
SET nbhDeck text="Four territories where Arbour reads the street, the light, and the long ownership of place." fontName="Inter" fontSize="17px" fontWeight="400" textColor="${CREAM_DIM}" width="1fr" height="auto" maxWidth="460px";

+ComponentInstanceNode nbhCue component="codeFile/GruqKYi:default" parent="nbhHeroBottom" position="1";
SET nbhCue width="auto" height="auto" $control__coordinates="4 TERRITORIES" $control__label="( SCROLL ↓ )" $control__align="end" $control__coords="${CREAM_DIM}" $control__label1="${CREAM}" $control__accent="${ACCENT}";

SET ${hero} appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.9s 0s";
`,
  { pagePath }
);
console.log("r2", JSON.stringify(r2));
