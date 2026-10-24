#!/usr/bin/env node
// Turns an approved "Timeline submission" issue into a timeline entry in data/timeline.json.
// Reads the JSON block the site's "Your path" panel puts in the issue body. Run from the repo root:
//   ISSUE_BODY=... ISSUE_NUMBER=12 ISSUE_AUTHOR=octocat APPROVED_ON=2026-10-24 node scripts/import-submission.mjs
// Then run build-timeline.mjs and build-standalone.sh as usual. Exits non-zero, changing nothing, if the data is unusable.
import { readFileSync, writeFileSync } from "node:fs";

const DATA = "data/timeline.json";
const body = process.env.ISSUE_BODY || "";
const num = String(process.env.ISSUE_NUMBER || "").trim();
const author = String(process.env.ISSUE_AUTHOR || "").trim();
const on = String(process.env.APPROVED_ON || new Date().toISOString().slice(0, 10)).trim();
const fail = msg => { console.error("Not imported: " + msg); process.exit(1); };

if (!/^\d+$/.test(num)) fail("missing issue number");
const m = body.match(/<!-- submission-data -->\s*```json\s*([\s\S]*?)```/);
if (!m) fail("no submission-data block. Submissions written by hand need to be added to data/timeline.json manually.");
let d; try { d = JSON.parse(m[1]); } catch (e) { fail("the data block is not valid JSON"); }

const DATE_RE = /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;
const CLAIMS = ["court", "sworn", "filing", "docket", "plaintiff", "defense", "reported", "unverified"];
const KINDS = ["date", "document", "testimony"];
const str = (v, max) => typeof v === "string" && v.trim() && v.length <= max;
const s = d.source || {};
if (!KINDS.includes(d.kind)) fail("unknown kind");
if (!str(d.title, 200)) fail("title missing or too long");
if (!DATE_RE.test(d.date || "")) fail("bad date " + d.date);
if (!CLAIMS.includes(d.claim)) fail("unknown source type " + d.claim);
if (!str(d.text, 2000)) fail("summary missing or too long");
if (d.quote && !str(d.quote, 1000)) fail("quote too long");
if (!str(s.title, 300) || !str(s.pin, 100)) fail("source name or pinpoint missing");
if (!/^https?:\/\/[^\s"<>]+\.[^\s"<>]+$/.test(s.url || "")) fail("source link must be a plain http(s) address");

const data = JSON.parse(readFileSync(DATA, "utf8"));
if (!data.lanes.some(l => l.id === d.lane)) fail("unknown lane " + d.lane);
const id = "community-" + num, src = "C" + num;
if (data.events.some(e => e.id === id)) fail("issue #" + num + " was already imported");

const MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
const p = d.date.split("-");
const label = p.length === 1 ? p[0] : p.length === 2 ? MONTHS[+p[1] - 1] + " " + p[0] : MONTHS[+p[1] - 1] + " " + (+p[2]) + ", " + p[0];
const date = p.length === 1 ? { year: d.date } : p.length === 2 ? { month: d.date } : { on: d.date };
const who = author ? "@" + author : "a visitor";

data.sources[src] = {
  short: s.title.length > 40 ? s.title.slice(0, 38).trim() + "…" : s.title,
  title: s.title, date: s.date || "", url: s.url,
  kind: "Community submission (issue #" + num + ")",
  status: "Submitted by " + who + " and approved by the site owner on " + on + ". The owner's review is the only check; it has not been otherwise verified.",
  note: "Submitted through the site's “Your path” panel: " + "https://github.com/CTZNCHANCE/tighty-whity/issues/" + num
};
data.events.push({
  id, lane: d.lane, title: d.title.trim(), people: [],
  accounts: [{ src, pin: s.pin.trim(), status: d.claim, date, label, text: d.text.trim() + (d.quote ? " “" + d.quote.trim() + "”" : "") }],
  note: "Community submission #" + num + " by " + who + ", approved " + on + "."
});
writeFileSync(DATA, JSON.stringify(data, null, 1));
console.log("Imported issue #" + num + " as " + id + " (" + label + ", " + d.lane + ").");
