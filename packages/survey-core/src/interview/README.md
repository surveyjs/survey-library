# survey-core/interview

Conducts a **survey** through a text interface. A chat widget, a voice front end or an AI agent
that fills a survey today gets the survey JSON and has to re-implement `visibleIf`, `enableIf`,
`requiredIf`, validators, dynamic panels and matrices — and gets them wrong. `SurveyModel` already
runs in Node and already evaluates all of it. This module turns a live model plus the current data
into **YAML inside Markdown**, accepts values back, and reports the consequences of every answer:
what became visible, what became hidden, what became required, what failed validation.

It is a Node runtime for a *conversation*, not a renderer:

* it makes **no LLM calls** and has no prompts — the consumer talks to its own model;
* it has **no transport, no auth, no sessions and no persistence** — one interview is one object in
  one process, and saving the answers is `survey.data`, the caller's business;
* it **never re-implements the survey logic** — every ordering decision, every visibility decision
  and every validation is asked of the `SurveyModel`.

Two modes: **single-input**, one item at a time (the model's own `questionsOnPageMode:
"inputPerPage"` mode, the same input a UI on the same model would show), and **batch**, the whole
form at once for an agent that fills many fields in a turn.

## Usage

```js
import { createInterview } from "survey-core/interview";
```

`survey-core/interview` is a separate entry point that treats `survey-core` as an **external**
dependency, so it is never pulled into the bundle of an application that only renders a survey.
CommonJS: `require("survey-core/interview")`. UMD global: `SurveyInterview` (expects `Survey` on
the page). Because the two share one module closure, the interview sees what the application
customized: question types registered in the `Serializer`, functions in `FunctionFactory.Instance`,
and `settings`.

### The survey JSON, for a survey that needs no setup

```js
const interview = await createInterview({
  title: "Health check",
  elements: [
    { type: "text", name: "name", title: "Your name", isRequired: true },
    { type: "dropdown", name: "plan", title: "Plan", choices: ["basic", "gold"] },
    { type: "text", name: "concierge", title: "Concierge contact", visibleIf: "{plan} = 'gold'" }
  ]
});

console.log(interview.describe());
const result = await interview.answer("plan", "gold");
console.log(result.becameVisible);      // ["concierge"]
```

### The model, when anything about it has to be configured

```js
import { SurveyModel } from "survey-core";
import { createInterview } from "survey-core/interview";

const survey = new SurveyModel();
// Providers go in before the JSON is loaded: expressions and choicesByUrl requests run while the
// model is being built.
survey.dateProvider = { now: () => Date.now() };
survey.webProvider = {
  sendRequest: (request, onResponse) => {
    myFetch(request.url).then(body => onResponse({ status: 200, response: body }));
  }
};
survey.fromJSON(surveyJson);

survey.locale = "de";
survey.data = savedAnswers;                    // restore: conditions run, triggers do not
survey.setVariable("tier", "gold");
survey.onComplete.add((sender) => saveToMyBackend(sender.data));

const interview = await createInterview(survey, { timeout: 10000 });
```

### The model is yours

The interview conducts **one `SurveyModel` the integrator owns**. It sets exactly **one** property
of it — `questionsOnPageMode = "inputPerPage"`, the mode it drives — and reads and writes everything
else through the public `Question` / `SurveyModel` surface, so a subclass of `SurveyModel` is
transparent to it.

* `firstPageIsStartPage`, `showPreviewBeforeComplete`, `checkErrorsMode`, `locale`, `clearInvisibleValues`
  and the rest stay whatever you set. The interview never writes them.
* Everything a survey needs in order to run — `data`, `locale`, variables, `dateProvider`,
  `webProvider`, `onServerValidateQuestions`, `onComplete` — is set on the model **before** the
  hand-over. That is why the options carry nothing but a `timeout`: there is no second place to
  configure a survey.
* Nothing is cached. A value written past the interview — by a UI rendering the same model, by your
  own code — is seen on the next call, and so is a `locale` you change afterwards.
* A UI may render the same model at the same time. The input the interview asks for is the input
  that UI shows, because both read the model's single-input mode.
* `dispose()` drops the interview's own state — the set of items the interviewee skipped — and
  **leaves the model alone**. Disposing the model is the owner's call.

The one thing the interview does to the state of the model at creation, besides the mode: a model
in the `"starting"` state is `start()`ed, because a start page is a UI concept that the single-input
mode skips and an interview would otherwise never get past it. If a required question on the start
page is empty, `start()` refuses and `createInterview` rejects with an `Error` carrying
`code: "startPageIncomplete"` and `names`, the questions with errors — answer them, or set
`firstPageIsStartPage` to `false`, before the hand-over. A model handed over already `"completed"`
is accepted: `current()` is `null` and there is nothing left to ask.

## API

Every mutating call returns a `Promise`: `choicesByUrl` goes out over the network, and asynchronous
validators, asynchronous expression functions, server validation and an asynchronous `onCompleting`
all hand control back while the model is still deciding. A call resolves once the model has settled,
so what it describes is never a state that is about to change.

| Export | Description | Arrives in |
| --- | --- | --- |
| `createInterview(survey, options?): Promise<IInterview>` | Takes a `SurveyModel` (used as is) or a survey JSON object (`new SurveyModel(json)`, nothing else configured). Anything else — a string, an array, `null`, a disposed model — is a `TypeError`. | tier 02 |
| `interview.survey` | The model that was passed in. | tier 02 |
| `interview.data` | `survey.data`. | tier 02 |
| `interview.dispose()` | Drops the interview's own state. The model is untouched. | tier 02 |
| `interview.current(): IInterviewItem \| null` | The first item that can be asked and is either unanswered or invalid; `null` when there is none. A synchronous read of settled state — it never moves the model and never runs a validator. | tier 04 |
| `interview.describe(): string` | The current item, the progress and the answers so far, as YAML in Markdown. | tier 03 / 04 |
| `interview.answer(value)` / `answer(name, value)` | Writes one answer — to the current item, or to the item at `name` — and reports the consequences: the errors, what became visible, hidden or required, the next item, and the document. | tier 04 |
| `interview.skip()` | Leaves the current item unanswered and moves on. Refused for a required item. | tier 04 |
| `interview.complete()` | Validates every item, then calls `tryComplete()`. | tier 04 |
| `interview.describeAll(): string` | The whole form at once, for batch mode. | tier 05 |
| `interview.answerAll(values)` | Writes many answers by address in one call. | tier 05 |
| `interview.getAnswerSchema(): any` | JSON Schema for the answers a batch call accepts. | tier 05 |
| `interview.getTools(): Array<IInterviewToolDefinition>` | MCP-shaped tool definitions, usable for function calling as is. | tier 05 |
| `interview.callTool(name, args): Promise<any>` | Runs one of them. | tier 05 |
| `toYaml(value, options?): string` | The emitter the documents are written with — plain data in, YAML out. Exported so that a host rendering its own text from the item records quotes exactly the way `describe()` does. | tier 03 |
| `InterviewErrorCodes` | The frozen table of the codes the interview raises itself. A host localizes on the code. | tier 04 |

A method that has not arrived yet throws `Error("not implemented: <name>")` rather than answering
wrongly. The addresses of nested inputs — inside dynamic panels, matrices, multiple text and custom
components — and the summary step of a dynamic container arrive in tier 06; until then a nested input
is addressed by its plain question name, and a summary step is listed as `unsupported` and never
asked for.

### Options

```ts
interface IInterviewOptions {
  timeout?: number;   // ms to wait for the model to settle; default 5000, 0 = do not wait
}
```

`timeout` is wall-clock time and it bounds one asynchronous survey operation. When it runs out, the
call rejects with an `Error` carrying `code: "asyncTimeout"`, the `reason` the model reported and,
for choices loading from a web service, the `urls` that have not answered. `timeout: 0` never waits:
the interview then describes whatever the model holds at that instant — an empty choice list, if the
choices are still on their way.

`Question.isReady` is deliberately not waited for: a question with a `choicesByUrl` url is un-ready
from the moment it has the url and stays un-ready forever if nothing ever sends the request. What is
waited for is `survey.getRunningAsyncOperations()`, the one place in survey-core that enumerates the
asynchronous mechanisms.

### Errors

Every mutating call answers with an `errors` array of `{ name, message, code? }`.

| Field | Description |
| --- | --- |
| `name` | The address of the item the error is about, or `""` when it is about the survey as a whole. |
| `message` | English, ready to show to a developer — **unless** there is no `code`, in which case it is the model's own localized error text, the string a rendered UI shows under the same input. |
| `code` | Present only for the errors the interview raises itself. The stable identifier a host localizes on, the way it localizes on `SurveyLintReasons`: a message is prose and may be reworded, a code is API and is never renamed. |

`InterviewErrorCodes` is the whole table, frozen:

| Code | Raised when |
| --- | --- |
| `nothingToAnswer` | `answer(value)` or `skip()` with no current item — everything that can be asked is answered and valid. |
| `unknownQuestion` | `answer(name, value)` with a name that is not an item: it does not exist, it is invisible, or it is read-only by property and can never be answered. |
| `notAskable` | The item exists but cannot take a value: an `enableIf` turned it off (`disabled`), or it has no plain input — a file, a signature, an image picker — or it is a summary step (`unsupported`). |
| `notAChoice` | The value is not among the choices the item lists. Checked per element for a multi-select; `other` and `none` are choices like any other; skipped entirely when the item says `choicesUnknown`. |
| `notANumber` | A string that is not a number, for an item whose value is a number. |
| `badAction` | An action object (`{ action: "add" }`) sent to an item that takes a value. Actions belong to the summary step of a dynamic container. |
| `requiredCannotSkip` | `skip()` on a required item. It stays current. |
| `completionBlocked` | A handler of `onCompleting` set `allow = false`. |
| `surveyCompleted` | `answer()` or `skip()` after the survey completed. |
| `startPageIncomplete` | `createInterview` rejects: the model shows a start page and `start()` refused to leave it. An `Error`, not an item error. |

An error with a code means **nothing was written**: the pre-checks run before the value reaches the
model, and the same current item comes back.

The interview invents no prose for the interviewee: every text a consumer sees is either a localized
model string — a title, a choice text, an error text, an add-button caption — or a fixed YAML key.
The messages above are for the developer or for an agent's next turn, and they are English only.

## Document format

`describe()` and `describeAll()` render the same plain object, an `IInterviewDocument`
(`{ title, progress, answered, changes, errors, current | items }`), as **YAML inside Markdown**: a
heading and one fenced `yaml` block. A chat UI strips the heading and renders the block; an agent
parses the first fenced `yaml` block and never sees anything else.

````markdown
# Pet survey

```yaml
progress:
  answered: 1
  remainingRequired: 1
answered:
  hasPet: "Yes"
changes:
  becameVisible: [petType, petAge]
  becameRequired: [petType]
current:
  name: petType
  type: dropdown
  title: What kind?
  required: true
  choices:
    - value: Dog
    - value: Cat
    - value: Other
```
````

* The heading is the survey's `processedTitle`. A survey with no title gets `# Survey`, so that a
  document always starts the same way.
* The sections come out in one fixed order — `progress`, `answered`, `changes`, `errors`, then
  `current` (single mode) or `items` (batch mode) — whatever order the document was built in.
* `progress` always carries both `answered` and `remainingRequired`.
* An optional section that carries nothing is **left out**, not written as an empty container:
  `answered` when nothing has been answered, `errors` when nothing failed, `changes` when every one
  of its lists is empty — and inside `changes`, each of `becameVisible`, `becameHidden` and
  `becameRequired` is left out on its own when it is empty. `current: null` is the exception: it is
  written, because "nothing left to ask" is information.
* `answered` maps an address to the raw value, in item order — a checkbox answer is a sequence, a
  multiple-text answer a nested map, an answer with a comment the `{ value, comment }` object that
  `answer()` itself takes. An address that is not an identifier (`medications[0].dose`,
  `matrix.row.column`) is a quoted key; a consumer reads it as a string either way. It is the whole
  map: a consumer that wants it short truncates it, the interview does not guess which answers matter.
  Items the interviewee skipped are left out.
* `errors` is a sequence of `{ name, message }`, plus `code` for the errors the interview raises
  itself. `message` is the localized text the rendered UI shows for the same error.
* `current` and each entry of `items` is one item record — `name`, `type`, `title`, `description`,
  `required`, then the type-specific keys, and `error` last when the current answer failed
  validation. A key that carries nothing is not written at all: there is no `description: null` and
  no `disabled: false`, so a key a consumer sees is a key it can act on. `name` is the address, not
  necessarily the question's name.
* One key of the record is deliberately **not** written: `valueType`. A reader already knows what a
  value is from the choices, the input type or the constraints, and where the value type is needed as
  data — the JSON Schema an agent fills in — `getAnswerSchema()` produces it. The `IInterviewItem`
  records a host reads from `current` and from a result do carry it.

### Quoting

The block is emitted by `toYaml`, a small emitter written here because survey-core ships no runtime
dependencies. It covers what the documents use — maps, block and flow sequences, scalars — and
nothing else: no anchors, no tags, no block scalars, no multi-document streams.

What it guarantees is that **the value a consumer parses back is the value the survey holds**:

* A string a YAML parser would type as something else is double-quoted with JSON escaping — `"Yes"`,
  `"No"`, `"1"`, `"2024-01-01"`, `""`, `"true"`, `"~"`, a string that starts with an indicator
  (`- ? : , [ ] { } # & * ! | > ' " % @ \``) or with a space, ends with a space or a colon, or
  carries `: `, ` #`, a newline or a tab. `Dog`, `petType` and `Do you have a pet?` stay bare.
* A multi-line string — an HTML description — is quoted with `\n` in it, never written as a block
  scalar: one line per key keeps the consumer's parser trivial.
* A sequence of scalars that fits in 80 columns is inline (`becameVisible: [petType, petAge]`);
  anything else is a block sequence, and a map inside one starts on its dash line
  (`- value: Dog`). In a flow sequence `,` `[` `]` `{` `}` are delimiters, so a string carrying one
  is quoted there even though it is bare in block context: `["a,b"]` is one value, not two.
* Numbers, booleans and `null` are written as themselves; a non-finite number is quoted.

`tests/interview/interviewYamlTests.ts` pins every rule above and reads each fixture back with
`js-yaml` — a real parser, on purpose: a second parser written next to the emitter would only agree
with its own assumptions.

## Single-input mode

One item at a time: `current()` says what to ask, `answer()` writes it and reports what changed,
`skip()` moves past an optional item, `complete()` finishes.

### Items are the model's own single inputs

The interview does not decide what an input is. `SurveyModel` has a mode for exactly this —
`questionsOnPageMode: "inputPerPage"`, which puts one input field on a page and splits the complex
questions: a dynamic panel into the questions of each panel, a matrix into its cells row by row, a
multiple text into its editors, a composite into its content questions, and a dynamic container also
into a **summary step**, the list of entries with add / remove / edit. `createInterview` sets that
mode, and every item is one of its inputs. So the input the interview asks for is the input a UI
rendering the same model shows, and the two can never disagree about what a question is.

The two host events that tune the mode tune the interview with it:
`onCheckSingleInputPerPageMode` turns nesting off for one question — the container then becomes a
single input holding the whole array or object — and `onGetLoopQuestions` edits the list of nested
inputs. Both are set on the model, before the hand-over, like everything else.

What the interview keeps of its own is the **inventory**: every input that exists, in document order,
rebuilt from the structure of the survey on every call. That is deliberately *not* the mode's own
navigation list (`getSingleInputQuestions()`), which answers a different question — "what do I walk
the respondent through next" — and depends on where the respondent already is: once a container's
summary step has been shown it returns the container alone, and a dynamic panel lists only the panels
that are incomplete or invalid. Right for walking forward, wrong as a record of what exists. If the
progress numbers, the answered map or the change report were built from it, all three would change
with the navigation instead of with the answers.

### Which item is current

`current()` is **the first item, in document order, that can be asked and is either unanswered or
invalid**, and `null` when there is none. "Can be asked" leaves out an item that an `enableIf` turned
off (`disabled`) and one with no plain input — a file, a signature, an image picker, and, until tier
06, a summary step (`unsupported`).

That is the issue's rule, and it is not the mode's own navigation: `performNext()` goes to the input
*after* the one the respondent is on, wherever that is. So the interview selects first and then
**tells** the model — `survey.currentSingleQuestion` and its nested current input are set to the item
that was selected, at the end of `createInterview` and of every call that writes. When there is
nothing left to ask, the model is left on the last input, which is where a respondent stands when
they press Complete.

`current()` itself never moves the model, never validates and never starts anything: it is a
synchronous read of state that has already settled.

### When validators run

Validity is a **persisted** state — the errors an earlier validation run left on the question, plus
the synchronous "required and empty" check. It is never computed on demand: `validate(false)` starts
the asynchronous validators over on every call and then throws their result away, so a consumer that
merely reads the items repeatedly would restart them forever and never see their errors.

Validators therefore run in exactly four places, always with the errors kept, and always followed by
the settle:

* at `createInterview`, on every askable input that already holds a value — a model resumed from
  saved data with an answer that violates a validator is invalid from the first `current()`;
* in `answer()`, on the input that was written;
* in `answer()`, on every input that held errors **before** the write — an expression validator or a
  `min`/`max` bound may depend on the value just written, and a stale error would keep an input
  current forever. (An input that a `visibleIf` hides clears its own errors and is left alone.)
* in `complete()`, on everything.

### `answer()`

```js
await iv.answer("Yes");             // the current item
await iv.answer("petType", "Dog");  // by address: a revisit
```

Before anything is written, three checks the model cannot make — it accepts whatever it is assigned,
and what keeps a respondent from entering an impossible value is the UI, which a text consumer does
not have. A value outside the listed choices is `notAChoice`, a non-numeric string for a number is
`notANumber`, an action object where a value belongs is `badAction`; each writes nothing and comes
back with its code and the same current item. A scalar answer to a question whose value is an array
is **wrapped** silently — a voice consumer says "Dog" and means `["Dog"]`.

An item that accepts a comment — the `other` choice, a comment area — takes the object form, and
reports it back the same way:

```js
await iv.answer({ value: "other", comment: "Ferret" });
// answered: { pet: { value: "other", comment: "Ferret" } }, data: { pet: "other", "pet-Comment": "Ferret" }
```

The value goes in through the question, never through `survey.data`, so triggers, `setValueIf`,
calculated values and conditions run at every nesting level exactly as they do for a respondent.
Then the written input is validated, the model is allowed to settle, and the result is assembled:

```ts
{
  errors,           // the written input's errors, or the one pre-check error
  becameVisible,    // addresses that were not being asked for before this call and are now
  becameHidden,     // the reverse
  becameRequired,   // required now, and not required-and-visible before
  current,          // the next item, or null
  describe          // the document, with the changes and the errors in it
}
```

An input that stays invalid keeps its value — 55 stays in the box with the error under it — and
`current()` stays on it. A question that went invisible had its value cleared by the model if the
survey says so (`clearInvisibleValues`); either way `answered` simply no longer lists it.

**Navigation-time triggers do not fire.** In a rendered UI, `"complete"` and `"skip"` triggers fire
when the respondent *leaves* an input, from `performNext()`. The interview selects its own next
input and never calls `performNext()`, and completion here is explicit, so those triggers stay
un-fired; value triggers — `setvalue`, `copyvalue`, `runexpression` — fire from the write itself and
work normally. A host that wants the navigation ones puts the model back on the input it answered and
navigates it:

```js
await iv.answer("go");
iv.survey.currentSingleQuestion = iv.survey.getQuestionByName("q1");
iv.survey.performNext();
```

### `skip()`

Skipping is a single-mode gesture and it lives only in the interview — the model has no notion of it.
`skip()` marks the current item as passed over and selects the next one; a **required** item is
refused with `requiredCannotSkip` and stays current. The value the input already holds is **not**
erased: skip means "move on". Answering a skipped item un-skips it, and a skipped item that a
`requiredIf` turns required is asked again — required means asked.

A skipped item is left out of the `answered` map and counts as done for `progress.answered`.

### `complete()`

1. Every askable item is validated and the model is allowed to settle. A required item that was never
   answered is an error **here** and nowhere else: the interview cannot know the person is done until
   every required input holds a value. Any error at this point ends the call with
   `{ completed: false, errors, data, completedHtml: "" }` and the survey still running.
2. With no errors, the model is moved to its last input and `survey.tryComplete()` runs — **not**
   `doComplete()`. Server validation lives only on the `tryComplete` path: it reaches
   `doServerValidation`, which fires `onServerValidateQuestions` and blocks until the host calls
   `options.complete()`. `doComplete()` skips it, and a survey whose host validates on a server would
   be completed behind its back.
3. The call settles again — an asynchronous `onCompleting`, the server validation and an asynchronous
   `onComplete` are all waited for — and answers with `completed`, the errors the server added under
   their questions' addresses, `data`, and `completedHtml` (the model's `processedCompletedHtml`).
   An `onCompleting` handler that sets `allow = false` produces `completionBlocked`.

