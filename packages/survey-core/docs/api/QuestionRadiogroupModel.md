---
title: QuestionRadiogroupModel
product: Form Library
api-type: class
description: "A class that describes the Radio Button Group question type. [View Demo](https://surveyjs.io/form-library/examples/questiontype-radiogroup/ (linkStyle))"
source: 
---

# `QuestionRadiogroupModel`

A class that describes the Radio Button Group question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-radiogroup/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase` &rarr; `QuestionCheckboxBase` &rarr; `QuestionRadiogroupModel`

## Properties

### `selectedItem`

Returns the selected choice item. If no item is selected, returns `null`.

**Type**: `ChoiceItem`

### `allowClear`

Specifies whether to display a button that clears the question value.

Default value: `false`

**Type**: `boolean`

### `showClearButton`

**Type**: `boolean`

### `canShowClearButton`

**Type**: `boolean`

### `clearButtonCaption`

**Type**: `string`

### `isNewA11yStructure`

**Type**: `boolean`

### `a11y_input_ariaRole`

**Type**: `string`

## Methods

### `getType()`

**Return value:** `string`

### `getConditionJson()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `operator` | `string` |  |
| `path` | `string` |  |

### `clickItemHandler()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |
