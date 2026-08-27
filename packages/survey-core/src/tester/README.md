# survey-core/tester

A headless assertion harness for survey logic. You supply a survey definition and a set of test
cases in JSON; the harness runs each case against a real `SurveyModel` and reports, per step and per
check, what the survey actually did. No UI, no DOM, no renderer — the result is structured data.

```ts
import { runSurveyTests } from "survey-core/tester";

const result = await runSurveyTests(surveyJson, tests, options);
```

The first argument is the survey JSON: the harness creates the `SurveyModel` every test runs on. A
host that needs to configure that model, or to watch and pace the run step by step, passes an
execution contract as the fourth argument — see §7.

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
8. **A test may hold no steps.** `"steps": []` is valid and it runs — see "An empty test" below. A
   *missing* or non-array `steps` is still the structural error `stepsMissing`: the property is what
   says "this object is a test".

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

The grammar runs backwards as well: `SurveyTestTargets.nameOf(survey, object)` returns the name that
addresses a live model object — see §8.

### An empty test

`"steps": []` is the natural intermediate state of a test that is being written, and it is what a
recorder starts from: it needs a model that the case describes, and the only thing that builds one is
the runner.

An empty test is structurally valid and it runs. In order:

* its model factory is called;
* the options, the variables and the start state are applied exactly as for any other test;
* `testStarted`, `surveyCreated` and `testCompleted` are emitted, in that order and with nothing
  between the last two — **no step, target or check event**, because nothing of the kind happened;
* the tester detaches from the model before `testCompleted` and before `run()` settles, so the host
  is left with a usable model whose clock is still pinned;
* the test **passes vacuously**.

What still ends it with `"error"`: a model factory that fails or returns something that is not a
`SurveyModel`, an element named `survey`, and a start state that cannot be applied (`startPage`
naming a page that does not exist). A disabled empty test is `"skipped"` and never reaches the
factory, like any other disabled one.

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
* Possible-but-ineffective is not an error: a Complete, Next or Preview button that validation blocks
  runs, warns and leaves the state to the following `expect`.

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
| `choiceTexts` | a question with choices | the visible choice texts, **in order** |
| `title` | question, panel, page | a string, with the locale and the text piping resolved |
| `description` | question, panel, page | a string, with the locale and the text piping resolved |
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

`choices` and `choiceTexts` are two checks for the same reason. `choices` is what the survey stores and
posts; `choiceTexts` is what the respondent reads — the rendered text of the same visible items, in the
order they appear, with `choicesVisibleIf`, the locale and the text piping resolved. A case that pins
the texts says so by name, and neither check changes meaning with the shape of its payload:

```json
{ "expect": { "plan": {
  "choices": ["basic", "pro"],
  "choiceTexts": ["Basic for Ann", "Professional for Ann"]
} } }
```

`choices` compares as a set and `choiceTexts` in order: the same answers offered in another order are
the same set of answers, and the same screen rendered in another order is a different screen.

`title` and `description` read an element the same way — the string as it is rendered, so the locale,
the text piping and the HTML form the definition wrote are all resolved. An element that declares no
description reads as an empty string, so `"description": ""` pins "there is none".

A check never converts one type into another. `value: "5"` does not match a stored `5`, even though
the expression engine treats them as equal — a case that passes with the wrong type hides the bug it
was written to find. Empty values keep the engine's semantics, so `value: null` still matches an
unanswered question.

Checks live in `SurveyTestCheckFactory.Instance` and are extensible in the same way as the commands.

---

## 4. Options, variables, starts and stubs — four inputs, four rules

This is the part that is easiest to get wrong, and the rules differ **because the four things
differ**: flat run configuration, independent named values, one coherent state a scenario
deliberately describes, and the answers the world outside the survey gives it.

### `options` merge per key

`ISurveyTestOptions` is pure run configuration — `locale`, `now`, `randomSeed`,
`clearInvisibleValues`, `checkErrorsMode`, `stopOnFirstFailure`, `asyncTimeout` — and every member is
a scalar. The
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

### `functions` and `web` — what the survey takes from outside itself

A survey is not always self-contained. Its expressions may call a function the application registered
through `FunctionFactory`, and a question may load its choices from a web service. Both come from
outside the model, and both are answered by the case: `functions` maps a function name to what it
answers, `web` maps a url to what it returns. Both **merge per key**, test over suite, exactly like
the variables above them.

```json
{
  "functions": {
    "getRate": {
      "async": true,
      "result": 1.0,
      "results": [
        { "params": ["EUR"], "result": 1.1 },
        { "params": ["GBP"], "delay": 20, "result": 1.3 }
      ]
    },
    "isMemberValid": { "async": true, "error": "the membership service is down" }
  },
  "web": {
    "https://api.example.com/countries": {
      "response": [{ "id": "de", "name": "Germany" }, { "id": "fr", "name": "France" }]
    },
    "https://api.example.com/cities": { "status": 500, "statusText": "Server Error" }
  }
}
```

