import * as fs from "node:fs";
import * as path from "node:path";
import type { ExtraOp } from "../scenarios/extra.ts";

// Local JSON files added to a local run (D03): never baselined, exempt from the zero-warning and jsonErrors rules.
// Optional sidecar files next to <base>.json, found by name: <base>.data.json (the survey data), <base>.setup.mjs (a
// module whose default export `(Survey) => void` runs once per scenario process before any survey is created) and
// <base>.ops.json (the operations of scenarios/extra.ts). Without them a file runs load/model and answer/first only.
export interface ExtraFixture {
  key: string;
  path: string;
  json: any;
  data?: any;
  setup?: string;
  ops?: Array<ExtraOp>;
}

function readJson(file: string): any {
  let text = fs.readFileSync(file, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.substring(1);
  try {
    return JSON.parse(text);
  } catch(e) {
    throw new Error("PERF_EXTRA_JSON: cannot parse " + file + ": " + (e as Error).message);
  }
}

export function extraSidecars(file: string): { data: string, setup: string, ops: string } {
  const base = file.replace(/\.json$/i, "");
  return { data: base + ".data.json", setup: base + ".setup.mjs", ops: base + ".ops.json" };
}

export function getExtraFixtures(value?: string): Array<ExtraFixture> {
  const list = (value === undefined ? process.env.PERF_EXTRA_JSON || "" : value).split(";").map((p: string) => p.trim()).filter((p: string) => !!p);
  const res: Array<ExtraFixture> = [];
  const used: { [key: string]: number } = {};
  for (const file of list) {
    const json = readJson(file);
    const base = path.basename(file).replace(/\.json$/i, "");
    used[base] = (used[base] || 0) + 1;
    const key = "extra/" + base + (used[base] > 1 ? "-" + used[base] : "");
    const fixture: ExtraFixture = { key: key, path: file, json: json };
    const side = extraSidecars(file);
    if (fs.existsSync(side.data)) fixture.data = readJson(side.data);
    if (fs.existsSync(side.setup)) fixture.setup = path.resolve(side.setup);
    if (fs.existsSync(side.ops)) {
      const ops = readJson(side.ops);
      if (!Array.isArray(ops)) throw new Error("PERF_EXTRA_JSON: " + side.ops + " is not an array of operations");
      fixture.ops = ops;
    }
    res.push(fixture);
  }
  return res;
}
