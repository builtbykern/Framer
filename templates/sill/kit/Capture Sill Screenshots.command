#!/bin/zsh
cd "$(dirname "$0")"
/bin/zsh ./capture-sill-screenshots.sh
echo ""
echo "Press Return to close…"
read -r _
