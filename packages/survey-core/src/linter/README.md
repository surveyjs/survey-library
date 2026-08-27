# survey-core/linter

Static analysis of a **survey JSON schema**. It reports logic defects — unresolvable
references, self-referencing conditions, duplicate names, unreachable choice comparisons,
trigger loops, dead carry-forward sources — before the survey is ever run.

The linter analyses the JSON **as authored**, without constructing a survey model. That is
the point: the serializer normalizes JSON while loading it (unknown properties are dropped,
an unknown type is replaced), which swallows the very defects the linter looks for. So no
`SurveyModel`, `PanelModel`, `Question` or `ItemValue` is created anywhere in this folder;
only the core's stateless utilities (`ConditionsParser`, `ValueGetter`, `TextPreProcessor`,
`FunctionFactory`, `Serializer` metadata) are reused. `tests/linter/linter-imports.tests.ts`
pins both constraints.

## Usage

```js
import { lintSurvey, renderFindings } from "survey-core/linter";

const result = lintSurvey(surveyJson);
if (result.errorCount > 0) {
  console.log(renderFindings(result));
}
```

`survey-core/linter` is a separate entry point that treats `survey-core` as an **external**
dependency, so it is never pulled into the bundle of an application that only renders a
survey. UMD global: `SurveyLinter` (expects `Survey` on the page).

Because both share one module closure, the linter sees what the application customized:
functions registered in `FunctionFactory.Instance`, question types registered in the
`Serializer`, and `settings` (`expressionVariables`, `commentSuffix`, `matrix.totalsSuffix`,
`noneItemValue`, comparison settings). Register your custom functions and types **before**
linting and no configuration is needed.

`lintSurvey` takes a parsed object — it throws a `TypeError` for a string, an array or
`null`. Parse JSON text with `JSON.parse` first.

## API

| Export | Description |
| --- | --- |
| `lintSurvey(json, options?): ISurveyLintResult` | Runs every enabled rule over the survey JSON. |
| `getRules(): Array<ILintRuleInfo>` | The rule registry: `{ id, defaultSeverity }` per rule. |
| `renderFindings(result \| findings, options?): string` | Human-readable text report (`{ includeSuppressed?: boolean }`). |

### Result

```ts
interface ISurveyLintResult {
  findings: Array<ILintFinding>;      // sorted by path, then ruleId
  errorCount: number;
  warningCount: number;
  infoCount: number;
  suppressedCount: number;
  suppressed?: Array<ILintFinding>;   // only with options.reportSuppressed
}

interface ILintFinding {
  ruleId: string;
  severity: "error" | "warning" | "info";
  message: string;                     // ready to show to a human
  messageData: { [key: string]: any }; // the same facts, structured, for custom formatting
  path: string;                        // "pages[0].elements[1].visibleIf"
  elementName?: string;
  elementType?: string;
  suggestion?: string;                 // closest known name, when the defect looks like a typo
  related?: Array<{ path: string, elementName?: string }>;
  reproduction?: ILintReproduction;    // steps demonstrating the defect: { set } / { expect }
}
```

### Options

```ts
interface ISurveyLintOptions {
  rules?: { [ruleId: string]: "error" | "warning" | "info" | "off" };
  suppress?: Array<{ ruleId?: string, elementName?: string, path?: string }>;
  knownVariables?: Array<string>;   // variables the host sets at runtime (survey.setVariable)
  knownFunctions?: Array<string>;   // functions registered elsewhere/later
  components?: { [typeName: string]: { questionJSON?: any, elementsJSON?: Array<any> } };
  reportSuppressed?: boolean;       // keep suppressed findings in result.suppressed
}
```

* **`rules`** overrides a rule's severity or switches it off entirely.
* **`suppress`** silences findings that match *all* the fields of an entry. `elementName`
  matching is case-insensitive; `path` is either exact or a prefix ending with `.*`
  (`"pages[2].*"`). An entry with no fields matches nothing.
* **`components`** describes custom question types (the `questionJSON` / `elementsJSON` of a
  `ComponentCollection` definition) so their inner elements and expressions are analysed and
  their type names stop being reported as unknown. Types already registered in the
  `ComponentCollection` of the shared closure need no entry here.

## Rules

| Rule id | Default | Reports |
| --- | --- | --- |
| `expression/syntax` | error | An expression that cannot be parsed — including one synthesized from a trigger's legacy `name`/`operator`/`value` properties. |
| `reference/unknown` | error | `{name}` that resolves to no question, panel, page, calculated value or variable; an unknown segment inside a dotted name (`{matrix.noSuchColumn}`); an unknown name in `bindings` or in a `choicesByUrl` URL. |
| `reference/self` | error | `visibleIf`/`enableIf`/`requiredIf` that references its own element (by name or `{self}`) — hiding the element clears its value, which flips the condition back. |
| `name/duplicate` | error | Two elements sharing a name in one namespace; duplicate calculated-value names; a calculated value shadowing an element name. |
| `element/unknown-type` | info | A question `type` that is neither registered nor passed via `options.components`. |
| `expression/unknown-function` | warning | A function call that `FunctionFactory.Instance` does not know and `options.knownFunctions` does not list. |
| `cycle/calculated-value` | error | Calculated values that reference themselves or form a loop. |
| `cycle/trigger` | warning | Triggers that form a loop through the values they set (a `valueName` and its question count as the same signal). |
| `expression/unknown-choice` | warning | A condition comparing a choice-based question to a value none of its choices can match. The check runs the runtime operator functions, so `contains` against a scalar value matches as a substring, exactly as at runtime. |
| `expression/type-mismatch` | warning | An operator that cannot hold for the question's value type: `=` against a multi-select array, ordering on a boolean, a numeric question compared to a string, a date compared to a number, a text question used in arithmetic. |
| `choices/dead-source` | error | `choicesFromQuestion` pointing at a missing question, at itself, or at a question that provides neither choices nor an array of values; `choiceValuesFromQuestion`/`choiceTextsFromQuestion` naming a column or template question that does not exist. |
| `trigger/unknown-target` | error | `setToName`, `fromName`, `gotoName` or `runExpression` targets that do not exist. |
| `trigger/unknown-type` | warning | A missing or unknown trigger `type` (silently dropped at runtime). |
| `page/empty` | warning | A page or panel with no element that can ever render, and a dynamic panel with an empty template. |

