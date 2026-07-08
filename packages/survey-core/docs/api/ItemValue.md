---
title: ItemValue
product: Form Library
api-type: class
description: Array of ItemValue is used in checkbox, dropdown and radiogroup choices, matrix columns and rows.
source: https://surveyjs.io/form-library/documentation/api-reference/itemvalue
---

# `ItemValue`

Array of ItemValue is used in checkbox, dropdown and radiogroup choices, matrix columns and rows.
It has two main properties: value and text. If text is empty, value is used for displaying.
The text property is localizable and support markdown.

## Methods

### `setData()`

Resets the input array and fills it with values from the values array

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | `ItemValue[]` |  |
| `values` | `any[]` |  |
| `type` | `string` |  |
