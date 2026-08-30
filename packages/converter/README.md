# survey-converter

Convert third-party form definitions into [SurveyJS](https://surveyjs.io)
survey JSON. Pure JSON→JSON, runs client-side, **zero runtime dependencies**.

Ships one converter per source format, each behind its own subpath export and
its own CDN bundle:

| Source | Import | CDN bundle |
| --- | --- | --- |
| Form.io | `survey-converter/formio` | `survey.converter.formio.min.js` |
| JSON Schema (JSONForms / RJSF / bare) | `survey-converter/json-schema` | `survey.converter.json-schema.min.js` |

> **Status:** scaffold. The report contract, package resolution, CLI, and
> format detection are in place; the converter walks are built per the specs in
> [`promts/`](./promts). Track progress by the `PROMPT NN` markers in the source.

## Install

```bash
npm install survey-converter survey-core
```

`survey-core` is a **peer dependency** (`^3.0.0`) — it is not used at runtime,
only as the conversion **oracle** in this package's tests (every converted JSON
must construct a `SurveyModel` with no errors). An install mismatch warns; it
does not change which Serializer you convert against.

## Usage

```ts
import { convert } from "survey-converter/formio";

const { output, report } = convert(formioForm);
// output  -> SurveyJS survey JSON
// report  -> what did NOT round-trip cleanly (see below)
```

`convert(input)` **never throws on an unsupported construct** — those go in the
report. It throws only on unparseable input (`UnparseableInputError`) or
wrong-format input (`WrongFormatError`, e.g. a JSON Schema handed to the Form.io
converter).

### The report

`report` is versioned, serializable, and **content-free** — stable codes,
structural pointers, and counts, never a fragment of the user's form. Four
buckets, each driving a different action:

| Bucket | Meaning | Action |
| --- | --- | --- |
| `unsupported` | In the source spec, we have no rule yet | Our gap — file it |
| `unknown` | Not in the spec at all | **Drift alarm** — format changed or a custom extension |
| `assumed` | We guessed; renders right, may branch wrong | The dangerous one — review |
| `dropped` | Knowingly discarded (styling, vendor metadata) | Silent unless `--verbose` |

Each entry carries a **target path** into the produced JSON, so the Creator
import plugin can highlight the affected element.

```ts
import { formatReport } from "survey-converter";
console.log(formatReport(report));           // the library never prints on its own
console.log(formatReport(report, { verbose: true }));
```

## CLI

```bash
survey-converter --from formio       form.json                 > survey.json
survey-converter --from json-schema  schema.json --out survey.json
survey-converter --from formio form.json --fail-on unsupported,assumed --verbose
```

The report goes to stderr, the SurveyJS JSON to stdout (or `--out`).
`--fail-on <buckets>` exits non-zero (1) when any named bucket fired — for
pipeline gating.

## What emits JSON Schema already converts

The `json-schema` converter is also the ingest path for anything that emits
JSON Schema: OpenAPI 3.1 request bodies, Zod/Yup/TypeBox/Valibot (via their
`*-to-json-schema` bridges), ngx-formly JSON Schema mode, and the RJSF /
JSONForms / Uniforms **data** schemas. Ceiling for the bridge cases: a flat
form, no layout, only the labels the schema carries. Full list, copy-paste
one-liners, and a runnable OpenAPI 3.1 demo:
[docs/emitters-json-schema.md](./docs/emitters-json-schema.md).

## Not converting

Typeform, Formily, native `ngx-formly` (`.ts` closures), FormKit, and other
SaaS exports are out of scope — see the epic register for the rationale and the
demand gate.

## Development

Every executable action in this package is an npm script — run them from
`packages/converter/`. Nothing here is wired into a monorepo task runner; the
package installs and builds on its own.

### One-time setup

```bash
# survey-core is the test ORACLE (converted JSON must construct a SurveyModel
# with zero jsonErrors) and is reached through node_modules/survey-core, a
# junction to ../survey-core/build. Build it BEFORE installing/testing here,
# or `npm install` links an empty directory and every spec fails to import it.
cd ../survey-core && npm run build

cd ../converter && npm install
```

