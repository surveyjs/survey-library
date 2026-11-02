import * as path from "node:path";
import { runnerRoot } from "./build.ts";

// The variables of 00, Environment variables.
export type RunKind = "local" | "nightly" | "on-demand" | "record" | "bisect" | "rerun";
const kinds: Array<RunKind> = ["local", "nightly", "on-demand", "record", "bisect", "rerun"];

export interface PerfEnv {
  coreDir?: string;
  uiDir?: string;
  targetCommit: string | null;
  kind: RunKind;
  label: string;
  ref: string | null;
  previousCommit: string | null;
  only: Array<string> | null;
  resultsDir: string;
  resultFile?: string;
  machineExtra: string;
  extraJson?: string;
}

const value = (env: NodeJS.ProcessEnv, name: string): string | undefined => {
  const v = env[name];
  return v === undefined || v === "" ? undefined : v;
};

export function parseOnly(text: string | undefined): Array<string> | null {
  if (!text) return null;
  const list = text.split(",").map((s: string) => s.trim()).filter((s: string) => !!s);
  return list.length > 0 ? list : null;
}

export function readEnv(env: NodeJS.ProcessEnv = process.env): PerfEnv {
  const kind = (value(env, "PERF_KIND") || "local") as RunKind;
  if (kinds.indexOf(kind) < 0) throw new Error("PERF_KIND must be one of " + kinds.join(", ") + ": " + kind);
  return {
    coreDir: value(env, "PERF_CORE_DIR"),
    uiDir: value(env, "PERF_UI_DIR"),
    targetCommit: value(env, "PERF_TARGET_COMMIT") || null,
    kind: kind,
    label: value(env, "PERF_LABEL") || kind,
    ref: value(env, "PERF_REF") || null,
    previousCommit: value(env, "PERF_PREVIOUS_COMMIT") || null,
    only: parseOnly(value(env, "PERF_ONLY")),
    resultsDir: path.resolve(value(env, "PERF_RESULTS_DIR") || path.join(runnerRoot, "perf", "results")),
    resultFile: value(env, "PERF_RESULT_FILE"),
    machineExtra: value(env, "PERF_MACHINE_EXTRA") || "",
    extraJson: value(env, "PERF_EXTRA_JSON")
  };
}