After the completion `current()` is `null`, `answer()` and `skip()` return `surveyCompleted`, and
`describe()` still renders — a transcript wants the final progress and answers. Completing an
already completed survey is a no-op with the same answer.

### The pet survey, end to end

```js
const iv = await createInterview(petSurveyJson);
iv.describe();
```

````markdown
# Pet survey

```yaml
progress:
  answered: 0
  remainingRequired: 1
current:
  name: hasPet
  type: radiogroup
  title: Do you have a pet?
  required: true
  choices:
    - value: "Yes"
    - value: "No"
```
````

```js
const res = await iv.answer("Yes");
// res.becameVisible: ["petType", "petAge"], res.becameRequired: ["petType"]
```

````markdown
# Pet survey

```yaml
progress:
  answered: 1
  remainingRequired: 1
answered:
  hasPet: "Yes"
changes:
  becameVisible: [petType, petAge]
  becameRequired: [petType]
current:
  name: petType
  type: dropdown
  title: What kind?
  required: true
  choices:
    - value: Dog
    - value: Cat
    - value: Other
```
````

```js
await iv.answer("petType", "Dog");
await iv.answer(55);          // petAge, which is bounded at 40
```

````markdown
# Pet survey

```yaml
progress:
  answered: 2
  remainingRequired: 0
answered:
  hasPet: "Yes"
  petType: Dog
  petAge: 55
errors:
  - name: petAge
    message: The value should not be greater than 40
current:
  name: petAge
  type: text
  title: Pet age (years)
  required: false
  inputType: number
  constraints:
    min: 0
    max: 40
  error: The value should not be greater than 40
```
````

