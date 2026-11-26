# The runner contract

How a caller runs the performance suites of a survey-library checkout and reads their results. The nightly perf server
(the private `surveyjs/surveyjs-performance-monitor` repository) is such a caller; it judges the results, keeps their
history and bisects regressions. This repository only measures.

Contract version: **2**. A change that a caller has to follow (a renamed variable, a new required step, a result file
field that changes meaning) raises `contractVersion` in `perf/manifest.ts`; a change of the result file's shape raises
`resultSchema` and the result file's `schema` with it. A caller refuses versions it does not know.

Contract 2 (2026-11-10) dropped the suite time limit and the spacer id from the manifest, and the fixed-work readings
from a result entry (result schema 2); the former spacer id in `PERF_ONLY` is now an unknown id. A contract-1 caller
reads `undefined` for them, so it must refuse contract 2.

## The manifest

`node perf/manifest.ts`, run from the checkout root with a Node that runs TypeScript directly (22.18 or newer), prints
JSON. It needs no build and no installed package.

```json
{
  "contract": 2,
  "resultSchema": 2,
  "suites": {
    "core": { "ids": ["..."], "cwd": "packages/survey-core", "script": "perf/core/run.ts", "args": [] },
    "react": { "ids": ["..."], "cwd": "packages/survey-react-ui",
      "script": "node_modules/@playwright/test/cli.js", "args": ["test", "-c", "playwright.perf.config.ts"],
      "package": "survey-react-ui", "buildFile": "survey-react-ui.min.js",
      "src": ["packages/survey-react-ui/src", "packages/survey-react-ui/entries"] },
    "survey-js-ui": { "...": "..." },
    "vue3": { "...": "..." },
    "angular": { "...": "...", "buildFile": "fesm2015/survey-angular-ui.js" }
  },
  "machine": { "key": "...", "os": "...", "cpu": "...", "cores": 16, "availableParallelism": 16, "node": "24.12.0", "chromium": null, "extra": "..." }
}
```

* `ids`: the scenario ids of the suite. An id is `<fixture>/<group>/<operation>` with an optional `@<question>`; the
  fixture is the part before the group (`extra/<name>` for the local-only extra fixtures), as `scenarioIdPattern` in
  `perf/harness/scenario.ts` reads it.
* `cwd`, `script`, `args`: paths relative to the checkout root. Run `node <script> <args...>` in `cwd`.
* `package`, `buildFile`, `src` (browser suites): the UI package to build, its main build file (for Angular, the
  partial-Ivy module the suite links into its page), and the folders its build reads. A caller can reuse a UI build
  when none of those folders changed.
* `machine`: the machine block of this process with `PERF_MACHINE_EXTRA` and no Chromium. Its `key` is how result
  files are grouped: results with different keys are never compared.

## Running a suite

Prerequisites: the checkout's root and `packages/survey-core` installed; for a browser suite also its UI package. The
React, Vue 3 and Angular suites install their pinned framework into `perf/react19`, `perf/vue3` and `perf/angular` by
themselves, so those folders must be writable. The target
builds are any survey-core and UI builds; without `PERF_CORE_DIR` / `PERF_UI_DIR` a suite measures the checkout's own
builds and refuses stale ones.

Input, all optional, as environment variables:

| variable | meaning |
|---|---|
| `PERF_CORE_DIR` | the survey-core build to measure (a `packages/survey-core/build` folder or an npm `node_modules/survey-core`) |
| `PERF_UI_DIR` | the UI build to measure (browser suites) |
| `PERF_RESULT_FILE` | where to write the result file |
| `PERF_RESULTS_DIR` | the folder for result files when `PERF_RESULT_FILE` is unset (default `perf/results`) |
| `PERF_ONLY` | comma-separated ids; ids of another suite are listed as `notInSuite`, unknown ids are an error (a local run also takes `extra/` ids and the local ids of `LOCAL_IDS`, which no manifest lists) |
| `PERF_KIND` | `local` (default), `nightly`, `on-demand`, `record`, `bisect`, `rerun`; recorded in the file |
| `PERF_LABEL`, `PERF_REF` | free text recorded in the file |
| `PERF_TARGET_COMMIT`, `PERF_PREVIOUS_COMMIT` | commits recorded in the file |
| `PERF_MACHINE_EXTRA` | appended to the machine key (the server passes its image tag and CPU set) |

