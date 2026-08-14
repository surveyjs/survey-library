# survey-core/tester

A headless assertion harness for survey logic. You supply a survey definition and a set of test
cases in JSON; the harness runs each case against a real `SurveyModel` and reports, per step and per
check, what the survey actually did. No UI, no DOM, no renderer — the result is structured data.

```ts
import { runSurveyTests } from "survey-core/tester";

const result = await runSurveyTests(surveyJson, tests, options);
```

It is a separate entry point. An application that only renders a survey never loads any of it, and
nothing in `survey-core` itself imports from `src/tester/`.

The case format is public API — a visual editor for it will live in SurveyJS Builder — so it is
optimised for being edited by a tool, not only written by hand. Read this file before changing it.

---

## 1. The grammar

Everything in the format has one shape:

```
<keyword>  →  <target name>  →  <payload>
```

* **Command step** — `{ "<command>": { "<target>": <parameters> } }`
* **Check step** — `{ "expect": { "<target>": { "<check>": <expected>, ... } } }`

`expect` **is a command** — the one whose parameters are a map of check → expected value. It lives in
the same registry as `set` and `complete`, so there is one execution path and one rule.

1. **A step is exactly one command.** Since `expect` is a command, a step never mixes acting and
   asserting. `name` and `description` are step metadata and do not count.
2. One command may address **several targets** and still be one command: `{ "set": { "q1": 1, "q2": "a" } }`.
   Targets run in the order the keys are written.
3. One `expect` may address several targets, and each target may assert several checks at once.
4. **`"survey"` is a reserved target name** meaning the survey itself. If the definition contains a
   question, panel or page named `survey`, the case does not run: it reports the case error
   `reservedTargetName` and asks you to rename the element.
5. **There is no `data` check.** Whole-object equality of the result data breaks whenever a question
   is added, a default value appears or `clearInvisibleValues` removes a key. Use `values` (partial,
   name → expected) and `noValues` (names that must be absent). They are deliberately not called
   `contains`/`notcontains`: those already mean array membership in the expression engine.
6. **One command, one check, one payload type.** Every entry declares exactly one accepted type and
   the runner verifies the payload before the handler runs. Nothing changes meaning according to the
   type it was handed — no page index where a page name is expected, no scalar silently wrapped into
   an array, no `true`/`{}`/`null` synonyms.
7. **The survey definition is not part of the case file.** A suite is a list of tests and nothing
   else; the definition is a separate argument, so the same suite runs against an edited definition
   and the same definition against several suites.

### Targets

A target is a name, or several names separated by `.`, where a name may carry an index:

| Target | Means |
|---|---|
| `"survey"` | the survey itself |
| `"q1"` | a question, panel, page or calculated value named `q1` |
| `"contacts[1].phone"` | the question `phone` of the second panel of the dynamic panel `contacts` |
| `"items[0].quantity"` | the cell `quantity` of the first row of the dynamic matrix `items` |
| `"matrix.row1.column1"` | a cell addressed by row name |

A name that resolves to nothing ends the case with the `unknownTarget` error and, when there is a
near miss, the name it probably meant.

### Commands simulate a respondent

Before a command acts, the harness verifies that the interaction is possible. If it is not, the case
ends with a **case error** and the survey is left untouched — the case describes something no
respondent could do.

* The navigation commands check that their button is currently displayed and enabled. Pressing Next
  on the last page is not a no-op; it is an error saying that Complete has replaced Next.
* `set` checks that the question is on the current page, visible and editable, and that the value
  could be typed into that input: the mask accepts it, `maxLength` permits it, the choice exists.
  Constraints a respondent *can* violate — `min`/`max`, validators — are deliberately not checked,
  or validation itself would be untestable.
* A complex question is filled **leaf by leaf**, each leaf checked before it is set, so conditions
  and triggers fire between cells exactly as they do for a person.
* `setComment` checks that a comment editor exists: the comment area is off by default, most question
  types have none at all, and the "Other" input of a select question is a comment editor only while
  `storeOthersAsComment` holds and the "Other" choice is selected — writing that input is a warning,
  because the text is an answer and not a comment. The comment area of a choice item is a different
  storage that the comment of the question does not reach, and the error says so.
