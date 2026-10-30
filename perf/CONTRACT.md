# The runner contract

How a caller runs the performance suites of a survey-library checkout and reads their results. The nightly perf server
(the private `surveyjs/surveyjs-performance-monitor` repository) is such a caller; it judges the results, keeps the
baselines and bisects regressions. This repository only measures.

Contract version: **1**. A change that a caller has to follow (a renamed variable, a new required step, a result file
field that changes meaning) raises `contractVersion` in `perf/manifest.ts`; a change of the result file's shape raises
`resultSchema` and the result file's `schema` with it. A caller refuses versions it does not know.

## The manifest

`node perf/manifest.ts`, run from the checkout root with a Node that runs TypeScript directly (22.18 or newer), prints
JSON. It needs no build and no installed package.

```json
{
  "contract": 1,
  "resultSchema": 1,
  "calibrationOnlyId": "calibration",
  "suites": {
    "core": { "ids": ["..."], "budgetMin": 10, "cwd": "packages/survey-core", "script": "perf/core/run.ts", "args": [] },
    "react": { "ids": ["..."], "budgetMin": 8, "cwd": "packages/survey-react-ui",
      "script": "node_modules/@playwright/test/cli.js", "args": ["test", "-c", "playwright.perf.config.ts"],
      "package": "survey-react-ui", "buildFile": "survey-react-ui.min.js",
      "src": ["packages/survey-react-ui/src", "packages/survey-react-ui/entries"] },
    "survey-js-ui": { "...": "..." }
  },
  "machine": { "key": "...", "os": "...", "cpu": "...", "cores": 16, "availableParallelism": 16, "node": "24.12.0", "chromium": null, "extra": "..." }
}
```

* `ids`: the scenario ids of the suite. An id is `<fixture>/<group>/<operation>` with an optional `@<question>`; the
  fixture is the part before the group (`extra/<name>` for the local-only extra fixtures), as `scenarioIdPattern` in
  `perf/harness/scenario.ts` reads it.
* `budgetMin`: the suite's wall time on the perf server; a caller may stop a suite with SIGTERM past 1.5x of it.
* `cwd`, `script`, `args`: paths relative to the checkout root. Run `node <script> <args...>` in `cwd`.
* `package`, `buildFile`, `src` (browser suites): the UI package to build, its main build file, and the folders its
  build reads (a caller can reuse a UI build when none of them changed).
* `machine`: the machine block of this process with `PERF_MACHINE_EXTRA` and no Chromium. Its `key` is how result
  files are grouped: results with different keys are never compared.

## Running a suite

Prerequisites: the checkout's root and `packages/survey-core` installed; for a browser suite also its UI package (the
React suite installs its pinned React 19 into `perf/react19` by itself, so that folder must be writable). The target
builds are any survey-core and UI builds; without `PERF_CORE_DIR` / `PERF_UI_DIR` a suite measures the checkout's own
builds and refuses stale ones.

Input, all optional, as environment variables:

| variable | meaning |
|---|---|
| `PERF_CORE_DIR` | the survey-core build to measure (a `packages/survey-core/build` folder or an npm `node_modules/survey-core`) |
| `PERF_UI_DIR` | the UI build to measure (browser suites) |
| `PERF_RESULT_FILE` | where to write the result file |
| `PERF_RESULTS_DIR` | the folder for result files when `PERF_RESULT_FILE` is unset (default `perf/results`) |
| `PERF_ONLY` | comma-separated ids; ids of another suite are listed as `notInSuite`, unknown ids are an error. `calibration` alone runs only a calibration process and writes no result file |
| `PERF_KIND` | `local` (default), `nightly`, `on-demand`, `record`, `bisect`, `rerun`; recorded in the file |
| `PERF_LABEL`, `PERF_REF` | free text recorded in the file |
| `PERF_TARGET_COMMIT`, `PERF_PREVIOUS_COMMIT` | commits recorded in the file |
| `PERF_MACHINE_EXTRA` | appended to the machine key (the server passes its image tag and CPU set) |

Output: one result file. The suite rewrites it as it goes, so a suite killed outright leaves a file marked
`incomplete` (`reason: "killed"`, with the ids not run). On SIGTERM it writes what it has with `reason: "timeout"`
and exits with 143. Otherwise the exit code is 0, or 1 when a scenario failed (it is listed in `failed`).

## The result file (`schema: 1`)

The types are `ResultFile` and `ResultEntry` in `perf/harness/node/result.ts`. A caller relies on:

* `suite`, `kind`, `label`, `ref`, `commit` (the runner's), `previousCommit`, `date`;
* `requested.only`, `requested.notInSuite`, `incomplete`;
* `build.core` / `build.ui` (`dir`, `version`, `commit`, `mtime`, `framework`) and `build.deps`;
* `machine` (as in the manifest, with `chromium` set by a browser suite);
* `fixtures[<fixture>]`: `hash`, `dataHash`, `options`;
* `skipped`, `failed`, and `results[]`: `id`, `rev`, `samples`, `median`, `min`, `max`, `mad`, `calibration`
  (`median`, `before`, `after`), `phases`, `counters` (`value`, `kind`), `info`, `jsonErrors`, `tolerance`, `local`,
  `repeat`, `counterOnly`.

`environment` is always `null` here: it belongs to the caller, which may fill it in (the server records the host load
there).
