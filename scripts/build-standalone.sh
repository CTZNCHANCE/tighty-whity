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
  # Link previews (texts, chat apps, social posts). og-image.jpg is a 1200x630 shot of the timeline; re-shoot it if the look changes.
  printf '<title>The Case of the Vanishing Valuation</title>\n'
  printf '<meta property="og:type" content="website">\n<meta property="og:site_name" content="Time Will Tell">\n'
  printf '<meta property="og:title" content="The Case of the Vanishing Valuation">\n'
  printf '<meta property="og:description" content="The VPEG receivership on the public record: a zoomable timeline where every fact is labeled. Educational only; not legal advice.">\n'
  printf '<meta property="og:url" content="https://time-will-tell-timeline.vercel.app/">\n'
  printf '<meta property="og:image" content="https://time-will-tell-timeline.vercel.app/og-image.jpg">\n<meta property="og:image:width" content="2400">\n<meta property="og:image:height" content="1260">\n'
  printf '<meta property="og:image:alt" content="The case timeline: lanes for statements, money and control running from 2009 to 2026.">\n'
  printf '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="https://time-will-tell-timeline.vercel.app/og-image.jpg">\n'
  printf '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}img{max-width:100%%}[hidden]{display:none!important}</style>\n'
  printf '</head>\n<body>\n'
  cat "$SRC"
  printf '\n</body>\n</html>\n'
} > "$OUT"
