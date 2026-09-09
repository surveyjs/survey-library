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
| `interview.answer(value)` / `answer(name, value)` | Writes one answer — to the current item, or to the item at the [address](#addresses) `name` — and reports the consequences: the errors, what became visible, hidden or required, the next item, and the document. On a [summary step](#the-summary-step) it takes an action (`{ action: "add" }`, `remove`, `edit`, `done`) instead of a value. | tier 04 / 06 |
| `interview.skip()` | Leaves the current item unanswered and moves on. Refused for a required item. | tier 04 |
| `interview.complete()` | Validates every item, then calls `tryComplete()`. | tier 04 |
| `interview.describeAll(): string` | Every question that still needs an answer, at once, for batch mode. | tier 05 |
| `interview.answerAll(values)` | Writes many answers by address in one call. | tier 05 |
| `interview.getAnswerSchema(): any` | JSON Schema for the answers `answerAll()` accepts right now. | tier 05 |
| `interview.getTools(options?): Array<IInterviewToolDefinition>` | MCP-shaped tool definitions, usable for function calling as is. `{ prefix }` renames them. | tier 05 |
| `interview.callTool(name, args): Promise<any>` | Runs one of them, by the name the definition carries. | tier 05 |
| `toYaml(value, options?): string` | The emitter the documents are written with — plain data in, YAML out. Exported so that a host rendering its own text from the item records quotes exactly the way `describe()` does. | tier 03 |
| `InterviewErrorCodes` | The frozen table of the codes the interview raises itself. A host localizes on the code. | tier 04 |

Nested inputs — inside dynamic panels, matrices, multiple text and custom components — are answered
in single-input mode, each at its own [address](#addresses). Batch mode fills a container whose value
is one object with a fixed set of keys — a single-choice matrix, a matrix dropdown, a multiple text,
a composite — as that object, and reports the rest instead of filling them (see
[Fixed-shape containers as objects](#fixed-shape-containers-as-objects)).

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
| `notAskable` | The item or the field exists but cannot take a value: an `enableIf` turned it off (`disabled`), it has no plain input — a file, a signature, an image picker (`unsupported`), it is a container `answerAll()` cannot fill — a dynamic panel, a dynamic matrix, or a container nested inside another container (`reason: "batch"`) — or the survey hid it, an earlier key of the same `answerAll()` included. The message says which. |
| `notAChoice` | The value is not among the choices the item lists. Checked per element for a multi-select; `other` and `none` are choices like any other; skipped entirely when the item says `choicesUnknown`. |
| `notANumber` | A string that is not a number, for an item whose value is a number. |
| `badAction` | An action object (`{ action: "add" }`) sent to an item that takes a value, a plain value sent to a [summary step](#the-summary-step), an action the step does not offer, or a `remove` / `edit` without an `index` of an entry that exists. |
| `badAddress` | `answer(name, value)` with text that is not an [address](#addresses) at all, or with an index past the entries the container holds now. The entry a well-formed index names into thin air is created by the summary step's `add`, not by answering. |
| `badRecord` | The value `answerAll()` was given for a [fixed-shape container](#fixed-shape-containers-as-objects), or for a row inside one, is not an object of field values — a string, a number, an array. `null` and `undefined` are not a mistake: they leave the container alone. |
| `cannotAdd` | `{ action: "add" }` on a container that has reached its maximum count or has adding turned off. |
| `cannotRemove` | `{ action: "remove" }` on an entry the model offers no remove button for. |
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
that was selected, at the end of `createInterview` and of every call that writes. When there is
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
| a question in panel *i* of a dynamic panel | `medications[0].dose` | `data.medications[0].dose` |
| a cell in row *i* of a dynamic matrix | `items[0].quantity` | `data.items[0].quantity` |
| a cell of a matrix dropdown | `matrix.row1.column1` | `data.matrix.row1.column1` |
| a row of a single-choice matrix | `satisfaction.price` | `data.satisfaction.price` |
| an item of a multiple text | `contact.email` | `data.contact.email` |
| a question of a composite component | `address.street` | `data.address.street` |
| the summary step of a dynamic container | `medications` | `data.medications`, the whole array |
| nested containers | `orders[1].items[0].sku` | as written |
| a container whose nesting the host turned off | `medications` | the whole array or object |

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
  is one record with `unsupported: true` and `reason: "batch"`, and so is a container **nested
  inside** another container. The questions inside either have no batch address at all; they are
  answered in single-input mode, which handles every type. Filling a dynamic container in one call
  is a follow-up issue.
* a question with **no plain input** — a file to upload, a signature to draw, an image picker — is
  `unsupported: true` with **no** `reason`. The distinction is the point of the key: `reason:
  "batch"` says *this version* cannot fill it, no reason at all says nothing ever will.
* an item an `enableIf` turned off is listed with `disabled: true` and refused by `answerAll()`; a
  question that is read-only by property is not an item and is not listed.
* items the interviewee **skipped** in single mode are listed. Skipping is a gesture of a
  conversation with a person; an agent that wants to leave a question blank leaves it blank.

### `answerAll(values)`

Keys are item addresses, plus `<address>` + [`settings.commentSuffix`](#the-comment-key) for an item
that accepts a comment. Every key is resolved first — an unknown one is `unknownQuestion`, a
container is `notAskable` — and the accepted ones are then written **in item order, not in the order
the object carries them**: a trigger or a `setValueIf` that depends on an earlier question has to see
it first, and an agent's batch is a set of answers rather than a sequence of gestures. A comment is
written with the item it belongs to.

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

One consequence of resolving the keys up front: a question that is invisible when the call starts
cannot be answered in the same call that reveals it. It is in the next document, and the loop below
sends it on the next turn.

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
  **matrix dropdown** row in column order, followed by the questions of its detail panel once the
  model has created that panel — the interview never opens one; the editors of a **multiple text**;
  the visible content questions of a **composite**.
* The container's own first error — `RequiredInAllRowsError`, `EachRowUniqueError`, a required
  container left empty — is on the record's `error`, under its own address in `errors`. A field's
  errors are under the field's address: `contact.email`, `matrix.row1.column1`.
* What the survey hid is not there: a row `rowsVisibleIf` hid, a column or a content question a
  `visibleIf` hid. A field an `enableIf` turned off is listed with `disabled: true` and refused.
* **A container nested inside a container** — a dynamic panel in a composite, a multiple text in a
  detail panel — is described in place with `unsupported: true` and `reason: "batch"`, with no
  `fields` of its own, and a key for it is `notAskable`. There is no recursion.
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

## Answer schema

`getAnswerSchema()` returns a JSON Schema for exactly the keys `answerAll()` accepts **right now**,
so an agent's function-calling API constrains what it may send instead of the interview refusing it
afterwards. It is synchronous, it reflects the current state — an agent that answers `hasPet` sees
`petType` in the next schema and not before — and it is built from the item records alone, so what
the document says and what the schema says cannot disagree.

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
| `fields` (a [fixed-shape container](#fixed-shape-containers-as-objects)) | `type: "object"`, one property per field, `additionalProperties: false`, and a fixed English `description` after the question's own. No `required` inside: a patch sends only what changes, and what is required is in the document and enforced at `complete()`. |
| `rows` (a matrix dropdown) | the same, one level deeper: a property per row, each `type: "object"` with the row's fields |
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
| `interview-items.ts` | The inventory over the model's single inputs, the item records, the three predicates (answered / valid / errors) and the one function that makes an input current. |
| `interview-address.ts` | The address grammar in both directions: derived from a nested question by walking its containers, and resolved against the live model. The twin of the tester's `test-targets.ts`. |
| `interview-summary.ts` | A dynamic container's summary step: the entries, the add caption and the "no entries" line as the model words them, and the four actions an answer can name. |
| `interview-batch.ts` | The same inventory read at the root level: which roots batch mode can write, which are containers it only reports, and the list of items a batch document carries. |
| `interview-fields.ts` | A fixed-shape container as an object of fields: the field records read from the live structure, the per-field write, and the value pre-checks all three modes of writing share. |
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
