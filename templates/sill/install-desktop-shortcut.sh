#!/bin/zsh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/templates/sill/Paste Sill Skin A.command"
DEST="${HOME}/Desktop/Paste Sill Skin A.command"
cp -f "$SRC" "$DEST"
chmod +x "$DEST"
echo "✓ Desktop shortcut: $DEST"
echo "Double-click it after: git -C ~/Desktop/Framer pull"
open -R "$DEST"
