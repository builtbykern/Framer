const fs = require("fs");
const path = "/Users/noel/Desktop/Framer/sill/assets/still-chair.png";
const buf = fs.readFileSync(path);
const asset = await framer.uploadImage({
  image: { bytes: new Uint8Array(buf), mimeType: "image/png" },
  name: "sill-still-chair",
  altText: "Studio still, chair and daylight.",
});
await framer.setAttributes("JzPSnIQ98", {
  backgroundImage: asset,
});
return { id: asset?.id, url: asset?.url, name: asset?.name };
