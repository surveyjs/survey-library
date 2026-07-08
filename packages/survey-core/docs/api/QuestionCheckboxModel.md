---
title: QuestionCheckboxModel
product: Form Library
api-type: class
description: A class that describes the Checkboxes question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questioncheckboxmodel
---

# `QuestionCheckboxModel`

A class that describes the Checkboxes question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-checkbox/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase` &rarr; `QuestionCheckboxBase` &rarr; `QuestionCheckboxModel`

## Properties

### `isAllSelected`

Returns `true` if all choice options, except [special options](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/documentation#display-special-choices), are selected.

**Type**: `boolean`

### `maxSelectedChoices`

Specifies the maximum number of selected choices.

Default value: 0 (unlimited)

> This property only limits the number of choice items that can be selected by users. You can select any number of choice items in code, regardless of the `maxSelectedChoices` value.

[Ranking Demo](https://surveyjs.io/form-library/examples/select-items-to-rank/ (linkStyle))

**Type**: `number`

### `minSelectedChoices`

Specifies the minimum number of selected choices.

Default value: 0 (unlimited)

> This property only limits the number of choice items that can be selected by users. You can select any number of choice items in code, regardless of the `minSelectedChoices` value.

[Ranking Demo](https://surveyjs.io/form-library/examples/select-items-to-rank/ (linkStyle))

**Type**: `number`

### `selectAllItem`

Returns the "Select All" choice item. Use this property to change the item's `value` or `text`.

**Type**: `ItemValue`

### `selectAllText`

Gets or sets a caption for the "Select All" choice item.

**Type**: `string`

### `selectedChoices`

An array of selected choice items. Includes the "Other", "None", "Refuse to answer", and "Don't know" choice items if they are selected, but not "Select All". Items are sorted in the order they were selected.

**Type**: `ItemValue[]`

### `showSelectAllItem`

Enable this property to display a "Select All" item. When users select it, all other choice options, except [special options](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/documentation#display-special-choices), also become selected.

**Type**: `boolean`

### `valuePropertyName`

Specifies a property name used to store selected values.

Set this property if you want to store selected values in an array of objects instead of an array of primitive values. For example, if you set `valuePropertyName` to `"car"`, the `value` property will contain an array of objects `[{ car: "Ford" }, { car: "Tesla" }]`, not an array of string values `[ "Ford", "Tesla" ]`.

[View Demo](https://surveyjs.io/form-library/examples/merge-question-values/ (linkStyle))

**Type**: `string`

## Methods

### `selectAll()`

Selects all choice options, except [special options](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/documentation#display-special-choices).

To clear selection, call the `clearValue()` method.
