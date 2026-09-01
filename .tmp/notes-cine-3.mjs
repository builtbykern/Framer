const pagePath = "/notes";

const CREAM = "rgb(252, 250, 244)";
const CREAM_DIM = "rgba(252, 250, 244, 0.72)";
const ACCENT = "rgb(214, 224, 74)";

const r3 = await framer.agent.applyChanges(
  `
SET sqsFVTzsL textColor="${ACCENT}" fontName="Space Mono" fontSize="12px" fontWeight="400";
SET t1K8NQ7z5 textColor="${CREAM_DIM}" fontName="Space Mono" fontSize="12px" fontWeight="400";
SET xEORYedqg textColor="${CREAM}" fontName="Fraunces" fontSize="88px" fontWeight="400" textWrapBalance=true;
SET dCYCf8ZZp textColor="${CREAM_DIM}" fontName="Inter" fontSize="17px" fontWeight="400" maxWidth="480px";
SET yzUPSfS5X textColor="${ACCENT}" fontName="Space Mono" fontSize="12px" fontWeight="400";

SET bxx6bGhKq width="auto" height="auto" $control__coordinates="FIELD NOTES — LONDON" $control__label="( SCROLL ↓ )" $control__align="end" $control__coords="${CREAM_DIM}" $control__label1="${CREAM}" $control__accent="${ACCENT}";

SET xEORYedqg appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="32" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.85s 0.08s";
SET Y2Bx8WkiS appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="16" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.7s 0s";
SET q0U1vQI7K appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="20" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.75s 0.28s";
SET ELuMN2aX9 appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.scale="1.04" appearEffect.enter.transition="tween 0.22,1,0.36,1 1.1s 0s";
`,
  { pagePath }
);
console.log("r3", JSON.stringify(r3));

// SoftOrb no longer visible (inside archived grid) — leave it; optional DEL later

const tab = "LptqEiXVp";
const phone = "INUKgvAna";

const r4 = await framer.agent.applyChanges(
  `
SET ${tab}Vq1f2mEkj height="560px" padding="0px";
SET ${tab}NPRkgYRMH padding="56px 40px 32px 40px" gap="24px";
SET ${tab}xEORYedqg fontSize="64px";
SET ${phone}Vq1f2mEkj height="520px" padding="0px";
SET ${phone}NPRkgYRMH padding="48px 16px 28px 16px" gap="20px";
SET ${phone}xEORYedqg fontSize="48px";
SET ${phone}q0U1vQI7K stackDirection="vertical" stackAlignment="start" gap="24px";
`,
  { pagePath }
);
console.log("r4", JSON.stringify(r4));
