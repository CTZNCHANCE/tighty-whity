#!/usr/bin/env sh
# Wraps the artifact source (which omits the document skeleton) into a
# complete page for static hosting such as Vercel. Run from the repo root.
set -e
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  printf '<meta name="description" content="An evidence game about the Visionary Private Equity Group receivership record, with a separate fictional mystery. Educational only; not legal advice.">\n'
  printf '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}img{max-width:100%%}[hidden]{display:none!important}</style>\n'
  printf '</head>\n<body>\n'
  cat vanishing-valuation/index.html
  printf '\n</body>\n</html>\n'
} > index.html
