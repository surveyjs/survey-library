---
title: QuestionTagboxModel
product: Form Library
api-type: class
description: A class that describes the Multi-Select Dropdown (Tag Box) question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questiontagboxmodel
---

# `QuestionTagboxModel`

A class that describes the Multi-Select Dropdown (Tag Box) question type.

[View Demo](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase` &rarr; `QuestionCheckboxBase` &rarr; `QuestionCheckboxModel` &rarr; `QuestionTagboxModel`

## Properties

### `allowClear`

Specifies whether to display a button that clears the selected value.

**Type**: `boolean`

### `allowCustomChoices`

Specifies whether users can add their own choices if the desired option isn't available in the dropdown.

Default value: `false`

>  Custom choices will only be stored temporarily for the duration of the current browser session. If you want to save them in a data storage, handle the [`onCreateCustomChoiceItem`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCreateCustomChoiceItem) event.

**Type**: `boolean`

### `choicesLazyLoadEnabled`

Enables lazy loading. If you set this property to `true`, you should implement the Survey's [`onChoicesLazyLoad`](https://surveyjs.io/form-library/documentation/surveymodel#onChoicesLazyLoad) event handler.

**Type**: `boolean`

### `choicesLazyLoadPageSize`

Specifies the number of choice items to load at a time when choices are loaded on demand.

**Type**: `number`

### `closeOnSelect`

Specifies whether to close the drop-down menu after a user selects a value.

**Type**: `number`

### `hideSelectedItems`

Specifies whether to remove selected items from the drop-down list.

**Type**: `boolean`

### `placeholder`

A text displayed in the input field when it doesn't have a value.

**Type**: `string`

### `searchEnabled`

Specifies whether users can enter a value into the input field to filter the drop-down list.

**Type**: `boolean`

### `searchMode`

Specifies a comparison operation used to filter the drop-down list. Applies only if [`searchEnabled`](#searchEnabled) is `true`.

Possible values:

- `"contains"` (default)
- `"startsWith"`

**Type**: `"contains" | "startsWith"`
