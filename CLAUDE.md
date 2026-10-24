# tighty-whity: The Case of the Vanishing Valuation

Handoff notes for any Claude session picking this project up. Read this first.

## What this is

Two public web pages about the **Visionary Private Equity Group (VPEG) receivership**: *Oliver and Company et al. v. Zamber et al.*, No. 4:25-cv-00132-MTS (E.D. Mo.), plus the related *JLP Partners, LLC v. Husch Blackwell LLP*, No. 4:26-cv-01298 (E.D. Mo.).

| Version | Live URL | Source file | What it is |
|---|---|---|---|
| V1 | https://tighty-whity.vercel.app | `vanishing-valuation/index.html` | An evidence game. **Part One (Case Explorer):** the real record, case brief, case files, The Inquiry puzzles, and a facts / "born on a day, not yesterday" lens. **Part Two:** an invented manor whodunit. |
| V2 | https://tighty-whity.vercel.app/v2 (once PR #6 is merged) | `v2-src/index.html` | "The VPEG File." No fiction. Our call, timeline, money chart, players, three storylines with odds, probable outcomes, takeaways and documents. |

Both are single-file React pages (UMD React 18.3.1 + htm, from cdnjs/jsdelivr) with no build step and no backend.

## Build and deploy

- The `*/index.html` source files are written as **claude.ai Artifacts**, without the doctype/html/head skeleton. Wrap them for static hosting:
  - `./scripts/build-standalone.sh` builds `vanishing-valuation/index.html` into `index.html` (V1).
  - `./scripts/build-standalone.sh v2-src/index.html v2/index.html` builds V2.
- **Always rebuild after editing a source file, and commit both** the source and the built output.
- **Vercel** deploys `main` automatically (repo root, framework "Other", no build command). Only `https://tighty-whity.vercel.app` is public; the longer `*-ctznchances-projects.vercel.app` aliases require a Vercel login.
- **Workflow:** work on a branch, open a PR, merge, and Vercel is live in about 30 seconds. The owner usually says "merge" when ready.

## Sources: the only facts allowed

All real-case facts come from four documents. Court copies are in `sources/` (PDF plus extracted text).
1. Doc. 88, Memorandum and Order appointing receiver (June 4, 2025): `sources/oliver-v-zamber-doc88-2025-06-04.*`
2. Doc. 264, Memorandum and Order denying three defense motions (Mar. 16, 2026): `sources/oliver-v-zamber-doc264-2026-03-16.*`
3. JLP v. Husch Blackwell class action complaint (Aug. 13, 2026): `sources/jlp-v-husch-blackwell-complaint-2026-08-13.*`
4. St. Louis Magazine, Nicholas Phillips, Aug. 27, 2025 (not stored; copyrighted): https://www.stlmag.com/news/visionary-private-equity-receivership/

Run `python3 scripts/check-quotes.py` after editing V1 cards. Every exact quotation must appear verbatim in its source.

**Not yet obtained** (listed with where-to-look links on both pages): the receiver's Sept. 23, 2025 report, its monthly reports, the hearing transcript (Doc. 82), the Third Amended Complaint (Doc. 177), the sealing and Circle-share orders, the Eighth Circuit ruling (No. 25-2269), Cosby's deposition (Doc. 278-11), the firm's response, and any docket activity after Mar. 16, 2026. **"Evidence current through" stays "Not yet verified"** until the docket is reviewed.

## Content rules (agreed with the owner; keep them)

- Every fact carries a status (court finding or order, sworn testimony, plaintiff allegation, defense position, reported, unverified) plus a pinpoint citation.
- A complaint quoting the receiver's report is a **plaintiff allegation**, not a receiver finding, until the report itself is read.
- Opinions are allowed and wanted ("Our call", "born on a day" lens, storylines, odds), but they must be **labeled as opinion, not a finding**, and must say what would change our mind.
- Never assert a crime, conspiracy or liability as fact. No criminal charges were found in reviewed sources.
- No invented dialogue or scenes for real people. Fiction stays in V1 Part Two only, with invented characters.
- No mocking nicknames for real people. The owner once asked for "the Zamboni" and agreed to leave it out.
- Don't double-count overlapping figures. The $90M raised is not a loss figure.
- No private investor details, contact info or family members. Never encourage contacting anyone in the case.
- The FBI link must stay visible, labeled "FBI: Seeking Victim Information in the Visionary Private Equity Group Investigation", opening externally. Its contents were never verified.
- Dry humor is fine about jargon and paperwork. No jokes about investor losses.
- Not reviewed by a lawyer; say so.

## The owner's style

A filmmaker. Wants a posh crime-drama look (Succession meets Knives Out, with Fargo-style deadpan): dark green, bone paper, oxblood and gold; Bodoni, Special Elite, Archivo Narrow and Source Serif 4. Thinks in storylines: the most likely, the most interesting, and a wildcard. Prefers decisive calls with confidence levels ("someone shows you who they are, believe them"). Messages are often voice-dictated, so read generously: "Purcell" meant Vercel, and "here on" meant hero.

## Open items when this handoff was written

- **PR #6** (V2) is open and waiting for the owner's "merge".
- Optional: add a link from V1 to V2.
- If new filings are obtained, add them to `sources/`, update the cards, timeline and storylines, re-run the quote check, then re-verify the coverage date.
