import * as fs from "node:fs";
import * as path from "node:path";

// Local JSON files added to a local run (D03): never baselined, exempt from the zero-warning and jsonErrors rules.
export interface ExtraFixture {
  key: string;
  path: string;
  json: any;
}

export function getExtraFixtures(value?: string): Array<ExtraFixture> {
  const list = (value === undefined ? process.env.PERF_EXTRA_JSON || "" : value).split(";").map((p: string) => p.trim()).filter((p: string) => !!p);
  const res: Array<ExtraFixture> = [];
  const used: { [key: string]: number } = {};
  for (const file of list) {
    let text = fs.readFileSync(file, "utf8");
    if (text.charCodeAt(0) === 0xfeff) text = text.substring(1);
    let json: any;
    try {
      json = JSON.parse(text);
    } catch(e) {
      throw new Error("PERF_EXTRA_JSON: cannot parse " + file + ": " + (e as Error).message);
    }
    const base = path.basename(file).replace(/\.json$/i, "");
    used[base] = (used[base] || 0) + 1;
    const key = "extra/" + base + (used[base] > 1 ? "-" + used[base] : "");
    res.push({ key: key, path: file, json: json });
  }
  return res;
}
