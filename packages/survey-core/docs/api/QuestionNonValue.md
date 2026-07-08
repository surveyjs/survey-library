---
title: QuestionNonValue
product: Form Library
api-type: class
description: "A base class for question types that cannot have a value ([Html](https://surveyjs.io/form-library/documentation/questionhtmlmodel), [Image](https://surveyjs.io/form-library/documentation/questionimagemodel)). This class does not implement new functionality&mdash;it only redefines default values of certain properties inherited from the [`Question`](https://surveyjs.io/form-library/documentation/question) class."
source: 
---

# `QuestionNonValue`

A base class for question types that cannot have a value ([Html](https://surveyjs.io/form-library/documentation/questionhtmlmodel), [Image](https://surveyjs.io/form-library/documentation/questionimagemodel)).

This class does not implement new functionality&mdash;it only redefines default values of certain properties inherited from the [`Question`](https://surveyjs.io/form-library/documentation/question) class.

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionNonValue`

## Properties

### `hasInput`

**Type**: `boolean`

### `hasTitle`

**Type**: `boolean`

### `hasComment`

**Type**: `boolean`

### `ariaRole`

**Type**: `string`

### `ariaRequired`

**Type**: `any`

## Methods

### `getType()`

**Return value:** `string`

### `getTitleLocation()`

**Return value:** `string`

### `getAllErrors()`

**Return value:** `SurveyError[]<SurveyError>`

### `supportAutoAdvance()`

**Return value:** `boolean`

### `addConditionObjectsByContext()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `objects` | `IConditionObject[]` |  |
| `context` | `any` |  |

### `getConditionJson()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `operator` | `string` |  |
| `path` | `string` |  |
