const paper = "var(--token-14d41f00-d3b3-4455-b994-8566aa84333e)"
const ink = "var(--token-724c8003-5371-4e26-9bfa-187223cdcf10)"
const muted = "var(--token-41c8b9ae-e604-40b6-9d37-a14c3803c179)"

await framer.agent.readProject(
    [
        { type: "implementation-guide-from-index", name: "Navigations" },
        { type: "implementation-guide-from-index", name: "CMS Detail Pages" },
        { type: "implementation-guide-from-index", name: "CMS Collection Lists" },
    ],
    { pagePath: "/" }
)

const structure = await framer.agent.applyChanges(
    `
+LinkStylePresetNode lnkNav001 name="Nav Link";
SET lnkNav001 link.textColor="${ink}" link.hover.textColor="${muted}" link.current.textColor="${ink}" link.transition="tween 0.2,0,0.38,1 0.18s 0s";
+WebPageNode pgWork001 name="Work" path="/work/:Work";
+FrameNode wkDesk001 parent="pgWork001" name="Desktop" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" overflow="clip" width="1200px" height="auto";
+FrameNode wkShell01 parent="wkDesk001" name="Article" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="24px" padding="48px 40px 80px 40px" position="relative" width="1fr" height="auto" maxWidth="920px";
+RichTextNode wkYear001 parent="wkShell01" name="Year" textStylePreset="Label" width="auto" height="auto" text.from="var(--variable-hpRwQbDYl)" text.transforms.0.name="toDateString" text.transforms.0.display="date" text.transforms.0.dateStyle="medium";
+RichTextNode wkTitle01 parent="wkShell01" name="Title" text="var(--variable-Rjsd6qD9G)" textStylePreset="Title" width="1fr" height="auto";
+RichTextNode wkDek0001 parent="wkShell01" name="Type" text="var(--variable-docaG2WpK)" textStylePreset="Body" width="560px" height="auto";
+FrameNode wkCover01 parent="wkShell01" name="Cover" fill="var(--variable-pZepVvnAD)" overflow="clip" width="1fr" height="560px";
+FrameNode wkStill01 parent="wkShell01" name="Still" fill="var(--variable-BM_bNm1MI)" overflow="clip" width="1fr" height="360px";
+WebPageNode pgInfo001 name="Info" path="/info";
+FrameNode inDesk001 parent="pgInfo001" name="Desktop" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" overflow="clip" width="1200px" height="auto";
+FrameNode inShell01 parent="inDesk001" name="Article" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="20px" padding="80px 40px 120px 40px" position="relative" width="1fr" height="auto";
+RichTextNode inTitle01 parent="inShell01" name="Title" text="Studio" textStylePreset="Display" width="auto" height="auto";
+RichTextNode inBody001 parent="inShell01" name="Body" text="Halden is a photography studio. The collection is the work, in the order it was made. Modules are chosen per series: square, landscape, portrait, cluster." textStylePreset="Body" width="560px" height="auto";
+WebPageNode pgCont001 name="Contact" path="/contact";
+FrameNode ctDesk001 parent="pgCont001" name="Desktop" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" overflow="clip" width="1200px" height="auto";
+FrameNode ctShell01 parent="ctDesk001" name="Article" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="20px" padding="80px 40px 120px 40px" position="relative" width="1fr" height="auto";
+RichTextNode ctTitle01 parent="ctShell01" name="Title" text="Contact" textStylePreset="Display" width="auto" height="auto";
+RichTextNode ctBody001 parent="ctShell01" name="Body" text="For commissions and prints, write to the studio. Replies are slow on purpose." textStylePreset="Body" width="560px" height="auto";
+WebPageNode pg4040001 name="404" path="/404";
+FrameNode erDesk001 parent="pg4040001" name="Desktop" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" overflow="clip" width="1200px" height="800px";
+FrameNode erShell01 parent="erDesk001" name="Article" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="16px" padding="80px 40px" position="relative" width="1fr" height="auto";
+RichTextNode erTitle01 parent="erShell01" name="Title" text="Missing" textStylePreset="Display" width="auto" height="auto";
+RichTextNode erBody001 parent="erShell01" name="Body" text="That series is not here. Return to the collection." textStylePreset="Body" link.href="/" linkStylePreset="Nav Link" width="auto" height="auto";
+LayoutTemplateNode lytHalden name="Halden Layout";
+FrameNode lytDesk01 parent="lytHalden" name="Desktop" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px" overflow="clip" width="1440px" height="900px";
+FrameNode navBar001 parent="lytDesk01" index="0" name="Navigation" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" width="1fr" height="auto" padding="28px 40px 20px 40px";
+RichTextNode navMark01 parent="navBar001" name="Wordmark" text="Halden" textStylePreset="Display" link.href="/" linkStylePreset="Nav Link" width="auto" height="auto";
+FrameNode navLinks1 parent="navBar001" name="Links" layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="center" gap="28px" width="auto" height="auto";
+RichTextNode navInfo01 parent="navLinks1" name="Info" text="Info" textStylePreset="Label" link.href="/info" linkStylePreset="Nav Link" width="auto" height="auto";
+RichTextNode navCont01 parent="navLinks1" name="Contact" text="Contact" textStylePreset="Label" link.href="/contact" linkStylePreset="Nav Link" width="auto" height="auto";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const assign = await framer.agent.applyChanges(
    `
SET augiA20Il layoutTemplate="lytHalden";
SET pgWork001 layoutTemplate="lytHalden";
SET pgInfo001 layoutTemplate="lytHalden";
SET pgCont001 layoutTemplate="lytHalden";
SET pg4040001 layoutTemplate="lytHalden";
SET S4aeyJLQa name="Cluster";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ structure, assign }, null, 2))
