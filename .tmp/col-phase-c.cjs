await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "Computed Values" }],
    { pagePath: "/" }
)
const ink = "var(--token-ce9a6d0b-4a20-4d5a-801f-53fcbb27e263)"
const muted = "var(--token-57f1af78-355c-46d4-835e-f1a5c3ef2f45)"
const dsl = `
+ComponentNode cmpCard01 name="Work Card";
+FrameNode frmSquare parent="cmpCard01" name="Square" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="0px" width="300px" height="auto" padding="0px" cursor="pointer";
SET frmSquare link.href="/work/:Work" link.collectionItem="var(--variable-v1_jAZuNB)";
+RichTextNode crdYear01 parent="frmSquare" name="Year" width="100%" height="auto" textStylePreset="Label" textAlignment="start";
SET crdYear01 text.from="var(--variable-Vu5g1RUmz)" text.transforms.0.name="toDateString" text.transforms.0.display="date" text.transforms.0.dateStyle="medium";
+RichTextNode crdTitle1 parent="frmSquare" name="Title" width="100%" height="auto" textStylePreset="Title" textAlignment="start" padding="10px 0 4px 0";
SET crdTitle1 text="var(--variable-ie3ZK0dAj)";
+RichTextNode crdDek001 parent="frmSquare" name="Type" width="100%" height="auto" textStylePreset="Body" textAlignment="start" padding="0px 0px 10px 0px";
SET crdDek001 text="var(--variable-nVT6VC7MK)" textColor="${muted}";
+FrameNode crdCover1 parent="frmSquare" name="Cover" width="100%" height="auto" aspectRatio="1" overflow="clip" fill="var(--variable-maO5HB9O2)";
SET crdCover1 appearEffect.trigger="onInView" appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.49s 0s";
+FrameNode crdStill1 parent="frmSquare" name="Still" width="100%" height="auto" aspectRatio="1.5" overflow="clip" fill="var(--variable-Bj5XtxwsY)" padding="0px";
SET crdStill1 appearEffect.trigger="onInView" appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.49s 0.08s";
CREATE_VARIANT frmLandsc from="frmSquare";
SET frmLandsc name="Landscape" width="380px";
SET frmLandsccrdCover1 aspectRatio="1.5";
SET frmLandsccrdStill1 aspectRatio="1.5";
CREATE_VARIANT frmPortrt from="frmSquare";
SET frmPortrt name="Portrait" width="200px";
SET frmPortrtcrdCover1 aspectRatio="0.75";
SET frmPortrtcrdStill1 aspectRatio="0.85";
CREATE_VARIANT frmClustr from="frmSquare";
SET frmClustr name="Cluster" width="248px";
SET frmClustrcrdCover1 aspectRatio="1.15";
SET frmClustrcrdStill1 aspectRatio="1";
`

const r = await framer.agent.applyChanges(dsl, { pagePath: "/" })
console.log(JSON.stringify(r, null, 2))
