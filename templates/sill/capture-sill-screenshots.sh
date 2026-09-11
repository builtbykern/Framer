#!/bin/zsh
# Sill Skin A — one double-click desktop + mobile screenshots after Framer paste.
# macOS only. Does not publish. Does not change Skin A design.
set -euo pipefail

SHOTS="${HOME}/Desktop/sill-shots"
STORE="/cursor/stores/bc-29d6bad1-a55c-4d30-894f-21c701117555/media/sill"
DROP_PATH="Context media/sill/"
PROJECT="Templates y componentes"
MOBILE_W=390
MOBILE_H=844

mkdir -p "$SHOTS"
[[ -d "$(dirname "$STORE")" ]] && mkdir -p "$STORE" || true

# Bring Framer (or Framer-in-browser) forward when possible.
osascript <<'APPLESCRIPT' >/dev/null 2>&1 || true
tell application "System Events"
  if exists process "Framer" then
    set frontmost of process "Framer" to true
    return
  end if
  repeat with procName in {"Google Chrome", "Chromium", "Arc", "Brave Browser", "Microsoft Edge", "Safari"}
    if exists process procName then
      tell process procName
        set frontmost to true
      end tell
      return
    end if
  end repeat
end tell
APPLESCRIPT
sleep 0.45

get_framer_window_id() {
  /usr/bin/python3 - <<'PY' 2>/dev/null || true
try:
    import Quartz
except Exception:
    raise SystemExit(0)
opts = (
    Quartz.kCGWindowListOptionOnScreenOnly
    | Quartz.kCGWindowListExcludeDesktopElements
)
wins = Quartz.CGWindowListCopyWindowInfo(opts, Quartz.kCGNullWindowID) or []
best = None
for w in wins:
    owner = w.get("kCGWindowOwnerName") or ""
    title = w.get("kCGWindowName") or ""
    if owner != "Framer" and "Helpful Clicks" not in title and "framer.com" not in title.lower():
        if owner not in ("Google Chrome", "Chromium", "Arc", "Brave Browser", "Microsoft Edge", "Safari"):
            continue
        if "framer" not in title.lower() and "Helpful" not in title:
            continue
    bounds = w.get("kCGWindowBounds") or {}
    area = float(bounds.get("Width") or 0) * float(bounds.get("Height") or 0)
    if area < 80000:
        continue
    wid = w.get("kCGWindowNumber")
    if wid is None:
        continue
    if best is None or area > best[0]:
        best = (area, int(wid))
if best:
    print(best[1])
PY
}

capture_desktop() {
  local out="$1"
  local wid
  wid="$(get_framer_window_id)"
  if [[ -n "${wid:-}" ]]; then
    if screencapture -x -l"$wid" "$out" 2>/dev/null; then
      echo "✓ desktop.png ← Framer window id $wid"
      return 0
    fi
  fi
  # Main display fallback (full canvas after Framer is frontmost).
  screencapture -x -m "$out"
  echo "✓ desktop.png ← main display (bring Framer full-viewport to front if crop looks wrong)"
}

capture_mobile() {
  local out="$1"
  # Phone-sized rect centered on the main display.
  local geom
  geom="$(/usr/bin/python3 - <<PY 2>/dev/null || true
try:
    import Quartz
    bounds = Quartz.CGDisplayBounds(Quartz.CGMainDisplayID())
    sw = int(bounds.size.width)
    sh = int(bounds.size.height)
    ox = int(bounds.origin.x)
    oy = int(bounds.origin.y)
except Exception:
    sw, sh, ox, oy = 1440, 900, 0, 0
w, h = ${MOBILE_W}, ${MOBILE_H}
x = ox + max(0, (sw - w) // 2)
y = oy + max(0, (sh - h) // 2)
if w > sw:
    w = sw
    x = ox
if h > sh:
    h = sh
    y = oy
print(f"{x},{y},{w},{h}")
PY
)"
  if [[ -z "${geom:-}" ]]; then
    geom="0,0,${MOBILE_W},${MOBILE_H}"
  fi
  screencapture -x -R"$geom" "$out"
  echo "✓ mobile.png ← phone frame ${MOBILE_W}×${MOBILE_H} @ $geom"
  echo "  Tip: set Framer breakpoint/preview to mobile before capture for a true phone shot."
}

if ! command -v screencapture >/dev/null 2>&1; then
  echo "screencapture not found — run this on macOS."
  exit 1
fi

capture_desktop "$SHOTS/desktop.png"
capture_mobile "$SHOTS/mobile.png"

# Best-effort copy into Project Context when this Mac mounts the store.
if [[ -d "$STORE" ]]; then
  cp -f "$SHOTS/desktop.png" "$STORE/desktop.png" 2>/dev/null || true
  cp -f "$SHOTS/mobile.png" "$STORE/mobile.png" 2>/dev/null || true
  echo "✓ Also copied into $STORE (when writable)"
fi

# Clipboard reminder: drop path + local folder.
REMINDER="Drop into Project Context ${DROP_PATH}
Local: ${SHOTS}/desktop.png
Local: ${SHOTS}/mobile.png
Also save: critique-vs-bruce.png (Bruce side-by-side)
Reply: screenshots ready
Noel RED — do not publish."
print -r -- "$REMINDER" | pbcopy
echo "✓ Drop-path reminder → clipboard"

open -R "$SHOTS/desktop.png" 2>/dev/null || open "$SHOTS" || true

cat << MSG

Sill shots ready:
  $SHOTS/desktop.png
  $SHOTS/mobile.png

Exact drop path (Project ${PROJECT}):
  ${DROP_PATH}
  → desktop.png
  → mobile.png
  → critique-vs-bruce.png   (make Bruce side-by-side; kit does not auto-compose)

Then reply: screenshots ready
Noel RED — do not publish.
MSG
