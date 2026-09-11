#!/bin/zsh
# Sill Skin A — run from Mac checkout (~/Desktop/Framer). No Cursor worker required.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SILL="$(cd "$(dirname "$0")" && pwd)"
TSX="$SILL/Kern_SillSkinA.tsx"
STILL="$SILL/assets/still-chair.png"
URL="https://framer.com/projects/Helpful-Clicks--erAjRu2jtuAc1SWeq5nh-eOIuP"
SHOTS="${HOME}/Desktop/Sill-shots"
# Agent Store (if mounted on this Mac)
STORE="${SILL_STORE:-/cursor/stores/bc-29d6bad1-a55c-4d30-894f-21c701117555/media/sill}"

if [[ ! -f "$TSX" ]]; then
  echo "Missing $TSX — git pull / checkout cursor/sill-skin-a-code-component-7555"
  exit 1
fi

pbcopy < "$TSX"
echo "✓ Kern_SillSkinA.tsx → clipboard"

open "$URL"
echo "✓ Helpful Clicks (do not publish) — delete FAIL layout first"

[[ -f "$STILL" ]] && open -R "$STILL" && echo "✓ still-chair.png revealed (drag → Still, cover)"

mkdir -p "$SHOTS"
if [[ -d "$(dirname "$STORE")" ]]; then
  mkdir -p "$STORE"
fi

if command -v screencapture >/dev/null 2>&1; then
  screencapture -x "$SHOTS/framer-status.png" 2>/dev/null || true
  [[ -d "$STORE" ]] && cp -f "$SHOTS/framer-status.png" "$STORE/framer-status.png" 2>/dev/null || true
  echo "✓ Proof shot → $SHOTS/framer-status.png"
fi

cat << MSG

Framer (~3 min) — must HOLD vs Bruce:
  1. Assets → Code → New Component → Cmd+V → Save
  2. Drop Kern Sill Skin A FULL viewport (not inset)
  3. Still = still-chair.png cover · 50/50 · ADA VALE · 01–06 text links
  4. FAIL if: skinny rail, floating photo, · bullets, empty cream under still
  5. Screenshots → save BOTH places if possible:
       $SHOTS/desktop.png
       $SHOTS/mobile.png
       $SHOTS/critique-vs-bruce.png
       and copy into Context media/sill/ (same names)
  6. Reply in Cursor: screenshots ready

Repo root: $ROOT
Noel RED — do not publish.
MSG
