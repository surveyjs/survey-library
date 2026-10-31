import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// The runner checkout (00 section Runner and target): this file is perf/harness/node/build.ts.
export const runnerRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
export const runnerCoreBuild = path.join(runnerRoot, "packages", "survey-core", "build");

export interface CoreDir {
  dir: string;
  // The runner's own build: PERF_CORE_DIR unset, or its realpath is the runner's build.
  isRunnerBuild: boolean;
}

export function resolveCoreDir(value?: string): CoreDir {
  const env = value === undefined ? process.env.PERF_CORE_DIR : value;
  if (!env) return { dir: runnerCoreBuild, isRunnerBuild: true };
  const dir = path.resolve(env);
  let isRunnerBuild = false;
  try {
    isRunnerBuild = fs.realpathSync(dir) === fs.realpathSync(runnerCoreBuild);
  } catch(e) {
    isRunnerBuild = false;
  }
  return { dir: dir, isRunnerBuild: isRunnerBuild };
}

export function newestFile(dir: string): { file: string, mtime: number } {
  let res = { file: "", mtime: 0 };
  const walk = (d: string): void => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const mtime = fs.statSync(full).mtimeMs;
        if (mtime > res.mtime) res = { file: full, mtime: mtime };
      }
    }
  };
  walk(dir);
  return res;
}

// Fails with both dates when a built file is older than the newest file of its src folder.
export function checkBuildFresh(srcDirs: string | Array<string>, buildFiles: Array<string>, hint: string): void {
  const newest = (Array.isArray(srcDirs) ? srcDirs : [srcDirs]).map(newestFile).reduce((a: any, b: any) => (b.mtime > a.mtime ? b : a));
  for (const file of buildFiles) {
    if (!fs.existsSync(file)) throw new Error("Missing build file " + file + ". Run: " + hint);
    const mtime = fs.statSync(file).mtimeMs;
    if (mtime < newest.mtime) {
      throw new Error("Stale build: " + file + " (" + new Date(mtime).toISOString() + ") is older than " + newest.file + " (" +
        new Date(newest.mtime).toISOString() + "). Run: " + hint);
    }
  }
}

export function checkBuildExists(buildFiles: Array<string>): void {
  for (const file of buildFiles) {
    if (!fs.existsSync(file)) throw new Error("Missing build file " + file);
  }
}

export const coreBuildHint = "npm run build && npm run build:i18n && npm run build:linter (in packages/survey-core)";
