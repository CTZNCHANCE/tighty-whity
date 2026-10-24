#!/usr/bin/env python3
"""Check that every exact quotation on the V1 evidence cards appears in its source.

Usage (from the repo root):  python3 scripts/check-quotes.py
Court-document text lives in sources/*.txt. The St. Louis Magazine article is not
stored here (it is copyrighted); quotes from it (source SSLM) are skipped and should
be checked by hand against https://www.stlmag.com/news/visionary-private-equity-receivership/
"""
import re, sys
SRC = {
    "S88": "sources/oliver-v-zamber-doc88-2025-06-04.txt",
    "S264": "sources/oliver-v-zamber-doc264-2026-03-16.txt",
    "SJLP": "sources/jlp-v-husch-blackwell-complaint-2026-08-13.txt",
}
norm = lambda s: re.sub(r"\s+", "", s.replace("[sic] ", ""))
texts = {k: norm(open(v, encoding="utf-8").read()) for k, v in SRC.items()}
page = open("vanishing-valuation/index.html", encoding="utf-8").read()
cards = page.split("var CARDS = [", 1)[1].split("var EMPTY", 1)[0]
checked = missing = skipped = 0
for m in re.finditer(r'\{ id:"(\w+)", room:"\w+", src:"(\w+)".*?quotes:\[(.*?)\],\s*\n?\s*status', cards, re.S):
    cid, src, block = m.groups()
    for q in re.findall(r'"((?:[^"\\]|\\.)*)"', block):
        if src not in texts:
            skipped += 1
            continue
        checked += 1
        if norm(q) not in texts[src]:
            missing += 1
            print(f"MISSING  {cid} ({src}): {q[:90]}")
print(f"{checked} quotes checked, {missing} missing, {skipped} skipped (magazine)")
sys.exit(1 if missing else 0)