`answer(4)` clears the error, `current()` becomes `null`, and `complete()` answers
`{ completed: true, data: { hasPet: "Yes", petType: "Dog", petAge: 4 } }`.

## Source layout

| File | Responsibility |
| --- | --- |
| `interview-types.ts` | The public interfaces of the whole module: options, item, summary, action, error, changes, result, document, tool definition. |
| `interview.ts` | `createInterview` — model intake, the one property the interview sets, the start page — and the `Interview` class: the selection rule, the four calls of single-input mode, the pre-checks and the documents. |
| `interview-items.ts` | The inventory over the model's single inputs, the item records, the three predicates (answered / valid / errors) and the one function that makes an input current. |
| `interview-state.ts` | The state the model has no notion of: the skipped set, and the snapshot / diff pair behind the change report. |
| `interview-errors.ts` | `InterviewErrorCodes`, frozen, and one composing function per code. |
| `interview-async.ts` | `settle()`: the one asynchronous primitive. Every mutating call ends with it before it reads the state it returns. |
| `yaml.ts` | `toYaml()`: the emitter, a pure function of plain data. It is where the quoting rules live. |
| `render.ts` | `renderInterviewDocument()`: the document as a Markdown heading and one fenced `yaml` block. The one place text is assembled; nothing else writes Markdown or YAML by hand. |

`src/interview/**` imports nothing but `"survey-core"` and its own files; nothing under `src/`
outside this folder imports from it, and no public entry point — nor `survey-core/tester` and
`survey-core/linter`, the other two sub-bundles — reaches it.
`tests/interview/interviewIsolationTests.ts` pins all of that, including that every value it imports
from `"survey-core"` is really exported by `"survey-core"`: the bundle declares the package external,
so a symbol the public surface does not export would be `undefined` at run time while the unit tests,
which alias the specifier to `entries/index.ts`, kept passing.

Shared functionality lives in survey-core, not here: the per-question record the items are built from
is `describeQuestion` / `IQuestionDescription` (`src/question-description.ts`), exported from
`"survey-core"` and used by the tester and, later, by the Creator as well.

## Build and test

```bash
npm run build             # survey-core itself — required first
npm run build:interview   # rollup -c rollup.interview.config.mjs (part of npm run build:all)
npx vitest run tests/interview
```

`build:interview` resolves `survey-core` types through `./build`, so it fails on a clean checkout
unless `npm run build` ran before it. It emits `build/interview.js`, `build/interview.min.js`,
`build/fesm/interview.mjs` and `build/typings/entries/interview.d.ts`, reached through the
`"./interview"` entry of the package's exports map.
