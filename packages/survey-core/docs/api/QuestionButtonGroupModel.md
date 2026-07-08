---
title: QuestionButtonGroupModel
product: Form Library
api-type: class
description: A Model for a button group question.
source: 
---

# `QuestionButtonGroupModel`

A Model for a button group question.

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase` &rarr; `QuestionCheckboxBase` &rarr; `QuestionButtonGroupModel`

## Properties

### `placeholder`

**Type**: `string`

### `_allowClear`

**Type**: `boolean`

### `readOnlyText`

**Type**: `string`

### `locReadOnlyText`

**Type**: `LocalizableString`

### `inputHasValue`

**Type**: `boolean`

### `showSelectedItemLocText`

**Type**: `boolean`

### `selectedItemLocText`

**Type**: `LocalizableString`

### `dropdownListModelValue`

**Type**: `DropdownListModel`

### `dropdownListModel`

**Type**: `DropdownListModel`

### `selectedItem`

**Type**: `ItemValue`

## Methods

### `locStrsChanged()`

### `getType()`

**Return value:** `string`

### `supportOther()`

**Return value:** `boolean`

### `getControlClass()`

**Return value:** `string`

### `getInputId()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `index` | `number` |  |

### `isItemSelected()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `needResponsiveWidth()`

**Return value:** `boolean`

### `dispose()`
