import * as fs from "node:fs";
import * as path from "node:path";
import type { Counters } from "../counters.ts";
import type { CalibrationResult } from "../calibration.ts";
import type { PerfEnv } from "./env.ts";
import type { MachineInfo } from "./machine.ts";
import type { DepsInfo } from "./deps.ts";

// The result file of one suite run (00, Result file).
export type Suite = "core" | "react" | "survey-js-ui";

export interface ResultEntry {
  id: string;
  rev: number;
  unit: "ms";
  samples: Array<number>;
  median: number;
  min: number;
  max: number;
  mad: number;
  calibration: CalibrationResult;
  phases?: { [phase: string]: { median: number, min: number } };
  counters: Counters;
  info: { [name: string]: any };
  jsonErrors: number;
  tolerance: number | null;
  local: boolean;
  repeat?: number;
  counterOnly?: boolean;
}

export interface BuildPart {
  dir: string;
  version: string | null;
  commit: string | null;
  mtime: string | null;
  framework?: { [name: string]: string };
}

export interface ResultFile {
  schema: 1;
  suite: Suite;
  kind: string;
  label: string;
  ref: string | null;
  commit: string | null;
  previousCommit: string | null;
  date: string;
  requested: { only: Array<string> | null, notInSuite: Array<string> };
  incomplete: { reason: "timeout" | "killed", unrun: Array<string> } | null;
  build: { core: BuildPart, ui?: BuildPart, deps: DepsInfo };
  machine: MachineInfo;
  // null here; the caller may fill it in (CONTRACT.md: the perf server records the host load there).
  environment: any;
  fixtures: { [key: string]: { hash: string, dataHash?: string, options: any } };
  skipped: Array<{ id: string, reason: string }>;
  // Scenarios that threw (a check, a warning, jsonErrors on the runner's build); 04 sees them as missing.
  failed: Array<{ id: string, error: string }>;
  results: Array<ResultEntry>;
}

export function readVersion(dir: string): string | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")).version || null;
  } catch(e) {
    return null;
  }
}

export function buildPart(dir: string, mainFile: string, commit: string | null): BuildPart {
  const file = path.join(dir, mainFile);
  return { dir: dir, version: readVersion(dir), commit: commit, mtime: fs.existsSync(file) ? new Date(fs.statSync(file).mtimeMs).toISOString() : null };
}

function stamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

// <suite>-latest.json when PERF_ONLY is unset, <suite>-<kind>-<timestamp>.json otherwise; PERF_RESULT_FILE wins.
export function resultFilePath(env: PerfEnv, suite: Suite, date: Date): string {
  if (env.resultFile) return path.resolve(env.resultFile);
  const name = env.only ? suite + "-" + env.kind + "-" + stamp(date) + ".json" : suite + "-latest.json";
  return path.join(env.resultsDir, name);
}

// Atomic: a temp file, then a rename, so a reader never sees half a file.
export function writeJsonAtomic(file: string, value: any): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + "." + process.pid + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + "\n");
  fs.renameSync(tmp, file);
}
