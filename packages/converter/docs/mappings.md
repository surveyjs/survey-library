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
  name.
* **Conditions.** A condition becomes an expression only when the translation is exact.
  Otherwise the element gets no condition and stays visible, and the report says `assumed`.
  A field that is always shown is a safer loss than one that shows or hides at the wrong time.
  A value that ends in `\` or holds `\"` cannot be written as a survey-core string literal, so
  a condition comparing with it is not translated either.

## Form.io

### Form

| Form.io | SurveyJS |
| --- | --- |
| `title` | `title` |
| `display: "form"` or `"pdf"` | One page, `page1` |
| `display: "wizard"` | One page per top-level component. A `panel`, `fieldset`, `well` or `container` gives its children to the page directly, with its title, `hidden`, `disabled` and condition. Any other component becomes the page's only element. |

### Components

| Form.io `type` | SurveyJS | Notes |
| --- | --- | --- |
| `textfield` | `text` | |
| `email`, `url`, `phoneNumber`, `number`, `password` | `text` | `inputType` `email`, `url`, `tel`, `number`, `password` |
| `datetime`, `day`, `time` | `text` | `inputType` `datetime-local`, `date`, `time` |
| `currency` | `text` | Currency mask, see [Currency](#currency) |
| `textarea` | `comment` | |
| `checkbox` | `boolean` | With `inputType: "radio"` and a `name`, see [Radio-type checkboxes](#radio-type-checkboxes) |
| `selectboxes` | `checkbox` | |
| `radio` | `radiogroup` | |
| `select` | `dropdown`, or `tagbox` when `multiple` | See [Select data sources](#select-data-sources) |
| `file` | `file` | |
| `signature` | `signaturepad` | |
| `content`, `htmlelement` | `html` | `html` or `content` becomes the markup. `{{ … }}` in it is not translated and reads as SurveyJS piping. |
| `panel`, `fieldset`, `well`, `container` | `panel` | See [Containers](#containers) |
| `columns`, `table` | `panel` | No title. The column and table layout is reported `dropped-styling`, and the cells' components follow each other in order. |
| `tabs` | `panel` | See [Containers](#containers) |
| `datagrid`, `editgrid` | `paneldynamic` | See [Data grids](#data-grids) |
| `button` | Nothing | SurveyJS navigation submits the survey. Reported `dropped-vendor-meta`. |

Any other type in Form.io's builtin set (`tags`, `address`, `survey`, `hidden`, `form`,
`recaptcha`, `resource`, `sketchpad`, `select2`, `nested`, `custom`, `datamap`, `tree`) is
reported `unsupported-component` and produces no element. A type outside that set, or a
component with no `type`, is reported `unknown-component`, the drift alarm. The builtin set is
vendored in `src/formio/vendor/` and checked by `npm run corpus:refresh`.

### Component properties

| Form.io | SurveyJS | Notes |
| --- | --- | --- |
| `key` | `name` | |
| `label` | `title` | Not on `html` |
| `description` | `description` | |
| `placeholder` | `placeholder` | `text` and `comment` only |
| `defaultValue` | `defaultValue` | `null` and `""` give none. `null` items are removed from an array. A `selectboxes` object (`{ a: true, b: false }`) becomes the array of checked keys. |
| `hidden: true` | `visible: false` | A condition still overrides it, as in Form.io |
| `disabled: true` | `readOnly: true` | |
| `validate.required` | `isRequired` | |
| `validate.minLength`, `maxLength` | `text` validator | |
| `validate.min`, `max` | `numeric` validator | |
| `validate.pattern` | `regex` validator | |
| `data.values` (select), `values` (radio, selectboxes) | `choices` | `{ value, text }` from `value` and `label`. An empty value is skipped. |
| `multiple` on a text-like field | Nothing | SurveyJS `text` and `comment` hold one value. Reported `unsupported-multiple`. A one-item default is kept as a single value. |

### Containers

* **`panel`** is titled with `title`, falling back to `label`.
* **`fieldset`** is titled with `legend`.
* **`container`** is titled with `label`, unless `hideLabel` is set. Its children's data
  nests under its key, which matters for [references](#references).
* **`well`, `columns` and `table`** have no title.
* **`tabs`** becomes an untitled panel holding one panel per tab, titled with the tab's
  `label`, so every field stays on the same page. A tab with no fields produces nothing. The
  tab strip itself is reported `dropped-styling`.

### Data grids

`datagrid` and `editgrid` always become a `paneldynamic`: the grid's components form
`templateElements`, `label` is the title, and `validate.required` sets `isRequired`. A grid
can nest panels and containers that a matrix cannot hold, and the definition does not say
whether a grid is tabular, so each one is reported `assumed-datagrid-model`.

### Currency

A `currency` field becomes a `text` question with `maskType: "currency"`, and `maskSettings`
as follows:

| Form.io | `maskSettings` | Notes |
| --- | --- | --- |
| `currency` (an ISO code) | `currencySymbol` | Resolved with `Intl`: `USD` gives `$`. An unknown code is reported `assumed-currency-format`. |
| `requireDecimal: true` | `showTrailingZeros: true` | |
| `decimalLimit` | `precision` | |
| `prefix`, `suffix` | `currencyPattern` | Wraps the currency's own layout, such as `@#` or `@ #`. An affix that holds a digit, `#`, `@` or `-` cannot be written and is reported `assumed-currency-format`. |

### Select data sources

| `dataSrc` | SurveyJS |
| --- | --- |
| None, `""` or `"values"` | `choices` from `data.values` |
| `"url"` | `choicesByUrl`: `url` from `data.url`, `path` from `selectValues`, `valueName` from `valueProperty`, `titleName` from `template` |
| `"resource"`, `"custom"`, `"json"` and others | Nothing. Reported `unsupported-data-source`. |

For `titleName`, a `template` of exactly `<span>{{ item.x }}</span>` gives `x` (a dotted path
is kept), and no template gives `label`, Form.io's default. Any other template is reported
`assumed-data-source-title` and the default stays. A URL that interpolates form data
(`{{ … }}`), or that needs `authenticate` or request `headers`, is reported
`unsupported-data-source`, because SurveyJS would call it differently.

### Radio-type checkboxes

A `checkbox` with `inputType: "radio"` and a `name` is one option of a radio group: Form.io
stores the checked member's `value` under `name`. Sibling members that share a `name` become
one `radiogroup` named after `name`, at the first member's place and with no title:

* each member gives a choice: `value` (or `key` when absent), with `label` as its text;
* any required member makes the group required;
* a member with `defaultValue: true` gives the group its default;
* a member's own condition would show or hide a single option, which a `radiogroup` choice
  cannot carry here, so it is reported `assumed-conditional`.

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
| `isEqual`, `isNotEqual` | `{q} = v`, `{q} <> v`. On a `selectboxes` field: `contains`, `notcontains`. Not translated on a multiple `select`. |
| `lessThan`, `lessThanOrEqual`, `greaterThan`, `greaterThanOrEqual` | `<`, `<=`, `>`, `>=` |
| `includes`, `notIncludes` | `contains`, `notcontains`. Not translated on `selectboxes`, where Form.io never matches. |
| `dateGreaterThan`, `dateGreaterThanOrEqual`, `dateLessThan`, `dateLessThanOrEqual`, `isDateEqual`, `isNotDateEqual` | The matching comparison, also reported `assumed-conditional`: Form.io compares moments, survey-core compares values. |
| `startsWith`, `endsWith`, anything else | Not translated. survey-core has no such operator. |

**Legacy format** (`{ show, when, eq }`) gives `{when} = eq`, or `<>` when `show` is not
`"true"`. A `selectboxes` field or a multiple `select` uses `contains` and `notcontains`.

**JSON logic** (`conditional.json`) is translated for `==`, `===`, `!=` and `!==` between a
`var` and a literal, and for `and` and `or` of those. Anything else is reported
`assumed-conditional`.

**Literals** follow the field: `"true"` and `"false"` compared with a `checkbox` become
booleans, and a numeric string compared with a `number` or `currency` field becomes a number.

#### References

A reference names a field by key. A leading `data.` is the form root. Otherwise the converter
tries, in order, the field's data path (keys of the `container`, `datagrid` and `editgrid`
around it), its full path (the keys of every component around it, layout included), and the
bare key when exactly one field has it. A leading `row.` names a field in the condition's own
grid.

Seen from inside data grids, the reference is `{name}` for a field outside any grid,
`{panel.name}` in the same grid, and `{parentPanel.name}` one grid up. A field inside a grid
the condition is not in, or two or more grids up, cannot be named, and the condition is
reported `assumed-conditional`.

### Refused

Arbitrary JavaScript and run-time rules are never parsed or evaluated. Each is reported with
its path only, never its content, and the component still converts:

| Form.io | Code |
| --- | --- |
| `customConditional` (any `conditional` on the same component is then ignored) | `custom-conditional` |
| `validate.custom` | `custom-validation` |
| `logic` | `custom-logic` |
| `calculateValue`, `customDefaultValue` | `custom-value` |

### Form.io report codes

| Code | Bucket | Meaning |
| --- | --- | --- |
| `formio.unsupported-component` | unsupported | A builtin type with no mapping |
| `formio.unsupported-multiple` | unsupported | `multiple` on a text-like field |
| `formio.unsupported-data-source` | unsupported | A `select` source the converter cannot carry |
| `formio.custom-conditional` | unsupported | `customConditional` |
| `formio.custom-validation` | unsupported | `validate.custom` |
| `formio.custom-logic` | unsupported | `logic` |
| `formio.custom-value` | unsupported | `calculateValue`, `customDefaultValue` |
| `formio.unknown-component` | unknown | A type outside the builtin set, or none |
| `formio.unknown-key` | unknown | Defined, never emitted. `npm run corpus:refresh` catches a new component key instead. |
| `formio.assumed-datagrid-model` | assumed | Every data grid |
| `formio.assumed-conditional` | assumed | A condition dropped or approximated |
| `formio.assumed-currency-format` | assumed | An unknown currency code, or an affix the pattern cannot hold |
| `formio.assumed-data-source-title` | assumed | A URL source whose template is not one `{{ item.x }}` |
| `formio.dropped-styling` | dropped | `tabs`, `columns` and `table` layout |
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
and a [discriminated `oneOf`](#oneof) at the root with no properties becomes pages.

### Types

| Schema | SurveyJS | Notes |
| --- | --- | --- |
| `object` | `panel` | Properties become its elements. Required in its parent gives `isRequired`. |
| `boolean` | `boolean` | |
| `integer`, `number` | `text`, `inputType: "number"` | |
| `enum`, or `oneOf` / `anyOf` whose every branch is a `const` | `dropdown` | `null` members are skipped. A `const` branch's `title` is the choice text. `radiogroup` with RJSF `ui:widget: "radio"` or JSONForms `format: "radio"`. |
| `string` | `text` | `inputType` from `format`, see below. `comment` with RJSF `ui:widget: "textarea"` or JSONForms `multi`. |
| `array` of `enum` items | `checkbox` | `tagbox` with JSONForms `multi`, `format: "combo"` or `"multiselect"`, or RJSF `ui:widget: "tagbox"` |
| `array` of objects | `paneldynamic` | Item properties form `templateElements`. An expression inside reads a sibling as `{panel.name}`. |
| `array` of anything else | `tagbox` | No choices |

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
| `required` | `isRequired` | On the listed properties |
| `readOnly` | `readOnly` | |
| `minLength`, `maxLength` | `text` validator | |
| `minimum`, `maximum` | `numeric` validator | |
| `exclusiveMinimum`, `exclusiveMaximum` | `numeric` validator | Both the draft-04 boolean and the later numeric form; the stricter bound wins. On an `integer` the bound moves one step inside, which is exact. On a `number` the bound is kept, and since the validator accepts a value equal to it, it is reported `assumed-exclusive-bound`. |
| `pattern` | `regex` validator | |

### Composition

#### `$ref`

A local reference (`#/definitions/…`, `#/$defs/…`, any pointer into the same document) is
resolved. A remote one is not fetched: the property becomes a `text` question and is reported
`dropped-remote-ref`. A reference cycle, a local reference that resolves to nothing, or nesting
deeper than 24 levels also gives a `text` question; the last is reported `unsupported-keyword`.

#### `allOf`

Each subschema's `properties` and `required` merge into the parent, along with `if`, `then`,
`else`, `oneOf`, `discriminator` and the dependency keywords. When two subschemas give the same
property incompatible types, the first wins and the conflict is reported `assumed-allof-merge`.

#### `if` / `then` / `else`

The `if` is translated when it holds `properties` whose every entry is a `const` or an `enum`.
The entries join with `and`; an `enum` gives an `or` of equalities.

* Each property in `then` gets `visibleIf: <if>`, created as a new question when the object
  does not declare it.
* Each name in `then.required` gets `requiredIf: <if>`.
* `else` does the same with the negated condition.

An `if` that cannot be translated is reported `assumed-if-then-else`, and nothing is gated.

#### Dependencies

| Schema | SurveyJS |
| --- | --- |
| `dependencies` with an array, `dependentRequired` | `requiredIf: "{trigger} notempty"` on each dependent |
| `dependencies` with a schema, `dependentSchemas` | Like `then`, with `{trigger} notempty` as the condition |

Every dependency is reported `assumed-dependencies`, because the granularity of the result is
inferred.

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
| `Control` | A question, from the property its `scope` names | A scope that resolves to nothing is reported `dropped-remote-ref`. A Control with no scope is reported `unsupported-ui-hint`. |
| `VerticalLayout`, `HorizontalLayout` | `panel` with no title | The root layout is flattened into the survey. Horizontal arrangement is not kept. |
| `Group` | `panel` titled with `label` | |
| `Categorization` at the root, or as the root layout's only child | Pages | A `Category` child's elements go on its page. A nested `Categorization` child becomes a page with one panel per `Category`. |
| `Categorization` anywhere else | `panel` | Each `Category` inside is a titled panel |
| `Category` | `panel` titled with `label` | |
| `Label` | `html` | `text` is the markup |
| Any other `type` | Nothing | Reported `unsupported-ui-hint` |

The data schema walk still applies inside each Control: an object Control becomes a panel whose
properties, `if`/`then`, dependencies and `oneOf` convert as above. JSONForms itself shows and
hides only by `rule` and uses those keywords to validate, so a question hidden this way is one
JSONForms would show. The root schema's own `if`/`then`, dependencies and `oneOf` are not read
and not reported, since no Control maps the root.

**Labels.** A string `label`, or `{ text }`, is the title. `label: false` or `{ show: false }`
hides it: `titleLocation: "hidden"` on a question, no title on a Group, Category or page.

**Control `options`:**

| Option | SurveyJS |
| --- | --- |
| `format: "radio"` | `radiogroup` |
| `format: "combo"`, `"multiselect"` | `tagbox` on an `enum` array |
| `multi: true` | `comment` on a string, `tagbox` on an `enum` array |
| `readonly` / `readOnly` | `readOnly`. A boolean here overrides the schema's `readOnly`. |
| `detail` as a layout | The `paneldynamic` template, walked with scopes relative to the item schema |
| `detail: "GENERATED"` or `"DEFAULT"` | The default template |
| `detail: "REGISTERED"`, or `detail` on a non-array | The default template, reported `unsupported-ui-hint` |
| Anything else | Reported `unsupported-ui-hint` |

Two Controls on the same scope edit one value: the second gets `valueName` naming the first.

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

The scope a condition reads must have a Control. A condition that cannot be translated, an
unknown effect, or a rule on the root layout or root Categorization (no element carries it) is
reported `assumed-ui-rule`; the element stays visible and enabled.

### RJSF uiSchema

The uiSchema is read per property, down any depth: an object's node holds its properties' nodes,
an array's `items` node applies to its template, and a `oneOf` variant or a question created by
`then` reads its object's node. `ui:options` is read like the matching `ui:` keys, and the later
key wins, as in RJSF's `getUiOptions`. Each node is reported once, however many times it is read.

| Key | SurveyJS | Notes |
| --- | --- | --- |
| `ui:title`, `ui:description` | `title`, `description` | On the root node, the survey's |
| `ui:placeholder` | `placeholder` | `text` and `comment` only |
| `ui:order` | Element order | `"*"` places the rest. Keys it does not list are kept. |
| `ui:disabled`, `ui:readonly` | `readOnly` | On questions and panels |
| `ui:widget` | See below | |

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
| Anything else, such as `help`, `emptyValue`, `enumDisabled`, `addable`, `removable`, `orderable`, `inputType`, or a key RJSF adds later | `unsupported-ui-hint` |

### JSON Schema report codes

| Code | Bucket | Meaning |
| --- | --- | --- |
| `json-schema.unsupported-keyword` | unsupported | A `oneOf` of objects with no discriminator, or nesting past the depth limit |
| `json-schema.unsupported-ui-hint` | unsupported | A JSONForms node or option, or an RJSF key or widget, with no mapping |
| `json-schema.unknown-keyword` | unknown | Defined, never emitted. `npm run corpus:refresh` catches a new keyword or UI key instead. |
| `json-schema.assumed-if-then-else` | assumed | An `if` that cannot be translated |
| `json-schema.assumed-oneof-discriminator` | assumed | An inferred discriminator, or a variant value that cannot be written |
| `json-schema.assumed-dependencies` | assumed | Every dependency |
| `json-schema.assumed-allof-merge` | assumed | Conflicting property types across `allOf` |
| `json-schema.assumed-exclusive-bound` | assumed | An exclusive bound on a `number` |
| `json-schema.assumed-ui-rule` | assumed | A JSONForms rule that cannot be translated or carried |
| `json-schema.dropped-remote-ref` | dropped | A remote `$ref`, or a JSONForms scope that resolves to nothing |
| `json-schema.dropped-custom-renderer` | dropped | RJSF custom fields, templates and widget functions |
| `json-schema.dropped-styling` | dropped | RJSF presentation options |
