# Performance tests

Performance tests of survey-library: survey-core alone (Node) and rendered with React 19, survey-js-ui, Vue 3 and Angular
in headless Chromium. They only measure: no markup checks, no screenshots. Every night the perf server (the private
`surveyjs/surveyjs-performance-monitor` repository) builds `master`, runs these suites, compares them with the previous
nights, posts the result to Discord and bisects a new regression to its PR. It uses this folder only through the runner
contract in [CONTRACT.md](CONTRACT.md).

## Layout

| path | what |
|---|---|
| `fixtures/` | generated survey JSON and data (`large`, `expressions`, `calculations`, `complexLogic`, `manyPages`, `records-1k`, `records-10k`, `records-plain`) |
| `scenarios/` | the operations measured on them; `revs.json` holds each scenario's `rev` and hash |
| `harness/` | sample loop, stats, counters, ids; `harness/node/`: build checks, environment, machine key, dependency fingerprint, the result file |
| `core/` | the core suite: one fresh `node --expose-gc` process per scenario |
| `browser/` | the browser suites: Playwright, one fresh page per scenario, pages served from the builds by `context.route` |
| `react19/`, `vue3/`, `angular/` | the pinned framework of the React, Vue 3 and Angular suites, installed by the suite into its `node_modules` |
| `manifest.ts`, `CONTRACT.md` | the runner contract: the suites, their ids and commands, and the result file a caller reads |
| `results/` | local output, git-ignored |

## Running locally

Build first: survey-core `npm run build && npm run build:i18n && npm run build:icons && npm run build:linter` (the UI
builds import `survey-core/icons`), then `npm run build` in the UI package of each browser suite you run
(survey-react-ui, survey-js-ui, survey-vue3-ui, survey-angular-ui). The suites refuse a stale build.

```bash
cd packages/survey-core && npm run perf              # core suite -> perf/results/core-latest.json
cd packages/survey-react-ui && npm run perf:ci       # React 19 suite
cd packages/survey-js-ui && npm run perf:ci          # survey-js-ui suite
cd packages/survey-vue3-ui && npm run perf:ci        # Vue 3 suite
cd packages/survey-angular-ui && npm run perf:ci     # Angular suite
cd packages/survey-core && npm run perf:test         # the perf code's own unit tests
```

* `PERF_ONLY=<id>,<id>` runs some scenarios (`perf/harness/ids.ts` lists them).
* `PERF_CORE_DIR=<dir>` measures another survey-core build (a `packages/survey-core/build` folder, or an npm
  `node_modules/survey-core`); `PERF_UI_DIR=<dir>` another UI build. The tests always come from this checkout.
* A judged run or a whole night locally come from the perf server's command line, pointed at this checkout (its
  README), such as `node src/nightly.ts --runner <this checkout> --dry-post`.

By default a scenario keeps up to 12 samples (core) or 7 (browser), and at least 5: `maxMs` (3 s core, 5 s browser,
from the first warm-up) decides how many. The order is warm-ups, then the samples (each: setup, gc, the timed run,
check, teardown), then one counter run. A browser load scenario has no warm-ups and opens a fresh page per sample
instead of a teardown. A suite runs as long as it runs; a hung scenario is stopped by its hang guard (5 minutes) and
fails alone (`CONTRACT.md`).

### Local forms (`PERF_EXTRA_JSON`)

`PERF_EXTRA_JSON=<file>;<file>` adds survey JSON files of your own to a local core run, as fixtures
`extra/<basename>`. Their scenarios are never baselined, and warnings and `jsonErrors` on them are counted
(`info.warnings`, `jsonErrors`), not failures. Each file gets `extra/<base>/load/model` and
`extra/<base>/answer/first` (the first choice of the first question with choices). Optional files next to
`<base>.json`, found by name, add more:

| file | what |
|---|---|
| `<base>.data.json` | the survey data: the `data` ops assign it, every other op starts from a model that has it |
| `<base>.setup.mjs` | a module whose default export `(Survey) => void` runs once per scenario process before any survey is created, with the measured build's module: register the form's custom functions here |
| `<base>.ops.json` | a JSON array of operations, one scenario each: `extra/<base>/ops/<id>` |

