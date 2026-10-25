# Archived: Part Two, the Fictional Mystery

The owner removed Part Two ("The Fiction": Pellingham Manor and the Harrowgate Orchard Trust whodunit) from the site on Oct. 25, 2026.

`vanishing-valuation-source.html` is the full app source as it stood just before the removal (main at the merge of PR #14). It contains Part One and Part Two together. To view it, wrap it with `sh scripts/build-standalone.sh archive/fictional-mystery-2026-10-25/vanishing-valuation-source.html /tmp/old.html` and open the output.

The fiction lives in these parts of that file: `COLD_OPEN`, `CAST`, `F_CARDS`, `F_TIMELINE`, `MECHS`, `KEY_CLUES`, `ALTS`, `FINALE`, `FIC_ASIDES`, the `FICTION` source, `ficScore`, `ColdOpen`, `FicDialog`, `Cast`, `Deduce` and `Reveal`, plus the `fiction` branches of `App`, `Welcome`, `Rooms`, `Room`, `Board` and `Timeline`.

This folder is not deployed (see `.vercelignore` and the redirect in `vercel.json`).