An url the case declares is answered by its stub. An url it does not declare follows the Form
Library's normal `XMLHttpRequest` or `fetch` path, including the process-wide `ChoicesRestful` cache.
This lets a test use the real choices service when it needs no controlled response and prevents
identical requests from putting avoidable pressure on that service. Declare every relevant url when
the test must be deterministic or must reproduce a service failure.

| function stub | |
| --- | --- |
| `result` | the answer when no `results` row matches |
| `results` | rows tried in order; a row answers when its `params` match the call |
| `params` | the argument list a row answers. Compared the way a check compares a value: `"1"` does not match `1` |
| `error` | the handler failed. The expression receives `null` and the step records `functionStubFailed`, which says why |
| `async` | whether the survey defers the expression that calls it — see below |
| `delay` | real milliseconds before the answer. Asynchronous stubs only |

| web stub | |
| --- | --- |
| `response` | the body. A string is parsed the way a real response is — JSON, XML, a plain list of lines — and an object or an array is the parsed body |
| `status` | default `200`. Anything else takes the question down the same path a failing service does |
| `statusText` | the status text the survey's own `WebRequestError` carries |
| `delay` | real milliseconds before the answer |

A stub supplies the response **and nothing else**: `path`, `valueName`, `titleName`, `imageLinkName`,
the parsing, `onLoadChoicesFromServer`, `WebRequestError` and
`settings.web.disableQuestionWhileLoadingChoices` are the survey's own code, which is the code the
case is there to test. A url is matched **exactly**, against the url the survey actually asks for —
after text piping resolved `{question}` placeholders — so a case that drives the piped question sees
a second, different request and answers it with a second entry.

**`async` is inherited, not chosen.** Whether an expression waits for a function is decided by
survey-core when the expression is *parsed*, from the registration of that name, and it is the same
for every survey in the process. So a stub of a function the process already registers inherits its
`async`, and declaring the opposite is the case error `functionStubConflict` rather than a silent
change to how an unrelated model parses its expressions. Only a name nobody registered defaults to
`async: true` — a stub declared for it exists to be waited for.

`delay` is real wall-clock milliseconds and deliberately **not** the pinned clock: what it describes
is a slow handler, not a different date. It is bounded by `asyncTimeout`.

The case document is the reproducible artifact, so these two maps are answers. A function that has a
real implementation — one no JSON table expresses — is not declared here at all; it is passed as
`functions` in the execution options. A `web` execution handler can serve undeclared requests from a
fixture directory; without that handler, undeclared urls use the real web service. See "Serving the
outside world from code" in section 7.

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

`result.status` is `"passed"`, `"failed"` (a check did not hold), `"error"` (the case could not
run) or `"canceled"` (the caller stopped the run — §7). `result.summary` counts the tests and the
checks, `result.tests[i].steps[j].checks` holds one
entry per assertion — target, check, expected, actual, `passed`, a plain sentence and the JSON path
of the node it is about — and `result.tests[i].issues` plus `steps[j].issues` hold the case errors
and the warnings. A failing check carries what explains it, and every issue carries where it belongs:
§6 reads a result field by field.

The whole result is plain data. Formatting it is the caller's job.

---

## 6. Reading a result

A result is read on its own: a run downloaded today and opened a week later says everything about
itself, without the event transcript that announced it.

### Where an issue belongs — the path grammar

Every issue carries two independent locations, and neither of them is a transient index:

* **`path`** — the node of the *case document* the issue belongs to.
* **`jsonPath`** — the node of the *survey definition* the issue names, when it names one.

`path` is one grammar, whoever produced the issue. The validator writes it for what it finds in the
document, and execution writes it for what it finds while running:

| Path | What it addresses |
|---|---|
| *(none)* | the run itself — no node of the case caused it |
| `starts[i]` | a named start |
| `tests[i]` | the test, in a suite run |
| `tests[i].steps[j]` | one step of it |
| `tests[i].steps[j].<command>.<target>` | one target inside the step — the validator only |
| `test` | the test, in `runTest()` |
| `test.steps[j]` | one step of it |

* A **step** issue — an unknown target, an unknown check, a feasibility refusal, a warning, an
  asynchronous timeout, an unexpected error from a handler — carries the path of the step that
  produced it.
* A **test-level** issue — a start that names a page the survey does not have, an element named after
  the reserved target, a model factory that failed — carries the path of the test.
* A **suite-level** issue that no case node caused — a missing survey definition, a `testFilter` that
  threw — carries **no** path. Nothing is invented for it.
* `runTest()` roots its paths at `test` rather than at `tests[i]`: a test run on its own is not
  required to belong to a suite, so it has no index in one.