* `addRow`, `removeRow`, `addPanel` and `removePanel` read the model's own `canAddRow`,
  `canRemoveRows` and `canRemoveRow`, `canAddPanel` and `canRemovePanel` — the properties that show
  and hide the Add and Remove buttons themselves. A read-only question, a count at `maxRowCount` or
  `minPanelCount`, a locked row and an `onMatrixRenderRemoveButton` handler each end the case with an
  error instead of a silent change no respondent could make. The growth a `set` performs implicitly
  stops at the same line. A press the model then refuses — an `onMatrixRowAdding`,
  `onMatrixRowRemoving` or `onDynamicPanelRemoving` handler cancels it — is a warning, not an error,
  exactly as a blocked Complete is.
* Possible-but-ineffective is not an error: a Complete button that validation blocks runs, warns and
  leaves the state to the following `expect`.

`setDirectly` is the one deliberate escape hatch, named for the mechanism so that nobody reaches for
it by accident: it assigns a value with none of those checks. It is for setup a respondent cannot
perform, never a way around a failing `set`.

---

## 2. Commands

| Command | Target | Payload | Effect |
|---|---|---|---|
| `expect` | survey, element | check → expected | asserts; see §3 |
| `set` | element | the value | types the value in, leaf by leaf, with every feasibility check |
| `setDirectly` | element | the value | assigns the value with no check; warns when the target is hidden or read-only |
| `clear` | element | `true` | clears the answer as the respondent would |
| `setComment` | element | a string | types into the comment area of the question |
| `addRow` | dynamic matrix | a count | presses "Add row" that many times |
| `removeRow` | dynamic matrix | a row index | removes that row |
| `addPanel` | dynamic panel | a count | presses "Add panel" that many times |
| `removePanel` | dynamic panel | a panel index | removes that panel |
| `nextPage` | survey | `true` | presses Next |
| `prevPage` | survey | `true` | presses Previous |
| `complete` | survey | `true` | presses Complete |
| `startSurvey` | survey | `true` | presses Start on the start page |
| `showPreview` | survey | `true` | presses Preview |
| `cancelPreview` | survey | `true` | presses Edit on the preview page |

`true` is the canonical "this command takes no parameters" payload.

Commands live in `SurveyTestCommandFactory.Instance`; an integrator registers their own the same way
the built-ins are registered, and a custom command may assert through `context.addCheckResult` just
as `expect` does.

## 3. Checks

Element checks:

| Check | Applies to | Payload |
|---|---|---|
| `value` | question, calculated value | the value |
| `empty` | question | a boolean |
| `visible` | question, panel, page | a boolean |
| `enabled` | question, panel, page | a boolean |
| `required` | question | a boolean |
| `errors` | question, panel, page | an array of error texts |
| `errorCount` | question, panel, page, survey | a number |
| `hasErrors` | question, panel, page | a boolean |
| `comment` | question | a string |
| `choices` | a question with choices | an array of choice values |
| `title` | question, panel, page | a string, with the locale and the text piping resolved |
| `page` | question, panel | a page name |
| `rowCount` | dynamic matrix | a number |
| `panelCount` | dynamic panel | a number |
| `type` | question | a question type name |

Survey checks:

| Check | Payload |
|---|---|
| `state` | `running`, `completed`, `preview`, `starting`, `empty`, `loading`, `completedbefore` |
| `currentPage` | a page name — never an index |
| `values` | name → expected value; a partial match, one result per name |
| `noValues` | an array of names that must be absent from the data |
| `variables` | name → expected value; one result per name |
| `pages` | the visible page names, **in order** |
| `errorCount` | a number |

The three error checks exist separately because one payload type means one thing: `errors` is the
texts, `errorCount` is a number, and `hasErrors` earns its place because a count cannot express "at
least one".

A check never converts one type into another. `value: "5"` does not match a stored `5`, even though
the expression engine treats them as equal — a case that passes with the wrong type hides the bug it
was written to find. Empty values keep the engine's semantics, so `value: null` still matches an
unanswered question.

