import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { Suite } from "./harness/ids.ts";
import { SUITES, idsOfSuite } from "./harness/ids.ts";
import type { MachineInfo } from "./harness/node/machine.ts";
import { machineInfo } from "./harness/node/machine.ts";
import { uiPackage } from "./browser/paths.ts";

// The runner contract (CONTRACT.md): what a caller, such as the perf server in surveyjs-performance-monitor, needs to
// run the suites of this checkout. `node perf/manifest.ts` prints it as JSON; it needs no build and no installed package.
// 2 (2026-11-10): the manifest and a result entry lost the fields of the old judging (CONTRACT.md).
export const contractVersion = 2;
export const resultSchema = 2;

// A hang guard: it stops one hung core scenario process (perf/core/run.ts), and the rest of the suite still runs. A
// suite itself has no time limit. On the perf server the longest process on master took about 175 s
// (expressions/answer/next10; next3 takes about a third: 61 s vs 182 s locally, as the untimed setup does not shrink);
// on survey-core 3.2.0 complexLogic/answer/next10 took 7 minutes, and load/design and output/dispose do not finish.
export const scenarioTimeoutMs = 300000;

export interface SuiteManifest {
  ids: Array<string>;
  // Paths are relative to the checkout root: the caller runs `node <script> ...args` in cwd.
  cwd: string;
  script: string;
  args: Array<string>;
  // A browser suite: the UI package, its main build file and the source folders its build reads.
  package?: string;
  buildFile?: string;
  src?: Array<string>;
}

export interface Manifest {
  contract: number;
  resultSchema: number;
  suites: { [suite: string]: SuiteManifest };
  // This process's machine block without Chromium (its version is known only once Playwright runs).
  machine: MachineInfo;
}

export function manifest(env: NodeJS.ProcessEnv = process.env): Manifest {
  const suites: { [suite: string]: SuiteManifest } = {};
  SUITES.forEach((suite: Suite) => {
    if (suite === "core") {
      suites[suite] = { ids: idsOfSuite(suite), cwd: "packages/survey-core", script: "perf/core/run.ts", args: [] };
      return;
    }
    const ui = uiPackage[suite];
    suites[suite] = { ids: idsOfSuite(suite), cwd: "packages/" + ui.pkg, script: "node_modules/@playwright/test/cli.js",
      args: ["test", "-c", "playwright.perf.config.ts"], package: ui.pkg, buildFile: ui.file, src: ui.src.map((s: string) => "packages/" + s) };
  });
  return { contract: contractVersion, resultSchema: resultSchema, suites: suites, machine: machineInfo({ extra: env.PERF_MACHINE_EXTRA }) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(manifest(), null, 2));
}
