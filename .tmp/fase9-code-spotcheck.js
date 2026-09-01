const ids = ["emg8ovC", "I2raC3I", "rB5gJ0d", "zCa0pzg"];

for (const id of ids) {
  const f = await framer.getCodeFile(id);
  const content = String(f?.content ?? f?.code ?? "");
  const lines = content.split("\n");
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      /fontFamily|Inter|Fraunces|Space Mono|fontSize|#([0-9a-fA-F]{3,8})\b|rgb\(/.test(
        line
      )
    ) {
      hits.push(`${i + 1}: ${line.trim().slice(0, 140)}`);
    }
  }
  console.log(`\n=== ${f?.name || id} (${hits.length} hits)`);
  console.log(hits.slice(0, 30).join("\n"));
}
