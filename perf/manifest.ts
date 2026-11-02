import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { Suite } from "./harness/ids.ts";
import { SUITES, idsOfSuite, CALIBRATION_ONLY } from "./harness/ids.ts";
import type { MachineInfo } from "./harness/node/machine.ts";
import { machineInfo } from "./harness/node/machine.ts";
import { uiPackage } from "./browser/paths.ts";

// The runner contract (CONTRACT.md): what a caller, such as the perf server in surveyjs-performance-monitor, needs to
// run the suites of this checkout. `node perf/manifest.ts` prints it as JSON; it needs no build and no installed package.
export const contractVersion = 1;
export const resultSchema = 1;

// The wall time of a suite on the perf server, in minutes; the caller stops a suite at 1.5x of it.
const budgetMin: { [suite: string]: number } = { "core": 10, "react": 8, "survey-js-ui": 8 };

export interface SuiteManifest {
  ids: Array<string>;
  budgetMin: number;
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
  calibrationOnlyId: string;
  suites: { [suite: string]: SuiteManifest };
  // This process's machine block without Chromium (its version is known only once Playwright runs).
  machine: MachineInfo;
}

export function manifest(env: NodeJS.ProcessEnv = process.env): Manifest {
  const suites: { [suite: string]: SuiteManifest } = {};
  SUITES.forEach((suite: Suite) => {
    if (suite === "core") {
      suites[suite] = { ids: idsOfSuite(suite), budgetMin: budgetMin[suite], cwd: "packages/survey-core", script: "perf/core/run.ts", args: [] };
      return;
    }
    const ui = uiPackage[suite];
    suites[suite] = { ids: idsOfSuite(suite), budgetMin: budgetMin[suite], cwd: "packages/" + ui.pkg, script: "node_modules/@playwright/test/cli.js",
      args: ["test", "-c", "playwright.perf.config.ts"], package: ui.pkg, buildFile: ui.file, src: ui.src.map((s: string) => "packages/" + s) };
  });
  return { contract: contractVersion, resultSchema: resultSchema, calibrationOnlyId: CALIBRATION_ONLY, suites: suites,
    machine: machineInfo({ extra: env.PERF_MACHINE_EXTRA }) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(manifest(), null, 2));
}