* A **more specific** path always wins. Validation addresses a target inside a step, and a command or
  a check an integrator registered may set a path of its own; neither is overwritten.
* Selected tests keep their **original suite index**, so a filtered run still addresses the right node
  of the suite document.

The path on the final `ISurveyTestIssue` is canonical, and `issueAdded` announces *that object*: what a
host renders live and what it reads back out of a saved result are the same string.

`issue.step` still carries the 0-based index of the step, for a host that indexes its own live state by
it. It says what the path says; the path is the one that survives being written to a file.

### Why a check failed — the diagnostic details

A failing check carries `details`: fields, never sentences, so a renderer composes the text and adds
nothing of its own.

| Member | Shape | When |
|---|---|---|
| `expression` | `ISurveyTestExpressionTrace` | the state was produced by `visibleIf`, `enableIf`, `requiredIf` or the expression of a calculated value: the expression, the values it read, the result, and the names that resolve to nothing |
| `triggers` | `Array<ISurveyTestTriggerTrace>` | a trigger fired during the command before a `state`, `value` or `values` check |
| `blockedBy` | `ISurveyTestBlockedRecord` | a `state` or `currentPage` check after a navigation or a completion the survey refused: the page, and every question that held it |
| `clearedBy` | `ISurveyTestClearedRecord` | the value the check is about was dropped by `clearInvisibleValues` |
| `rowIndex` | `number` | the target is in a matrix row or a created panel — neither has a node in the definition, so the index travels here |
| `key` | `string` | one result of a per-key survey check: `values`, `variables`, `noValues` |
| `present` | `boolean` | `noValues` only: whether the data holds the key at all |

`details` itself stays open: a check an integrator registered puts into it whatever it likes, including
an object under one of the names above. So **every built-in detail object carries a `kind`** —
`"expression"`, `"trigger"`, `"blocked"`, `"cleared"` — and a host reads them back through the two
helpers rather than by guessing from the properties an object happens to have:

```ts
import { getSurveyTestCheckDetails, getSurveyTestDetailKind } from "survey-core/tester";

const details = getSurveyTestCheckDetails(check.details);   // only what carries the discriminant
if (details.expression) renderTrace(details.expression);    // ISurveyTestExpressionTrace
if (details.blockedBy) renderBlocked(details.blockedBy);    // ISurveyTestBlockedRecord

// Anything the helper did not vouch for is a third-party detail: render it as it is.
getSurveyTestDetailKind(anyDetailObject);                   // undefined unless the tester made it
```

`getSurveyTestCheckDetails` never presents a custom object as a built-in shape, so a host can fall back
to the raw payload for what it does not recognise and still narrow safely on what it does.
`ISurveyTestCheckDetails` is the shape it returns; the interfaces of the members, and
`SurveyTestDetailKinds`, are exported next to it.

A check result also carries `jsonPath`, the node of the survey definition it is about: the element, the
expression property that produced the state a failing `visible` / `enabled` / `required` check read, or
the `choices` list for a failing `choices` / `choiceTexts` — never one choice item, because a list that
came out in the wrong order was not caused by one of them.

---

## 7. Running a suite — the execution contract

```ts
const result = await runSurveyTests(surveyJson, tests, options, executionOptions);
```

The first two arguments are data, `options` is the run configuration of §4, and `executionOptions`
is the only part of the call that is code: how the model of a test is built, and what the caller is
told while the run progresses. A headless caller passes none of it and gets exactly the behaviour the
first three arguments describe.

### The input is survey JSON

The first argument is **the survey JSON, never a `SurveyModel`**. The runner builds the model each
test runs on and throws it away afterwards, so a model passed here would never be the one that runs:
its event handlers, its callbacks and its state would silently be lost, and a case that relies on them
would pass for the wrong reason. A `SurveyModel` is reported as the case error `surveyJsonExpected`
instead of being serialised.

To configure the model the runner creates, replace the factory that creates it.

### The model factory

```ts
// The default, when createSurvey is not given. Two steps, not new SurveyModel(surveyJson): what the
// test provides — the clock, the transport its choicesByUrl requests go through, the functions its
// expressions call — has to be on the model before the JSON is loaded, because the expressions that
// run while the model is being built already use it.
createSurvey(surveyJson, context) {
  const survey = new SurveyModel();
  context.attachProviders(survey);
  survey.fromJSON(surveyJson);
  return survey;
}
```

```ts
const result = await runSurveyTests(surveyJson, tests, undefined, {
  createSurvey(surveyJson, context) {
    const survey = new SurveyModel();
    context.attachProviders(survey);
    survey.fromJSON(surveyJson);
    survey.onServerValidateQuestions.add(serverValidationHandler);
    return survey;                       // or a Promise<SurveyModel>
  }
});
```

* It is called **once per enabled, structurally runnable test** — a disabled test and a test the
  validator rejected never reach it.
