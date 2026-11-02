import * as fs from "node:fs";
import * as path from "node:path";
import { runnerRoot } from "../harness/node/build.ts";
import type { Suite } from "../harness/ids.ts";

// The directories a browser suite serves (00, Runner and target): the target's builds and the runner's page files.
export const browserDir = path.join(runnerRoot, "perf", "browser");
export const cacheDir = path.join(runnerRoot, "perf", "results", ".cache");
export const react19Dir = path.join(runnerRoot, "perf", "react19");

// src: the folders the UI build reads, for the stale-build check (survey-js-ui compiles survey-react-ui's sources).
export const uiPackage: { [suite: string]: { pkg: string, file: string, page: string, src: Array<string> } } = {
  "react": { pkg: "survey-react-ui", file: "survey-react-ui.min.js", page: "react.html", src: ["survey-react-ui/src", "survey-react-ui/entries"] },
  "survey-js-ui": { pkg: "survey-js-ui", file: "survey-js-ui.min.js", page: "js-ui.html",
    src: ["survey-js-ui/entries", "survey-react-ui/src", "survey-react-ui/entries"] }
};

export function suiteOf(env: NodeJS.ProcessEnv = process.env): Suite {
  const suite = env.PERF_SUITE;
  if (suite !== "react" && suite !== "survey-js-ui") throw new Error("PERF_SUITE must be react or survey-js-ui: " + suite);
  return suite;
}

export function coreDirOf(env: NodeJS.ProcessEnv = process.env): string {
  return env.PERF_CORE_DIR ? path.resolve(env.PERF_CORE_DIR) : path.join(runnerRoot, "packages", "survey-core", "build");
}

export function uiDirOf(suite: Suite, env: NodeJS.ProcessEnv = process.env): string {
  return env.PERF_UI_DIR ? path.resolve(env.PERF_UI_DIR) : path.join(runnerRoot, "packages", uiPackage[suite].pkg, "build");
}

// The file behind a perf.local URL, or undefined (the request fails).
export function resolveUrl(url: string, suite: Suite): string | undefined {
  const u = new URL(url);
  if (u.host !== "perf.local") return undefined;
  const [, root, ...rest] = u.pathname.split("/");
  const rel = rest.join("/");
  if (!rel || rel.split("/").indexOf("..") > -1) return undefined;
  let dir: string | undefined;
  if (root === "core") dir = coreDirOf();
  if (root === "ui") dir = uiDirOf(suite);
  if (root === "react19") dir = cacheDir;
  if (root === "page") dir = rel === "perf-page.js" ? cacheDir : path.join(browserDir, "pages");
  if (!dir) return undefined;
  const file = path.join(dir, rel);
  return fs.existsSync(file) ? file : undefined;
}
