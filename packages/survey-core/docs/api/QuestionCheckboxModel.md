---
title: QuestionCheckboxModel
product: Form Library
api-type: class
description: "A class that describes the Checkboxes question type. [View Demo](https://surveyjs.io/form-library/examples/questiontype-checkbox/ (linkStyle))"
source: 
---

# `QuestionCheckboxModel`

A class that describes the Checkboxes question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-checkbox/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase` &rarr; `QuestionCheckboxBase` &rarr; `QuestionCheckboxModel`

## Properties

### `selectAllItemValue`

**Type**: `ItemValue`

### `invisibleOldValues`

**Type**: `any`

### `valuePropertyName`

Specifies a property name used to store selected values.

Set this property if you want to store selected values in an array of objects instead of an array of primitive values. For example, if you set `valuePropertyName` to `"car"`, the `value` property will contain an array of objects `[{ car: "Ford" }, { car: "Tesla" }]`, not an array of string values `[ "Ford", "Tesla" ]`.

[View Demo](https://surveyjs.io/form-library/examples/merge-question-values/ (linkStyle))

**Type**: `string`

### `selectAllItem`

Returns the "Select All" choice item. Use this property to change the item's `value` or `text`.

**Type**: `ItemValue`

### `selectAllText`

Gets or sets a caption for the "Select All" choice item.

**Type**: `string`

### `locSelectAllText`

**Type**: `LocalizableString`

### `showSelectAllItem`

Enable this property to display a "Select All" item. When users select it, all other choice options, except [special options](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/documentation#display-special-choices), also become selected.

**Type**: `boolean`

### `hasSelectAll`

**Type**: `boolean`

### `isAllSelected`

Returns `true` if all choice options, except [special options](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/documentation#display-special-choices), are selected.

**Type**: `boolean`

### `isTheOnlyComment`

**Type**: `boolean`

### `isValueArray`

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

### `selectedChoices`

An array of selected choice items. Includes the "Other", "None", "Refuse to answer", and "Don't know" choice items if they are selected, but not "Select All". Items are sorted in the order they were selected.

**Type**: `ItemValue[]`

### `selectedItems`

**Type**: `ItemValue[]`

### `hasFilteredValue`

**Type**: `boolean`

### `isChangingValueOnClearIncorrect`

**Type**: `boolean`

### `checkBoxSvgPath`

**Type**: `string`

### `isNewA11yStructure`

**Type**: `boolean`

### `a11y_input_ariaRole`

**Type**: `string`

### `a11y_input_ariaRequired`

**Type**: `"true" | "false"`

## Methods

### `getType()`

**Return value:** `string`

### `getValuePropertyName()`

**Return value:** `string`

### `getQuestionFromArray()`

**Return value:** `IQuestion`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `index` | `number` |  |

### `toggleSelectAll()`

### `selectAll()`

Selects all choice options, except [special options](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/documentation#display-special-choices).

To clear selection, call the `clearValue()` method.

### `unselectAll()`

### `clickItemHandler()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |
| `checked` | `boolean` |  |

### `selectItem()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |
| `checked` | `boolean` |  |

### `getFilteredName()`

**Return value:** `any`

### `getFilteredValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `isUnwrapped` | `boolean` |  |

### `getStoreOthersAsComment()`

**Return value:** `boolean`

### `isBuiltInChoice()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `isItemInList()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getConditionJson()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `operator` | `string` |  |
| `path` | `string` |  |

### `isAnswerCorrect()`

**Return value:** `boolean`
