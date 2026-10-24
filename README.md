# tighty-whity
The Vpeg Case

## The Vanishing Valuation app

`vanishing-valuation/index.html` is the app source. `index.html` at the root is the
same page wrapped for Vercel.

The Timeline tab reads `data/timeline.json`: events, each with one or more sourced
accounts, plus missing documents (gaps), overlapping amounts, and the opinion
readings shown only in the "Born on a day" lens. After editing the JSON, run:

```sh
node scripts/build-timeline.mjs   # validates the data and writes it into the app
sh scripts/build-standalone.sh    # rebuilds index.html for Vercel
```

The build fails on any account without a known source, a pinpoint, or a valid
status. `node scripts/build-timeline.mjs --check` validates without writing.

A timeline view can be shared by link: `/#timeline/from:2023-11/to:2025-01/ev:dist-jul2024`.