### Build

| Command | What it does |
| --- | --- |
| `npm run build` | `build:types` + rollup. The full publishable `dist/`. |
| `npm run build:types` | `tsc -p tsconfig.build.json` → `dist/typings/` only. Declarations are emitted separately because the rollup TS plugin runs with `declaration: false`; the `exports` map and `typesVersions` point at this output, so a rollup-only build ships JS with no types. |
| `npm run watch:dev` | Rollup in watch mode (JS bundles only — **no** `.d.ts` refresh; re-run `build:types` when a public signature changes). |

`rollup.config.mjs` emits three things: ESM + CJS per subpath (`.`, `./formio`,
`./json-schema`), one minified self-contained IIFE per converter
(`dist/survey.converter.<name>.min.js`, the CDN bundles), and the Node CLI
(`dist/cli.js`, shebang preserved).

### Test

| Command | What it does |
| --- | --- |
| `npm test` | `vitest run` — unit + fidelity specs. Vitest picks up `src/**/*.spec.ts` **and** `corpus/**/*.spec.ts`, so this includes the corpus gate. Node environment, no DOM. |
| `npm run test:watch` | Same set, watch mode. |
| `npx vitest run src/formio` | One directory. |
| `npx vitest run -t "name"` | One test by name substring. |

### Corpus (fidelity gate + drift alarm)

The corpus is real upstream form definitions, scored rather than pinned — see
[`corpus/README.md`](./corpus/README.md) for why. Two jobs, four commands — all
run by hand: this package has no workflow of its own in `.github/workflows/`.

| Command | Network | What it does |
| --- | --- | --- |
| `npm run corpus:score` | no | The regression gate — run it before pushing a converter change: runs `corpus/fidelity.spec.ts` over the **committed** snapshots. Hard-fails on an oracle break (any output that will not construct a `SurveyModel`) or an aggregate fidelity regression below `corpus/fidelity-baseline.json`. |
| `npm run corpus:score:update-baseline` | no | Deletes `corpus/fidelity-baseline.json` and re-scores so the spec writes a fresh one. **Deliberate act** — commit the baseline diff and say why it moved; a converter improvement raises it, a regression must not be laundered through it. |
| `npm run corpus:refresh` | **yes** | The drift job (weekly cadence, run by hand). A: re-scrape the repos in `corpus/sources.json` into `corpus/<source>/` and diff construct tokens against each `_manifest.json`. B: diff the vendored schema snapshots (`src/formio/vendor/`, JSON Schema meta-schemas) against upstream. Writes content-free alerts to `corpus/.alerts.json` (gitignored) and rewrites snapshots + manifests in the working tree. Add `--fail-on-alert` to gate on it. |
| `npm run corpus:refresh:self-test` | no | Proves the alert paths fire against a synthetic new construct + vendored drift. Nothing else covers the alarm itself, so run it whenever the diff/alert code changes. |

`corpus:refresh` is the one that needs a cadence rather than a trigger — weekly
is what it was designed for, because upstream ships on its own clock and a
construct we have no rule for only shows up when we look. It rewrites snapshots
and manifests in the working tree, so its output is reviewed as an ordinary
diff, and the *high* alerts in `corpus/.alerts.json` are the backlog it exists
to produce.

### Lint

```bash
npm run lint        # eslint . --max-warnings=0
npm run lint:fix
```

`.eslintignore` excludes `dist`, `node_modules`, and `corpus` (scraped
third-party JSON and the `.mjs` job scripts are not linted).

### Running the CLI locally

The `survey-converter` bin points at the **built** `dist/cli.js`, so build first:

```bash
npm run build
node dist/cli.js --from formio corpus/formio/<some>.json | head
node dist/cli.js --from json-schema schema.json --fail-on unsupported,assumed --verbose
```

Report → stderr, survey JSON → stdout (or `--out`); `--fail-on` exits 1 when a
named bucket fired.

### Release

`npm run release` (commit-and-tag-version) bumps `package.json` and tags. It
publishes nothing on its own — the package is released through the repo's
normal pipeline.
