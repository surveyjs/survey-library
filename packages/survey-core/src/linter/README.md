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
| `SurveyLintReasons` | `reason` values per rule id — the localization key, see [Localization](#localization). |
| `SurveyLintHintReasons` | `hint.reason` values. |
| `SurveyLintReproductionReasons` | `reproduction.reason` values. |

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
  message: string;                     // ready to show to a human, in English
  reason?: string;                     // which branch of the rule's message this is
  messageData: { [key: string]: any }; // the same facts, structured, for custom formatting
  hint?: { reason: string, name: string };  // the scope hint appended to the message
  path: string;                        // "pages[0].elements[1].visibleIf"
  elementName?: string;
  elementType?: string;
  suggestion?: string;                 // closest known name, when the defect looks like a typo
  related?: Array<{ path: string, elementName?: string }>;
  reproduction?: ILintReproduction;    // steps demonstrating the defect: { set } / { expect }
}
```

## Localization

`message` is English. A host that shows findings in its own language does not translate that
string: it composes its own sentence from **`(ruleId, reason)`** plus `messageData`.

`reason` names the branch of the rule's message the finding took, and every value is listed in
`SurveyLintReasons[ruleId]`. **The rule ids and the reason values are public API — they are
frozen and they stay stable.** `getRules()` gives the rule ids on their own, for a host that
also names the checks.

```js
import { lintSurvey, SurveyLintReasons } from "survey-core/linter";

