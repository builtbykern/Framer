#!/bin/zsh
# Sill Skin A — Mac paste helper (no Cursor worker required).
# Run from any cwd on Noel Mac mini.
set -euo pipefail

# Resolve repo: script location or ~/Desktop/Framer
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [[ -f "$SCRIPT_DIR/Kern_SillSkinA.tsx" ]]; then
  SILL="$SCRIPT_DIR"
  ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
elif [[ -f "${HOME}/Desktop/Framer/templates/sill/Kern_SillSkinA.tsx" ]]; then
  ROOT="${HOME}/Desktop/Framer"
  SILL="$ROOT/templates/sill"
else
  echo "Clone/pull builtbykern/Framer to ~/Desktop/Framer first:"
  echo "  cd ~/Desktop/Framer && git fetch && git checkout cursor/sill-skin-a-code-component-7555 && git pull"
  exit 1
fi

TSX="$SILL/Kern_SillSkinA.tsx"
STILL="$SILL/assets/still-chair.png"
URL="https://framer.com/projects/Helpful-Clicks--erAjRu2jtuAc1SWeq5nh-eOIuP"
SHOTS="${HOME}/Desktop/Sill-shots"
STORE_MEDIA="/cursor/stores/bc-29d6bad1-a55c-4d30-894f-21c701117555/media/sill"

# Best-effort: update checkout
if [[ -d "$ROOT/.git" ]]; then
  git -C "$ROOT" fetch origin cursor/sill-skin-a-code-component-7555 2>/dev/null || true
  git -C "$ROOT" checkout cursor/sill-skin-a-code-component-7555 2>/dev/null || true
  git -C "$ROOT" pull --ff-only origin cursor/sill-skin-a-code-component-7555 2>/dev/null || true
fi

pbcopy < "$TSX"
echo "✓ Kern_SillSkinA.tsx → clipboard ($(wc -l < "$TSX" | tr -d ' ') lines)"

open "$URL" || open -a Framer "$URL" || true
echo "✓ Helpful Clicks (do not publish)"

if [[ -f "$STILL" ]]; then
  open -R "$STILL"
  echo "✓ still-chair.png revealed → Still control, cover"
fi

mkdir -p "$SHOTS"
[[ -d "$(dirname "$STORE_MEDIA")" ]] && mkdir -p "$STORE_MEDIA" || true

if command -v screencapture >/dev/null 2>&1; then
  screencapture -x "$SHOTS/framer-status.png" 2>/dev/null || true
  [[ -d "$STORE_MEDIA" ]] && cp -f "$SHOTS/framer-status.png" "$STORE_MEDIA/framer-status.png" 2>/dev/null || true
  echo "✓ Proof → $SHOTS/framer-status.png"
fi

# Copy Bruce ref + PASS preview to Desktop if present in Context
for ref in \
  "/cursor/stores/bc-29d6bad1-a55c-4d30-894f-21c701117555/docs/sill/taste/01-bruce.png" \
  "/cursor/stores/bc-29d6bad1-a55c-4d30-894f-21c701117555/media/sill/preview-desktop.png"
do
  [[ -f "$ref" ]] && open "$ref" && echo "✓ Opened $(basename "$ref")" || true
done

cat << MSG

Framer (~3 min) — must HOLD vs Bruce:
  1. Delete FAIL layout (skinny rail / floating photo / · bullets)
  2. Assets → Code → New Component → Cmd+V → Save as Kern Sill Skin A
  3. Drop FULL viewport (not inset) · Still = still-chair.png cover
  4. 50/50 · ADA VALE · 01–06 text links · paper #F4F3F0
  5. Screenshots → $SHOTS/ AND Context media/sill/:
       desktop.png
       mobile.png
       critique-vs-bruce.png
  6. Reply in Cursor: screenshots ready

Repo: $ROOT
Noel RED — do not publish.
MSG
