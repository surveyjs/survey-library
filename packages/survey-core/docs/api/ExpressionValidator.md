---
title: ExpressionValidator
product: Form Library
api-type: class
description: "A class that implements validation using [expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions). [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))"
source: 
---

# `ExpressionValidator`

A class that implements validation using [expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions).

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyValidator` &rarr; `ExpressionValidator`

## Properties

### `conditionRunner`

**Type**: `ConditionRunner`

### `expression`

A Boolean [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions). If it evaluates to `false`, validation fails.

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

**Type**: `string`

## Methods

### `getType()`

**Return value:** `string`

### `validateOnCallback()`

**Return value:** `ValidatorResult`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` |  |
| `callback` | `(res: ValidatorResult) => void` |  |
| `name` | `string` |  |
| `properties` | `any` |  |

### `getValueGetterContext()`

**Return value:** `IValueGetterContext`