* It receives a **deep clone of the survey JSON of its own test**, so what the factory or the model
  does to it cannot reach another test, and the caller's definition is never touched.
* `context` is `{ test, testIndex, options, dateProvider, attachProviders }` — the test, its index in
  the suite (absent for `runTest()`), the options that test resolved to, the clock of that test, and
  the one call that puts everything of the test on the model before its JSON is loaded. A factory that
  skips `attachProviders` loses them for constructor-time evaluation only: the runner attaches them to
  the model it gets back, so everything the case does afterwards runs with them whatever the factory
  did.
* It may be synchronous or asynchronous; a promise is awaited.
* It must return a **new** `SurveyModel` every time. A failure, a rejection, a wrong return value and a
  model handed out twice each become a structured issue of that test alone (`surveyFactoryFailed`,
  `surveyFactoryInvalidResult`); the suite goes on and the next test gets its own model.

What the factory does **not** decide is what makes a run reproducible: the runner applies the locale,
`clearInvisibleValues`, `checkErrorsMode` and the random seed to the model it is handed, whatever the
factory set. The order of one test is fixed and it is the contract:

1. resolve the options and create the test context;
2. call and await `createSurvey` with the cloned survey JSON;
3. apply the model configuration the runner owns, the clock included;
4. attach the tester diagnostics and subscriptions;
5. emit and await `surveyCreated`;
6. wait for the model to settle (see "Asynchronous survey operations" below);
7. apply the variables, then the start data and the start page;
8. wait for the model to settle again;
9. run the steps.

So a handler installed by the factory — or by the host, in `surveyCreated` — is already in place while
the start data goes in.

### Asynchronous survey operations

A survey does not always finish an operation inside the call that started it, and the returned boolean
says nothing about the ones it does not:

| what the survey is doing | what the call returns |
| --- | --- |
| `onServerValidateQuestions` is validating | `tryComplete()` / `nextPage()` return `false`, and the survey navigates from `options.complete()` later |
| an asynchronous validator or validation expression is running | the same |
| an `onCompleting` / `onCurrentPageChanging` handler returned a promise | the same, and `isNavigationBlocked` is set meanwhile |
| an asynchronous expression function is running | `set` returns, and the `visibleIf`, the calculated value or the expression question it feeds updates later |
| a `choicesByUrl` request is in flight | `set` returns, and the choices of the question arrive later |

So **a command is not finished until the model it acted on has settled.** After every command — the
ones an integrator registered included — after the model is created and after the start state is
applied, the runner waits until the survey is running none of the above. Three consequences:

* a navigation command reads **what the model did**, never the boolean it was handed. "The survey did
  not complete" is decided after the wait, so a completion that passes server validation is no longer
  reported as `completeBlocked`, and one the server rejects carries the server's own error text in
  the warning;
* the next step, and every check in it, sees the state the interaction produced;
* nothing lands on the model after the run is over. A survey that completes half a second after
  `runSurveyTests` resolved used to be possible, and it is exactly the kind of result no one reads.

The model is settled before the start data goes in for a reason of its own: survey-core skips a second
run of an expression while the first one is still in flight, and loading the JSON starts them all. A
value applied to a model that is still loading would be ignored by the very condition that reads it.

**What the wait is, and what it is not.** It is the whole model, and it is what is **in flight** — not
what is "ready".

A step never waits for the question it addresses. An asynchronous function running on `q1` leaves `q2`
perfectly ready, because nothing has told `q2` yet; when the function answers, `q1` takes its value,
the conditions re-run, and `q2` changes under a step that already read it. Nothing computes that `q2`
depends on `q1` — no such graph exists, and a trigger or a `setValueExpression` reaches wherever it
likes — so the scan is flat and covers every question and every expression owner. It is cheap: a
property read per question, once per command, returning without awaiting when nothing is running.

And it waits for operations that were **started**, never for `Question.isReady`. A question is
un-ready from the moment it merely *has* a `choicesByUrl` url — `waitingChoicesByURL` is
`!isChoicesLoaded && hasChoicesUrl` — and it stays un-ready for the whole run when nothing will ever
send that request, which is what a lazy-loading question with a url does. Waiting for readiness would
time out on every step of such a survey, over a question no step addresses.

`choicesLazyLoadEnabled` and `getChoiceDisplayValue` are callback mechanisms with their own contract
and are **not** stubbed by the case: they are not a url a case can name. A question using them never
blocks a run either.

**`asyncTimeout`** bounds the wait — milliseconds, default `5000`, per operation. A handler that never
answers ends the test with the error `asyncOperationTimeout`, which names what the survey was waiting
for (`reason`: `serverValidation`, `navigationHandler`, `validators`, `expressions`, `webChoices`) and
the questions — and, for `webChoices`, the urls — involved. The test stops there rather than reporting
steps that read a model no one was driving. `asyncTimeout: 0` waits for nothing, for a caller that
drives the waiting itself.