A suite has no time limit: it runs as long as its scenarios take. Each scenario has a hang guard instead, which fails
that scenario alone and lets the rest run: 5 minutes per core scenario process (`scenarioTimeoutMs` in
`perf/manifest.ts`) and 5 minutes per browser test (the Playwright `timeout` in
`perf/browser/playwright.perf.base.cjs`).

Output: one result file. The suite rewrites it as it goes, so a suite killed outright leaves a file marked
`incomplete` (`reason: "killed"`, with the ids not run). A caller or a person may still stop a suite: on SIGTERM it
writes what it has with `reason: "timeout"` and exits with 143. Otherwise the exit code is 0, or 1 when a scenario
failed (it is listed in `failed`).

## The result file (`schema: 2`)

The types are `ResultFile` and `ResultEntry` in `perf/harness/node/result.ts`. A caller relies on:

* `suite`, `kind`, `label`, `ref`, `commit` (the runner's), `previousCommit`, `date`;
* `requested.only`, `requested.notInSuite`, `incomplete`;
* `build.core` / `build.ui` (`dir`, `version`, `commit`, `mtime`, `framework`) and `build.deps`;
* `machine` (as in the manifest, with `chromium` set by a browser suite);
* `fixtures[<fixture>]`: `hash`, `dataHash`, `options`;
* `skipped`, `failed`, and `results[]`: `id`, `rev`, `samples`, `median`, `min`, `max`, `mad`, `phases`,
  `counters` (`value`, `kind`), `info`, `jsonErrors`, `tolerance`, `local`, `repeat`, `counterOnly`.

A counter's `kind` says what it counts, not how to judge it: that is the caller's. All of them come from the untimed
counter run or from outside the samples' timed runs:

| kind | counters | what |
|---|---|---|
| `work` | `conditionRuns`, `expressionRuns`, `conditionsPasses`, `rowsCreated`, `panelsCreated`, a scenario's own | calls in survey-core during the counter run (`conditionsPasses`: passes over the survey's conditions, `SurveyModel.runConditionsCore`) |
| `dom` | `domNodes` (browser) | elements under the survey's root after the counter run |
| `render` | `layoutCount`, `recalcStyleCount` (browser) | layouts and style recalcs (CDP `Performance.getMetrics`) from the counter run's first run until the rendering is quiet (the counts the same for 2 frames in a row; `null` when it is not quiet within 60 frames) |
| `leak` | `listenerGrowth`, `nodeGrowth` (browser actions) | growth per sample of the JS event listeners and the DOM nodes, after a full gc (CDP `HeapProfiler.collectGarbage`), from the end of the first sample to the end of the last one: what a page keeps once is not counted |
| `heap` | `jsHeapGrowth`, `blinkHeapGrowth` (browser actions) | growth per sample in KB of the V8 heap and of Blink's (CDP `Runtime.getHeapUsage`: `usedSize`, `embedderHeapUsedSize`), in the same snapshots as `leak` |

What the counters do between runs of the same build, as observed (3 runs of the React, Vue 3 and Angular suites; the
leak counters also of survey-js-ui):

* `render` may differ by 1: a frame that falls inside an action (between an input event and the framework's commit)
  lets a ResizeObserver see an intermediate size, and its callback may force one more layout.
* `leak` was the same in every run.
* `heap` is not 0 without a leak and differs between runs: `jsHeapGrowth` by a few percent (JIT code and V8's caches
  grow the heap), `blinkHeapGrowth` by up to a few KB per sample (e.g. 5.51, 0.39, 5.42).

A `value` is `null` when the target cannot count it (a funnel the build lacks, no CDP). `info` holds what is not a
counter, for people: in the browser suites it adds `layoutMs`, `recalcStyleMs`, `scriptMs` (the `render` window's CDP
durations) and `jsHeapMB`, `blinkHeapMB` (the V8 and Blink heaps after a full gc through CDP, at the end of the
scenario) in place of the `heapMB` the core suite keeps.
A caller skips a counter whose `kind` it does not know: a new counter or a new `kind` does not raise the contract
version.

`environment` is always `null` here: it belongs to the caller, which may fill it in (the server records the host load
there).
