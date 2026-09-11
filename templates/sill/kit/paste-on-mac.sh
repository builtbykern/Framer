#!/bin/zsh
set -euo pipefail
SILL="$(cd "$(dirname "$0")" && pwd)"
TSX="$SILL/Kern_SillSkinA.tsx"
STILL="$SILL/assets/still-chair.png"
URL="https://framer.com/projects/Helpful-Clicks--erAjRu2jtuAc1SWeq5nh-eOIuP"
SHOTS="${HOME}/Desktop/Sill-shots"
STORE="/cursor/stores/bc-29d6bad1-a55c-4d30-894f-21c701117555/media/sill"

pbcopy < "$TSX"
echo "✓ Kern_SillSkinA.tsx → clipboard ($(wc -l < "$TSX" | tr -d ' ') lines)"
open "$URL" || true
[[ -f "$STILL" ]] && open -R "$STILL" && echo "✓ still-chair.png"
mkdir -p "$SHOTS"
[[ -d "$(dirname "$STORE")" ]] && mkdir -p "$STORE" || true
if command -v screencapture >/dev/null 2>&1; then
  screencapture -x "$SHOTS/framer-status.png" 2>/dev/null || true
  [[ -d "$STORE" ]] && cp -f "$SHOTS/framer-status.png" "$STORE/framer-status.png" 2>/dev/null || true
fi
cat <<'MSG'

Framer Helpful Clicks (~3 min) — HOLD vs Bruce:
  1. Delete FAIL (skinny rail / floating photo / · bullets)
  2. Assets → Code → New Component → Cmd+V → Save
  3. Full viewport · Still = assets/still-chair.png cover
  4. ADA VALE · 50/50 · 01–06 text links · paper #F4F3F0
  5. Save screenshots:
       Desktop/Sill-shots/{desktop,mobile,critique-vs-bruce}.png
       + Context media/sill/ same names
  6. Reply: screenshots ready

Noel RED — do not publish.
MSG
