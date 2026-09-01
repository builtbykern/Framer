const paper = "var(--token-6f520be6-0d5d-45ee-87ac-81db0390a6f2)"
const ink = "var(--token-ce9a6d0b-4a20-4d5a-801f-53fcbb27e263)"
const muted = "var(--token-57f1af78-355c-46d4-835e-f1a5c3ef2f45)"

await framer.agent.readProject(
    [
        { type: "implementation-guide-from-index", name: "Navigations" },
        { type: "implementation-guide-from-index", name: "CMS Detail Pages" },
        { type: "implementation-guide-from-index", name: "CMS Collection Lists" },
    ],
    { pagePath: "/" }
)

await framer.agent.readComponentControls({ componentIds: ["PzdF7MhGJ"] })

const structure = await framer.agent.applyChanges(
    `
SET aBz9LPj8U name="Cluster";
SET tXhqCKMP_ initialValue="2025-03-14T00:00:00.000Z";
+LinkStylePresetNode lnkNav001 name="Nav Link";
SET lnkNav001 link.textColor="${ink}" link.hover.textColor="${muted}" link.current.textColor="${ink}" link.transition="tween 0.2,0,0.38,1 0.18s 0s";
+WebPageNode pgWork001 name="Work" path="/work/:Work";
+FrameNode wkDesk001 parent="pgWork001" name="Desktop" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="24px" overflow="clip" padding="48px 40px 80px 40px" width="1200px" height="auto";
+RichTextNode wkYear001 parent="wkDesk001" name="Year" textStylePreset="Label" width="auto" height="auto" text.from="var(--variable-Vu5g1RUmz)" text.transforms.0.name="toDateString" text.transforms.0.display="date" text.transforms.0.dateStyle="medium";
+RichTextNode wkTitle01 parent="wkDesk001" name="Title" text="var(--variable-ie3ZK0dAj)" textStylePreset="Display" width="1fr" height="auto";
+RichTextNode wkDek0001 parent="wkDesk001" name="Type" text="var(--variable-nVT6VC7MK)" textStylePreset="Body" width="42ch" height="auto";
+FrameNode wkCover01 parent="wkDesk001" name="Cover" fill="var(--variable-maO5HB9O2)" overflow="clip" width="1fr" height="720px";
+FrameNode wkStill01 parent="wkDesk001" name="Still" fill="var(--variable-Bj5XtxwsY)" overflow="clip" width="1fr" height="480px";
+WebPageNode pgInfo001 name="Info" path="/info";
+FrameNode inDesk001 parent="pgInfo001" name="Desktop" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="20px" overflow="clip" padding="80px 40px 120px 40px" width="1200px" height="auto";
+RichTextNode inTitle01 parent="inDesk001" name="Title" text="Studio" textStylePreset="Display" width="auto" height="auto";
+RichTextNode inBody001 parent="inDesk001" name="Body" text="Halden is a photography studio. The collection is the work, in the order it was made. Modules are chosen per series: square, landscape, portrait, cluster." textStylePreset="Body" width="42ch" height="auto";
+WebPageNode pgCont001 name="Contact" path="/contact";
+FrameNode ctDesk001 parent="pgCont001" name="Desktop" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="20px" overflow="clip" padding="80px 40px 120px 40px" width="1200px" height="auto";
+RichTextNode ctTitle01 parent="ctDesk001" name="Title" text="Contact" textStylePreset="Display" width="auto" height="auto";
+RichTextNode ctBody001 parent="ctDesk001" name="Body" text="For commissions and prints, write to the studio. Replies are slow on purpose." textStylePreset="Body" width="42ch" height="auto";
+WebPageNode pg4040001 name="404" path="/404";
+FrameNode erDesk001 parent="pg4040001" name="Desktop" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="start" gap="16px" overflow="clip" padding="80px 40px" width="1200px" height="100vh";
+RichTextNode erTitle01 parent="erDesk001" name="Title" text="Missing" textStylePreset="Display" width="auto" height="auto";
+RichTextNode erBody001 parent="erDesk001" name="Body" text="That series is not here. Return to the collection." textStylePreset="Body" link.href="/" linkStylePreset="Nav Link" width="auto" height="auto";
+LayoutTemplateNode lytHalden name="Halden Layout";
+FrameNode lytDesk01 parent="lytHalden" name="Desktop" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px" overflow="clip" width="1440px" height="100vh";
+FrameNode navBar001 parent="lytDesk01" index="0" name="Navigation" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" width="1fr" height="auto" padding="28px 40px 20px 40px";
+RichTextNode navMark01 parent="navBar001" name="Wordmark" text="Halden" textStylePreset="Display" link.href="/" linkStylePreset="Nav Link" width="auto" height="auto";
+FrameNode navLinks1 parent="navBar001" name="Links" layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="center" gap="28px" width="auto" height="auto";
+RichTextNode navInfo01 parent="navLinks1" name="Info" text="Info" textStylePreset="Label" link.href="/info" linkStylePreset="Nav Link" width="auto" height="auto";
+RichTextNode navCont01 parent="navLinks1" name="Contact" text="Contact" textStylePreset="Label" link.href="/contact" linkStylePreset="Nav Link" width="auto" height="auto";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const placeholders = await framer.agent.getDescendantsOfTypes(
    { id: "lytHalden", types: ["PlaceholderNode"] },
    { pagePath: "/" }
)

const assign = await framer.agent.applyChanges(
    `
SET augiA20Il layoutTemplate="lytHalden";
SET pgWork001 layoutTemplate="lytHalden";
SET pgInfo001 layoutTemplate="lytHalden";
SET pgCont001 layoutTemplate="lytHalden";
SET pg4040001 layoutTemplate="lytHalden";
SET is8kAge_X link.href="/work/:Work" link.collectionItem="var(--variable-pVZbvkw6U)";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(
    JSON.stringify(
        {
            structure,
            placeholders,
            assign,
        },
        null,
        2
    )
)
