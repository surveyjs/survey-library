---
title: AnswerCountValidator
product: Form Library
api-type: class
description: "A class that implements answer count validation in the question types that can have multiple values (for instance, [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model)). [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))"
source: 
---

# `AnswerCountValidator`

A class that implements answer count validation in the question types that can have multiple values (for instance, [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model)).

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyValidator` &rarr; `AnswerCountValidator`

## Properties

### `minCount`

A minimum number of selected answers.

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

**Type**: `number`

### `maxCount`

A maximum number of selected answers.

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

**Type**: `number`

## Methods

### `getType()`

**Return value:** `string`

### `validate()`

**Return value:** `ValidatorResult`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` |  |
| `name` | `string` |  |
| `properties` | `any` |  |