Stopping a run stops the waiting too: the operation the survey is holding is the caller's decision, so
the run reports `canceled` and not a timeout.

### The pinned clock

A case that reads `today()`, `currentDate()`, `currentYear()` or `age()` must produce the same result
on every machine and at any hour, so the tester pins the current moment to the `now` option
(default `2024-01-01T00:00:00`). Explicit dates a survey or a case writes are never touched: only the
question "what time is it now" is answered by the test.

The clock is **a property of the model**, `survey.dateProvider`, and nothing global is installed.
This is what makes an asynchronous run safe: a run that is waiting for a UI callback, for an
asynchronous command handler or for a factory that fetches something holds no process-wide state while
it waits, so

* two runs pinned to two different moments may be interleaved, nested or run concurrently on a server;
* an ordinary `SurveyModel` of the application, created or evaluated while a run is paused, reads the
  machine clock as it always did;
* there is no callback to restore, so there is no way to restore the wrong one.

`settings.onDateCreated` keeps working exactly as before, for the tester's models as well: the clock
decides what the current moment is, and the application hook still sees every created date and may
still adjust it.

The one thing a factory owns is **construction time**. A `defaultValueExpression`, a calculated value
or an expression question runs while the JSON is being loaded, before the runner ever sees the model,
so the clock has to be installed before `fromJSON` — that is why the default factory builds the model
in two steps and why `context.dateProvider` exists. A factory that returns `new SurveyModel(json)`
instead is not broken: the runner assigns the clock to the model it is handed, so every later
evaluation is pinned; only what the constructor itself computed used the machine clock.

### The lifecycle events

`onEvent` is called for every operation of the run. It may return a promise, and **the runner awaits
it before it continues**: this is the whole mechanism a host has to delay, animate, scroll or render
between two actions. The tester itself never waits, never sleeps and knows nothing about a UI.

| Event | When | Carries |
|---|---|---|
| `runStarted` | a suite run begins | `tests`, `plannedTestCount`, `plannedTestIndexes` |
| `testStarted` | before a test, skipped and broken ones included | `testIndex`, `test` |
| `surveyCreated` | after step 4 above, before the start state | `testIndex`, `test`, `survey` |
| `stepStarted` | before a step | `testIndex`, `stepIndex`, `step` |
| `targetStarted` | before one target of the command of a step | `testIndex`, `stepIndex`, `command`, `target` |
| `checkCompleted` | a check produced a result | `testIndex`, `stepIndex`, `result` |
| `issueAdded` | an error or a warning was recorded | `testIndex`, `stepIndex`, `issue` |
| `targetCompleted` | that target is done | `testIndex`, `stepIndex`, `command`, `target` |
| `stepCompleted` | the step is done, with its status | `testIndex`, `stepIndex`, `result` |
| `testCompleted` | the test is done | `testIndex`, `result` |
| `runCompleted` | the suite run is done | `result` |

Every event carries what applies to it and nothing else.

* `surveyCreated` exposes **the exact model** the commands of that test run on. A host renders it there
  and may attach handlers of its own before anything touches it.
* A step whose command addresses several targets — `{ "set": { "q1": 1, "q2": 2 } }` — produces one
  `targetStarted`/`targetCompleted` pair per target, in the order the case wrote them, so a host can
  highlight the individual operations.
* A check result and an issue are produced inside a handler, where nothing can be awaited. They are
  announced at the end of the operation that produced them, in the order they were produced, before
  that operation's `targetCompleted` or `stepCompleted`.
* An issue the structural validation found is announced too, at the level that carries it: a broken
  case reports it right after its `testStarted`, and a suite that cannot run at all reports its own
  between `runStarted` and `runCompleted`, with no `testIndex`. Nothing the run records reaches the
  result without an `issueAdded` first — the one exception is an issue produced *by* a failing
  callback, which is not announced to the observer that just failed.
* A target whose command ends the step with an error has **no** `targetCompleted`: the error travels
  past that level, and the `stepCompleted` that follows carries it. A target a stopped run never let
  begin is the same case. Every other `*Started` has its matching `*Completed`.
* `runStarted` and `runCompleted` bracket a suite run only. `runTest()` runs one test and emits the
  test-level events without them.
* A callback that throws or rejects is reported exactly like a handler that fails at the same point:
  as an `unexpectedError` issue of the step, the test or the suite. The run never rejects, and nothing
  the tester installed — the model subscriptions, the diagnostics — is left behind. There is nothing
  global to undo: the clock lives on the model, and the tester releases the model at the end of the
  test that ran on it.

`run()` and `runTest()` still resolve to their existing result types: the events are progress, the
resolved result is the canonical one, and a run watched by a host produces the same result as the same
run without one.

### The lifecycle guarantees

The order below is the contract. A host may build its whole presentation on it, and nothing in the
tester is allowed to reorder it.