## What the analysis understands

* **Scopes.** `{row.col}`, `{panel.q}`, `{composite.field}` and their standalone forms are
  resolved against the matrix, dynamic panel or composite component that actually surrounds
  the expression; used outside such a container they get an explaining hint instead of a bare
  "not found". The prefixes come from `settings.expressionVariables`, so renaming them is
  honoured.
* **Data keys, not just names.** `valueName`, the `-Comment` suffix, matrix `-total` keys, the
  built-in variables the survey answers itself (`{pageno}`, `{locale}`, quiz counters) and the
  special choice items (`none`, `other`, `refuse`, `dontknow`) are all resolved.
* **Item-level conditions.** `choicesVisibleIf`, `choicesEnableIf`, `rowsVisibleIf` and
  `columnsVisibleIf` are evaluated with an item frame, so the legitimate "filter my own items
  by my own value" idiom is not reported as a self reference.
* **Typos.** Unresolved names, types, functions and trigger targets carry a `suggestion` — the
  closest known name by edit distance.
* **The serializer is the source of truth.** Element types, expression-bearing properties,
  container array keys and trigger target properties are read from the `Serializer` at lint
  time, so a property or a type added to the core — or registered by the application — is
  analysed without touching this folder. `catalog.ts` holds only the handful of semantics the
  metadata cannot carry, and `tests/linter/linter-catalog-drift.tests.ts` guards it.

## Limits

* No runtime data: a defect that appears only for a particular set of answers is out of scope,
  and conditions are not solved (a `cycle/trigger` loop may be unreachable — the message says so).
* A custom question type without a `components` entry is analysed as an opaque element.
* A custom trigger type is not covered by the target and cycle checks.

## Example output

```
ERROR  reference/unknown
  "frut" is not found - no question, panel, page, calculated value, or variable with that name exists. Did you mean "fruit"? (in "{frut} = 'apple'")

  visibleIf: {frut} = 'apple'
  at elements[1].visibleIf

  No case: the reference cannot be evaluated.

WARN  expression/unknown-choice
  The condition compares "fruit" to "aple" - not among its choices. Available: "apple", "banana". (in "{fruit} = 'aple'")

  visibleIf: {fruit} = 'aple'
  at elements[2].visibleIf

  Reproduction: No selectable choice of "fruit" equals "aple".
    {
      "steps": [
        { "set": { "fruit": "apple" } },
        { "set": { "fruit": "banana" } },
        { "expect": { "visible": { "note": true } } }
      ]
    }

1 error, 1 warning, 0 info
```

## Source layout

| File | Responsibility |
| --- | --- |
| `index.ts` | `lintSurvey`, `getRules`, the run order and the result assembly. |
| `types.ts` | The public interfaces (options, findings, result). |
| `walker.ts` | Walks the JSON once and builds the index: elements, containers, name/valueName maps, calculated values, triggers, expression sites and their scopes. |
| `symbols.ts` | The index data structures, including the case-insensitive maps used for user-supplied names. |
| `metadata.ts` | Everything read from the `Serializer` at runtime (types, expression properties, trigger definitions, container keys). |
| `catalog.ts` | The few linter semantics the serializer metadata cannot express. |
| `lint-settings.ts` | Snapshot of the `settings` the analysis depends on, taken once per run. |
| `expression-utils.ts` | Expression parsing, reference splitting and reference classification (resolved / unknown / scoped / skipped). |
| `value-types.ts` | Per-question value shape and choice information. |
| `graph.ts`, `levenshtein.ts` | Cycle detection and typo suggestions. |
| `rule.ts` | `ILintRule`, `LintContext.report`, severity resolution and suppression matching. |
| `rules/` | One file per rule, registered in `rules/index.ts`. |
| `renderer.ts` | `renderFindings` — the text report. |

### Adding a rule

1. Create `rules/<id>.ts` exporting an `ILintRule` with a namespaced `id` (`"area/defect"`),
   a `defaultSeverity` and a `run(ctx)` that reads `ctx.index` / `ctx.metadata` and calls
   `ctx.report(...)`. Do not read the JSON directly when the walker already indexed what you
   need, and never construct a model object.
2. Register it in `rules/index.ts`.
3. Give every finding a `path`, a message a form author can act on, and the same facts in
   `messageData`; add a `suggestion` when the defect looks like a typo and a `reproduction`
   when the failure can be demonstrated with a few `set` steps.
4. Add tests under `tests/linter/`.

## Build and test

```bash
npm run build          # survey-core itself — required first
npm run build:linter   # rollup -c rollup.linter.config.mjs (part of npm run build:all)
npx vitest run tests/linter
```

`build:linter` resolves `survey-core` types through `./build`, so it fails on a clean
checkout unless `npm run build` ran before it.
