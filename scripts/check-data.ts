import { EXERCISES } from "../data/exercises.ts";
import { STRUCTURES, STRUCTURE_BY_ID, uses, detectStructures } from "../data/structures.ts";
import { checkAccuracy } from "../data/errorRules.ts";

let fail = 0;
console.log("exercises:", EXERCISES.length, "structures:", STRUCTURES.length);
const ids = new Set<string>();
for (const e of EXERCISES) {
  if (ids.has(e.id)) { console.log("DUP", e.id); fail++; }
  ids.add(e.id);
  const s = STRUCTURE_BY_ID[e.structureId];
  if (!s) { console.log("NO STRUCT", e.id); fail++; continue; }
  if (!uses(s, e.model)) { console.log("NOT DETECTED", e.id, "|", e.model); fail++; }
  const issues = checkAccuracy(e.model, e.ctx !== "T1I");
  if (issues.length) { console.log("LINT", e.id, issues.map((i) => `${i.id}:"${i.match}"`).join(", "), "|", e.model); fail++; }
}
for (const s of STRUCTURES) {
  const n = EXERCISES.filter((e) => e.structureId === s.id).length;
  if (n !== 20) { console.log("COUNT", s.id, n); fail++; }
  for (const ex of s.examples) if (!uses(s, ex)) { console.log("EXAMPLE NOT DETECTED", s.id, ex); fail++; }
  if (s.detect.some((r) => r.test(s.mistake.wrong)) && false) {}
}
// false-positive stats
const fp: Record<string, number> = {};
for (const e of EXERCISES) for (const d of detectStructures(e.model)) if (d !== e.structureId) fp[d] = (fp[d] || 0) + 1;
console.log("also-detected counts:", JSON.stringify(fp));
console.log(fail ? `FAIL ${fail}` : "ALL OK");
process.exit(fail ? 1 : 0);