* **Teardown precedes `testCompleted`.** Everything the tester installed on the model of a test — the
  subscriptions it uses to observe it and the diagnostics that explain what the survey did — is removed
  before the `testCompleted` of that test is emitted, whether the test ended on its own, on a failing
  handler, on a failing callback or on cancellation.
* **The model is released, not destroyed.** After teardown the tester no longer drives that model and
  no longer hears from it: what a host does with it afterwards reaches nothing and adds no issue. A host
  that kept the model — from `surveyCreated`, to keep rendering the last test — keeps a perfectly usable
  `SurveyModel`, pinned to the clock the test ran with and still loading the urls the case declared from
  the case: a reload after the run answers, immediately and with the same body, rather than reaching the
  network or waiting forever.
* **Every test that started is completed.** A selected test that emitted `testStarted` emits
  `testCompleted`, cancellation included. A test the run never entered emits neither.
* **`runCompleted` is the last observer callback of a suite run.** There is no terminal event after it,
  and none is planned: a host finishes its presentation there.
* **The promise settles last.** `run()` resolves after `runCompleted` has been awaited and after every
  model the run created has been released. `runTest()` has no run-level events at all, and its promise
  settles after the teardown of its one test.

### Running a part of a suite

`testFilter` selects the suite entries a run holds. It is **execution infrastructure**: the suite is not
copied, not re-indexed and not re-flagged, and a test left out is *absent from the run* rather than
reported as one the author disabled.

```ts
// One test, addressed by its index in the suite.
await runSurveyTests(surveyJson, tests, undefined, {
  testFilter: (test, testIndex) => testIndex === 3
});

// An arbitrary selected set, from an editor that tracks the nodes the user ticked.
const selected = new Set([0, 2, 5]);
await runSurveyTests(surveyJson, tests, undefined, {
  testFilter: (test, testIndex) => selected.has(testIndex)
});
```

* The filter is called **once per suite entry, in suite order**, with the original test object and its
  original index, before anything is announced. Passing none runs every entry, exactly as before.
* An unselected test produces **no result, no events and no issues**, and it is counted nowhere in the
  summary. `summary.total` counts the results that were produced, so a filtered run reports one test
  rather than one test plus a row of skipped ones.
* A **selected** test that the author disabled is still `"skipped"`, and a selected test that is
  structurally broken is still `"error"`: the filter says what runs, never what a test means.
* Selected tests keep their **original suite index** — in `testIndex` on every event and in the
  `tests[i]…` path of every issue — so an event still addresses the right node of the suite document.
* Nothing is mutated: not the suite, not a test, not the options and not the starts.
* **The index is the identity.** Test names are only warned about when they repeat, so they are not an
  identity, and the filter is handed an index precisely so that a host can select unambiguously.

Structural validation is unchanged: the whole suite is validated before the run, because a malformed
suite is malformed for every subset of it and filtering out the entry that demonstrates a broken root
shape does not make the rest runnable. What the validator found *inside* a test is published only if
that test is in the run.

`runStarted` describes the planned run, so a UI never has to execute the filter a second time or infer
what the runner selected:

```ts
onEvent: event => {
  if (event.type === "runStarted") {
    progress.reset(event.plannedTestCount);        // how many results this run will produce
    event.plannedTestIndexes.forEach(highlight);   // which suite entries they belong to
  }
}
```

`plannedTestCount` is `plannedTestIndexes.length`. A selected test that is disabled or broken is counted
— it still produces a result. `summary.total` may end up *lower*: a stopped run holds fewer results than
it planned.

A filter that throws is a bug in the host, not a broken case. It is reported once, as a suite-level
`unexpectedError`, the selection stops there, no test runs, `runCompleted` is emitted as always and
`run()` resolves with an `"error"` result. It never rejects and never leaves a subscription behind.

`runTest()` selects one test by definition and never consults `testFilter`.

### Serving the outside world from code

The `functions` and `web` sections of a suite are answers, written in JSON. When the answer is a rule
rather than a value — a fixture directory, a computation, a recorded session — it goes into the
execution options instead, as code:

```ts
const result = await runSurveyTests(surveyJson, tests, undefined, {
  // Called with the arguments of the call and the model that called it. A promise is awaited, and the
  // survey waits for it exactly as it waits for a real asynchronous function.
  functions: {
    getRate: (params, survey) => rateTable[params[0]] ?? 1,
    checkMembership: params => fetchFromFixture("members/" + params[0]),
  },
  // Called for a url the case did not declare.
  web: request => ({ response: readFileSync("fixtures/" + hash(request.url) + ".json", "utf-8") }),
});
```

The case document is the reproducible artifact, so **a JSON entry always wins** and these serve what
the case did not declare. When a `web` handler is supplied, it owns undeclared requests. A handler
that answers with nothing — or with anything that is not a response object — produces
`webRequestNotStubbed` and an empty list. When no handler is supplied, an url absent from the JSON
`web` map uses the normal cached network transport.