Checks live in `SurveyTestCheckFactory.Instance` and are extensible in the same way as the commands.

---

## 4. Options, variables and starts — three inputs, three rules

This is the part that is easiest to get wrong, and the rules differ **because the three things
differ**: flat run configuration, independent named values, one coherent state a scenario
deliberately describes.

### `options` merge per key

`ISurveyTestOptions` is pure run configuration — `locale`, `now`, `randomSeed`,
`clearInvisibleValues`, `checkErrorsMode`, `stopOnFirstFailure` — and every member is a scalar. The
root `options` always apply, and a test's own `options` merge over them **shallow, one level, per
key**. Because it is flat, deep-merge semantics never become a question, and every option can be
overridden back to its default.

The options a test actually ran with are reported on its result: the root values apply invisibly,
and a reader of a failing case would otherwise see nothing that explains the behaviour.

### `variables` merge per name

Root variables always apply, and a test's own merge over them **per variable name**, so a test that
overrides `region` still gets `tier`. Variables are neither an option (options merge per key, so a
dictionary nested there would be replaced wholesale and every root variable the test did not restate
would silently vanish) nor part of a start (starts do not merge at all, so a test referencing a
shared start could never override one variable).

Variables are applied **before** the start data, so a `defaultValueExpression` or a `visibleIf` that
reads one sees it while the answers go in.

**The one limit:** a test can override a root variable but cannot remove it. `null` sets it to
`null`; it does not unset it. This is the single place where "everything is overridable back to its
default" does not hold, and it is documented rather than solved with an unset sentinel.

### `start` does not merge at all

A test either references a start by name from `starts` or inlines one — never a name with overrides
on top. A partly merged `data` blob would produce a starting state that no scenario deliberately
describes, and it changes what the survey computes. The resolved start is **deep-cloned for every
test run**, so one test's mutation cannot leak into the next through a shared entry.

`startPage` is a page name only: an index would let a page reorder silently redirect a case.
`dataMode` decides how the data is applied — `"input"` (the default) puts every answer in through the
normal set path, so triggers, calculated values and conditions run as they would for a respondent;
`"restore"` assigns the data at once, as if it were loaded from saved storage.

---

## 5. A worked example

```ts
import { runSurveyTests } from "survey-core/tester";

const surveyJson = {
  pages: [{
    name: "page1",
    elements: [
      { type: "radiogroup", name: "hasInsurance", choices: ["yes", "no"] },
      { type: "text", name: "insuranceProvider", visibleIf: "{hasInsurance} = 'yes'", isRequired: true }
    ]
  }]
};

const tests = {
  name: "Insurance",
  options: { clearInvisibleValues: "onComplete" },
  variables: { region: "eu", tier: "gold" },
  starts: [
    { name: "declined", data: { hasInsurance: "no" } }
  ],
  tests: [
    {
      name: "Declining insurance skips the provider question",
      steps: [
        { set: { hasInsurance: "no" } },
        { expect: { insuranceProvider: { visible: false } } },
        { complete: { survey: true } },
        { expect: { survey: {
            state: "completed",
            values: { hasInsurance: "no" },
            noValues: ["insuranceProvider"]
        } } }
      ]
    },
    {
      name: "US pricing starts from a declined form",
      start: "declined",
      variables: { region: "us" },
      steps: [
        { expect: { survey: { variables: { region: "us", tier: "gold" } } } }
      ]
    }
  ]
};

const result = await runSurveyTests(surveyJson, tests);
```

`result.status` is `"passed"`, `"failed"` (a check did not hold) or `"error"` (the case could not
run). `result.summary` counts the tests and the checks, `result.tests[i].steps[j].checks` holds one
entry per assertion — target, check, expected, actual, `passed`, a plain sentence and the JSON path
of the node it is about — and `result.tests[i].issues` plus `steps[j].issues` hold the case errors
and the warnings. A failing check carries what explains it: the expression that produced the state
with the values it read, the triggers that fired, the questions that blocked a navigation, and the
name a value was cleared under.

The whole result is plain data. Formatting it is the caller's job.
