---
title: What each converter maps
description: The Form.io and JSON Schema (JSONForms, RJSF, bare) constructs survey-converter maps to SurveyJS, and the report code for each one it drops, refuses or guesses.
---
# What each converter maps

This page lists, per source format, what becomes SurveyJS JSON and what goes to the
[report](../README.md#the-report) instead. A construct that is not listed here and does not
appear in the report is ignored without a trace: that is a gap, so file it.

Report codes are written without their prefix in the tables below (`assumed-conditional` is
`formio.assumed-conditional`). The full lists are at the end of each section.

Two rules hold for both converters:

* **Names.** A question, panel or page is named after its source key. A name that is already
  taken gets `_1`, `_2` and so on, and every expression the converter writes uses the final
  name. Names are compared without regard to case, as survey-core compares them.
* **Conditions.** A condition becomes an expression only when the translation is exact.
  Otherwise the element gets no condition and stays visible, and the report says `assumed`.
  A field that is always shown is a safer loss than one that shows or hides at the wrong time.
  A value that ends in `\` or holds `\"` cannot be written as a survey-core string literal, and
  survey-core's expressions have no exponent, so a number such as 1e-7 or 1e+21 cannot be
  written either: a condition comparing with one of them is not translated.

## Form.io

### Form

| Form.io | SurveyJS |
| --- | --- |
| `title` | `title` |
| `display: "form"` or `"pdf"` | One page, `page1`. It is named after the fields, so a field keyed `page1` keeps its key and the page becomes `page1_1`. |
| `display: "wizard"` | One page per top-level component. A `panel`, `fieldset`, `well` or `container` gives its children to the page directly, with its title, `hidden`, `disabled` and condition. A top-level `button` gives no page, and nor does a `columns`, `table` or `well` whose components all give nothing. Any other component becomes the page's only element. |

### Components

| Form.io `type` | SurveyJS | Notes |
| --- | --- | --- |
| `textfield` | `text` | `inputMask`, see [Options](#options) |
| `email`, `url`, `phoneNumber`, `number`, `password` | `text` | `inputType` `email`, `url`, `tel`, `number`, `password`. A `number` with decimals and a `phoneNumber` get a mask, see [Options](#options). |
| `datetime`, `day`, `time` | `text` | `inputType` `datetime-local`, `date`, `time`. A `datetime` without its time or its date is `date` or `time`, see [Options](#options). |
| `currency` | `text` | Currency mask, see [Currency](#currency) |
| `textarea` | `comment` | |
| `checkbox` | `boolean` | With `inputType: "radio"` and a `name`, see [Radio-type checkboxes](#radio-type-checkboxes) |
| `selectboxes` | `checkbox` | |
| `radio` | `radiogroup` | |
| `select` | `dropdown`, or `tagbox` when `multiple` | See [Select data sources](#select-data-sources) |
| `file` | `file` | |
| `signature` | `signaturepad` | |
| `content`, `htmlelement` | `html` | `html` or `content` becomes the markup. See [HTML templates](#html-templates). |
| `hidden` | `text` | `visible: false` and `clearIfInvisible: "none"`, so its value stays in the data. Its own condition, or logic that hides it, is reported `assumed-conditional`: a `visibleIf` would show it. |
| `survey` | `matrix` | `rows` from `questions`, `columns` from `values`. The value `{ question: value }` has the same shape. `validate.required` also sets `eachRowRequired`, as Form.io needs every question answered. A condition that reads it is reported `assumed-conditional`. |
| `tags` with `storeas: "array"` | `tagbox` | `allowCustomChoices: true`. `maxTags` becomes `maxSelectedChoices`. A string default is split on `delimeter`. |
| `form` with inline `components` | `panel` | See [Containers](#containers) |
| `panel`, `fieldset`, `well`, `container` | `panel` | See [Containers](#containers) |
| `columns`, `table` | `panel` | No title. The column and table layout is reported `dropped-styling`, and the cells' components follow each other in order. |
| `tabs` | `panel` | See [Containers](#containers) |
| `datagrid`, `editgrid` | `paneldynamic` | See [Data grids](#data-grids) |
| `button` | Nothing | SurveyJS navigation submits the survey. Reported `dropped-vendor-meta`. Its condition, `customConditional`, `logic` entries and computed values decide when the form can be submitted, and are reported (`assumed-conditional`, `custom-conditional`, `custom-logic`, `custom-value`) with no target. |

Any other type in Form.io's builtin set (`address`, `recaptcha`, `resource`, `sketchpad`,
`select2`, `nested`, `custom`, `datamap`, `tree`) is reported `unsupported-component` and
produces no element. So is a `tags` stored as a string (the default) and a `form` with no
inline `components`, which only names a form stored elsewhere. A type outside that set, or a
component with no `type`, is reported `unknown-component`, the drift alarm. The builtin set is
vendored in `src/formio/vendor/` and checked by `npm run corpus:refresh`.

### Component properties

| Form.io | SurveyJS | Notes |
| --- | --- | --- |
| `key` | `name` | |
| `label` | `title` | Not on `html` |
| `description` | `description` | |
| `placeholder` | `placeholder` | `text` and `comment` only |
| `defaultValue` | `defaultValue` | `null` and `""` give none. `null` items are removed from an array. A `selectboxes` object (`{ a: true, b: false }`) becomes the array of checked keys. A `day`, `time` or `datetime` default is read in Form.io's format, see [Date and time defaults](#date-and-time-defaults). A radio or select default is cast as its choices are, see `dataType` in [Options](#options). |
| `hidden: true` | `visible: false` | A condition still overrides it, as in Form.io |
| `disabled: true` | `readOnly: true` | |
| `clearOnHide` | `clearIfInvisible` | See [Hidden values](#hidden-values) |
| `validate.required` | `isRequired` | |
| `validate.minLength`, `maxLength` | `text` validator | |
| `validate.min`, `max` | `numeric` validator | |
| `validate.pattern` | `regex` validator | |
| `validate.customMessage` | Each validator's `text`, and `requiredErrorText` | `requiredErrorText` only when the field is required, statically or by a converted `requiredIf` |
| `validate.minSelectedCount`, `maxSelectedCount` (selectboxes) | `minSelectedChoices`, `maxSelectedChoices` | |
| `data.values` (select), `values` (radio, selectboxes) | `choices` | `{ value, text }` from `value` and `label`. An empty value is skipped. |
| `inline: true` (radio, selectboxes) | `colCount: 0` | |
| `multiple` on a text-like field | Nothing | SurveyJS `text` and `comment` hold one value. Reported `unsupported-multiple`. A one-item default is kept as a single value. |

### Containers

* **`panel`** is titled with `title`, falling back to `label`.
* **`fieldset`** is titled with `legend`.
* **`container`** is titled with `label`, unless `hideLabel` is set. Its children's data
  nests under its key, which matters for [references](#references). The panel keeps them at
  the level around it, so the data has another shape, and each `container` is reported
  `assumed-container-data`.
* **`form` with inline `components`** (a nested form) has no title. Form.io nests its data
  under `<key>.data`, so it is reported `assumed-container-data` too. A reference inside it
  reads the nested form's own data and cannot name a field outside it.
* **`well`, `columns` and `table`** have no title. One whose components all give nothing,
  such as only buttons, gives no element, and its condition, `logic` and computed values are
  reported with no target, as a button's are. A `panel`, `fieldset` or `container` stays even
  when empty.
* **`tabs`** becomes an untitled panel holding one panel per tab, titled with the tab's
  `label`, so every field stays on the same page. A tab with no fields produces nothing. The
  tab strip itself is reported `dropped-styling`.

A container, a tab and a wizard page take their names after their children, so a field keeps
a key its container also has. A field of a nested `form` gives way to a field of the form
around it with the same key: the nested field takes the suffix.

### Data grids

`datagrid` and `editgrid` always become a `paneldynamic`: the grid's components form
`templateElements`, `label` is the title, and `validate.required` sets `isRequired`. A grid
can nest panels and containers that a matrix cannot hold, and the definition does not say
whether a grid is tabular, so each one is reported `assumed-datagrid-model`.

The template is a name pool of its own, as survey-core scopes template names, so a field in
the grid keeps a key that a field outside it also has. survey-core's linter still reports such
a pair as `name/duplicate`.

| Form.io | `paneldynamic` | Notes |
| --- | --- | --- |
| `validate.minLength`, `maxLength` | `minPanelCount`, `maxPanelCount` | |
| `addAnother` | `addPanelText` | |
| `disableAddingRemovingRows: true` | `allowAddPanel: false`, `allowRemovePanel: false` | |
| Initial rows | `panelCount` | A `datagrid` opens with one row, or `validate.minLength` rows, so it gets `panelCount`. With `initEmpty` (or `noFirstRow`) it opens with none, and so does an `editgrid`, which is `paneldynamic`'s default. `initEmpty` together with `minLength` is reported `unsupported-option`: `minPanelCount` would open that many rows. |
| `validate.customMessage` | `requiredErrorText` | On a grid that is not required, statically or by a converted `requiredIf`, reported `unsupported-option` |
| `reorder: true` | Nothing | Reported `unsupported-option` |

### Currency

A `currency` field becomes a `text` question with `maskType: "currency"`, and `maskSettings`
as follows:

| Form.io | `maskSettings` | Notes |
| --- | --- | --- |
| `currency` (an ISO code) | `currencySymbol` | Resolved with `Intl`: `USD` gives `$`. An unknown code is reported `assumed-currency-format`. |
| `requireDecimal: true` | `showTrailingZeros: true` | |
| `decimalLimit` | `precision` | |
| `prefix`, `suffix` | `currencyPattern` | Wraps the currency's own layout, such as `@#` or `@ #`. An affix that holds a digit, `#`, `@` or `-` cannot be written and is reported `assumed-currency-format`. |

### Options

Only a value other than Form.io's default (its component `schema()`) counts. Pure layout keys
(`labelPosition`, `labelWidth`, `optionsLabelPosition`, `widget`, `customClass`) are ignored.

| Type | Form.io | SurveyJS | Notes |
| --- | --- | --- | --- |
| `datetime` | `enableTime: false`, `enableDate: false` | `inputType: "date"`, `"time"` | The default keeps the part the input reads. |
| `datetime` | `datePicker.minDate`, `maxDate` (or under `widget`) | `min`, `max` | A date literal only. Anything else, such as a `moment()` expression, or any limit on a time input, is reported `unsupported-option`. |
| `number` | `decimalLimit`, `requireDecimal` | A numeric mask: `precision`, `showTrailingZeros` | `precision` is 2 under `requireDecimal` alone, as in Form.io. Without `delimiter`, `thousandsSeparator: ""`. The input becomes a text input, which a mask needs. |
| `textfield`, `phoneNumber` | `inputMask` | `maskType: "pattern"`, `saveMaskedValue: true` | `9` stays `9`, `A` becomes `a`, `*` becomes `#`, and a literal `#` is escaped. Form.io stores the value with the mask's literals, so the mask saves them too. A `phoneNumber` with no `inputMask` gets Form.io's default `(999) 999-9999`. Reported `unsupported-option`, with no mask: a lowercase `a` (a lowercase letter in Form.io, with no survey-core token), a `\` (survey-core cannot show one), and on a `textfield` a `#`, `&`, bracket or `\|`, which the Inputmask library Form.io types through reads as its own tokens. |
| `radio`, `select` | `dataType: "number"`, `"boolean"`, or none (`"auto"`) | Choice values and the default in that type | Cast as Form.io casts them, so condition literals that read the field are cast too. With no `dataType`, a value written as JavaScript writes a number becomes that number, and `"true"` or `"false"` (any case on a select) a boolean. Values that survey-core would read as one value after the cast, such as `"01"` and `"1"`, are reported `unsupported-option` at `/dataType`, even when the key is absent, and kept as written. A URL source with `dataType` `"number"` or `"boolean"` is reported `unsupported-option`. |
| `file` | `multiple`, `fileMaxSize`, `filePattern` | `allowMultiple`, `maxSize` in bytes, `acceptedTypes` | `acceptedTypes` takes `*.ext`, `.ext` and `type/sub` globs. A size or pattern that does not parse is reported `unsupported-option`. |
| `signature` | `width`, `height`, `penColor`, `backgroundColor`, `minWidth`, `maxWidth` | `signatureWidth`, `signatureHeight`, `penColor`, `backgroundColor`, `penMinWidth`, `penMaxWidth` | A size not in pixels, or a pen width that is not a positive number, is reported `dropped-styling`. |
| `textarea` | `rows` | `rows` | |

Reported `unsupported-option`, at the option, with nothing written: `validate.minWords` and
`maxWords`, `unique`, `kickbox.enabled`, `allowMultipleMasks` (no mask is written),
`persistent` other than `true`, a textarea `editor` (the value is code or HTML), and a `file`
`storage` other than base64, SurveyJS's default.

Reported `dropped-styling`, as presentation the respondent reads: `tooltip`, `errorLabel`, and
`prefix` and `suffix` outside `currency`. A `tooltip` on a titled panel or a wizard page is
reported too.

### Date and time defaults

A default is written as the ISO value the input reads:

* a `day` `MM/DD/YYYY`, or `DD/MM/YYYY` with `dayFirst`, gives `YYYY-MM-DD`. Form.io's empty
  day, `00/00/0000`, gives none, silently;
* a `time`, 24-hour or `h:mm AM`, with or without seconds, gives `HH:mm`;
* a `datetime`, a local ISO date and time, gives `YYYY-MM-DDTHH:mm`. Without a `defaultValue`,
  `defaultDate` is read the same way.

Anything else, a value with a time zone included, gives no default and is reported
`assumed-default-value`.

### HTML templates

Form.io renders `{{ … }}` in `html` and `content` as a template. `{{ data.x }}` and
`{{ data.a.b }}` become `{name}` (or `{panel.name}` inside a grid) when the path names a field,
and survey-core pipes the value. Any other template, a path that names no field, and a
`{% … %}` code block stay as written and are reported `custom-template`, once per component.
survey-core still reads the inner braces of what stays as piping.

### Select data sources

| `dataSrc` | SurveyJS |
| --- | --- |
| None, `""` or `"values"` | `choices` from `data.values` |
| `"json"` | `choices` from `data.json`, an array or a string that parses to one. A string item is its own value, and a number item is the string item of its text, cast by `dataType` (with none, it stores the number). An object item takes its value from `valueProperty` and its text from the template, as `titleName` below. An object item with no `valueProperty` gives no choice, and the source is reported `unsupported-data-source`. |
| `"url"` | `choicesByUrl`: `url` from `data.url`, `path` from `selectValues`, `valueName` from `valueProperty`, `titleName` from `template` |
| `"resource"`, `"custom"` and others | Nothing. Reported `unsupported-data-source`. |

For `titleName`, a `template` of exactly `<span>{{ item.x }}</span>` gives `x` (a dotted path
is kept), and no template gives `label`, Form.io's default. Any other template is reported
`assumed-data-source-title` and the default stays. In a URL, `{{ data.x }}` becomes `{x}` and
`{{ row.x }}` inside a grid becomes `{panel.x}`, which survey-core substitutes and reloads on.
A URL with any other interpolation (`{{ limit }}`, say), a path that names no field, or a need
for `authenticate` or request `headers`, is reported `unsupported-data-source`, because
SurveyJS would call it differently.

### Radio-type checkboxes

A `checkbox` with `inputType: "radio"` and a `name` is one option of a radio group: Form.io
stores the checked member's `value` under `name`. Sibling members that share a `name` become
one `radiogroup` named after `name`, at the first member's place and with no title:

* each member gives a choice: `value` (or `key` when absent), with `label` as its text;
* any required member makes the group required;
* a member with `defaultValue: true` gives the group its default;
* a member's own condition would show or hide a single option, which a `radiogroup` choice
  cannot carry here, so it is reported `assumed-conditional`, and each of its `logic` entries
  is reported `custom-logic`.

A condition that names a member's `key` finds no field, because the data lives under `name`.

### Conditions

`conditional` becomes `visibleIf` on a field, panel, data grid, tab set or wizard page. All
three Form.io formats are read. When a component carries more than one, the same one decides
as in Form.io: the simple format, then the legacy one, then JSON logic.

**Simple format** (`{ show, conjunction, conditions }`):

* `conjunction: "all"` joins with `and`, and `"any"` with `or`.
* `show: false` negates the whole expression. A string `show` is parsed as Form.io does.
* An empty `conditions` list means no condition. A condition with no `component` is ignored.
* If one condition cannot be translated, the whole conditional is dropped, and each failed
  condition is reported `assumed-conditional`.

| Operator | Expression |
| --- | --- |
| `isEmpty`, `isNotEmpty` | `{q} empty`, `{q} notempty` |
| `isEqual`, `isNotEqual` | `{q} = v`, `{q} <> v`. On a `selectboxes` field: `contains`, `notcontains`. Not translated on a multiple `select` or a `tags` field. |
| `lessThan`, `lessThanOrEqual`, `greaterThan`, `greaterThanOrEqual` | `<`, `<=`, `>`, `>=`. Form.io matches only a stored number, so they are not translated on a field that may hold text, nor on a multiple field. |
| `includes`, `notIncludes` | `contains`, `notcontains`. Form.io matches a text that contains the literal, and never a number or a boolean. Not translated on `selectboxes`. On a field that may hold a number or a boolean, not translated when survey-core would find the literal in one of them (`5` in 5, `e` in true); a literal it finds in none is written, and holds for no number or boolean, as in Form.io. On a multiple `select`, `includes` is translated only when every choice contains the literal exactly when it equals it, and `notIncludes` is not translated. |
| `dateGreaterThan`, `dateGreaterThanOrEqual`, `dateLessThan`, `dateLessThanOrEqual`, `isDateEqual`, `isNotDateEqual` | On a `day` or `datetime` field, the matching comparison, also reported `assumed-conditional`: Form.io compares moments, survey-core compares values. Not translated on other fields. |
| `startsWith`, `endsWith`, anything else | Not translated. survey-core has no such operator. |

**Legacy format** (`{ show, when, eq }`) gives `{when} = eq`, or `<>` when `show` is not
`"true"`. A `selectboxes` field, a multiple `select` or a `tags` field uses `contains` and
`notcontains`; on the last two, an `eq` that Form.io reads as a path into the array (empty, with
a comma, or whose first path key is an index or `length`) is not translated.

**JSON logic** (`conditional.json`) is translated for `==`, `===`, `!=` and `!==` between a
`var` and a literal, a bare `var` read for its truthiness, `!` and `!!`, and `and` and `or` of
those. `!` around any of them gives `!(…)`.

* Truthiness depends on the field: a `checkbox` gives `{q} = true`, a text field `{q} notempty`,
  and a `number` `({q} notempty and {q} <> 0)`. Any other type, `selectboxes` included (its
  object is always truthy), or a multiple field, is not translated.
* The literal is matched as for the other formats, below, with JavaScript's `==` or `===`: a
  string is not translated in `===` with a field that stores a number, nor `"true"` in `==`
  with a field that stores a boolean (`true == "true"` is false).

Anything else is reported `assumed-conditional`.

**Literals** are matched with what Form.io stores in the field, and written only when
survey-core's comparison holds for exactly the values Form.io's does: the legacy format
compares texts, the simple `isEqual` parses a string as JSON when the stored value has another
type and is not falsy, and JSON logic uses `==` or `===`. A radio or select with choices is
matched with its choices, cast by its `dataType`. Otherwise, a `number` or `currency` field
stores a number (`null` when empty), a `checkbox` a boolean, a text field its text, a `hidden`
field any of these, and a select from a URL its `valueProperty` cast by its `dataType`. So
`"true"` compared with a `checkbox` becomes `true`, and `"5"` with a `number` field becomes
`5`, while `"05"` (which Form.io never matches) or `""` (an empty number is `null`) is not
translated. A comparison with any other field, a select from a URL with no `valueProperty` (it
stores the whole item) or with an unknown `dataType`, or a `number` or text field that holds
several values, is not translated. survey-core compares texts without regard to case or
surrounding spaces, and a text that reads as a number as that number, also in `contains` (it
reads `"5.0"` as 5, and a text that starts with `0x` as a hexadecimal number); the converter does
not guard against that for a field that stores text, so `=` and `includes` can hold there where
Form.io's comparison does not, or the reverse.

A `day` or `time` equality is translated only when the literal is the text Form.io stores, a
padded day in its order or a time in its `dataFormat` (`HH:mm:ss` or `HH:mm`), and it is written
as the ISO value the input stores. The date operators take any `day` literal that parses, and a
`datetime` literal with no time zone and zero seconds (and midnight, when the input reads only a
date). An equality on a `datetime`, an order or
`includes` on any of the three, and a day with a hidden part are not translated.

#### References

A reference names a field by key. A leading `data.` is the form root. Otherwise the converter
tries, in order, the field's data path (keys of the `container`, `datagrid` and `editgrid`
around it), its full path (the keys of every component around it, layout included), and the
bare key when exactly one field has it. A leading `row.` names a field in the condition's own
grid. Inside a nested `form`, the root is the nested form's data, and only its fields can be
named. A `survey` field cannot be named: its `{}` is not empty in Form.io, so no comparison
reads it as Form.io does.

Seen from inside data grids, the reference is `{name}` for a field outside any grid,
`{panel.name}` in the same grid, and `{parentPanel.name}` one grid up. A field inside a grid
the condition is not in, or two or more grids up, cannot be named, and the condition is
reported `assumed-conditional`.

### Logic

A `logic` entry holds while its trigger does, as a condition does: Form.io rebuilds the
component from its definition on every check. An entry maps when its trigger is `simple` or
`json` and translates exactly, and every action is a `property` action that sets `hidden`,
`disabled` or `validate.required` to the state the component does not already have:

| Action | SurveyJS |
| --- | --- |
| `hidden: true` | `visibleIf: !(cond)` |
| `hidden: false` on a hidden component | `visibleIf: cond` |
| `disabled: true` | `enableIf: !(cond)` |
| `validate.required: true` on a question | `requiredIf: cond` |

A `simple` trigger is read in the legacy or the simple format, and `show: false` inverts it.
Anything else is reported `custom-logic` at `/logic/<i>`, with no partial output. That covers
an `event` or `javascript` trigger, an empty `simple` trigger (it always fires), a trigger with
an `assumed` part, a `value`, `customAction` or `mergeComponentSchema` action, `disabled: false`,
`validate.required: false`, and `requiredIf` on a panel, a page or an `html` element. An entry also stays reported
when another entry of the component sets the same property, or an action that may change
anything, and a `hidden` entry stays reported on a component with a `customConditional`.

When a component has both a `conditional` and a mapped `hidden` entry, Form.io combines them in
its own order. Neither is emitted, and both are reported `assumed-conditional`.

### Hidden values

Form.io clears a field's value when a condition hides it (`clearOnHide`, true by default), and
its server also clears the fields of a hidden container. survey-core keeps a hidden value until
completion, and then drops every value that is invisible. So each input that can be invisible
gets `clearIfInvisible`:

* `onHiddenContainer` when a converted condition or hiding logic is on the input or a container
  around it, the input does not set `clearOnHide: false`, and nothing around it is statically
  hidden;
* `none` when Form.io keeps the value: an input with `clearOnHide: false` that can be hidden, an
  input that is statically `hidden` or sits in a statically hidden container, and every
  `hidden` component;
* nothing for an input that can never be invisible.

A statically hidden container that logic only shows does not count as statically hidden for
the inputs in it: an input with a converted condition anywhere in its chain gets
`onHiddenContainer`, and one with none gets `none`. While the container's own `hidden` holds,
the first kind loses its value, which Form.io keeps.

This follows the Form.io server. Form.io's browser renderer keeps the values inside a hidden
`panel`, `fieldset` or `columns`, whose own `clearOnHide` defaults to false. Where a condition
hides an input in a statically hidden chain, or a container around a `hidden` component, the
server clears the value and the converted survey keeps it.

### Refused

Arbitrary JavaScript and run-time rules are never parsed or evaluated. Each is reported with
its path only, never its content, and the component still converts:

| Form.io | Code |
| --- | --- |
| `customConditional` (any `conditional` on the same component is then ignored) | `custom-conditional` |
| `validate.custom` | `custom-validation` |
| A `logic` entry that does not map, see [Logic](#logic) | `custom-logic` |
| `calculateValue`, `customDefaultValue` | `custom-value` |
| A template in HTML other than a `data.` path, see [HTML templates](#html-templates) | `custom-template` |

### Form.io report codes

| Code | Bucket | Meaning |
| --- | --- | --- |
| `formio.unsupported-component` | unsupported | A builtin type with no mapping |
| `formio.unsupported-multiple` | unsupported | `multiple` on a text-like field |
| `formio.unsupported-data-source` | unsupported | A `select` source the converter cannot carry |
| `formio.unsupported-option` | unsupported | An option, set to something other than Form.io's default, that SurveyJS cannot express. The pointer names the option, also an absent `dataType` whose `auto` cast would merge two choices. |
| `formio.custom-conditional` | unsupported | `customConditional` |
| `formio.custom-validation` | unsupported | `validate.custom` |
| `formio.custom-logic` | unsupported | A `logic` entry that does not map |
| `formio.custom-value` | unsupported | `calculateValue`, `customDefaultValue` |
| `formio.custom-template` | unsupported | A `{{ … }}` or `{% … %}` in HTML that is not a `data.` path to a field |
| `formio.unknown-component` | unknown | A type outside the builtin set, or none |
| `formio.unknown-key` | unknown | Defined, never emitted. `npm run corpus:refresh` catches a new component key instead. |
| `formio.assumed-datagrid-model` | assumed | Every data grid |
| `formio.assumed-conditional` | assumed | A condition dropped or approximated |
| `formio.assumed-currency-format` | assumed | An unknown currency code, or an affix the pattern cannot hold |
| `formio.assumed-data-source-title` | assumed | A URL or `json` source whose template is not one `{{ item.x }}` |
| `formio.assumed-container-data` | assumed | A `container`, or a nested `form` with inline components, whose data nests under its key |
| `formio.assumed-default-value` | assumed | A date or time default that does not parse, or a `survey` default that is neither an object nor one of its values |
| `formio.dropped-styling` | dropped | `tabs`, `columns` and `table` layout; `tooltip`, `errorLabel`, and `prefix` and `suffix` outside `currency`; a signature size not in pixels or a pen width that is not a number |
| `formio.dropped-vendor-meta` | dropped | `button` |

## JSON Schema

### Input

`convert` takes a bare JSON Schema, or a `{ schema, uiSchema }` envelope. The UI schema decides
how the form is laid out:

| `uiSchema` | Read as |
| --- | --- |
| None | Bare schema: one flat page from the data schema. Uniforms carries no layout, so it converts this way. |
| An object whose `type` is a JSONForms layout or control type | [JSONForms](#jsonforms-ui-schema). Only the Controls it lists become questions. |
| Any other object | [RJSF](#rjsf-uischema), layered on the data walk |

The schema's `title` and `description` become the survey's. Without JSONForms, the root's
properties become the survey's elements; a root with no properties becomes a single question,
and a [discriminated `oneOf`](#oneof) at the root with no properties becomes pages. A root whose
fields are only in `anyOf` variants of objects gives no question, and is reported
`unsupported-keyword`.

### Types

| Schema | SurveyJS | Notes |
| --- | --- | --- |
| `object` | `panel` | Properties become its elements. Required in its parent gives `isRequired`. See [optional objects](#optional-objects) and [free-form objects](#free-form-objects). |
| `boolean` | `boolean` | |
| `integer`, `number` | `text`, `inputType: "number"` | |
| `enum`, or `oneOf` / `anyOf` whose every branch is a `const` | `dropdown` | `null` members are skipped. A `const` branch's `title` is the choice text. `radiogroup` with RJSF `ui:widget: "radio"` or JSONForms `format: "radio"`. |
| `string` | `text` | `inputType` from `format`, see below. `comment` with RJSF `ui:widget: "textarea"` or JSONForms `multi`. |
| `array` of `enum` items | `checkbox` | `tagbox` with JSONForms `multi`, `format: "combo"` or `"multiselect"`, or RJSF `ui:widget: "tagbox"` |
| `array` of objects | `paneldynamic` | Item properties form `templateElements`. An expression inside reads a sibling as `{panel.name}`. |
| `array` of anything else | `tagbox` | No choices, `allowCustomChoices: true` (the respondent types the items, and survey-core keeps them, also when the question is required). A tagbox stores text, so each `items` keyword that constrains more (`maxLength`, `format`, a `type` that allows no text such as `number`, `integer` or `boolean`, …) is reported `unsupported-keyword` at its own pointer. A tuple-form `items` (an array of schemas) is reported `unsupported-keyword` at `items`. |
| `items: false` | Nothing | Only an empty array is valid. Reported `unsupported-keyword`. |
| A property declared `false` | Nothing | No value is valid, so nothing is lost and nothing is reported (but see [`allOf`](#allof) and [`if`](#if--then--else)) |

A `type` array ignores `"null"`. With no `type`, `properties` means an object, `items` an array
and `enum` a string.

| `format` | `inputType` |
| --- | --- |
| `date` | `date` |
| `date-time` | `datetime-local` |
| `time` | `time` |
| `email`, `idn-email` | `email` |
| `uri`, `iri`, `uri-reference` | `url` |

### Keywords

| Schema | SurveyJS | Notes |
| --- | --- | --- |
| `title`, `description` | `title`, `description` | A UI schema's label wins |
| `default` | `defaultValue` | `null` gives none. Arrays included. |
| `required` | `isRequired` | On the listed properties. A listed key that no schema of the object declares has no question, and is reported `unsupported-free-form-object` at `…/required/<i>`. |
| `readOnly` | `readOnly` | |
| `minLength`, `maxLength` | `text` validator | |
| `minimum`, `maximum` | `numeric` validator | |
| `exclusiveMinimum`, `exclusiveMaximum` | `numeric` validator | Both the draft-04 boolean and the later numeric form; the stricter bound wins. On an `integer` the bound moves one step inside, which is exact. On a `number` the bound is kept, and since the validator accepts a value equal to it, it is reported `assumed-exclusive-bound`. |
| `pattern` | `regex` validator | |

#### Optional objects

AJV checks nothing inside an object that is absent, and survey-core leaves an object out of the
data when all its fields are empty. So inside a nested object its parent does not list in
`required`, every requirement holds only while the object is present: `isRequired` becomes
`requiredIf: {f1} notempty or {f2} notempty …` over the object's other fields, and a
`requiredIf: c` becomes `(<presence>) and (c)`. A field's own question is left out of its
presence, as its requirement is met while it holds a value, so an object's only field is not
required at all. Nested optional objects carry the innermost one's presence, which implies the
outer ones. A dependency's `{trigger} notempty` already implies presence and is kept as it is.

#### Free-form objects

An object with no `properties` (free-form, or keys only from `additionalProperties` or
`patternProperties`) keeps a titled empty panel, as JSONForms and RJSF render an empty group, and
is reported `unsupported-free-form-object`; for an array of them, at `…/items`. Beside
`properties`, an `additionalProperties` (other than `false`) or a non-empty `patternProperties`
is reported at the keyword.

### Composition

#### `$ref`

A local reference (`#/definitions/…`, `#/$defs/…`, any pointer into the same document) is
resolved. Any other reference is looked up among the document's `$id`s (a bundled schema),
against the base URI it sits under, and the JSON Pointer in its fragment is followed. Where the
converter cannot follow a reference, the property becomes a `text` question:

* a URI no `$id` in the document declares is remote, not fetched, and reported
  `dropped-remote-ref`;
* a pointer, or an `$id`'s fragment, that names nothing, and a reference cycle, are reported
  `unresolved-ref`;
* nesting deeper than 24 levels is reported `unsupported-keyword`.

#### `allOf`

The entries merge into the parent, each one's `$ref` followed and its own `allOf` merged first.
Their `properties` and `required` are added, and a keyword the parent does not set (`type`,
`format`, bounds, `oneOf`, `discriminator`, `items`, …) is taken from the first entry that sets it.
`anyOf` is not merged.

* **A keyword two entries set differently** (annotations aside) keeps the first value, and the
  later one is reported `assumed-allof-merge`. Two `items` merge as their `allOf`.
* **A property several entries declare** is the `allOf` of its declarations, merged the same way
  where it is read, so the constraints of each apply. Incompatible `type`s keep the first
  declaration and report the other.
* **`true` and `false`.** A `true` declaration adds nothing. A `false` one allows no value, so the
  property gets no question, and each declaration it outweighs is reported at the `false` one. A
  `false` entry is reported.
* **Conditionals.** Each entry's `if`/`then`/`else`, dependencies and `required` apply on their
  own, as written at the entry's pointer.

#### `if` / `then` / `else`

The `if` is translated when it holds only `properties`, `required`, annotations and a `type` that
allows `"object"`, and each of its `properties` is a `const` or a non-empty `enum` (with
annotations, and a `type` every value has). Any other keyword (`not`, `minProperties`, `anyOf`, …)
is not read, so such an `if` is not translated. Each key gives one term, and the terms join with
`and`; an `enum` gives an `or` of equalities:

| The `if` names the key in | Term |
| --- | --- |
| `properties` only | `({k} empty or {k} = v)`: `properties` constrains only the keys present, so the `if` holds while the key is empty |
| `properties` and `required` | `{k} = v` |
| `required` only | `{k} notempty` |

An `if` that holds for every value (`true`, `{}`, annotations only, a `type` that allows
`"object"`, `properties` that each hold for any value, `required: []`, `not: false`) applies `then`
always, as AJV does; one that holds for none (`false`, a `not` of the former, a `type` without
`"object"`) applies `else` always. That branch's properties are shown with no `visibleIf`, and its
`required` gives `isRequired`.

**Literals.** survey-core's `=` is lenient: it trims texts and ignores case, reads a numeric text
as a number and `"true"` as a boolean, and does not even read the text "1,000" as equal to
`'1,000'`. JSON Schema's `const` and `enum` compare strictly. A literal is written only when
survey-core's `=` holds for exactly the values JSON Schema's does. The values checked are the
literals themselves, no value, and the values the field is known to hold: its `const`, its
`enum`, a `oneOf`/`anyOf` of `const`s, a boolean's two, and `null` when its `type` allows it. A
value the field's `type` excludes is not compared: a required key left with none is not
translated, and an optional one gives `{k} empty`. The values of a free text are not known, so
there survey-core still reads a text that differs from the literal only in case, in surrounding
spaces or in how it writes a number, or a `"1"` / `"0"` against `true` / `false`, as equal.

**`null` and `""`** are values to JSON Schema and empty to survey-core. On a field that can hold
either (an `enum` member, or a `type` that allows `null`), no `empty` or `notempty` term is
written, so an optional key's term and a required-only key's presence test are not translated.
An object's panel holds no value, so an `if` that reads an object key is not translated either.

**Branches:**

* Each property in `then` gets `visibleIf: <if>`, created as a new question when the object
  does not declare it. A property the object declares keeps its own schema, and one the `if`
  itself reads gets no `visibleIf`.
* Each name in `then.required` gets `requiredIf: <if>`.
* `else` does the same with the negated condition.

Conditionals that show one property, or require it, join with `or`: it is shown, or required,
when any of them holds. A question that is required anyway takes no `requiredIf`. A property one
branch made, which a later branch gives a different schema, is not shown by the later branch, and
that branch's property is reported: one question cannot be both.

**Order.** An object's conditionals (its `if`s, dependencies, and the `required` of the object and
of each `allOf` entry) apply in three steps: every branch shows its properties, then the
conditions that read them are written, then the requirements. A condition that reads a key a
branch shows waits until it is shown. A question a branch shows is also shown while another
branch requires it, and always when a `required` that always holds lists it, as JSON Schema then
demands a value. The order of the conditionals in the schema does not change the result.

**A branch's `false` property.** While the branch holds, the property allows no value: its
`visibleIf` is ANDed with the negation of the branch's condition, so it is hidden then, and
survey-core clears its value when the survey completes. It is reported instead when the condition
does not translate, when the `if` itself reads the key, or when a branch requires the key under
the same condition, always, or under a condition one of them is nested in: then no value is
valid, which a form cannot say. A branch that applies always and declares `false` is a `false`
declaration: no question.

**Branch shapes.** A `then`, `else` or schema dependency can be a `$ref`, which is followed, or
an `allOf`, which is merged as above. An `if` nested in it applies while both conditions hold. A
`not`, a `false` branch or `allOf` entry, a keyword beside the branch's `$ref`, and any other
keyword are not translated, and each is reported with the branch's code at its own pointer. One
top-level branch reads at most 64 branch schemas, nested ones included (`MAX_BRANCH_SHAPES`): past
that, a nested `if` is reported at its `/if`, and nothing of it applies. A key a branch requires
that no schema of the object declares has no question, and is reported at `…/required/<i>`.

An `if` that cannot be translated is reported `assumed-if-then-else`, and nothing is gated.
Under a JSONForms UI schema, branches give `requiredIf` only (see
[JSONForms](#jsonforms-ui-schema)).

#### Dependencies

| Schema | SurveyJS |
| --- | --- |
| `dependencies` with an array, `dependentRequired` | `requiredIf: "{trigger} notempty"` on each dependent |
| `dependencies` with a schema, `dependentSchemas` | Like `then`, with `{trigger} notempty` as the condition. The trigger itself is not hidden by its own presence. |

Every dependency is reported `assumed-dependencies`, because the granularity of the result is
inferred. A trigger that can hold `null` or `""`, or that is an object, has no exact presence
test, so its dependency gives no condition.

#### Known gaps

These are not reported:

* A free text compared with a literal: see **Literals** above.
* A requirement and a `false` under two different conditions that can hold together: no value
  is valid there, and the form hides the key and does not require it.
* survey-core clears the values of hidden questions in one pass when the survey completes, and
  does not check visibility again. A `false` property whose condition reads a question that is
  itself hidden with a value can keep its value.
* A field that holds `null` or `""` does not make its [optional object](#optional-objects)
  present.
* Under JSONForms, an object `detail`'s presence reads only the detail's own Controls, not
  another Control on the same object.

#### `oneOf`

A `oneOf` is discriminated when it has an explicit OpenAPI `discriminator.propertyName`, or when
one property carries a `const` in every branch (inferred, reported
`assumed-oneof-discriminator`). It becomes:

* a required `dropdown` of the discriminator values, unless the object already has that
  property;
* one panel per variant, titled with the branch `title` and holding the branch's other
  properties, with `visibleIf: {discriminator} = value`.

At the root of a schema with no properties of its own, the selector gets the first page and each
variant becomes a page. A variant whose value cannot be written as a literal stays visible and is
reported `assumed-oneof-discriminator`.

A `oneOf` or `anyOf` of `const` branches is a [choice list](#types). A `oneOf` of object shapes
with no discriminator cannot be flattened without letting a user satisfy two exclusive branches,
so it is reported `unsupported-keyword`.

### JSONForms UI schema

| UI node | SurveyJS | Notes |
| --- | --- | --- |
| `Control` | A question, from the property its `scope` names | The scope resolves as JSONForms' `resolveSchema` resolves it: through `$ref`, and through `oneOf`, `allOf`, `anyOf`, `then` and `else` in that order, the first match winning; `required` is read from the scope's parent path. A scope that resolves to nothing is reported `unresolved-scope`. A Control with no scope is reported `unsupported-ui-hint`. |
| `ListWithDetail` | As a `Control` on an array | The master list beside the detail is reported `dropped-styling`. On an object or a scalar, nothing, reported `unsupported-ui-hint`: no JSONForms renderer lists them. |
| `VerticalLayout`, `HorizontalLayout` | `panel` with no title | The root layout is flattened into the survey. Horizontal arrangement is not kept. |
| `Group` | `panel` titled with `label` | |
| `Categorization` at the root, or as the root layout's only child | Pages | A `Category` child's elements go on its page. A nested `Categorization` child becomes a page with one panel per `Category`. |
| `Categorization` anywhere else | `panel` | Each `Category` inside is a titled panel |
| `Category` | `panel` titled with `label` | |
| `Label` | `html` | `text` is the markup |
| Any other `type` | Nothing | Reported `unsupported-ui-hint` |

The data schema walk still applies inside each Control: an object Control becomes a panel whose
properties and `oneOf` convert as above.

**Schema conditionals.** JSONForms shows and hides only by `rule`, and reads schema conditionals
only to validate. So under a JSONForms UI schema, `if`/`then`/`else`, dependencies and `required`
give `requiredIf` (or `isRequired`) only: never `visibleIf`, and no question for a branch's
property. They are read inside an object Control, and, once the layout is walked, for the root
schema, for each `detail`'s object or items, and for each object a nested scope goes through, on
the Controls that name each property. A key with no Control has nothing to read or require: a
condition on it is reported, and a requirement is left out, as the UI schema leaves the key out.
A branch's `false` property keeps its Control, and is reported. A conditional inside a root
`anyOf` or `oneOf` of several entries is reported, since the entry that holds is unknown. A
Control on a property several `allOf` entries declare reads every declaration; what the merge
drops is reported as on the data walk, and a `false` declaration gives no question.

**Scopes and data paths.** A scope names the data path JSONForms' `toDataPathSegments` gives it,
with the combinator steps dropped: `#/anyOf/0/then/properties/x` and `#/properties/x` are one
value. Two Controls on one data path edit one value: the second gets `valueName` naming the first.
A Control on a nested scope (`#/properties/a/properties/b`) outside its object's own `detail`
gives a question at the layout's level. survey-core keeps a value under one key of the form (or
of the row), and a `valueName` cannot hold a path, so the value is stored under the question's
name, not at `a.b`; this is reported `assumed-nested-scope`. The object's conditionals and
`required` still apply to the Controls on its fields, and while the object is optional, only when
it is [present](#optional-objects), judged by those Controls.

**Labels.** A string `label`, or `{ text }`, is the title. `label: false` or `{ show: false }`
hides it: `titleLocation: "hidden"` on a question, no title on a Group, Category or page.

**Names.** A Group, Category, page, `layout` panel or `label` element is not named after any
property key of the schema (compared without case), so a question keeps its property's name.

**Control `options`:**

| Option | SurveyJS |
| --- | --- |
| `format: "radio"` | `radiogroup` |
| `format: "combo"`, `"multiselect"` | `tagbox` on an `enum` array |
| `multi: true` | `comment` on a string, `tagbox` on an `enum` array |
| `readonly` / `readOnly` | `readOnly`. A boolean here overrides the schema's `readOnly`. |
| `restrict: true` | `maxLength` from the schema's `maxLength`, on `text` and `comment` |
| `step` | `step` on a number input or a slider |
| `slider: true` | `slider` with `min` and `max`, when the schema has `minimum`, `maximum` and `default` (JSONForms' `isRangeControl`). Otherwise the number input stays. |
| `toggle: true` | Nothing on a `boolean`, which is a switch already |
| `elementLabelProp` (a dotted path), `labelRef` (a pointer into the items) | `templateTitle: "{panel.<name>}"`, from the row's question on that full path |
| `detail` as a layout on an array | The `paneldynamic` template, walked with scopes relative to the item schema |
| `detail` as a layout on an object | The panel's elements, walked with scopes relative to the object schema |
| `detail: "GENERATED"` or `"DEFAULT"` | The default template |
| `detail: "REGISTERED"`, or `detail` on anything but an array or an object | The default template, reported `unsupported-ui-hint` |
| `trim`, `showUnfocusedDescription`, `hideRequiredAsterisk`, `autocomplete`, `clearable`, `orientation`, `ampm`, `okLabel`, `cancelLabel`, `clearLabel`, `dateFormat`, `dateTimeFormat`, `views` | Presentation, reported `dropped-styling` |
| A mapped option that cannot apply to the question, or anything else (`dateSaveFormat`, `dateTimeSaveFormat`, `showSortButtons`, …) | Reported `unsupported-ui-hint` |

#### Rules

A `rule` on a Control, Group, layout, Categorization, Category or Label is translated after the
walk, so its condition can name a Control further down.

| `effect` | SurveyJS |
| --- | --- |
| `SHOW` | `visibleIf: <condition>` |
| `HIDE` | `visibleIf: !(<condition>)` |
| `ENABLE`, `WRITABLE` | `enableIf: <condition>` |
| `DISABLE`, `READONLY` | `enableIf: !(<condition>)` |

An enablement rule decides alone, as in JSONForms, so it removes `readOnly` from its element.

| Condition | Expression |
| --- | --- |
| `{ type: "LEAF", scope, expectedValue }` | `{q} = value` for a primitive value |
| `{ scope, schema: { const } }` | `{q} = value` |
| `{ scope, schema: { enum } }` | An `or` of equalities |
| `{ scope, schema: { not } }` | `!(…)` of the inner schema |
| `{ scope, schema: { properties, required } }` | One term per property: a required one must be `notempty`, an optional one passes when `empty` |
| `failWhenUndefined: true` | Adds `{q} notempty` |
| `{ type: "AND" \| "OR", conditions }` | `and` / `or` of the parts |

The scope a condition reads must have a Control. A literal is written only when survey-core
compares it exactly, and an `empty` or `notempty` term only on a field that cannot hold `null` or
`""`, as for [`if`](#if--then--else). A rule on a `detail` layout's root hides or disables the whole
detail: that layout becomes a panel, which carries it. A condition that cannot be translated, an
unknown effect, or a rule on the form's root layout or root Categorization (no element carries
it) is reported `assumed-ui-rule`; the element stays visible and enabled.

### RJSF uiSchema

The uiSchema is read per property, down any depth: an object's node holds its properties' nodes,
an array's `items` node applies to its template, and a `oneOf` variant or a question created by
`then` reads its object's node. `ui:options` is read like the matching `ui:` keys, and the later
key wins, as in RJSF's `getUiOptions`. Each read is for one question and reports what that
question loses: on a node `oneOf` variants share, an option every variant loses is counted once
per variant, and one a variant applies is reported only where it is lost.

| Key | SurveyJS | Notes |
| --- | --- | --- |
| `ui:title`, `ui:description` | `title`, `description` | On the root node, the survey's |
| `ui:placeholder` | `placeholder` | `text` and `comment` only |
| `ui:order` | Element order | `"*"` places the rest. Keys it does not list are kept. |
| `ui:disabled`, `ui:readonly` | `readOnly` | On questions and panels |
| `ui:inputType` | `inputType` | A text input type survey-core has, on a `text` question |
| `ui:addable: false`, `ui:removable: false` | `allowAddPanel: false`, `allowRemovePanel: false` | On a `paneldynamic`. `true` is the default and changes nothing. |
| `ui:enumNames` | Choice texts | An array by index (a `null` keeps its index), or an object by value |
| `ui:enumDisabled` | `enableIf: "false"` on the listed choices | |
| `ui:help` | `description` | Only on a field, or a form, that has none |
| `ui:widget` | See below | |

A mapped key that cannot apply where it is written (`ui:inputType` on a number, `ui:addable` on a
list with no add button, `ui:help` beside a description, …) is reported `unsupported-ui-hint`.

| `ui:widget` | SurveyJS |
| --- | --- |
| `password`, `email`, `url`, `color`, `date`, `time` | `inputType` of the same name |
| `date-time`, `datetime-local`, `alt-datetime` | `inputType: "datetime-local"` |
| `alt-date` | `inputType: "date"` |
| `updown`, `range` | `inputType: "number"` |
| `hidden` | `visible: false`. The question keeps its type. |
| `radio` | `radiogroup` |
| `textarea` | `comment` |
| `tagbox` | `tagbox` on an `enum` array |
| `checkboxes` on an `enum` array, `checkbox` on a boolean, `select` on a single-choice `enum` | RJSF's default for the field, so nothing changes and nothing is reported |
| Anything else, or a default widget on a field it does not fit | Reported `unsupported-ui-hint` |

Every other key is reported:

| Keys | Code |
| --- | --- |
| Presentation: `classNames`, `className`, `style`, `rows`, `autocomplete`, `autocapitalize`, `autofocus`, `inline`, `label`, `submitButtonOptions`, `hideError`, `filePreview`, `enableMarkdownInDescription`, `enableMarkdownInHelp`, `allowClearTextInputs` | `dropped-styling` |
| `ui:field`, any `…Template`, a `ui:widget` that is a function | `dropped-custom-renderer` |
| A `ui:widget` that is an object (RJSF refuses it) | `unsupported-ui-hint` |
| Anything else, such as `emptyValue`, `orderable` (survey-core cannot reorder dynamic panels), or a key RJSF adds later | `unsupported-ui-hint` |

### JSON Schema report codes

| Code | Bucket | Meaning |
| --- | --- | --- |
| `json-schema.unsupported-keyword` | unsupported | A `oneOf` of objects with no discriminator; `items`, or a root, whose fields are only in an `anyOf` or `oneOf` of objects; `items: false`; an `items` keyword a `tagbox` cannot hold; nesting past the depth limit |
| `json-schema.unsupported-ui-hint` | unsupported | A JSONForms node or option, or an RJSF key or widget, with no mapping or that cannot apply where it is written; a `ListWithDetail` on an object or a scalar |
| `json-schema.unsupported-free-form-object` | unsupported | Keys a schema leaves free, which no question holds: an object with no `properties`, an `additionalProperties` or `patternProperties` beside them, and a required key no schema of the object declares (in a JSONForms object Control's walk, one only a branch declares) |
| `json-schema.unresolved-scope` | unsupported | A JSONForms scope that resolves to nothing |
| `json-schema.unresolved-ref` | unsupported | A `$ref` that names nothing in the document, or a reference cycle |
| `json-schema.unknown-keyword` | unknown | Defined, never emitted. `npm run corpus:refresh` catches a new keyword or UI key instead. |
| `json-schema.assumed-if-then-else` | assumed | An `if` that cannot be translated; what a branch does not translate: a keyword, a property given another schema, a `false` property that cannot be hidden exactly, a required key no schema declares, a nested `if` past the branch budget |
| `json-schema.assumed-oneof-discriminator` | assumed | An inferred discriminator, or a variant value that cannot be written |
| `json-schema.assumed-dependencies` | assumed | Every dependency, and what a schema dependency's branch does not translate |
| `json-schema.assumed-allof-merge` | assumed | A declaration an `allOf` merge drops: an incompatible `type`, a keyword set differently, one a `false` declaration outweighs, a `false` entry; under JSONForms, a declaration that constrains the object and that the schema a Control's scope found leaves unread |
| `json-schema.assumed-exclusive-bound` | assumed | An exclusive bound on a `number` |
| `json-schema.assumed-ui-rule` | assumed | A JSONForms rule that cannot be translated or carried |
| `json-schema.assumed-nested-scope` | assumed | A JSONForms Control on a nested scope, whose value is stored under the question's name |
| `json-schema.dropped-remote-ref` | dropped | A `$ref` to a URI no `$id` in the document declares |
| `json-schema.dropped-custom-renderer` | dropped | RJSF custom fields, templates and widget functions |
| `json-schema.dropped-styling` | dropped | RJSF and JSONForms presentation options, and a `ListWithDetail`'s master list |
