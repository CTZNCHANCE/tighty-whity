#!/usr/bin/env sh
# Wraps an artifact source (which omits the document skeleton) into a complete
# page for static hosting such as Vercel. Run from the repo root.
#   ./scripts/build-standalone.sh                      V1: vanishing-valuation/index.html -> index.html
#   ./scripts/build-standalone.sh v2-src/index.html v2/index.html
set -e
SRC="${1:-vanishing-valuation/index.html}"
OUT="${2:-index.html}"
mkdir -p "$(dirname "$OUT")"
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  printf '<meta name="description" content="An evidence-based look at the Visionary Private Equity Group receivership record. Educational only; not legal advice.">\n'
  printf '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}img{max-width:100%%}[hidden]{display:none!important}</style>\n'
  printf '</head>\n<body>\n'
  cat "$SRC"
  printf '\n</body>\n</html>\n'
} > "$OUT"
