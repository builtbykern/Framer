const copy = await framer.agent.applyChanges(
    `
SET QhfNwiny9 textStylePreset="Display";
SET odgkshwbV textStylePreset="Title";
SET FnQbHIoGD textStylePreset="Title";
SET BU8_2gg2U textStylePreset="Title";
SET oSHXrizqB text="The house keeps a catalogue of work from the bench. Each piece has a date, a name, a note, an object, and a still.";
SET yAd2lMDSW overflow="auto" hideScrollbars="true";
SET t62LHpSTayAd2lMDSW overflow="auto" hideScrollbars="true";
SET u75vHQkARyAd2lMDSW overflow="auto" hideScrollbars="true";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)
console.log(JSON.stringify(copy, null, 2))
