const pagePath = "/notes";

const IMG =
  "https://framerusercontent.com/images/5Ytxn8avZFwlwp4Ng3t8PDU56Lk.png";
const ALT = "London terrace at dusk — field notes from Arbour";
const CREAM = "rgb(252, 250, 244)";
const ACCENT = "rgb(214, 224, 74)";
const SCRIM = "var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)";

const inertia = "ELuMN2aX9";
const overlay = "NPRkgYRMH";

const r2 = await framer.agent.applyChanges(
  `
SET ${inertia} name="Journal Cinematic" width="100%" height="100%" position="absolute" top="0px" left="0px" right="0px" bottom="0px" centerAnchorX="0%" centerAnchorY="0%" constraintsLocked=false $control__image.src="${IMG}" $control__image.alt="${ALT}" $control__aspect="3:2" $control__fit="Cover" $control__grain="true" $control__grainOpacity="0.05" $control__vignette="false" $control__radius="0" $control__intensity="5" $control__parallax="Scroll" $control__scrollY="36" $control__scrollX="0" $control__bottomBlur="false" $control__bottomScrim="true" $control__scrimColor="${SCRIM}" $control__textSafeZone="0.7" $control__scrimHeight="55";

SET ${overlay} name="Journal Overlay" layout="stack" stackDirection="vertical" stackDistribution="end" stackAlignment="start" stackWrapEnabled=false gap="28px" padding="72px 48px 40px 48px" width="100%" height="100%" position="relative" zIndex="1";

+FrameNode notesCineKicker parent="${overlay}" position="0";
SET notesCineKicker name="Journal Kicker" layout="stack" stackDirection="horizontal" stackAlignment="center" stackDistribution="start" gap="16px" width="1fr" height="auto";

MOVE sqsFVTzsL parent="notesCineKicker" position="0";
MOVE t1K8NQ7z5 parent="notesCineKicker" position="1";

MOVE xEORYedqg parent="${overlay}" position="1";

+FrameNode notesCineDeck parent="${overlay}" position="2";
SET notesCineDeck name="Journal Deck Row" layout="stack" stackDirection="horizontal" stackAlignment="end" stackDistribution="space-between" gap="48px" width="1fr" height="auto";

+FrameNode notesCineDeckCol parent="notesCineDeck" position="0";
SET notesCineDeckCol name="Journal Deck Col" layout="stack" stackDirection="vertical" stackAlignment="start" gap="16px" width="1fr" height="auto" maxWidth="480px";

MOVE dCYCf8ZZp parent="notesCineDeckCol" position="0";
MOVE yzUPSfS5X parent="notesCineDeckCol" position="1";

+ComponentInstanceNode notesCineCue component="codeFile/GruqKYi:default" parent="notesCineDeck" position="1";
`,
  { pagePath }
);
console.log("r2", JSON.stringify(r2));
