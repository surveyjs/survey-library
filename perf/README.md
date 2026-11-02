# Performance tests

Performance tests of survey-library: survey-core alone (Node) and rendered with React 19 and survey-js-ui in headless
Chromium. They only measure: no markup checks, no screenshots. Every night the perf server (the private
`surveyjs/surveyjs-performance-monitor` repository) builds `master`, runs these suites, compares them with a reference,
posts the result to Discord and bisects a new regression to its PR. It uses this folder only through the runner
contract in [CONTRACT.md](CONTRACT.md).

## Layout

| path | what |
|---|---|
| `fixtures/` | generated survey JSON and data (`large`, `expressions`, `calculations`, `complexLogic`, `manyPages`, `records-1k`, `records-10k`) |
| `scenarios/` | the operations measured on them; `revs.json` holds each scenario's `rev` and hash |
| `harness/` | sample loop, stats, counters, calibration, ids; `harness/node/`: build checks, environment, machine key, dependency fingerprint, the result file |
| `core/` | the core suite: one fresh `node --expose-gc` process per scenario |
| `browser/` | the browser suites: Playwright, one fresh page per scenario, pages served from the builds by `context.route` |
| `react19/` | the pinned React 19 production build of the React suite |
| `manifest.ts`, `CONTRACT.md` | the runner contract: the suites, their ids, budgets and commands, and the result file a caller reads |
| `results/` | local output, git-ignored |

## Running locally

Build first: survey-core `npm run build && npm run build:i18n && npm run build:icons && npm run build:linter` (the UI
builds import `survey-core/icons`), then `npm run build` in
survey-react-ui and survey-js-ui. The suites refuse a stale build.

```bash
cd packages/survey-core && npm run perf              # core suite -> perf/results/core-latest.json
cd packages/survey-react-ui && npm run perf:ci       # React 19 suite
cd packages/survey-js-ui && npm run perf:ci          # survey-js-ui suite
cd packages/survey-core && npm run perf:test         # the perf code's own unit tests
```

* `PERF_ONLY=<id>,<id>` runs some scenarios (`perf/harness/ids.ts` lists them); `PERF_ONLY=calibration` runs only a
  calibration process.
* `PERF_CORE_DIR=<dir>` measures another survey-core build (a `packages/survey-core/build` folder, or an npm
  `node_modules/survey-core`); `PERF_UI_DIR=<dir>` another UI build. The tests always come from this checkout.
* A baseline, a judged run or a whole night locally come from the perf server's command line, pointed at this
  checkout (its README): `npm run baseline` / `npm run compare` on result files of these suites, and
  `node src/nightly.ts --runner <this checkout> --dry-post`.

## Changing the suites

A new scenario, fixture or suite needs no change on the server: it reads the ids, budgets and commands from
`node perf/manifest.ts`. A change it has to follow (a renamed environment variable, a result file field that changes
meaning, another way to run a suite) raises the contract version in `manifest.ts`, as `CONTRACT.md` says.
