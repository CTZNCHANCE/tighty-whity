#!/usr/bin/env node
// Validates data/timeline.json against the app's own source, status, card and
// takeaway lists, then writes it into vanishing-valuation/index.html between
// the TIMELINE-DATA markers. Run from the repo root, before build-standalone.sh.
//   node scripts/build-timeline.mjs           validate and write
//   node scripts/build-timeline.mjs --check   validate only
import { readFileSync, writeFileSync } from "node:fs";

const PAGE = "vanishing-valuation/index.html";
const DATA = "data/timeline.json";
const BEGIN = "/* TIMELINE-DATA:BEGIN";
const END = "/* TIMELINE-DATA:END */";

const page = readFileSync(PAGE, "utf8");
const data = JSON.parse(readFileSync(DATA, "utf8"));

// Pull one top-level `var NAME = [...]` or `{...}` literal out of the page.
function grab(name) {
  const at = page.indexOf("var " + name + " = ");
  if (at < 0) throw new Error("Could not find " + name + " in " + PAGE);
  const a = page.indexOf("[", at), b = page.indexOf("{", at);
  const start = a >= 0 && (b < 0 || a < b) ? a : b;
  let depth = 0, q = null, i = start;
  for (; i < page.length; i++) {
    const c = page[i];
    if (q) { if (c === "\\") { i++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") { q = c; continue; }
    if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") { depth--; if (!depth) break; }
  }
  return (0, eval)("(" + page.slice(start, i + 1) + ")");
}

const SOURCES = grab("SOURCES"), STATUS = grab("STATUS"), NEEDED = grab("NEEDED");
const CARDS = grab("CARDS"), TAKEAWAYS = grab("TAKEAWAYS"), FILES = grab("FILES");
const allSources = { ...SOURCES, ...data.sources };
const errors = [];
const err = (where, msg) => errors.push(where + ": " + msg);

const DATE_RE = /^\d{4}(-\d{2}(-\d{2})?)?$/;
function checkDate(where, d) {
  if (!d || typeof d !== "object") return err(where, "missing date");
  const keys = Object.keys(d);
  if (d.on || d.month || d.year) {
    const v = d.on || d.month || d.year;
    if (keys.length !== 1 || !DATE_RE.test(v)) err(where, "bad date " + JSON.stringify(d));
  } else if (d.from && d.to) {
    if (!DATE_RE.test(d.from) || !DATE_RE.test(d.to) || d.from > d.to) err(where, "bad range " + JSON.stringify(d));
  } else err(where, "date needs on, month, year, or from and to");
}
function checkCite(where, x) {
  if (!allSources[x.src]) err(where, "unknown source " + x.src);
  if (x.src === "FICTION") err(where, "fiction source on the case timeline");
  if (!x.pin || !String(x.pin).trim()) err(where, "missing pinpoint");
  if (!STATUS[x.status] || x.status === "fiction") err(where, "bad status " + x.status);
  if (x.card && !CARDS.some(c => c.id === x.card)) err(where, "unknown card " + x.card);
}

const lanes = new Set(data.lanes.map(l => l.id));
const people = new Set(Object.keys(data.people));
const ids = new Set();
function checkId(where, id) { if (!id) err(where, "missing id"); else if (ids.has(id)) err(where, "duplicate id " + id); else ids.add(id); }

data.eras.forEach((e, i) => { if (!DATE_RE.test(e.from) || !DATE_RE.test(e.to)) err("era " + i, "bad dates"); });

for (const e of data.events) {
  const w = "event " + e.id;
  checkId(w, e.id);
  if (!lanes.has(e.lane)) err(w, "unknown lane " + e.lane);
  if (!e.title) err(w, "missing title");
  if (!e.accounts || !e.accounts.length) err(w, "no accounts: every event needs at least one sourced account");
  (e.accounts || []).forEach((a, i) => {
    checkCite(w + " account " + i, a);
    checkDate(w + " account " + i, a.date);
    if (!a.label || !a.text) err(w + " account " + i, "missing label or text");
  });
  if (e.accounts && e.accounts.every(a => a.said)) err(w, "needs at least one account that dates the event itself");
  (e.people || []).forEach(p => { if (!people.has(p)) err(w, "unknown person " + p); });
}
for (const g of data.gaps) {
  const w = "gap " + g.id;
  checkId(w, g.id);
  if (!lanes.has(g.lane)) err(w, "unknown lane " + g.lane);
  if (!NEEDED[g.need]) err(w, "need index " + g.need + " not in NEEDED");
  checkDate(w, g.date);
}
for (const o of data.overlaps) {
  const w = "overlap " + o.id;
  checkId(w, o.id);
  if (!lanes.has(o.lane)) err(w, "unknown lane " + o.lane);
  if (!o.members || o.members.length < 2) err(w, "an overlap needs two or more members");
  (o.members || []).forEach((m, i) => { checkCite(w + " member " + i, m); checkDate(w + " member " + i, { from: m.from, to: m.to }); });
}
for (const e of data.events) {
  [...(e.related || []), ...(e.versionOf ? [e.versionOf] : [])].forEach(r => { if (!ids.has(r)) err("event " + e.id, "links to unknown id " + r); });
}
for (const r of data.readings) {
  const w = "reading " + r.id;
  if (!TAKEAWAYS[r.takeaway]) err(w, "takeaway " + r.takeaway + " not in TAKEAWAYS");
  if (!r.events || r.events.length < 2) err(w, "a reading links two or more events");
  (r.events || []).forEach(id => { if (!data.events.some(e => e.id === id)) err(w, "unknown event " + id); });
}
// The rest of the app follows the same rules, so check it too.
CARDS.forEach(c => checkCite("card " + c.id, c));
FILES.forEach(f => ["roles", "knew"].forEach(k => (f[k] || []).forEach((r, i) => {
  if (!allSources[r[r.length === 6 ? 3 : 2]]) err("file " + f.id + " " + k + " " + i, "unknown source");
})));

if (errors.length) {
  console.error(errors.length + " problem(s) in " + DATA + ":\n  " + errors.join("\n  "));
  process.exit(1);
}
const n = data.events.reduce((s, e) => s + e.accounts.length, 0);
console.log("OK: " + data.events.length + " events, " + n + " accounts, " + data.gaps.length + " gaps, " + data.overlaps.length + " overlaps, " + data.readings.length + " readings.");
if (process.argv.includes("--check")) process.exit(0);

const b = page.indexOf(BEGIN), e = page.indexOf(END);
if (b < 0 || e < b) { console.error("Markers not found in " + PAGE); process.exit(1); }
const block = BEGIN + " (generated from " + DATA + " by scripts/build-timeline.mjs; edit the JSON, not this block) */\n" +
  "var TL = " + JSON.stringify(data) + ";\n" + END;
writeFileSync(PAGE, page.slice(0, b) + block + page.slice(e + END.length));
console.log("Wrote timeline data into " + PAGE);