A function whose body comes from `functions` here is not declared in the suite's `functions` map: a
map entry that answers nothing is a validation error, because a stub that silently returns `undefined`
is the failure this format exists to prevent. Such a function is asynchronous unless the process
registered it as synchronous.

### Delaying execution

```ts
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

await runSurveyTests(surveyJson, tests, undefined, {
  onEvent: async event => {
    switch (event.type) {
      case "surveyCreated":
        render(event.survey);           // the model the test is about to run on
        break;
      case "targetStarted":
        highlight(event.target);        // the element the next operation is about to touch
        await delay(600);               // the runner waits here
        break;
      case "checkCompleted":
        show(event.result);
        break;
    }
  }
});
```

Nothing above is in `survey-core`: there is no delay option, no animation setting and no timer in the
tester. The host owns the pace, and the same suite that plays back at reading speed in an editor runs
at full speed in CI by passing no observer at all.

### Stopping a run

A host that can delay a run needs a Stop button for it. `signal` takes an `AbortSignal`, and aborting
it ends the run at the next safe boundary with a coherent partial result.

```ts
const controller = new AbortController();
stopButton.onclick = () => controller.abort();

const result = await runSurveyTests(surveyJson, tests, undefined, {
  signal: controller.signal,
  onEvent: async event => {
    if (event.type === "targetStarted") await delay(600);
  }
});

if (result.status === "canceled") {
  // result.tests holds what did run, and nothing was invented for what did not.
}
```

The signal is read at the boundaries between operations: before a test, before a step, before each
target of a command, after an awaited command or check handler, and on both sides of every awaited
`onEvent` callback. Between two of them the tester is inside somebody else's promise, and **it cannot
terminate one**: what is already running finishes, and nothing after it starts.

* The step that was running becomes `"canceled"`, and so do the test it belongs to and the suite.
* The last step of a test is a boundary like every other one: a stop that arrives while the host is
  holding its `stepCompleted` cancels that test as well. The step keeps the status it reported — what
  it found is on its own result — and the test says it was stopped rather than that it passed.
* Everything that finished earlier keeps exactly the status it reported: a test that failed before the
  stop is still `"failed"`, and `summary.canceled` counts only the tests that were stopped.
* Cancellation is a control-flow outcome, not a broken case: **no issue is added** because the user
  pressed Stop.
* A test, a step or a target the run never reached produces no result and no event pair. What did
  start is completed: `stepCompleted`, `testCompleted` and `runCompleted` are emitted with the canceled
  results, so a host finishes its presentation from the events alone. Aborting *before* `run()` is
  called emits nothing at all and resolves to a canceled result.
* Everything the tester installed is removed as always — the model subscriptions and the diagnostics.
  A host that keeps rendering the model of a stopped test keeps seeing the dates the case ran with:
  the clock belongs to that model and to nothing else.
* A signal nobody aborts changes nothing, and passing none keeps the previous behaviour exactly.

A custom asynchronous handler cooperates through `context.signal`. There is nothing to throw and no
protocol to follow: **return early**, and the runner ends the run the moment the handler returns.

```ts
SurveyTestCommandFactory.Instance.register({
  name: "waitForBackend",
  payloadType: "none",
  run: async (context, target) => {
    const answer = await fetch(url, { signal: context.signal });
    if (!!context.signal && context.signal.aborted) return;   // stopped: touch nothing
    target.obj.value = await answer.json();
  }
});
```

A handler that rejects because it was aborted — what `fetch` does with an aborted signal — is read as
cancellation too, not as a failure of the case.

---

## 8. Authoring APIs — for a recorder, a case editor or a test generator

A host that *writes* cases needs more than the runner: it has to produce a target name for something
the user touched, and it has to obey the small rules of the format. Both are exported from
`survey-core/tester`, so that nothing has to be copied out of the sources and drift from them.

### `SurveyTestTargets.nameOf` — the inverse of target resolution

```ts
import { SurveyTestTargets } from "survey-core/tester";

const name = SurveyTestTargets.nameOf(survey, object);
// When name is defined, resolving it in this survey returns the same addressable object.
```

That round trip is the contract, and it is how the name is produced: a candidate path is built from
the object and then resolved by the very resolver the runner uses. If it comes back as a different
object — a question of another survey that happens to share the name, an element that was detached —
the answer is `undefined`. **A name is never invented for something the public grammar cannot
address**, because such a name would end the case with `unknownTarget`.

