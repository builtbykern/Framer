
const n = await framer.getNode("D86aoiS2J");
if (!n) throw new Error("instance missing");
await n.setAttributes({
  controls: {
    content: {
      label: "Waaaaaaave...",
      destination: "/",
      ariaLabel: "",
      triggerMode: "Hover",
    },
    typographyGroup: {
      textColor: "rgb(245, 245, 247)",
      activeColor: "rgb(154, 154, 163)",
      fontSizeTablet: 26,
      fontSizeMobile: 22,
    },
    marker: {
      markerShape: "Square",
      dotColor: "rgb(245, 245, 247)",
      dotSize: 8,
      baselineGap: 14,
    },
    motion: {
      duration: 1.05,
      jumpAmplitude: 14,
      waveWidth: 28,
      perLetterStagger: 0.22,
    },
    characterMotion: {
      springFeel: 0.7,
      maxRotation: 6,
      scaleBoost: 0.06,
      trailIntensity: 0.4,
      overshoot: 0.25,
    },
    appearance: {
      blendMode: "Normal",
    },
  },
});
console.log(JSON.stringify({ ok: true, blend: "Normal", id: n.id }, null, 2));
