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
| `interview.current(): IInterviewItem \| null` | The first visible input that is unanswered or invalid. | tier 04 |
| `interview.describe(): string` | The current item as YAML in Markdown. The text form is final; the document behind it — the item, the answered map, the progress numbers — arrives in tier 04. | tier 03 / 04 |
| `interview.answer(value)` / `answer(name, value)` | Writes one answer and reports the consequences. | tier 04 |
| `interview.skip()` | Leaves the current item unanswered and moves on. | tier 04 |
| `interview.complete()` | Validates everything and calls `tryComplete()`. | tier 04 |
| `interview.describeAll(): string` | The whole form at once, for batch mode. | tier 05 |
| `interview.answerAll(values)` | Writes many answers by address in one call. | tier 05 |
| `interview.getAnswerSchema(): any` | JSON Schema for the answers a batch call accepts. | tier 05 |
| `interview.getTools(): Array<IInterviewToolDefinition>` | MCP-shaped tool definitions, usable for function calling as is. | tier 05 |
| `interview.callTool(name, args): Promise<any>` | Runs one of them. | tier 05 |
| `toYaml(value, options?): string` | The emitter the documents are written with — plain data in, YAML out. Exported so that a host rendering its own text from the item records quotes exactly the way `describe()` does. | tier 03 |

A method that has not arrived yet throws `Error("not implemented: <name>")` rather than answering
wrongly. Nested inputs — dynamic panels, matrices, multiple text, custom components — and their
summary steps arrive in tier 06; until then they are described as their container.

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

| Field | Description |
| --- | --- |
| `message` | English, ready to show to a developer. |
| `code` | The stable identifier a host localizes on. `"startPageIncomplete"`, `"asyncTimeout"`; tier 04 adds the table of the codes the interview raises per item. |

The interview invents no prose for the interviewee: every text a consumer sees is either a localized
model string — a title, a choice text, an error text, an add-button caption — or a fixed YAML key.

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
* `answered` maps an address to the raw value — a checkbox answer is a sequence, a multiple-text
  answer a nested map. An address that is not an identifier (`medications[0].dose`,
  `matrix.row.column`) is a quoted key; a consumer reads it as a string either way.
* `errors` is a sequence of `{ name, message }`, plus `code` for the errors the interview raises
  itself. `message` is the localized text the rendered UI shows for the same error.
* `current` and each entry of `items` is one item record — `name`, `type`, `title`, `description`,
  `required`, then the type-specific keys, and `error` last when the current answer failed
  validation. A key that carries nothing is not written at all: there is no `description: null` and
  no `disabled: false`, so a key a consumer sees is a key it can act on.

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

## Source layout

| File | Responsibility |
| --- | --- |
| `interview-types.ts` | The public interfaces of the whole module: options, item, summary, action, error, changes, result, document, tool definition. |
| `interview.ts` | `createInterview` — model intake, the one property the interview sets, the start page — and the `Interview` class. |
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
