---
title: QuestionDropdownModel
product: Form Library
api-type: class
description: A class that describes the Dropdown question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questiondropdownmodel
---

# `QuestionDropdownModel`

A class that describes the Dropdown question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-dropdown/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; [`QuestionSelectBase`](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase.md) &rarr; `QuestionDropdownModel`

## Properties

### `allowClear`

**Type**: `boolean`

Specifies whether to display a button that clears the selected value.

### `allowCustomChoices`

**Type**: `boolean`

Specifies whether users can add their own choices if the desired option isn't available in the dropdown.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/dropdown-custom-choice-options/ (linkStyle))

> Custom choices will only be stored temporarily for the duration of the current browser session. If you want to save them in a database or another data storage, handle the [`onCreateCustomChoiceItem`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCreateCustomChoiceItem) event.

Available since: v2.0.4

### `choicesLazyLoadEnabled`

**Type**: `boolean`

Enables lazy loading. If you set this property to `true`, you should implement the Survey's [`onChoicesLazyLoad`](https://surveyjs.io/form-library/documentation/surveymodel#onChoicesLazyLoad) event handler.

**Related APIs:** [`choicesLazyLoadPageSize`](#choicesLazyLoadPageSize), [`SurveyModel.onChoicesLazyLoad`](#SurveyModel.onChoicesLazyLoad)

### `choicesLazyLoadPageSize`

**Type**: `number`

Specifies the number of choice items to load at a time when choices are loaded on demand.

Default value: 25

> This property does not accept values below 25 to prevent the server from being flooded with requests.

**Related APIs:** [`choicesLazyLoadEnabled`](#choicesLazyLoadEnabled), [`SurveyModel.onChoicesLazyLoad`](#SurveyModel.onChoicesLazyLoad)

### `choicesMax`

**Type**: `number`

Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. For example, the configuration below generates three choice items: [10, 20, 30].

```js
"choicesMin": 10,
"choicesMax": 30
"choicesStep": 10
```

**Related APIs:** [`choicesMin`](#choicesMin), [`choicesStep`](#choicesStep)

### `choicesMin`

**Type**: `number`

Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. For example, the configuration below generates three choice items: [10, 20, 30].

```js
"choicesMin": 10,
"choicesMax": 30
"choicesStep": 10
```

**Related APIs:** [`choicesMax`](#choicesMax), [`choicesStep`](#choicesStep)

### `choicesStep`

**Type**: `number`

Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. For example, the configuration below generates three choice items: [10, 20, 30].

```js
"choicesMin": 10,
"choicesMax": 30
"choicesStep": 10
```

The default value of the `choicesStep` property is 1.

**Related APIs:** [`choicesMin`](#choicesMin), [`choicesMax`](#choicesMax)

### `createCustomChoiceText`

**Type**: `string`

Specifies the text displayed for the command that creates a custom choice. Applies only when [`allowCustomChoices`](#allowCustomChoices) is `true`.

Default value: `"Create \"{0}\" item..."`

Available since: v2.5.17

### `placeholder`

**Type**: `string`

A placeholder for the input field.

### `searchEnabled`

**Type**: `boolean`

Specifies whether users can enter a value into the input field to filter the drop-down list.

[View Demo](https://surveyjs.io/form-library/examples/create-dropdown-menu-in-javascript/ (linkStyle))

**Related APIs:** [`searchMode`](#searchMode), [`SurveyModel.onChoicesSearch`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onChoicesSearch)

### `searchMode`

**Type**: `"contains" | "startsWith"`

Specifies a comparison operation used to filter the drop-down list. Applies only if [`searchEnabled`](#searchEnabled) is `true`.

Possible values:

- `"contains"` (default)
- `"startsWith"`

**Related APIs:** [`SurveyModel.onChoicesSearch`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onChoicesSearch)

### `selectedItem`

**Type**: `ChoiceItem`

Returns the selected choice item. If no item is selected, returns `null`.

### `textWrapEnabled`

**Type**: `boolean`

Specifies whether to wrap long texts in choice options onto a new line.

Default value: `true`

Disable this property if you want the texts to be truncated with ellipsis.
