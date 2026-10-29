import * as fs from "node:fs";
import * as path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { allScenarios, helperFunctions } from "./index.ts";
import type { PerfScenario } from "../harness/scenario.ts";

// The rev check (00, Ids): the hash of a scenario is the sha1 of String(setup) + String(run) + String(check), plus
// the source of every helper in its `uses`, with whitespace removed. It runs in plain Node: Vitest and esbuild
// transform the source, so String(fn) differs there. `--write` updates revs.json after a rev bump.
// Exit code 1: a hash changed without a rev bump, a rev changed without --write, a scenario is new, or `uses`
// names an unknown helper.
// --file <path> checks another revs file (the unit test).
const fileArg = process.argv.indexOf("--file");
const revsFile = fileArg > -1 ? path.resolve(process.argv[fileArg + 1]) : path.join(path.dirname(fileURLToPath(import.meta.url)), "revs.json");

export function scenarioHash(s: PerfScenario, helpers: { [name: string]: Function }): string {
  let text = String(s.setup) + String(s.run) + String(s.check);
  (s.uses || []).forEach((name: string) => {
    if (!helpers[name]) throw new Error(s.id + ": `uses` names an unknown helper " + name);
    text += String(helpers[name]);
  });
  return createHash("sha1").update(text.replace(/\s+/g, "")).digest("hex");
}

// The helpers a scenario's own functions call by name but do not list in `uses`.
export function unlistedHelpers(s: PerfScenario, helpers: { [name: string]: Function }): Array<string> {
  const text = String(s.setup) + String(s.run) + String(s.check) + String(s.teardown || "");
  return Object.keys(helpers).filter((name: string) => new RegExp("\\b" + name + "\\(").test(text) && (s.uses || []).indexOf(name) < 0);
}

function main(): void {
  const write = process.argv.indexOf("--write") > -1;
  const helpers = helperFunctions();
  const stored: { [id: string]: { rev: number, hash: string } } = fs.existsSync(revsFile) ? JSON.parse(fs.readFileSync(revsFile, "utf8")) : {};
  const next: { [id: string]: { rev: number, hash: string } } = {};
  const problems: Array<string> = [];
  for (const s of allScenarios()) {
    const hash = scenarioHash(s, helpers);
    next[s.id] = { rev: s.rev, hash: hash };
    const unlisted = unlistedHelpers(s, helpers);
    if (unlisted.length > 0) problems.push(s.id + ": calls helpers not listed in uses: " + unlisted.join(", "));
    const old = stored[s.id];
    if (!old) problems.push(s.id + ": new scenario, not in revs.json");
    else if (old.rev === s.rev && old.hash !== hash) problems.push(s.id + ": the measured code changed but rev is still " + s.rev + "; bump rev, then --write");
    else if (old.rev !== s.rev) problems.push(s.id + ": rev " + old.rev + " -> " + s.rev + ", run --write");
  }
  Object.keys(stored).filter((id: string) => !next[id]).forEach((id: string) => problems.push(id + ": in revs.json, no longer a scenario"));
  if (write) {
    const unlisted = problems.filter((p: string) => p.indexOf("not listed in uses") > -1);
    if (unlisted.length > 0) {
      console.error(unlisted.join("\n"));
      process.exit(1);
    }
    const sortedIds = Object.keys(next).sort();
    const out: { [id: string]: { rev: number, hash: string } } = {};
    sortedIds.forEach((id: string) => { out[id] = next[id]; });
    fs.writeFileSync(revsFile, JSON.stringify(out, null, 2) + "\n");
    console.log("revs.json: " + sortedIds.length + " scenarios");
    return;
  }
  if (problems.length > 0) {
    console.log(problems.join("\n"));
    process.exit(1);
  }
  console.log("revs.json: " + Object.keys(next).length + " scenarios, all hashes match");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