An operation is `{ "id": "<id>", "op": "<kind>", ... }`. Each sample creates a fresh model in the untimed setup; every
op except `data` also assigns the data there, then runs `before` (an optional list of `{ "name", "value" }`
`setValue` calls). Only the operation itself is timed, and its check runs after it.

| `op` | fields | the timed call | the check |
|---|---|---|---|
| `data` | | `survey.data = data` on a model without data | some data values are set; the `dataDiffs` counter is the number of top-level keys whose value differs from the data |
| `data-again` | | the same assignment a second time | as `data` |
| `merge` | `value` | `survey.mergeData(value)` | each key of `value` |
| `set` | `name`, `value` | `survey.setValue(name, value)` | the value |
| `cell` | `question`, `row`, `column`, `value` | `matrix.value` with one cell changed (`row`: a row value, or an index of a dynamic matrix) | the cell |
| `row-cell` | `question`, `row`, `column`, `value` | the cell question of the visible row gets `value` | the cell question and the row |
| `panel-question` | `question`, `panelIndex`, `name`, `value` | the question `name` of the panel gets `value` | the question |
| `type` | `question`, `text` | one `value` assignment per character, as `textUpdateMode: "onTyping"` makes them | the text |

A slow op sets `"samples"` (the samples kept: all of them when 5 or fewer) and `"warmup"` (default 2). A sample that
takes minutes needs a longer hang guard: `PERF_EXTRA_TIMEOUT_MS` sets it for `extra/` ids only.

```bash
PERF_EXTRA_JSON=/abs/form.json PERF_EXTRA_TIMEOUT_MS=1800000 PERF_ONLY=extra/form/ops/data,extra/form/ops/type npm run perf
```

The core suite counts `conditionsPasses` for every scenario: the passes over the survey's conditions
(`SurveyModel.runConditionsCore`) in the counter run.

## The browser suites

Every page loads survey-core's UMD build from `PERF_CORE_DIR` as `window.Survey`, so all suites measure the same core
build. React and survey-js-ui run 24 ids (survey-js-ui without `manyPages/pages/preview`). Vue 3 and Angular run
`RENDER_SUBSET` (`harness/ids.ts`): 13 ids whose cost is mostly rendering. The rest measure model code that core and
React already cover.

* React 19 and Vue 3 are pinned in `react19/` and `vue3/`. The page loads the UI package's UMD build.
* Angular is pinned in `angular/` and runs with zone.js. survey-angular-ui has no UMD build: its `fesm2015` module is
  partial-Ivy, so global-setup links it with Angular's linker and bundles it with `browser/angular-entry.ts` into one
  page script. That script takes `survey-core` from `window.Survey` and the icons from the same core build.

The browser suites also count through CDP `Performance.getMetrics` (`browser/cdp-metrics.ts` exposes it to the page as
`__perfMetrics()`, `harness/cdp.ts` turns snapshots into counters), never inside a timed run: `layoutCount` and
`recalcStyleCount` in the counter run (until the rendering is quiet: survey-core's ResizeObserver callbacks measure in
the rAF of a later frame), `listenerGrowth`, `nodeGrowth`, `jsHeapGrowth` and `blinkHeapGrowth` of an action scenario per sample, from the first
sample to the last (after a full gc through CDP), `jsHeapMB` and `blinkHeapMB` in `info`, and the counter run's layout, style and script durations in `info`
(`CONTRACT.md` lists the counter kinds).

## Changing the suites

A new scenario, fixture or suite needs no change on the server: it reads the ids and commands from
`node perf/manifest.ts`. A change it has to follow (a renamed environment variable, a result file field that changes
meaning, another way to run a suite) raises the contract version in `manifest.ts`, as `CONTRACT.md` says.

`node perf/scenarios/revs.ts` checks each id's `rev` against the hash of its measured code. A browser id's hash also
covers the page code (`browser/page-helpers.ts`, `browser/angular-entry.ts`). After changing that code, bump
`PAGE_REV` in `scenarios/index.ts` once, then run `revs.ts --write`.
