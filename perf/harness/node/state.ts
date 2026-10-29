import * as fs from "node:fs";
import * as path from "node:path";
import { writeJsonAtomic } from "./result.ts";

// The state directory (D15, PERF_STATE_DIR): baselines/, history/, known.json, last-nightly.json, locks/. Every
// write is atomic (a temp file, then a rename).
export function baselinesDir(stateDir: string): string {
  return path.join(stateDir, "baselines");
}

export function baselineFile(stateDir: string, suite: string, machineKey: string): string {
  return path.join(baselinesDir(stateDir), suite + "." + machineKey + ".json");
}

// The ratchet of a baseline (D19): renewing the baseline removes it.
export function ratchetFile(stateDir: string, suite: string, machineKey: string): string {
  return path.join(baselinesDir(stateDir), suite + "." + machineKey + ".ratchet.json");
}

export function knownFile(stateDir: string): string {
  return path.join(stateDir, "known.json");
}

export function readJson<T>(file: string, fallback: T): T {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

export function writeJson(file: string, value: any): void {
  writeJsonAtomic(file, value);
}

// Keys sorted at every level and numbers rounded to 0.01, so two files diff cleanly.
export function canonical(value: any): any {
  if (Array.isArray(value)) return value.map(canonical);
  if (typeof value === "number") return Math.round(value * 100) / 100;
  if (!value || typeof value !== "object") return value;
  const res: any = {};
  Object.keys(value).sort().forEach((key: string) => { if (value[key] !== undefined) res[key] = canonical(value[key]); });
  return res;
}

// The newest baseline of a suite with any machine key: counters are machine-independent (D22).
export function newestBaseline(stateDir: string, suite: string): string | undefined {
  const dir = baselinesDir(stateDir);
  if (!fs.existsSync(dir)) return undefined;
  const files = fs.readdirSync(dir).filter((f: string) => f.indexOf(suite + ".") === 0 && /^[^.]+\.[a-z0-9.-]+\.json$/.test(f) &&
    !/\.ratchet\.json$/.test(f) && !/\.\d{8}T\d{6}Z\.json$/.test(f));
  if (files.length === 0) return undefined;
  return files.map((f: string) => path.join(dir, f)).sort((a: string, b: string) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
}
