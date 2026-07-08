---
title: InputMaskBase
product: Form Library
api-type: class
description: "A base class for classes that implement input masks: - [`InputMaskNumeric`](https://surveyjs.io/form-library/documentation/inputmasknumeric) - [`InputMaskCurrency`](https://surveyjs.io/form-library/documentation/inputmaskcurrency) - [`InputMaskDateTime`](https://surveyjs.io/form-library/documentation/inputmaskdatetime) - [`InputMaskPattern`](https://surveyjs.io/form-library/documentation/inputmaskpattern)"
source: 
---

# `InputMaskBase`

A base class for classes that implement input masks:

- [`InputMaskNumeric`](https://surveyjs.io/form-library/documentation/inputmasknumeric)
- [`InputMaskCurrency`](https://surveyjs.io/form-library/documentation/inputmaskcurrency)
- [`InputMaskDateTime`](https://surveyjs.io/form-library/documentation/inputmaskdatetime)
- [`InputMaskPattern`](https://surveyjs.io/form-library/documentation/inputmaskpattern)

## Inheritance

`Base` &rarr; `InputMaskBase`

## Properties

### `saveMaskedValue`

Specifies whether to store the question value with an applied mask in survey results.

Default value: `false`

**Type**: `boolean`

### `owner`

**Type**: `ISurveyImpl`

## Methods

### `getSurvey()`

**Return value:** `ISurvey`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `live` | `boolean` |  |

### `getType()`

**Return value:** `string`

### `setData()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `json` | `any` |  |

### `getData()`

**Return value:** `any`

### `processInput()`

**Return value:** `IMaskedInputResult`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `args` | `ITextInputParams` |  |

### `getUnmaskedValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `src` | `string` |  |

### `getMaskedValue()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `src` | `any` |  |

### `getTextAlignment()`

**Return value:** `"auto" | "left" | "right"`

### `getTypeForExpressions()`

**Return value:** `string`
