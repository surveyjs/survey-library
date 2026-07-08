---
title: ISurveyValidation
product: Form Library
api-type: interface
description: Validation-related members for questions and panels.
source: 
---

# `ISurveyValidation`

Validation-related members for questions and panels.

## Properties

### `isValidateOnValueChanging`

**Type**: `boolean`

### `isValidateOnValueChanged`

**Type**: `boolean`

## Methods

### `validateQuestion()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `errors` | `SurveyError[]` |  |
| `fireCallback` | `boolean` |  |

### `validatePanel()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `panel` | `IPanel` |  |
| `errors` | `SurveyError[]` |  |
| `fireCallback` | `boolean` |  |

### `createRegexValidator()`

**Return value:** `RegExp`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `validator` | `Base` |  |
| `pattern` | `string` |  |
| `flags` | `string` |  |

### `getValidateVisitedEmptyFields()`

**Return value:** `boolean`