const key = finding.ruleId + "/" + finding.reason;   // "reference/unknown/notFound"
const text = format(myStrings[key], finding.messageData);
```

Three things are composed on top of the base sentence, and none of them needs a channel of its
own — a host appends them from fields it already has:

* `finding.suggestion` — the *Did you mean "x"?* clause.
* `messageData.expression` — the *(in "…")* clause.
* `messageData.refKind` — for `reference/unknown`, whether the reference came from `bindings`
  or from a `choicesByUrl` URL.

`finding.hint` is the one part that is not a branch: any base message of `reference/unknown` can
carry any of the `SurveyLintHintReasons`, so it travels separately. `reproduction.reason` and
`messageData.suggestionReason` (`expression/type-mismatch` only, whose `suggestion` is prose
rather than an identifier) work the same way.

A rule interpolates only what it also reports in `messageData`, so a localized message never
needs a fact the finding does not carry. `tests/linter/linter-reasons.tests.ts` pins that: every
reason in the table is reachable, and every finding carries one.

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
| `reference/unknown` | error | `{name}` that resolves to no question, panel, page, calculated value or variable; an unknown segment inside a dotted name (`{matrix.noSuchColumn}`); an unknown name in `bindings` or in a `choicesByUrl` URL; a `keyName` naming no column / template question. |
| `reference/self` | error | `visibleIf`/`enableIf`/`requiredIf` that references its own element (by name or `{self}`) — hiding the element clears its value, which flips the condition back. |
| `name/duplicate` | error | Two elements sharing a name in one namespace; duplicate calculated-value names; a calculated value shadowing an element name. |
| `name/shadowing` | warning | A name that answers somewhere else than the JSON suggests: a question, `valueName` or calculated value spelling a built-in variable (`{pageno}`, `{locale}`, the quiz counters), which the survey answers first; a `valueName` landing on the name another question already writes under; a data key spelling the `-Comment` or `-total` key the runtime derives for another element; and a `setvalue` trigger with `isVariable` writing a variable named after a question, whose answer then stops answering its own name. Two questions deliberately sharing a `valueName` is not reported — that is how they answer as one. |
| `element/unknown-type` | info | A question `type` that is neither registered nor passed via `options.components`. |
| `property/invalid-value` | warning | A value the property cannot hold: one outside the values the serializer lists for it (`titleLocation`, `clearIfInvisible`, `progressBarType`, a column `cellType`, …) — with the closest allowed spelling as a suggestion, including a value that only has the wrong case — and a number outside the registered `minValue`/`maxValue`. Also a `valueName` containing a `.`, which every reference reads as a path into another key. |
| `property/dead` | info | A property the JSON states and the runtime does not keep: one that is not serializable (globally, like `mode`, or suppressed on its own type, like `correctAnswer` on an `expression` question) and so disappears the next time the survey is saved; one property written under both its names (`elements` and `questions`, `showOtherItem` and `hasOther`), where the key written last silently wins; and `min`/`max`/`step` on an `inputType` that has no bounds. Kept apart from `property/unknown` at `info`, since legacy JSON carries these and they do work. |
| `property/unknown` | warning | A key that matches no property of the class the JSON says it belongs to — the deserializer drops it, so the setting never takes effect. The key matching is the deserializer's own (a property name or its `alternativeName`, spelled exactly), and the class comes from the serializer, so custom types and custom properties are known automatically. A misspelling carries the closest property name as a suggestion. Custom components are left alone: what a component does with its JSON is its own business. |
| `expression/unknown-function` | warning | A function call that `FunctionFactory.Instance` does not know and `options.knownFunctions` does not list. |
| `cycle/calculated-value` | error | Calculated values that reference themselves or form a loop. |
| `cycle/trigger` | warning | Triggers that form a loop through the values they set (a `valueName` and its question count as the same signal). Reads include the guard condition, `runExpression`, and a copyvalue's `fromName`. |
| `cycle/value-write` | warning | Everything that writes a value - question `setValueIf`/`setValueExpression`, `resetValueIf`, `defaultValueExpression`, triggers, calculated values - in one graph: a loop spanning those domains, or an expression reading the very value it writes. A loop living entirely among triggers or entirely among calculated values stays with its own rule. |
| `expression/unknown-choice` | warning | A condition comparing a question to a value none of the values it can hold matches: the `choices` of a select question, the `rateValues` of a rating, the `columns` a single-choice matrix row answers with, or the two values of a `boolean` with `valueTrue`/`valueFalse`. The check runs the runtime operator functions, so `contains` against a scalar value matches as a substring, exactly as at runtime. |
| `expression/type-mismatch` | warning | An operator that cannot hold for the question's value type: `=` against a multi-select array, ordering on a boolean, a numeric question compared to a string, a date compared to a number, a text question used in arithmetic. |
| `choices/dead-source` | error | `choicesFromQuestion` pointing at a missing question, at itself, or at a question that provides neither choices nor an array of values; `choiceValuesFromQuestion`/`choiceTextsFromQuestion` naming a column or template question that does not exist. |
| `choices/duplicate` | warning | Two items of one itemvalue array holding the same value — `choices` (a question's own, a matrix column's own, or the shared cell choices of a matrix), `rateValues`, and the `rows`/`columns` of a single-choice matrix. Equality is the runtime one, so `1` and `"1"` are one value. Also a listed choice colliding with a built-in item the question shows anyway (`showNoneItem`, `showOtherItem`, `showRefuseItem`, `showDontKnowItem`), which renders the item twice. |
| `trigger/unknown-target` | error | `setToName`, `fromName`, `gotoName` or `runExpression` targets that do not exist. |
| `trigger/unknown-type` | warning | A missing or unknown trigger `type` (silently dropped at runtime). |
| `validator/unknown-type` | warning | A missing or unknown validator `type` on a question, a matrix column or a multiple-text item — the deserializer drops it, so nothing validates. |
| `validator/dead` | warning | A validator that cannot do the job it was written for: one the question does not support (`settings.supportedValidators` up the class chain, narrowed by `inputType` for a text question — a `numeric` validator on a checkbox rejects every answer, an `email` one on a number never fires); a `numeric`, `text` or `answercount` validator whose minimum is above its maximum; an `answercount` minimum above the choices that can be selected together; a `regex` the engine rejects; and an `expression` validator with no expression, which always passes. |
| `expression/contradiction` | warning | A condition that can never hold: one that evaluates to false from constants written inline or reached through a reference, one asking for a value the question is not allowed to hold, and one that contradicts itself (`{q} = 'a' and {q} = 'b'`, `{q} empty and {q} notempty`, bounds with nothing between them, `anyof []`). |
| `expression/meaningless-condition` | warning | A condition whose result is known upfront in some other way - always true, arithmetic where a boolean is expected, or a fragment (a constant branch of `and`/`or`, a comparison of two constants, an operand compared with itself). |
| `value/not-a-choice` | warning | A value written in the JSON that its question can never hold: a `defaultValue`, a `correctAnswer`, or the `setValue` of a `setvalue` trigger. The same sets of values as `expression/unknown-choice`, checked from the other side. Composite defaults (matrix/dynamic panel `defaultValue`, `defaultRowValue`, `defaultPanelValue`) are taken apart per key: an unknown row/column/template-question key and an alien cell value are both reported. A `copyvalue` trigger whose ends cannot exchange a value (an array copied into a single-value question, or two listed value sets with nothing in common) is reported too. |
| `element/count-contradiction` | warning | Authored count and bound constraints the runtime silently reconciles: `minRowCount` above `maxRowCount`, `rowCount`/`panelCount` outside the authored bounds (dynamic matrices and panels), and the same conflict in every other bound pair — `rateMin`/`rateMax`, a numeric or date `min`/`max` (question, matrix column, multiple-text item), slider `min`/`max` and `minRangeLength`/`maxRangeLength`, `minSelectedChoices`/`maxSelectedChoices`, and the fraction-digit pairs of an `expression` question and of column totals. Also a `rateStep` (or slider `step`) wider than the whole range, a `rateCount` outside `[2, settings.ratingMaximumRateValueCount]`, and a `minSelectedChoices` above the number of choices that can be selected together. |
| `element/never-visible` | warning | An element dead through the cascade: its `visibleIf` demands a value of a question that can never become visible and that nothing (defaults, expressions, triggers, bindings) ever writes to. A question with `visible: false` is not a cascade source - hidden fields are routinely filled from application code. |
| `page/empty` | warning | A page or panel with no element that can ever render, and a dynamic panel with an empty template. An element is counted out when it is statically hidden or its own `visibleIf` can never hold. Also `detailElements` of a matrix whose `detailPanelMode` stays `"none"` (the default). |

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
* **Constant sources.** A calculated value or an `expression` question whose expression contains
  no answer and no function call has one value, known while authoring, so a condition reading it
  is decided too: `visibleIf: "{c1} = 5"` against `"expression": "1 + 1"` never holds. Chains are
  followed (a source built on another source), and a branch that settles decides the whole
  condition — a false `and` branch sinks it whatever the other branch depends on. A source is
  disqualified when a trigger can write to it, when it carries a `defaultValue` or a
  `setValueExpression`, when its name is declared twice, or when it sits inside a matrix or a
  dynamic panel, where the name is not what the reference addresses. A source that can be hidden
  proves "never holds" but not "always holds": under `clearInvisibleValues: "onHidden"` the value
  is gone. The folded value also reaches `expression/unknown-choice` and
  `expression/type-mismatch`, so `{q1} = {c1}` is checked the way `{q1} = 'zzz'` is.
* **Sets of values.** A question whose JSON lists every value it can hold — `choices`,
  `rateValues`, the `columns` a single-choice matrix row answers with, the `valueTrue`/`valueFalse`
  pair of a boolean — is checked from both sides: a condition comparing it to something outside
  that set (`expression/unknown-choice`), and a value the JSON itself writes into it
  (`value/not-a-choice`). The set is used only when it is exhaustive, so `choicesByUrl`,
  `choicesLazyLoadEnabled`, `choicesFromQuestion` and a question with no listed choice at all are
  left alone. A `defaultValue` outside the choices is a deliberate legacy value, so it widens what
  a *condition* may compare against — but it is exactly what `value/not-a-choice` reports, which
  is why the domain itself does not carry it.
* **Bounds.** A question that keeps its value between two bounds — `min`/`max` on a numeric or
  date `text`, `rateMin`/`rateMax`/`rateCount` on a rating, `min`/`max` on a slider — rules out
  the comparisons no allowed value satisfies: `visibleIf: "{age} > 10"` against `max: 5` never
  holds. These are not merely validators — `canSetValueToSurvey` refuses to write an out-of-range
  value into the survey data — but the reasoning runs one way only: an unanswered question makes
  any comparison false, so bounds can prove that a condition *never* holds and never that it
  always does. `inputType: "time"` and `"week"` are left out, since the runtime compares them
  with its own arithmetic, and so is a bound given as `minValueExpression`/`maxValueExpression`.
* **Conditions that contradict themselves.** Within one `and` chain, two requirements on the
  same reference that cannot both hold — two different values, a value and its negation,
  `empty` next to `notempty` or next to a value, a lower bound at or above an upper one, a value
  outside a bound the same condition states — make the condition unreachable. Only an `and`
  chain is taken apart: the branches of an `or` are alternatives. Tautologies are deliberately
  not reported: `{q} = 'a' or {q} <> 'a'` is false for an unanswered question, so it is not
  always true. The three mechanisms compose without knowing about each other, because each of
  them settles a leaf of the same three-valued walk: `{age} > 3 and {age} > 10` against
  `max: 5` is caught by the bounds of the question, not by the two conjuncts.
* **Typos.** Unresolved names, types, functions and trigger targets carry a `suggestion` — the
  closest known name by edit distance.
* **The serializer is the source of truth.** Element types, expression-bearing properties,
  container array keys and trigger target properties are read from the `Serializer` at lint
  time, so a property or a type added to the core — or registered by the application — is
  analysed without touching this folder. `catalog.ts` holds only the handful of semantics the
  metadata cannot carry, and `tests/linter/linter-catalog-drift.tests.ts` guards it.

## Relation to `Base.validateExpressions`

`validateExpressions` reports four kinds of error over a **built model**. The linter reports the
same four over the **authored JSON**: syntax errors as `expression/syntax`, unknown functions as
`expression/unknown-function`, unknown variables as `reference/unknown`, and semantic errors as
`expression/contradiction` (the condition is always false) or `expression/meaningless-condition`
(everything else). The semantic verdict is taken from the core itself — the rules call
`Operand.addConditionSemanticErrors` rather than reimplementing it — so the two stay in step,
including the deliberate silence on a lone boolean constant: `visibleIf: "false"` is how an author
switches an element off, not a defect, and nothing reports it. A lone reference to a constant
source (`visibleIf: "{c1}"`) is left alone for the same reason.

Where the linter goes further than `validateExpressions` is the constant sources above: the core
judges one expression at a time, while the linter has the whole JSON and can tell that `{c1}` is
always `2`. Such findings carry their own reasons (`alwaysFalseViaConstants`,
`alwaysTrueViaConstants`), and the core's verdict wins whenever it has one — it names the more
specific defect.

`expression/contradiction` is named for the whole defect rather than for one way of establishing
it, which is why the satisfiability reasoning of the reachability group of #11693 extended it
under new reasons instead of needing a new rule id.

## Limits

* No runtime data: a defect that appears only for a particular set of answers is out of scope,
  and a `cycle/trigger` loop may be unreachable — the message says so. A condition decided
  entirely by what is known while authoring is the exception: it has no answers to depend on, so
  it is evaluated. The satisfiability reasoning stays deliberately shallow — one reference at a
  time, within one `and` chain — so a contradiction spread across several references, or one that
  only holds for whole numbers, is not reported.
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
| `expression-utils.ts` | Expression parsing, reference splitting and reference classification (resolved / unknown / scoped / skipped), the operator sets, and the constant-value extraction the analysis modules share. |
| `value-types.ts` | Per-question value shape and choice information. |
| `value-domain.ts` | The set of values a reference can hold, or the bounds it stays inside. |
| `value-range.ts` | Whether a comparison against those bounds can hold at all. |
| `satisfiability.ts` | Conjuncts of one `and` chain that demand contradictory things of the same reference. |
| `constant-env.ts` | The values known at authoring time: calculated values and expression questions nothing else writes to. |
| `condition-eval.ts` | Three-valued evaluation of a condition over the modules above. |
| `graph.ts`, `levenshtein.ts` | Cycle detection and typo suggestions. |
| `cycle-report.ts`, `message-utils.ts` | The shared halves of the cycle rules and of the sentences rules build. |
| `rule.ts` | `ILintRule`, `LintContext` (site iteration, memoized verdicts and domains, `report`), severity resolution and suppression matching. |
| `reasons.ts` | The frozen `(ruleId, reason)` tables a host localizes on. |
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
4. Add an entry for the rule to `SurveyLintReasons` in `reasons.ts`, with one value per branch
   of its message, and pass it as `reason`. Interpolate nothing the finding does not also
   report: a host composes the localized sentence from `(ruleId, reason)` and `messageData`.
5. Add tests under `tests/linter/`.

## Build and test

```bash
npm run build          # survey-core itself — required first
npm run build:linter   # rollup -c rollup.linter.config.mjs (part of npm run build:all)
npx vitest run tests/linter
```

`build:linter` resolves `survey-core` types through `./build`, so it fails on a clean
checkout unless `npm run build` ran before it.
