await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "Computed Values" }],
    { pagePath: "/" }
)
const paper = "var(--token-6f520be6-0d5d-45ee-87ac-81db0390a6f2)"
const dsl = `
+Variable cvTitle01 name="Title" type="string" scope="PzdF7MhGJ" initialValue="Glass Hours";
+DateVariable cvDate001 name="Date" scope="PzdF7MhGJ";
+Variable cvDek0001 name="Description" type="string" scope="PzdF7MhGJ" initialValue="A house that is mostly glass. The trees come in across the floor.";
+Variable cvCover01 name="Cover" type="image" scope="PzdF7MhGJ";
+Variable cvStill01 name="Still" type="image" scope="PzdF7MhGJ";
+Variable cvSlug001 name="Slug" type="string" scope="PzdF7MhGJ" initialValue="glass-hours";
SET is8kAge_X fill="${paper}" gap="8px" link.href="/work/:Work" link.collectionItem="var(--variable-cvSlug001)";
SET Zmp43mQJT textStylePreset="Label" text.from="var(--variable-cvDate001)" text.transforms.0.name="toDateString" text.transforms.0.display="date" text.transforms.0.dateStyle="medium";
SET MlOQAxxqp text="var(--variable-cvTitle01)";
SET QsVvncIdl text="var(--variable-cvDek0001)";
SET OrlcC44h0 fill="var(--variable-cvCover01)" height="300px" width="100%";
SET SGJIsGPc2 fill="var(--variable-cvStill01)" height="200px" width="100%";
SET PPRGeRnSA fill="${paper}";
SET PPRGeRnSAOrlcC44h0 height="253px";
SET PPRGeRnSASGJIsGPc2 height="253px";
SET YNRdoVS7N fill="${paper}";
SET YNRdoVS7NOrlcC44h0 height="266px";
SET YNRdoVS7NSGJIsGPc2 height="235px";
SET aBz9LPj8U fill="${paper}";
SET aBz9LPj8UOrlcC44h0 height="216px";
SET aBz9LPj8USGJIsGPc2 height="248px";
`

const r = await framer.agent.applyChanges(dsl, { pagePath: "/" })
console.log(JSON.stringify(r, null, 2))
