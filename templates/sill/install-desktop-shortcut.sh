#!/bin/zsh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SILL="$ROOT/templates/sill"

# Desktop shortcuts always call into the checkout (not Desktop cwd).
cat > "${HOME}/Desktop/Paste Sill Skin A.command" <<EOF
#!/bin/zsh
cd "$SILL"
/bin/zsh ./paste-on-mac.sh
echo ""
echo "After Framer paste: double-click Capture Sill Screenshots.command"
echo "Press Return to close…"
read -r _
EOF

cat > "${HOME}/Desktop/Capture Sill Screenshots.command" <<EOF
#!/bin/zsh
cd "$SILL"
/bin/zsh ./capture-sill-screenshots.sh
echo ""
echo "Press Return to close…"
read -r _
EOF

chmod +x "${HOME}/Desktop/Paste Sill Skin A.command" "${HOME}/Desktop/Capture Sill Screenshots.command"
echo "✓ Desktop: Paste Sill Skin A.command"
echo "✓ Desktop: Capture Sill Screenshots.command"
echo "After: git -C ~/Desktop/Framer pull"
open -R "${HOME}/Desktop/Capture Sill Screenshots.command"
