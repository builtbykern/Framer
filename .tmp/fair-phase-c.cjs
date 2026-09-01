await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "Computed Values" }],
    { pagePath: "/" }
)
const paper = "var(--token-14d41f00-d3b3-4455-b994-8566aa84333e)"
const muted = "var(--token-41c8b9ae-e604-40b6-9d37-a14c3803c179)"

const r = await framer.agent.applyChanges(
    `
+ComponentNode cmpCard01 name="Work Card";
+FrameNode frmSquare parent="cmpCard01" name="Square" fill="${paper}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="8px" overflow="visible" cursor="pointer" width="300px" height="auto";
+Variable cvTitle01 name="Title" type="string" scope="cmpCard01" initialValue="Glass Hours";
+DateVariable cvDate001 name="Date" scope="cmpCard01";
+Variable cvDek0001 name="Description" type="string" scope="cmpCard01" initialValue="A house that is mostly glass. The trees come in across the floor.";
+Variable cvCover01 name="Cover" type="image" scope="cmpCard01";
+Variable cvStill01 name="Still" type="image" scope="cmpCard01";
+RichTextNode crdYear01 parent="frmSquare" name="Year" width="100%" height="auto" textStylePreset="Label" textAlignment="start";
SET crdYear01 text.from="var(--variable-cvDate001)" text.transforms.0.name="toDateString" text.transforms.0.display="date" text.transforms.0.dateStyle="medium";
+RichTextNode crdTitle1 parent="frmSquare" name="Title" text="var(--variable-cvTitle01)" textStylePreset="Title" width="100%" height="auto" textAlignment="start";
+RichTextNode crdDek001 parent="frmSquare" name="Type" text="var(--variable-cvDek0001)" textStylePreset="Body" textColor="${muted}" width="100%" height="auto" textAlignment="start";
+FrameNode crdCover1 parent="frmSquare" name="Cover" fill="var(--variable-cvCover01)" overflow="clip" width="100%" height="300px" appearEffect.trigger="onInView" appearEffect.threshold="0.5" appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.49s 0s";
+FrameNode crdStill1 parent="frmSquare" name="Still" fill="var(--variable-cvStill01)" overflow="clip" width="100%" height="200px" appearEffect.trigger="onInView" appearEffect.threshold="0.5" appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.transition="tween 0.23,1,0.32,1 0.49s 0.08s";
CREATE_VARIANT frmLandsc from="frmSquare";
SET frmLandsc name="Landscape" width="380px";
SET frmLandsccrdCover1 height="253px";
SET frmLandsccrdStill1 height="253px";
CREATE_VARIANT frmPortrt from="frmSquare";
SET frmPortrt name="Portrait" width="200px";
SET frmPortrtcrdCover1 height="266px";
SET frmPortrtcrdStill1 height="235px";
CREATE_VARIANT frmClustr from="frmSquare";
SET frmClustr name="Cluster" width="248px";
SET frmClustrcrdCover1 height="216px";
SET frmClustrcrdStill1 height="248px";
SET cvDate001 initialValue="2025-03-14T00:00:00.000Z";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify(r, null, 2))
