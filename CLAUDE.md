# tighty-whity: The Case of the Vanishing Valuation

Handoff notes for any Claude session picking this project up. Read this first.

## What this is

One public web page about the **Visionary Private Equity Group (VPEG) receivership**: *Oliver and Company et al. v. Zamber et al.*, No. 4:25-cv-00132-MTS (E.D. Mo.), plus the related *JLP Partners, LLC v. Husch Blackwell LLP*, No. 4:26-cv-01298 (E.D. Mo.).

| Version | Live URL | Source file | What it is |
|---|---|---|---|
| V1 (**newest; the main site**) | https://tighty-whity.vercel.app | `vanishing-valuation/index.html` + `data/timeline.json` | An evidence game, rebuilt in PR #7 (Oct. 24, 2026) with a Dorot-style zoomable timeline, a matching top bar and tabs, and emblems and monograms. **Part One (Case Explorer):** the real record, case brief, case files, The Inquiry puzzles, and a facts / "born on a day, not yesterday" lens. **Part Two:** an invented manor whodunit. |
| (retired) /v2 | https://tighty-whity.vercel.app/v2 | `v2/index.html` (redirect only) | "The VPEG File" was folded into V1 as its own tab (`#file`) on Oct. 24, 2026. `/v2` now redirects to `/#file`; the old source is in git history (PR #6). |

**PR #7 is the current version of the site,** and The VPEG File lives inside it as a tab. Never rebuild `index.html` from an older copy of the source.

It is a single-file React page (UMD React 18.3.1 + htm, from cdnjs/jsdelivr) with no build step and no backend.

## Build and deploy

- **V1 timeline data** lives in `data/timeline.json`. Edit it there, then run `node scripts/build-timeline.mjs` (it validates every account's source, pinpoint and status and writes the data into `vanishing-valuation/index.html`; `--check` only validates), then build V1.
- The `*/index.html` source files are written as **claude.ai Artifacts**, without the doctype/html/head skeleton. Wrap them for static hosting:
  - `./scripts/build-standalone.sh` builds `vanishing-valuation/index.html` into `index.html` (V1).
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

**Current direction (Oct. 24, 2026):** the owner wants the Dorot timeline's refinement (dorot.tali.org.il): a cream stage (#FBF6F1, ink #34312F) in Alegreya Sans italics, flowing gradient lanes, hairline pill controls and sliding switches. The top bar and tabs turn cream on the Timeline tab and stay dark elsewhere. People and firms get monogram portraits and records get original line emblems. No photographs of the individuals named (private people in an allegations case). Use only free sources: no PACER or other paid databases.

A filmmaker. Earlier direction: a posh crime-drama look (Succession meets Knives Out, with Fargo-style deadpan): dark green, bone paper, oxblood and gold; Bodoni, Special Elite, Archivo Narrow and Source Serif 4. Thinks in storylines: the most likely, the most interesting, and a wildcard. Prefers decisive calls with confidence levels ("someone shows you who they are, believe them"). Messages are often voice-dictated, so read generously: "Purcell" meant Vercel, and "here on" meant hero.

## Open items when this handoff was written

- Every visit lands on the Timeline tab (set in `blank()` and `load()`); the title screen with its three doors is one click away on the brand name. `#file` and timeline hash links still open their own views.
- The VPEG File (our call, money, players, storylines, odds, takeaways) is the `file` tab in Case Explorer, data in the `VF_*` arrays. It opens from a third door on the title screen and from `#file`.
- If new filings are obtained, add them to `sources/`, update the cards, timeline and storylines, re-run the quote check, then re-verify the coverage date.
