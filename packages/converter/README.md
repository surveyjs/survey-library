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
form, no layout, only the labels the schema carries. See the docs page.

## Not converting

Typeform, Formily, native `ngx-formly` (`.ts` closures), FormKit, and other
SaaS exports are out of scope — see the epic register for the rationale and the
demand gate.

## Development

```bash
# survey-core must be built first (it is the test oracle):
cd ../survey-core && npm run build

cd ../converter
npm install
npm run build      # dist/ + per-converter CDN bundles + cli
npm test           # unit + fidelity specs
npm run lint
```
