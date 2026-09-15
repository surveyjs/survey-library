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
so what it describes is never a state that is about to change. The settle also covers what the call
brought into being: a row's [detail panel](#items-are-the-models-own-single-inputs) the call created
— a `choicesByUrl` of a detail question, an asynchronous validator of its `defaultValue` — is
drained by the same call.

| Export | Description | Arrives in |
| --- | --- | --- |
| `createInterview(survey, options?): Promise<IInterview>` | Takes a `SurveyModel` (used as is) or a survey JSON object (`new SurveyModel(json)`, nothing else configured). Anything else — a string, an array, `null`, a disposed model — is a `TypeError`. | tier 02 |
| `interview.survey` | The model that was passed in. | tier 02 |
| `interview.data` | `survey.data`. | tier 02 |
| `interview.dispose()` | Drops the interview's own state. The model is untouched. | tier 02 |
| `interview.current(): IInterviewItem \| null` | The first item that can be asked and is either unanswered or invalid; `null` when there is none. A synchronous read of settled state — it never moves the model and never runs a validator. | tier 04 |
| `interview.describe(): string` | The current item, the progress and the answers so far, as YAML in Markdown. | tier 03 / 04 |
| `interview.getSingleDocument(): IInterviewDocument` | The same state as **data**: the very object `describe()` renders. Plain records only, so `JSON.stringify` of it is the JSON form of that document. | tier 03 / 04 |
| `interview.answer(value)` / `answer(name, value)` | Writes one answer — to the current item, or to the item at the [address](#addresses) `name` — and reports the consequences: the errors, what became visible, hidden or required, the next item, and the document. On a [summary step](#the-summary-step) it takes an action (`{ action: "add" }`, `remove`, `edit`, `done`) instead of a value. | tier 04 / 06 |
| `interview.skip()` | Leaves the current item unanswered and moves on. Refused for a required item. | tier 04 |
| `interview.complete()` | Validates every item, then calls `tryComplete()`. | tier 04 |
| `interview.describeAll(): string` | Every question that still needs an answer, at once, for batch mode. | tier 05 |
| `interview.getBatchDocument(): IInterviewDocument` | The object `describeAll()` renders, as data — every item of the list as a record, the ones an agent cannot fill included. | tier 05 |
| `interview.answerAll(values)` | Writes many answers by address in one call. | tier 05 |
| `interview.getAnswerSchema(): any` | JSON Schema for the answers `answerAll()` accepts right now. | tier 05 |
| `interview.getTools(options?): Array<IInterviewToolDefinition>` | MCP-shaped tool definitions, usable for function calling as is. `{ prefix }` renames them. | tier 05 |
| `interview.callTool(name, args): Promise<any>` | Runs one of them, by the name the definition carries. | tier 05 |
| `toYaml(value, options?): string` | The emitter the documents are written with — plain data in, YAML out. Exported so that a host rendering its own text from the item records quotes exactly the way `describe()` does. | tier 03 |
| `InterviewErrorCodes` | The frozen table of the codes the interview raises itself. A host localizes on the code. | tier 04 |

Nested inputs — inside dynamic panels, matrices, multiple text and custom components — are answered
in single-input mode, each at its own [address](#addresses). Batch mode fills a container whose value
is one object with a fixed set of keys — a single-choice matrix, a matrix dropdown, a multiple text,
a composite — as that object (see [Fixed-shape containers as objects](#fixed-shape-containers-as-objects)),
a dynamic panel or a dynamic matrix as a list of records (see
[Dynamic containers as records](#dynamic-containers-as-records)), and a container nested inside
another one the same way, at any depth (see [Nested containers](#nested-containers)).

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
| `notAskable` | The item or the field exists but cannot take a value: an `enableIf` turned it off (`disabled`), it has no plain input — a file, a signature, an image picker (`unsupported`), it sits deeper than the 20 nested containers the interview addresses and neither mode reaches it (`reason: "batch"`, see [the ceiling](#the-depth-ceiling)), or the survey hid it, an earlier key of the same `answerAll()` included. The message says which. |
| `notAChoice` | The value is not among the choices the item lists. Checked per element for a multi-select; `other` and `none` are choices like any other; skipped entirely when the item says `choicesUnknown`. |
| `notANumber` | A string that is not a number, for an item whose value is a number. |
| `badAction` | An action object (`{ action: "add" }`) sent to an item that takes a value, a plain value sent to a [summary step](#the-summary-step), an action the step does not offer, or a `remove` / `edit` without an `index` of an entry that exists. |
| `badAddress` | `answer(name, value)` with text that is not an [address](#addresses) at all, or with an index past the entries the container holds now. The entry a well-formed index names into thin air is created by the summary step's `add`, not by answering. |
| `badRecord` | The value `answerAll()` was given is not the shape the container takes: not an object of field values for a [fixed-shape container](#fixed-shape-containers-as-objects) or for a row inside one, not a list for a [dynamic one](#dynamic-containers-as-records), or an element of that list that is neither an object nor a `null` naming an entry that exists — at any depth, under the address of what was refused: `orders[0].items` for a string sent for a nested list, `orders[0].items[1]` for a `null` past its count. `null` and `undefined` for a container are not a mistake: they leave it alone. |
| `cannotAdd` | `{ action: "add" }` on a container that has reached its maximum count or has adding turned off, and the same in a batch, at any depth: the list asks for more entries than fit, or a handler of the survey refused the new one. The error is named after the position (`orders[0].items[2]`) and the message after the container: "No entry can be added to \"orders[0].items\" at position 2". |
| `cannotRemove` | `{ action: "remove" }` on an entry the model offers no remove button for, and the same in a batch, at any depth: a `null` names an entry that cannot go, the removals would fall below the minimum count, or a handler of the survey refused. Named after the position (`orders[0].items[0]`), like `cannotAdd`. |
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
  Items the interviewee skipped are left out. A dynamic container appears under its own address, with
  its whole array as the value, once its [summary step](#the-summary-step) counts as answered; the
  inputs inside it are listed under their own addresses either way, so a consumer can read the
  answers at whichever level it works at.
* `errors` is a sequence of `{ name, message }`, plus `code` for the errors the interview raises
  itself. `message` is the localized text the rendered UI shows for the same error.
* `current` and each entry of `items` is one item record — `name`, `type`, `title`, `description`,
  `required`, then the type-specific keys, then `entry` (the model's breadcrumb for the entry a
  nested input sits in), `summary` (a container's [summary step](#the-summary-step)) or `fields` /
  `rows` (the inputs of a [fixed-shape container](#fixed-shape-containers-as-objects), each a record
  of its own with `value` and `error` on top), and `error`
  last when the current answer failed validation. A key that carries nothing is not written at all:
  there is no `description: null` and no `disabled: false`, so a key a consumer sees is a key it can
  act on. `name` is the [address](#addresses), not necessarily the question's name.
* One key of the record is deliberately **not** written: `valueType`. A reader already knows what a
  value is from the choices, the input type or the constraints, and where the value type is needed as
  data — the JSON Schema an agent fills in — `getAnswerSchema()` produces it. The `IInterviewItem`
  records a host reads from `current` and from a result do carry it.

### The same document as JSON

The text is not the only form. `getSingleDocument()` and `getBatchDocument()` return the
`IInterviewDocument` that `describe()` and `describeAll()` render — the *same* object, not a second
reading of the model, so the two forms cannot drift apart:

```js
const document = iv.getBatchDocument();
JSON.stringify(document);            // the JSON form of exactly what describeAll() wrote
document.items.map(i => i.name);     // every item as a record, without parsing any text
```

Everything a document can reach is a string, a number, a boolean, a plain object or an array — no
model object, no function, no cycle — so `JSON.stringify` needs no replacer and the round trip is
lossless. A chat front end takes the text, an HTTP or MCP host takes the JSON, and a host that wants
its own rendering walks the records rather than parsing our YAML.

Two differences between the object and the block, both deliberate:

* `title` is the Markdown **heading** above the block, not a key inside it.
* the item records carry `valueType`, which the block leaves out (see above).

The one field of the API that is *not* a record of ours is `complete().data`: it is `survey.data`,
the model's own object, so whatever a host assigned to a question is what comes back — a `Date`
assigned as a value stays a `Date` there, while every record the interview builds holds the
model's normalized value. `tests/interview/interviewJsonTests.ts` pins all of it.

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
single input holding the whole array or object, `answer()` takes that whole value, and there is no
summary step because there is nothing to add or remove one entry at a time — and `onGetLoopQuestions`
edits the list of nested inputs, so a question the host drops there is not an item and its address
answers nothing. Both are set on the model, before the hand-over, like everything else.

**A row's detail panel exists from the moment the row does.** A matrix creates the detail panel of a
row lazily — left to the model, at the row's first validation — and until then the row's questions
are its cells alone. The interview creates the missing panels itself, in the call that made the row
visible: `createInterview` for the rows there are at load, and every call that writes — a value that
revealed a row through `rowsVisibleIf`, a batch that added one — before it settles. So a detail
question is an item from the first `current()` on (`items[0].note` right after `items[0].sku`), and a
`choicesByUrl` on it is drained by the settle of the call that created the panel. **No read creates
anything**: `current()`, `describe()` and `describeAll()` see a panel only once a call that writes has
run. A row the survey's `onHasDetailPanelCallback` excludes gets no panel, and a row whose panel
already exists is left as it is.

The panel is created through `row.showDetailPanel()`, the one public gesture the model offers for it,
and that has a UI side effect: the row is **expanded** — with `detailPanelMode: "underRowSingle"`, the
row expanded before it collapses — the matrix builds its rendered table, and
`onMatrixDetailPanelVisibleChanged` fires for the row. Each row is expanded once, by the call that
made it visible; a panel a UI collapses afterwards stays collapsed and stays readable, because a
collapsed panel is kept.

**The questions inside a choice are items of their own.** A radiogroup's or a checkbox's choice may
hold questions — `choices: [{ value: "Yes", elements: [{ type: "text", name: "petName" }] }, "No"]` —
and the model shows them while the choice is selected and keeps their values at the top level of
`data`, under their own names: `{ hasPet: "Yes", petName: "Rex" }`, the owner's value staying the
plain choice. The interview does the same. Such a question is an item right after its owner, its name
is its address, it carries no `entry` breadcrumb, and it is to the interview what a question in a
`visibleIf` panel is — the condition being the choice. Selecting the choice reports it in
`becameVisible`, deselecting it in `becameHidden`; nothing on the choice record announces it
beforehand. A question inside a choice may be anything a root may be — a container is filled the way a
root container is, a radiogroup with choice questions of its own lists them after it in turn — and
the detail panel of a matrix among them is created in the call that selects the choice.

* Validating the owner validates the questions of its selected choice with it, so the answer that
  selects a choice would put "Response required." on a question nobody has asked for yet. The
  interview leaves such an error off, as it does for a freshly added entry: an empty required
  question inside a choice is current without an error, and is an error at `complete()`.
* Deselecting the choice takes the questions out of every document — `answered` is a map over the
  inputs there are, and they are no longer inputs — while the model decides what happens to their
  values, by `clearInvisibleValues`. Under the default `"onComplete"` a value survives the
  deselection and `complete()` drops it. `"onHidden"` drops it as soon as the choice is deselected
  once the owner's page has been the model's current page — always so in single mode, where the owner
  was current when it was answered — and at `complete()` otherwise: the model clears a choice's
  questions only for an owner it has rendered, and a batch that selects and deselects a choice on a
  page no call has made current leaves the value in `data` until then. The interview does not clear
  what the model keeps.
* While one of its choice questions is asked, the model's current single element is the **owner** —
  the outermost one for a choice inside a choice — which is what a UI on the same model shows: the
  panel under its choice. The mode's navigation does not know the choice questions, and a survey whose
  current input were one of them would never consider itself at the end: one that ends inside a
  choice would validate on the server and stay running. `current()` is the question all the same.
* A select question with choice questions **inside an entry** — a dynamic panel's template, a
  matrix's detail panel, a composite — keeps those questions at the top level of `data` too, one key
  shared by every entry: the model gives the choice's panel the survey as its data provider, not the
  entry. That is the model's gap, and until the model scopes them to the entry the interview lists
  those questions nowhere; `complete()` then fails the way the model's own validation does, with an
  error nobody can reach.

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
off (`disabled`) and one with no plain input — a file, a signature, an image picker (`unsupported`).

That is the issue's rule, and it is not the mode's own navigation: `performNext()` goes to the input
*after* the one the respondent is on, wherever that is. So the interview selects first and then
**tells** the model — `survey.currentSingleQuestion` and its nested current input are set to the item
that was selected, at the end of `createInterview` and of every call that writes; for a question
inside a choice, the model is set to the choice's owner
([why](#items-are-the-models-own-single-inputs)). When there is
nothing left to ask, the model is left on the last input, which is where a respondent stands when
they press Complete.

`current()` itself never moves the model, never validates and never starts anything: it is a
synchronous read of state that has already settled.

The rule has exactly one exception, and it lasts one gesture: the `edit` action of a
[summary step](#the-summary-step) opens an entry that is answered and valid, which the rule would
walk straight past. That entry stays current until something is written, and then the rule takes
over again.

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
* on a container, after every `add` and every `remove` of its [summary step](#the-summary-step) — a
  `MinRowCountError`, a duplicated key or a required container that has just lost its last entry.
  Validating a container validates its entries with it, and an entry that was just created is empty
  by definition, so the errors that run puts on inputs nobody has been asked for yet are dropped:
  an unanswered required input is an error at `complete()`, not the moment its entry comes into being.
* in `complete()`, on everything, containers included.

### Addresses

An **address** names an item: it is what `answer(name, value)` takes, what `errors[].name` and the
keys of the `answered` map carry, and what `current.name` is. A top-level question is its own name;
below it, the address says which container, which entry of it, and which input inside that entry.

| Input | Address | Value in `data` |
| --- | --- | --- |
| a top-level question | `email` | `data.email` |
| a question inside a selected choice | `petName` | `data.petName` |
| a question in panel *i* of a dynamic panel | `medications[0].dose` | `data.medications[0].dose` |
| a cell in row *i* of a dynamic matrix | `items[0].quantity` | `data.items[0].quantity` |
| a cell of a matrix dropdown | `matrix.row1.column1` | `data.matrix.row1.column1` |
| a row of a single-choice matrix | `satisfaction.price` | `data.satisfaction.price` |
| an item of a multiple text | `contact.email` | `data.contact.email` |
| a question of a composite component | `address.street` | `data.address.street` |
| the summary step of a dynamic container | `medications` | `data.medications`, the whole array |
| nested containers | `orders[1].items[0].sku` | as written |
| a container whose nesting the host turned off | `medications` | the whole array or object |

* A question inside a choice is its bare name — the same name the tester's `nameOf` gives it — because
  that is where the model keeps its value; `hasPet.petName` names nothing in `data`. It answers only
  while its choice is selected: an address names an input that exists now, and after a deselection
  `answer("petName", …)` is `unknownQuestion`.
* A segment matches a question by its **`name`**, never by `getValueName()`. A question with a
  `valueName` is addressed by its name and its value lands under the `valueName`: the address is the
  survey's structure, the data key is the model's.
* An index counts the entries the interviewee **sees** — `visiblePanels`, `visibleRows` — which is
  the list the summary step numbers and the `remove` and `edit` actions index. An index past the
  entries that exist is `badAddress`: an entry comes into being through the summary step's `add`,
  never by answering an address that names nothing.
* A segment that carries a `.`, a `[`, a `]` or a `"` is written as a double-quoted JSON string:
  `contact."e.mail"`, `matrix."row.one".c1`.
* A revisit works whatever the mode is doing. The mode's own navigation list drops a panel that is
  complete and valid; the interview's inventory does not, so `answer("medications[0].dose", "15mg")`
  writes it and moves the model there.
* The **depth** of a question is the number of containers above it — a root is at depth 0,
  `orders[1].items[0].sku` at 2 — and its address has one segment more than that. A question
  deeper than 20 containers has no address, no item and no record, in either mode: the grammar refuses
  an address of more than 21 segments (`badAddress`), and [batch mode](#the-depth-ceiling) reports the
  container at the ceiling instead of filling it. Nothing a survey can express gets there.

It is the same grammar as the tester's target names (`SurveyTestTargets.nameOf` / `resolve` in
`survey-core/tester`), and the two are implemented separately because neither sub-bundle may import
the other — `tests/interview/interviewAddressTests.ts` pins them against each other over a nested
fixture. Two differences: the interview indexes the entries a respondent sees where the tester
indexes `panels`, and the tester's grammar has no quoted form and no name at all for a multiple-text
item or a composite's content question.

### The summary step

A dynamic panel and a dynamic matrix are not filled by answering a value. The mode gives them a
**summary step** — the list of entries with add / remove / edit that a UI on the same model shows —
and the interview hands it over as one item, last among the container's inputs, and first again once
it has been shown:

```yaml
current:
  name: medications
  type: paneldynamic
  title: Medications
  required: false
  summary:
    entries:
      - index: 0
        title: Aspirin           # the model's own entry title
        canRemove: true
      - index: 1
        title: Panel 2
        canRemove: true
    canAdd: true
    addText: Add new             # the model's localized add caption
```

`constraints.minCount` / `maxCount` are on the item as well when the container declares them, the
way every other constraint of the description layer is.

Every string in it is the model's: the entry title is the processed `templateTitle` (piping included
— `{panel.name}` is why the entry above reads "Aspirin"), or `"Panel {panelIndex}"` / `"Row
{rowIndex}"` / the row name; `addText` is `addPanelText` / `addRowText`; and when there are no
entries, `entries` is left out and the container's own `noEntriesText` / `noRowsText` takes its
place. `canAdd` and `canRemove` are the model's `canAddPanel` / `canRemovePanel`, `canAddRow` /
`canRemoveRow`.

`answer()` on a summary step takes an **action**, not a value:

| Action | Does | Then current is |
| --- | --- | --- |
| `{ action: "add" }` | Adds an entry, through the model's own add. | the new entry's first input |
| `{ action: "remove", index }` | Removes that entry. | the summary step again |
| `{ action: "edit", index }` | Opens that entry. | its first input, **even though it is answered** — the one place the current follows the model instead of the rule, until something is written |
| `{ action: "done" }` | Says the list is finished. | the next item |

```js
await iv.answer({ action: "add" });        // -> medications[0].name
await iv.answer("Aspirin");
await iv.answer("10mg");                   // -> the summary, with one entry
await iv.answer({ action: "done" });       // -> the next question
```

* **`done` is the interview's own**, and the only part of a summary step the model has no notion of.
  A container is not finished because it holds entries — an optional dynamic panel with two
  medications in it may still want a third — so the step counts as answered when, and only when, the
  interviewee says so, exactly as the mode keeps the summary in front of them. Adding, removing or
  editing an entry afterwards re-opens it, and `done` is asked for again.
* A **required container with no entries is invalid** by the model's own rule, so `done` does not
  get past it: the step stays current and `complete()` reports it.
* The container's own errors — `MinRowCountError`, a required container left empty — are reported
  under the container's address and shown on its summary step. An error the model puts on a question
  inside an entry, `KeyDuplicationError` among them, is reported at that question's address, which is
  where a consumer can ask for a different value.
* **Removing never prompts.** The buttons the summary carries go through `removePanelUI` /
  `removeRowUI`, which consult `confirmDelete` and hand a populated entry to a confirmation dialog —
  and nobody answers a dialog in Node, so the removal would stay pending forever. The action uses the
  data-level calls instead, after checking that the model offers the entry a remove button at all.
  Asking "remove Aspirin?" first is the consumer's job: a chat or a voice front end is where that
  question belongs.
* A plain value sent to a summary step, an action it does not offer, and a `remove` or `edit` without
  the index of an entry that exists are all `badAction`; adding to a full container is `cannotAdd`
  and removing an entry that offers no remove button is `cannotRemove`. None of them changes anything.

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

### A dynamic panel, end to end

```js
const iv = await createInterview({
  title: "Health check",
  elements: [{
    type: "paneldynamic", name: "medications", title: "Medications", templateTitle: "{panel.name}",
    panelCount: 0,
    templateElements: [
      { type: "text", name: "name", title: "Name", isRequired: true },
      { type: "text", name: "dose", title: "Dose" }
    ]
  }]
});
iv.describe();
```

````markdown
# Health check

```yaml
progress:
  answered: 0
  remainingRequired: 0
current:
  name: medications
  type: paneldynamic
  title: Medications
  required: false
  summary:
    noEntriesText: "No entries yet.\nClick the button below to add a new entry."
    canAdd: true
    addText: Add new
```
````

```js
const added = await iv.answer({ action: "add" });
// added.becameVisible: ["medications[0].name", "medications[0].dose"]
// added.becameRequired: ["medications[0].name"], added.current.name: "medications[0].name"
await iv.answer("Aspirin");
const filled = await iv.answer("10mg");
```

````markdown
# Health check

```yaml
progress:
  answered: 2
  remainingRequired: 0
answered:
  "medications[0].name": Aspirin
  "medications[0].dose": 10mg
current:
  name: medications
  type: paneldynamic
  title: Medications
  required: false
  summary:
    entries:
      - index: 0
        title: Aspirin
        canRemove: true
    canAdd: true
    addText: Add new
```
````

```js
await iv.answer({ action: "done" });
// current() is null; answered now carries "medications" as well, the whole array
await iv.complete();
// { completed: true, data: { medications: [{ name: "Aspirin", dose: "10mg" }] } }
```

### A matrix dropdown, end to end

A matrix dropdown has a fixed set of rows: its cells are items, in row order, and there is **no**
summary step — there is nothing to add or remove.

```js
const iv = await createInterview({
  elements: [{
    type: "matrixdropdown", name: "matrix", title: "Matrix", rows: ["row1", "row2"],
    columns: [{ name: "column1", title: "Rating", cellType: "dropdown", choices: ["low", "high"] }]
  }]
});
iv.describe();
```

````markdown
# Survey

```yaml
progress:
  answered: 0
  remainingRequired: 0
current:
  name: matrix.row1.column1
  type: dropdown
  title: Rating
  required: false
  choices:
    - value: low
    - value: high
  entry: row1
```
````

`answer("low")` moves to `matrix.row2.column1` with `entry: row2`; answering that one leaves
`current()` at `null` and `data.matrix` as `{ row1: { column1: "low" }, row2: { column1: "high" } }`.
`entry` is the model's own breadcrumb for the entry an input sits in — the row name here, a processed
`templateTitle` in a dynamic panel, `"Row 1"` in a dynamic matrix.

### A question inside a choice, end to end

```js
const iv = await createInterview({
  title: "Pets",
  elements: [
    { type: "radiogroup", name: "hasPet", title: "Do you have a pet?", choices: [
      { value: "Yes", elements: [{ type: "text", name: "petName", title: "Pet name", isRequired: true }] },
      "No"
    ] },
    { type: "text", name: "note", title: "Note" }
  ]
});
const res = await iv.answer("Yes");
// res.becameVisible: ["petName"], res.becameRequired: ["petName"]
```

````markdown
# Pets

```yaml
progress:
  answered: 1
  remainingRequired: 1
answered:
  hasPet: "Yes"
changes:
  becameVisible: [petName]
  becameRequired: [petName]
current:
  name: petName
  type: text
  title: Pet name
  required: true
```
````

```js
await iv.answer("Rex");      // current: note
await iv.skip();             // current: null
await iv.complete();
// { completed: true, data: { hasPet: "Yes", petName: "Rex" } }
```

The same survey in batch mode, in three documents:

```js
iv.describeAll();                           // items: hasPet, note
await iv.answerAll({ hasPet: "Yes" });      // becameVisible: [petName]   items: petName, note
await iv.answerAll({ petName: "Rex", note: "-" });
                                            // items: []   current: null
```

An agent that already knows the answer sends `{ hasPet: "Yes", petName: "Rex" }` in one call: a key
that names a question another key of the same call reveals is written in that call (see
[`answerAll(values)`](#answerallvalues)).

### Addresses shift when an entry is removed

The change report is over addresses, and an address is a position. Removing entry 0 of three moves
the two entries after it down, so `medications[2].*` becomes `medications[1].*`. The diff says what
is true of the addresses themselves: the highest ones stop being asked for and are listed in
`becameHidden`, and an address that was already visible stays visible even though the answer under it
is now a different entry's.

```js
await iv.answer({ action: "remove", index: 0 });
// becameHidden: ["medications[2].name", "medications[2].dose"]
// answered: { "medications[0].name": "Ibuprofen", ... } - what was medications[1]
```

**A consumer keys on the addresses of the current document, never on ones it remembers from an
earlier turn.** The document that comes back from every call is the whole truth about where the
answers are now.

## Batch mode

Single mode is a conversation; batch mode is a turn of an agent. `describeAll()` hands over every
question that still needs work, `answerAll()` takes as many answers back as the agent could produce,
and the pair is looped until nothing is invalid and nothing new became visible. The loop converges
because visibility depends only on data: an answer either reveals questions or it does not, and once
no answer changes anything there is nothing left to reveal.

The document is the one of single mode with `items` in place of `current`:

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
items:
  - name: petType
    type: dropdown
    title: What kind?
    required: true
    choices:
      - value: Dog
      - value: Cat
      - value: Other
  - name: petAge
    type: text
    title: Pet age (years)
    required: false
    inputType: number
    constraints:
      min: 0
      max: 40
```
````

`items` lists every item that is **not already answered and valid**, plus every item the agent has to
be told about even though it cannot fill it. `items: []` means there is nothing left to send. An item
that failed validation carries its first error text under `error`, exactly as `current` does in
single mode.

Unlike single mode, batch mode works at the level of the **root question** — the name a JSON key
carries — and not of the nested input a respondent fills one at a time. So:

* a container whose value is **one object with a fixed set of keys** — a single-choice matrix, a
  matrix dropdown, a multiple text, a composite component — is one record whose `fields` (or, for a
  matrix dropdown, whose `rows`) describe the inputs it holds, and `answerAll()` takes that object
  back. See [Fixed-shape containers as objects](#fixed-shape-containers-as-objects).
* a container whose value is a **list that grows and shrinks** — a dynamic panel, a dynamic matrix —
  is one record whose `entries` describe what it holds now, and `answerAll()` takes a list of records
  back: add, remove and edit, any number of entries, in one turn. See
  [Dynamic containers as records](#dynamic-containers-as-records).
* a container **nested inside** another container — a dynamic matrix in a panel template, a dynamic
  panel in a matrix's detail panel or in a composite, a multiple text in a template — is described
  and filled the way a root container is, where it sits, at any depth: its record is a field of the
  entry or of the container that holds it, and the value sent for it is its own value form. See
  [Nested containers](#nested-containers). The one thing still refused is a container at the
  [depth ceiling](#the-depth-ceiling), which nothing a survey can express reaches.
* a question **inside a selected choice** of a radiogroup or a checkbox is a root of its own, listed
  after its owner while the choice is selected, and written by its own name: its value is at the top
  level of `data`, and the owner's value stays the plain choice — `{ hasPet: { petName: "Rex" } }` is
  `notAChoice`. See [the rule in single mode](#items-are-the-models-own-single-inputs).
* a question with **no plain input** — a file to upload, a signature to draw, an image picker — is
  `unsupported: true` with **no** `reason`. The distinction is the point of the key: `reason:
  "batch"` is the depth ceiling, no reason at all says nothing ever will.
* an item an `enableIf` turned off is listed with `disabled: true` and refused by `answerAll()`; a
  question that is read-only by property is not an item and is not listed.
* items the interviewee **skipped** in single mode are listed. Skipping is a gesture of a
  conversation with a person; an agent that wants to leave a question blank leaves it blank.

### `answerAll(values)`

Keys are item addresses, plus `<address>` + [`settings.commentSuffix`](#the-comment-key) for an item
that accepts a comment. Every key is resolved first — one the agent cannot fill is `notAskable` —
and the accepted ones are then written **in item order, not in the order the object carries them**:
a trigger or a `setValueIf` that depends on an earlier question has to see it first, and an agent's
batch is a set of answers rather than a sequence of gestures. A comment is written with the item it
belongs to.

**A key that names an input another key of the same call reveals is written in that call**, whatever
order the object carries them in — a question inside the choice that key selects
(`{ petName: "Rex", hasPet: "Yes" }`), a root that key's `visibleIf` shows
(`{ from: "Rome", trip: "yes" }`). The keys that name nothing when the call starts are resolved again
once the others were written, and written as a further pass, again in item order; that repeats while
a pass writes something. A key that names nothing after the last pass is `unknownQuestion`, and its
message lists the inputs there are **after** the writes. It is the rule a container already applies
to its own fields, one level up.

The writes are **sequential, and each answer is re-checked immediately before its own write** against
the state its predecessors left behind: the item must still be visible and askable — an earlier write
may have hidden it (`notAskable`) — and the pre-checks of single mode (`notAChoice`, `notANumber`, the
silent array wrapping) run against the choices *as they are now*, which `choicesFromQuestion` and
`choicesVisibleIf` may have moved. **A key that fails is skipped and the rest are written**: one bad
answer of a turn must not throw away the good ones, and the errors say which key was refused and why.

The model then settles **once**, after the last write, so the asynchronous validators and expressions
of the whole batch drain together, and the result is the one `answer()` returns:

```ts
{ errors, becameVisible, becameHidden, becameRequired, current, describe }
```

`errors` is *what was wrong with what you sent*: the refused keys, and the validation errors of the
items that were written. A **required item the agent did not touch is not an error** — it is an item
in the next `describeAll()`, which is where the remaining work lives.

What a call reveals and the agent did not send is in the next document, and the loop below sends it
on the next turn. A key an earlier write of the same call **hid** is refused with `notAskable`, not
written: it named an input when the call started, and the check before its own write says the input
is gone.

### The loop

```ts
let result = await iv.answerAll(await agent(iv.describeAll(), iv.getAnswerSchema()));
let previous = "";
while (result.current) {                    // an askable item is still unanswered or invalid
  if (result.describe === previous) break;  // no progress: the agent repeats itself — stop, do not spin
  previous = result.describe;
  result = await iv.answerAll(await agent(result.describe, iv.getAnswerSchema()));
}
const done = await iv.complete();
if (!done.completed) { /* done.errors: hand them back to the agent, or to a person */ }
```

`current` is filled in batch mode too, and it **is** the loop condition: it is non-null while any
askable item is still unanswered or invalid.

`errors.length || becameVisible.length` is **not** a loop condition. An agent that answers one of two
already-visible required questions produces neither an error nor a new question, and a loop written
that way would try to complete with work remaining.

The no-progress guard is the other half: an agent that answers nothing, or sends the same refused
answer twice, produces the same document twice, and the loop ends rather than spinning. What to do
then — re-prompt, escalate to a person, complete anyway — is the integrator's call.

### The comment key

An item whose record carries `comment` accepts a second key, the question name plus
`settings.commentSuffix` (`-Comment` by default) — the same key the model stores the text under, and
the key `getAnswerSchema()` advertises:

```js
await iv.answerAll({ petType: "other", "petType-Comment": "Ferret" });
// data: { petType: "other", "petType-Comment": "Ferret" }
```

It is the batch twin of single mode's `{ value, comment }` object. A key that ends with the suffix but
names no item that accepts a comment is `unknownQuestion`, and a question really called
`note-Comment` is answered by its own name — an address always wins over a comment key. Inside a
container the same key works one level down, for a field: `{ pet: "other", "pet-Comment": "Ferret" }`.
It never applies to the container key itself — `contact-Comment` is `unknownQuestion`.

### Fixed-shape containers as objects

Four question types hold **one object with a fixed set of keys**: the keys are the survey's structure
and nothing is added or removed. Batch mode fills them as that object, the way the object appears in
`data`:

```js
await iv.answerAll({
  contact: { email: "ann@example.com" },                            // multipletext: one item written
  address: { street: "Main St 1", city: "Bonn" },                   // composite: two content questions
  satisfaction: { price: "good" },                                  // matrix: the row, the column value
  matrix: { row1: { column1: "low" }, row2: { column1: "high" } },  // matrixdropdown: rows, then cells
});
```

The record of such a container is the ordinary item record — no `unsupported`, no `reason` — with one
extra key: `fields`, or `rows` for a matrix dropdown, whose value has two levels and whose document
therefore has two.

````markdown
```yaml
items:
  - name: contact
    type: multipletext
    title: Contact
    required: false
    fields:
      - name: email
        type: text
        title: Email
        required: true
        inputType: email
        value: ann@example
        error: Please enter a valid e-mail address.
      - name: phone
        type: text
        title: Phone
        required: false
  - name: matrix
    type: matrixdropdown
    title: Matrix
    required: false
    rows:
      - name: row1
        title: First row
        fields:
          - name: column1
            type: dropdown
            title: Rating
            required: false
            choices:
              - value: low
              - value: high
```
````

* **`fields`** is `describeQuestion` for every input the container holds, in the container's own
  order, plus three keys: `name`, the field's name **relative to the container** — the key of the
  object above, not an [address](#addresses); `value`, what it holds now, in the `{ value, comment }`
  form when a comment is set; and `error`, its first error text. There is no `entry` key: a field
  sits where the document put it.
* **`fields` replaces the describer's `items`.** A multiple text and a composite carry their nested
  records under `items` in a single-mode record; in a batch record that key is dropped and `fields`
  takes its place, so there is one key for "the inputs inside" whatever the container is.
* Per type, the fields are: the synthesized row questions of a **single-choice matrix** (one
  radiogroup, or a checkbox for `cellType: "checkbox"`, per visible row, named after the row, with
  the visible columns as its choices and `eachRowRequired` as its `required`); the cells of a
  **matrix dropdown** row in column order, followed by the questions of its detail panel — which the
  interview creates for every visible row in the call that made the row visible, before that call
  settles, and never from a read ([the rule and its UI side effect](#items-are-the-models-own-single-inputs));
  the editors of a **multiple text**; the visible content questions of a **composite**.
* The container's own first error — `RequiredInAllRowsError`, `EachRowUniqueError`, a required
  container left empty — is on the record's `error`, under its own address in `errors`. A field's
  errors are under the field's address: `contact.email`, `matrix.row1.column1`.
* What the survey hid is not there: a row `rowsVisibleIf` hid, a column or a content question a
  `visibleIf` hid. A field an `enableIf` turned off is listed with `disabled: true` and refused.
* **A container nested inside a container** — a dynamic panel in a composite, a multiple text in a
  detail panel — is a field whose record is the container record itself, and a key for it takes that
  container's value form. See [Nested containers](#nested-containers).
* `fields` and `rows` are written even when they are empty, unlike the optional sections of a
  document: `fields: []` says that this container has nothing an agent can fill — an `enableIf` that
  is false turns every editor of a multiple text read-only with it — and that is information, the way
  `items: []` and `current: null` are.

**Patch semantics.** Keys that are not sent are left as they are; `{}` writes nothing; `null` or
`undefined` for the whole container writes nothing and clears nothing. **A field is cleared by
sending `null` for that field**, exactly as a plain question is. The interview never clears what it
was not told to clear.

The keys of the object are written in the **container's field order**, not in the order the object
carries them — a `setValueIf` or a trigger that reads an earlier field has to see it first — and each
is resolved immediately before its own write, against the container as it is at that moment. So a
field an earlier key of the same object revealed is written in the same call, and a value is checked
against the choices the earlier keys left behind. **One bad field skips that field and the rest of
the object is written**, the same rule one level up. After the last field the container validates
itself, which is where its own errors come from.

Anything that is not a plain object — a string, a number, an array — is `badRecord` at the
container's address, and nothing of that key is written; a row value that is not a plain object is
`badRecord` at `matrix.row1`. A key that names no field is `unknownQuestion` at `contact.fax`, with
the container's fields in the message.

**When a container is listed.** It is *answered* when its value holds something (`!isEmpty()`) and
*valid* when neither it nor any of its fields carries an error or a required error — a read of
persisted state, never a validation run. It is listed while it is not both, and always while it is
`disabled`. An empty **optional** field does not make it invalid, so a multiple text with one of two
items filled is done as far as batch mode is concerned, while single mode still stands on the empty
item. That is why `current` in a batch result is **the first item of `items` an agent may write to**
(not `disabled`, not `unsupported`), or `null`: the loop condition said directly, so that it cannot
disagree with `items: []`.

A three-turn transcript, in the style of the pet survey:

```js
iv.describeAll();
// items: contact (fields email, phone) and satisfaction (fields price, speed)

await iv.answerAll({
  contact: { email: "ann@" },
  satisfaction: { price: "good" },
});
// errors:
//   - name: contact.email   message: Please enter a valid e-mail address.
//   - name: satisfaction    message: "Response required: answer questions in all rows."
// items: contact, with error on the email field; satisfaction, with speed still empty

await iv.answerAll({
  contact: { email: "ann@example.com" },
  satisfaction: { speed: "bad" },
});
// errors: []   items: []   current: null

await iv.complete();
// completed: true
// data: { contact: { email: "ann@example.com" },
//         satisfaction: { price: "good", speed: "bad" } }
```

### Dynamic containers as records

A dynamic panel and a dynamic matrix hold a **list that grows and shrinks**. Batch mode describes
their entries as records and takes a list of records back, so an agent adds, removes and edits any
number of entries in one turn:

```js
await iv.answerAll({
  medications: [
    { dose: "20mg" },                     // position 0 exists: patch it - only the keys sent are written
    null,                                 // position 1 exists: remove it
    { name: "Ibuprofen", dose: "400mg" }, // position 2 is past the count: add an entry and fill it
  ],
});
```

The record of such a container is the ordinary item record — no `unsupported`, no `reason` — with
three extra keys: `entries`, `template` and `canAdd`.

````markdown
```yaml
items:
  - name: medications
    type: paneldynamic
    title: Medications
    required: true
    constraints:
      minCount: 1
      maxCount: 5
    entries:
      - index: 0
        canRemove: true
        fields:
          - name: name
            type: text
            title: Name
            required: true
            value: Aspirin
          - name: dose
            type: text
            title: Dose
            value: 10 mg
            error: Please enter a number followed by a unit
      - index: 1
        canRemove: true
        fields:
          - name: name
            type: text
            title: Name
            required: true
          - name: dose
            type: text
            title: Dose
    template:
      - name: name
        type: text
        title: Name
        required: true
      - name: dose
        type: text
        title: Dose
    canAdd: true
```
````

* **`entries`** — one per entry the interviewee sees (`visiblePanels`, `visibleRows`), which is the
  list the [summary step](#the-summary-step) of single mode numbers as well. `index` is the position
  a value addresses, `canRemove` is the model's own `canRemovePanel` / `canRemoveRows &&
  canRemoveRow(row)`, and `fields` are the [fields](#fixed-shape-containers-as-objects) of that
  entry: a panel's visible questions, a row's cells followed by the questions of its detail panel,
  which exists for every visible row ([created by the interview](#items-are-the-models-own-single-inputs)).
  There is no entry **title**: the model builds the titles the
  summary step shows only for the container it is currently standing on, and a document never moves
  the model. An agent reads the values instead. The key is left out while the container holds no
  entries.
* **`template`** — what a **new** entry takes: the template panel's questions, or the visible
  columns' template questions followed by the questions of the detail panel. It is a declaration and
  not a live entry: a `visibleIf` inside it has not run and `choicesFromQuestion` is empty, so **an
  entry's own `fields` are the truth once it exists**. One thing the template cannot answer for itself
  is the choices a matrix column inherits from the matrix's own `choices` — the column's template
  question is never bound to them — so when a row exists that column is described from the first
  row's cell. With no row at all it reports no choices, and the fields of the first entry an agent adds
  do. The detail questions have the same gap, wider: the design-time detail panel they are declared on
  is not attached to the survey, so neither a title in the survey's locale nor a `choicesFromQuestion`
  resolves there. They are therefore described from the panel of the first row that has one — still
  as a declaration, with no value — and only a matrix with no such row falls back to the design-time
  panel, whose titles are then in the default locale.
* **`canAdd`** — `canAddPanel` / `canAddRow`: false at the maximum count, with adding turned off, in
  read-only state, and under a `panelCountExpression` / `rowCountExpression`, where the count is the
  expression's and records cannot change it.
* **`constraints.minCount` / `maxCount`** are `minPanelCount` / `maxPanelCount` and `minRowCount` /
  `maxRowCount`, each only when the survey set one: both maximums otherwise fall back to a global
  default (`settings.panel.maxPanelCount`, `settings.matrix.maxRowCount`) that nobody asked for.
* The container's own first error — `MinRowCountError`, a duplicated `keyName`, a required container
  with no entries — is on the record's `error` and under its own address in `errors`. A field's
  errors are under the field's address: `medications[1].dose`.
* A **container inside an entry** — a dynamic panel or a matrix in a panel template, a multiple text
  in a detail panel — is a field of the entry whose record is the container record itself: live in the
  entry's `fields`, a declaration in `template`. See [Nested containers](#nested-containers).

**The value.** A list, whose positions are the `entries[].index` of the document the agent read. A
single plain object is wrapped — `[obj]` — like any other array value; `null`, `undefined` and `[]`
for the whole key write nothing and remove nothing ("clear it all" is a list of `null`s), and a
position the list does not reach, or an `undefined` in it, is left alone.

| At a position | Below the current count | At or past it |
| --- | --- | --- |
| an object | **patches** that entry: the keys sent are written, the others left as they are, `{}` writes nothing | **adds** an entry and patches it; positions past the count are taken in order |
| `null` | **removes** that entry | `badRecord` |
| anything else | `badRecord` | `badRecord` |

**Nothing shifts within one call.** Before anything is written, every position below the count is
resolved to the entry it names — the panel, the row — and every operation acts on that object.
Patches and adds run first, removals last. So a patch that hides an earlier entry (`templateVisibleIf`,
`rowsVisibleIf`) cannot make a later `null` remove the wrong one, and what the agent read stays what
the agent meant. The addresses in the **result** have shifted; the next document is the truth.

**Whole-key refusals.** A list whose shape cannot work is refused entirely — nothing of it is
written, because a half-realized shape moves the positions the agent reasoned about — and the error
names the position (`medications[5]`): a `null` on an entry that offers no remove (`cannotRemove`), adds that do not fit
(`cannotAdd`), removals that would fall below the minimum (`cannotRemove`), an element that is
neither an object nor a `null` naming an entry that exists (`badRecord`). The counts are checked **in
the order the operations run**, because the model enforces every add and every remove on its own: the
adds have to fit *before* the removals happen. Four entries, a maximum of five, two adds and one
`null` is therefore `cannotAdd`, although the final count would be five — an agent that needs the
room removes first, in a turn of its own, and the message says so.

**Per record**, the keys are field names — never addresses — and the rules are the ones one level up:
they are written in the entry's own **field order**, each resolved immediately before its own write,
so a field an earlier key of the same record revealed is written in the same call; **one bad field
skips that field and the rest of the record is written**; a key that names nothing is
`unknownQuestion` at `medications[0].colour`; a hidden or disabled field is `notAskable`; a field
that is a container takes its own value form ([Nested containers](#nested-containers)); the comment
key works here too
(`{ kind: "other", "kind-Comment": "Ferret" }`). An entry an earlier patch of the same call hid is
`notAskable` at `medications[1]`.

Every add and every removal is re-checked immediately before it happens — the permission may have
changed since the pre-check, and the data-level calls the interview uses do not read it themselves —
and a handler of the survey that refuses one (`onMatrixRowAdding`, `onDynamicPanelRemoving`) is
`cannotAdd` / `cannotRemove` at that position. A refused **removal** does not stop the other
removals of the call; a refused **add** does stop the adds after it, whose positions have moved.
Removing never prompts, for the reason the [summary step](#the-summary-step) gives.

After every write of the key the container validates itself: `hasKeysDuplicated` lives in the
container's own validation and nowhere a field's own validation reaches, so a patch that turns a
`keyName` field into a duplicate would otherwise leave no error anywhere. That run also puts
"Response required." on every empty required field of every entry — including the entry that was just
added, which nobody has been asked for yet — so the errors it puts on inputs that were empty before
the call and were not written by it are dropped again. **An empty required field is work in the next
`describeAll()`, not an error of this call**, and an error at `complete()`.

**When a container is listed.** It is *answered* when it holds at least one entry, and *valid* when
neither it nor any field of any entry carries an error or a required error — a read of persisted
state, never a validation run. It is listed while it is not both, and always while it is `disabled`.
An empty **optional** field does not make it invalid, so a container whose entries are filled as far
as the survey demands drops out of `items`, and `current` — the first item of `items` an agent may
write to — moves on. The `done` gesture of single mode is not consulted: an agent has none, exactly
as it has no `skip`. The other way round, **a batch write drops a `done`** the interviewee said
earlier, so a host that mixes the two modes on one interview gets the summary step back — growing,
shrinking or editing the list re-opens it, whichever mode did it.

A three-turn transcript, in the style of the pet survey:

```js
iv.describeAll();
// items: medications, required, with no entries yet - "canAdd: true" and the template

await iv.answerAll({
  medications: [
    { name: "Aspirin", dose: "10 mg" },
    { name: "Ibuprofen", dose: "twice a day" },
  ],
});
// errors:
//   - name: "medications[1].dose"   message: Please enter a number followed by a unit
// items: medications, with two entries and the error on the second one's dose

await iv.answerAll({ medications: [null, { dose: "400 mg" }] });
// the patch lands on the entry that was at position 1 although position 0 is being removed:
// patches run first, and a position names the entry it named when the document was read
// errors: []   items: []   current: null

await iv.complete();
// completed: true
// data: { medications: [{ name: "Ibuprofen", dose: "400 mg" }] }
```

### Nested containers

A container inside an entry, or inside a fixed-shape container, is described and filled **exactly as a
root container is**, at any depth: a dynamic panel of orders whose template holds a dynamic matrix of
items, a dynamic panel in a matrix's detail panel, a multiple text in a template, a dynamic panel in a
composite. The entry's record lists the nested container as a field, and that field *is* the
container record — `entries`, `template` and `canAdd`, or `fields`, or `rows`:

````markdown
```yaml
items:
  - name: orders
    type: paneldynamic
    title: Orders
    required: false
    entries:
      - index: 0
        canRemove: true
        fields:
          - name: ref
            type: text
            title: Reference
            required: false
            value: PO-1
          - name: items
            type: matrixdynamic
            title: Items
            required: true
            entries:
              - index: 0
                canRemove: true
                fields:
                  - name: sku
                    type: text
                    title: SKU
                    required: true
                    value: A-1
                  - name: qty
                    type: text
                    title: Quantity
                    required: false
                    inputType: number
                    constraints:
                      min: 1
                    value: 0
                    error: The value should not be less than 1
              - index: 1
                ...
            template:
              - name: sku
                ...
            canAdd: true
    template:
      - name: ref
        ...
      - name: items
        type: matrixdynamic
        title: Items
        required: true
        template:
          - name: sku
            ...
        canAdd: true
    canAdd: true
```
````

* A field that is a container keeps the field keys — `name` relative to its owner, `error` for its own
  first error (`MinRowCountError`, a required container with no entries, a duplicated key) — and has
  **no `value`**: its value is what its entries and fields say. There is no `entry` key anywhere; the
  position says which entry.
* **A container inside a `template` is a declaration**, as the template is: `template` and `canAdd`, or
  `fields` or `rows`, read from the template's own question, and never `entries`, a `value` or an
  `error`, at any depth. What the template section says — a `visibleIf` inside it has not run,
  `choicesFromQuestion` is empty, the entry's own record is the truth — holds one level down. `canAdd`
  there is what the template's container reports, which is what a new entry's container will report
  before anything is written.
* A matrix's **detail panel** works the same way: its questions follow the cells in every visible row,
  and a container among them is a nested record like any other.

```yaml
# a dynamic matrix whose detail panel holds a dynamic panel of notes
entries:
  - index: 0
    canRemove: true
    fields:
      - name: sku
        ...
      - name: notes
        type: paneldynamic
        title: Notes
        required: false
        template:
          - name: text
            ...
        canAdd: true
```

**The value.** Inside a record, a key whose field is a container takes **that container's own value
form** — a list by position for a dynamic one (an object patches, a position past the count adds,
`null` removes, a single object is wrapped), an object of fields for a fixed-shape one, an object of
row objects for a matrix dropdown. It is the shape the value has in `data`, at every level:

```js
await iv.answerAll({
  orders: [
    { ref: "PO-1", items: [{ qty: 2 }, null, { sku: "C-3", notes: [{ text: "fragile" }] }] },
    { ref: "PO-2", items: [{ sku: "D-4" }] },   // position 1 is past the count: add, then fill
  ],
});
```

**`null` or `undefined` for a container leaves it alone, wherever the key sits** — the rule of a root
key, and *not* the rule of a plain field, which `null` clears. "Clear it all" is a list of `null`s, or
an object of `null` fields. The schema still offers `null` for such a field, and it then means
nothing. Anything else of the wrong shape — a string, a number, an array where an object belongs — is
`badRecord` at the field's address, `orders[0].items`, and that field alone is skipped. The comment
key works for a plain field at every level and never for a container: `items-Comment` inside an
`orders` record is `unknownQuestion`.

**The write** is the same functions one level down: a nested list is resolved, pre-checked and
patched, added to and removed from exactly as a root list is, then the nested container validates
itself, and a nested fixed-shape container is written field by field in its own order. A nested list
refused as a whole — it does not fit (`cannotAdd` at `orders[0].items[2]`), it names an entry that
cannot go — skips **that field** and the rest of the outer record is written. **Positions are entries
at every level**: the outer positions are resolved before anything is written, an inner list is
resolved when its field's turn comes, against the entry as the earlier fields of the same record left
it, and outer removals still run last — an inner list written into an entry a later `null` of the same
call removes is written and then removed with its entry. Field order holds across kinds: `ref` is
written before `items` because the entry lists it first, so a `setValueIf` of a cell that reads
`{panel.ref}` sees the reference sent in the same record.

Validating a container validates everything below it, so the rule that an empty required field of a
new entry is **work in the next document, not an error of the call** applies at every depth, with one
snapshot of "what was already invalid" per call: an empty required `sku` of a row added inside an
order added in the same call is listed without a value and becomes an error at `complete()`, under
`orders[1].items[0].sku`.

**The addresses of the result** are longer and nothing else: a field's errors under
`orders[0].items[0].qty`, a nested container's own errors under `orders[0].items`, the refusals under
the address of what was refused. The change report is taken over the inventory's addresses as before
(`becameVisible: ["orders[1].ref", "orders[1].items[0].sku", "orders[1].items"]` for the call above).

**The predicates are recursive**: a root is answered when it holds an entry or is not empty, and valid
when neither it nor any field at any depth carries an error or a required error, a nested container's
own included. An empty *optional* nested container does not make it invalid. So a root whose only
problem is an empty required field three levels down stays in `items`, and `current` stays on it.

#### The depth ceiling

A container at depth 20 — twenty containers above it — is the one thing a batch cannot fill. It is
described with `unsupported: true` and `reason: "batch"`, with no `entries`, `template` or `fields` of
its own, and a key for it is `notAskable`; single mode has no item below it either, and the address
grammar refuses what lies there. It exists so that the grammar, the inventory and the two documents
agree on what exists, and it is the only place `reason: "batch"` is still written. Nothing a survey
can express reaches it.

A transcript, in the style of the pet survey:

```js
survey.data = { orders: [{ ref: "PO-1", items: [{ sku: "A-1", qty: 0 }, { sku: "B-2", qty: 1 }] }] };
const iv = await createInterview(survey);
iv.describeAll();
// items: orders - the quantity of its first item carries "The value should not be less than 1"

await iv.answerAll({
  orders: [
    { items: [{ qty: 2 }, null] },                        // fix the quantity, remove the second item
    { ref: "PO-2", items: [{ sku: "C-3", qty: 1 }] },     // add an order with an item
  ],
});
// errors: []   items: []   current: null

await iv.complete();
// completed: true
// data: { orders: [{ ref: "PO-1", items: [{ sku: "A-1", qty: 2 }] },
//                  { ref: "PO-2", items: [{ sku: "C-3", qty: 1 }] }] }
```

## Answer schema

`getAnswerSchema()` returns a JSON Schema for exactly the keys `answerAll()` accepts **right now**,
so an agent's function-calling API constrains what it may send instead of the interview refusing it
afterwards. It is synchronous, it reflects the current state — an agent that answers `hasPet` sees
`petType` in the next schema and not before — and it is built from the item records alone, so what
the document says and what the schema says cannot disagree. A question inside a choice is a plain
property while its choice is selected and absent otherwise, so the schema after a batch that selected
a choice is the one to read next.

```json
{
  "type": "object",
  "properties": { "petType": { "title": "What kind?", "enum": ["Dog", "Cat", "Other"] },
                  "petAge": { "title": "Pet age (years)", "type": "number", "minimum": 0, "maximum": 40 } },
  "required": ["petType"],
  "additionalProperties": false
}
```

Draft 2020-12 keywords only, and no `$schema`: every provider accepts this subset and none of them
fetches a meta-schema at run time. The mapping, per item:

| Item | Schema |
| --- | --- |
| `title`, `description` | `title`, `description` |
| `choices` (and no `choicesUnknown`) | `enum` of the values, `other` included |
| `rateValues` | `enum` of the values |
| `valueType: "string"` | `type: "string"` |
| `valueType: "number"` | `type: "number"` |
| `valueType: "boolean"` | `enum` of the two values — `[false, true]`, or the custom `valueFalse`/`valueTrue` pair. One rule for every question that offers a set, and no special case to get wrong. |
| `valueType: "date"` | `type: "string"` with `format` by `inputType`: `datetime-local` → `date-time`, `time` → `time`, everything else → `date` |
| `valueType: "array"` | `type: "array"`, `uniqueItems: true`, and `items: { enum: [...] }` when the choices can be enumerated |
| `constraints.min` / `max` | `minimum` / `maximum` |
| `constraints.minLength` / `maxLength` | `minLength` / `maxLength` |
| `constraints.minCount` / `maxCount` | `minItems` / `maxItems` |
| `constraints.regex` | `pattern` |
| `constraints.format: "email"`, or `inputType: "email"` | `format: "email"` |
| `constraints.step` | `multipleOf`, **only** when `min` is `0` or absent — JSON Schema counts multiples from zero and the model steps from `min`, so anywhere else the step goes unreported rather than wrong |
| `comment` | a second property, `<name>` + `settings.commentSuffix`, of `type: "string"` |
| `required: true` | the name is in `required` |
| `disabled: true` | `readOnly: true`, and never in `required` |
| `unsupported: true` | not in the schema at all — there is no value an agent could send |
| `fields` (a [fixed-shape container](#fixed-shape-containers-as-objects)), at any depth | `type: "object"`, one property per field, `additionalProperties: false`, and a fixed English `description` after the question's own. No `required` inside: a patch sends only what changes, and what is required is in the document and enforced at `complete()`. |
| `rows` (a matrix dropdown), at any depth | the same, one level deeper: a property per row, each `type: "object"` with the row's fields |
| `entries` (a [dynamic container](#dynamic-containers-as-records)), at any depth | `type: "array"`, `maxItems` from `constraints.maxCount`, and one element schema for every position: `{ "anyOf": [ { "type": "object", "properties": …, "additionalProperties": false }, { "type": "null" } ] }`. The properties are the **union**, by field name, of the `template` records and the fields of every entry, each nullable. No `minItems` — a patch is legitimately shorter than the minimum — and the minimum goes into the fixed English `description` along with the current number of entries. A [nested](#nested-containers) list serves every entry of its owner, whose inner lists have different counts, so its description names no count ("a position past the entries the document lists for this entry adds one"). |
| a field that is a container | the property its root twin would be, nested where the field sits and nullable like every field. The union of an element schema merges the records of one name before it builds the property: a nested list takes the template and the entries of every record as one template, a nested object the fields of every record, so the enum of a column two levels down is the union of what every entry offers, and `maxItems` is the loosest of the records'. A name that is a plain field in one record and a container in another is left out. |
| a field of a container | the per-item mapping above, wrapped as `{ "anyOf": [ …, { "type": "null" } ] }` — a field is cleared by sending `null` for it, and a schema that forbade `null` would refuse the agent before the interview could. `anyOf`, not `type: ["string", "null"]`: the strict function-calling modes accept the first and not always the second. Comment keys are nullable the same way; `unsupported` fields are left out. |

A date bound and a mask have no draft 2020-12 keyword, and an `ExpressionValidator` has none either.
They go into `description` as text, in brackets after the question's own description:
`"Your birthday (min 2020-01-01, max 2030-12-31)"`.

## Tools

`getTools()` returns three tool definitions in the **MCP shape** — `name`, `description`,
`inputSchema` — which every function-calling API accepts after renaming one key.

| `name` | `inputSchema` | `callTool` runs |
| --- | --- | --- |
| `describe_survey` | `{ type: "object", properties: {} }` | `describeAll()` |
| `answer_survey` | `getAnswerSchema()`, as it was when `getTools()` was called | `answerAll(args)` |
| `complete_survey` | `{ type: "object", properties: {} }` | `complete()` |

`getTools({ prefix })` prepends `prefix` to all three names, so one server can expose several surveys
through one set of tools; `callTool(name, args)` takes the prefixed name back and rejects an unknown
one with `Error("unknown tool: <name>")`. The definitions are plain data — nothing in this module
talks to a network, and nothing remembers the prefix.

The descriptions are fixed English on purpose. Every other text the interview produces is a localized
model string, but these are not shown to the interviewee: they are read by the agent's own model,
which is prompted in whatever language the host chose, and a tool description that changed with the
survey's locale would change the agent's behaviour with it.

An MCP server is the three definitions and nothing else:

```js
// with an MCP server object of your SDK of choice
iv.getTools().forEach(tool => {
  server.tool(tool.name, tool.description, tool.inputSchema, args => iv.callTool(tool.name, args));
});
```

The two other shapes are a rename:

```js
const openai = iv.getTools().map(t =>
  ({ type: "function", function: { name: t.name, description: t.description, parameters: t.inputSchema } }));
const anthropic = iv.getTools().map(t =>
  ({ name: t.name, description: t.description, input_schema: t.inputSchema }));
```

## A survey over HTTP, in one file

There is no hosted session service here and there will not be one: an interview is one object in one
process, and where it lives between two requests is the integrator's decision. This is the whole of
it for a server that keeps one interview per session id in memory — `node:http`, `node:crypto`,
`survey-core` and `survey-core/interview`, nothing else.

```js
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { SurveyModel } from "survey-core";
import { createInterview } from "survey-core/interview";

const sessions = new Map();

function readBody(req) {
  return new Promise((resolve, reject) => {
    let text = "";
    req.on("data", chunk => { text += chunk; });
    req.on("end", () => { try { resolve(text ? JSON.parse(text) : {}); } catch (e) { reject(e); } });
    req.on("error", reject);
  });
}

function send(res, status, body) {
  const isText = typeof body === "string";
  res.writeHead(status, { "content-type": isText ? "text/markdown" : "application/json" });
  res.end(isText ? body : JSON.stringify(body));
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const id = url.searchParams.get("session");
  const iv = sessions.get(id);
  try {
    if (url.pathname === "/start") {                       // POST -> { session, describe }
      const created = randomUUID();
      const started = await createInterview(new SurveyModel(surveyJson));
      sessions.set(created, started);
      return send(res, 200, { session: created, describe: started.describeAll() });
    }
    if (!iv) return send(res, 404, { error: "unknown session" });
    if (url.pathname === "/describe") return send(res, 200, iv.describeAll());          // GET
    if (url.pathname === "/answer") return send(res, 200, await iv.answerAll(await readBody(req)));  // POST
    if (url.pathname === "/complete") {                                                 // POST
      const done = await iv.complete();
      if (done.completed) { iv.dispose(); sessions.delete(id); }
      return send(res, 200, done);
    }
    send(res, 404, { error: "unknown path" });
  } catch (error) {
    send(res, 500, { error: String(error) });
  }
}).listen(3000);
```

`POST /start` answers with the session id and the first document; `GET /describe?session=…` renders
the current one; `POST /answer?session=…` takes the object `answerAll()` takes and answers with the
result; `POST /complete?session=…` finishes. A real server adds auth, a time-to-live on the map, and
`survey.data` written somewhere that survives a restart — none of which the interview has an opinion
about.

## Source layout

| File | Responsibility |
| --- | --- |
| `interview-types.ts` | The public interfaces of the whole module: options, item, summary, action, error, changes, result, document, tool definition. |
| `interview.ts` | `createInterview` — model intake, the one property the interview sets, the start page — and the `Interview` class: the selection rule, the four calls of single-input mode, the pre-checks and the documents. |
| `interview-items.ts` | The inventory over the model's single inputs, including the questions inside a selected choice, the item records, the three predicates (answered / valid / errors) and the one function that makes an input current. |
| `interview-address.ts` | The address grammar in both directions: derived from a nested question by walking its containers, and resolved against the live model. The twin of the tester's `test-targets.ts`. |
| `interview-summary.ts` | A dynamic container's summary step: the entries, the add caption and the "no entries" line as the model words them, and the four actions an answer can name. |
| `interview-batch.ts` | The same inventory read at the root level: which roots batch mode can write, the list of items a batch document carries and when a root is listed. |
| `interview-containers.ts` | One describer and one writer for "a container at an address", whatever it holds and wherever it sits, live or declared, plus the recursive validity. The root code and the field code both go through it; the field code reaches it through a parameter, so there is no import cycle. |
| `interview-fields.ts` | A fixed-shape container as an object of fields: the field records read from the live structure, the per-field write, and the value pre-checks all three modes of writing share. A field that is a container is handed to the recursion it is given. |
| `interview-records.ts` | A dynamic container as a list of entry records: the entries and the template read from the live structure, and the patch / add / remove of one call, planned before anything is written. The fields of an entry are `interview-fields.ts`, reused per entry. |
| `interview-detail.ts` | The one place a row's detail panel is brought into being: the pass every settle starts with — over every matrix the interview reaches, on the page and inside a selected choice — and the panel of the one row a batch record is about to write. A leaf that nothing describing or reading imports. |
| `interview-schema.ts` | `createAnswerSchema()`: the item records as a JSON Schema. A pure function of the records — it never looks at the model. |
| `interview-tools.ts` | The three tool definitions and the name matching behind `callTool`. Plain data; nothing here talks to a network. |
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