```ts
SurveyTestTargets.nameOf(survey, survey);                        // "survey"
SurveyTestTargets.nameOf(survey, survey.getQuestionByName("q1")); // "q1"
SurveyTestTargets.nameOf(survey, survey.getPageByName("page2"));  // "page2"
SurveyTestTargets.nameOf(survey, survey.getPanelByName("info"));  // "info"
SurveyTestTargets.nameOf(survey, survey.getCalculatedValueByName("total")); // "total"

const contacts = survey.getQuestionByName("contacts");           // a dynamic panel
SurveyTestTargets.nameOf(survey, contacts.panels[1]);            // "contacts[1]"
SurveyTestTargets.nameOf(survey, contacts.panels[1].getQuestionByName("phone")); // "contacts[1].phone"

const items = contacts.panels[0].getQuestionByName("items");     // a dynamic matrix inside it
SurveyTestTargets.nameOf(survey, items.visibleRows[1]);          // "contacts[0].items[1]"
SurveyTestTargets.nameOf(survey, items.visibleRows[1].getQuestionByColumnName("price"));
                                                                 // "contacts[0].items[1].price"

const ratings = survey.getQuestionByName("ratings");             // a matrix with declared rows
SurveyTestTargets.nameOf(survey, ratings.visibleRows[0].getQuestionByColumnName("score"));
                                                                 // "ratings.row1.score"
```

A **dynamic** matrix row is addressed by position and a **declared** row by its name, for the same
reason the forward direction does it: a dynamic row is created by the respondent and names itself
after a generated id, while a declared row's name is what the definition fixes.

Nothing is cached and nothing is retained — neither the survey nor a row handed in. Adding or
removing a panel or a row simply changes the answer:

```ts
SurveyTestTargets.nameOf(survey, phone);   // "contacts[1].phone"
contacts.removePanel(0);
SurveyTestTargets.nameOf(survey, phone);   // "contacts[0].phone"
```

When a matrix renderer event hands over a cell together with the row and the matrix it came from,
pass them as the context. It is a fallback used only when the object cannot say which row it belongs
to; what the object itself says always wins, and the round trip is verified either way:

```ts
SurveyTestTargets.nameOf(survey, cellQuestion, { matrix, row });   // "ratings.row1.score"
SurveyTestTargets.nameOf(survey, row, { matrix, row });            // "ratings.row1"
```

`SurveyTestTargets.resolve(survey, name)` is the forward direction without a runner: the
`ISurveyTestTarget` the name addresses, or `undefined`. Target names come from the model — **never
from a DOM attribute**.

### Reading a step

A step is its metadata plus exactly one command. `parseSurveyTestStep` applies that rule and reports
a broken step honestly rather than picking one of its keys:

```ts
import { getSurveyTestStepCommandNames, parseSurveyTestStep } from "survey-core/tester";

parseSurveyTestStep({ name: "answer", set: { q1: "a" } });
// { name: "answer", commands: ["set"], command: "set", params: { q1: "a" }, undefinedKeys: [] }

parseSurveyTestStep({ name: "a" });                        // commands: [],            command: undefined
parseSurveyTestStep({ set: { q1: 1 }, expect: { … } });    // commands: ["set","expect"], command: undefined
parseSurveyTestStep({ set: { q1: 1 }, clear: undefined }); // undefinedKeys: ["clear"]

getSurveyTestStepCommandNames(step);   // the commands only
```

`command` and `params` are set only when there is exactly one command. This is the same parse the
validator runs, so what an editor shows and what the validator reports cannot differ.

### Payloads and the runtime collections

```ts
import {
  isValidTestPayload, getTestPayloadTypeText, isCommandAllowedForKind,
  SurveyTestPayloadTypes, SurveyTestTargetKinds,
  SurveyTestStepMetadataKeys, SurveyTestCheckCommandName, SurveyTestSurveyTargetName,
} from "survey-core/tester";

const command = SurveyTestCommandFactory.Instance.get("set");
isValidTestPayload(command.payloadType, value);   // exactly what the runner checks before the handler
getTestPayloadTypeText(command.payloadType);      // "a question value" — the words the error uses
isCommandAllowedForKind(command, target.kind);    // whether this command applies to this kind
```

`isValidTestPayload` is the function the runner calls, not a copy of it: an editor that refuses a
payload refuses exactly what the run would have reported as `invalidCommandParams`.

`SurveyTestPayloadTypes` and `SurveyTestTargetKinds` are the runtime form of the `SurveyTestPayloadType`
and `SurveyTestTargetKind` unions, for a UI that enumerates them; both are derived from the one
declaration the types come from. `SurveyTestStepMetadataKeys` (`["name", "description"]`),
`SurveyTestCheckCommandName` (`"expect"`) and `SurveyTestSurveyTargetName` (`"survey"`) are the three
names the format fixes. All of them are frozen.

The set of commands and checks is **not** among these constants: it is data, and it is read from
`SurveyTestCommandFactory.Instance` and `SurveyTestCheckFactory.Instance`, so a command an integrator
registered appears in an editor's menu like a built-in one.
