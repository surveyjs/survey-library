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

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; [`QuestionSelectBase`](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase.md) &rarr; [`QuestionCheckboxBase`](https://surveyjs.io/form-library/documentation/api-reference/questioncheckboxbase.md) &rarr; [`QuestionCheckboxModel`](https://surveyjs.io/form-library/documentation/api-reference/questioncheckboxmodel.md) &rarr; `QuestionTagboxModel`

## Properties

### `allowClear`

**Type**: `boolean`

Specifies whether to display a button that clears the selected value.

### `allowCustomChoices`

**Type**: `boolean`

Specifies whether users can add their own choices if the desired option isn't available in the dropdown.

Default value: `false`

>  Custom choices will only be stored temporarily for the duration of the current browser session. If you want to save them in a data storage, handle the [`onCreateCustomChoiceItem`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCreateCustomChoiceItem) event.

Available since: v2.0.4

### `choicesLazyLoadEnabled`

**Type**: `boolean`

Enables lazy loading. If you set this property to `true`, you should implement the Survey's [`onChoicesLazyLoad`](https://surveyjs.io/form-library/documentation/surveymodel#onChoicesLazyLoad) event handler.

**Related APIs:** [`choicesLazyLoadPageSize`](#choicesLazyLoadPageSize), [`SurveyModel.onChoicesLazyLoad`](#SurveyModel.onChoicesLazyLoad)

### `choicesLazyLoadPageSize`

**Type**: `number`

Specifies the number of choice items to load at a time when choices are loaded on demand.

**Related APIs:** [`choicesLazyLoadEnabled`](#choicesLazyLoadEnabled), [`SurveyModel.onChoicesLazyLoad`](#SurveyModel.onChoicesLazyLoad)

### `closeOnSelect`

**Type**: `number`

Specifies whether to close the drop-down menu after a user selects a value.

### `hideSelectedItems`

**Type**: `boolean`

Specifies whether to remove selected items from the drop-down list.

### `placeholder`

**Type**: `string`

A text displayed in the input field when it doesn't have a value.

### `searchEnabled`

**Type**: `boolean`

Specifies whether users can enter a value into the input field to filter the drop-down list.

### `searchMode`

**Type**: `"contains" | "startsWith"`

Specifies a comparison operation used to filter the drop-down list. Applies only if [`searchEnabled`](#searchEnabled) is `true`.

Possible values:

- `"contains"` (default)
- `"startsWith"`

**Related APIs:** [`SurveyModel.onChoicesSearch`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onChoicesSearch)
