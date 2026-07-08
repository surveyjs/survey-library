---
title: QuestionBooleanModel
product: Form Library
api-type: class
description: A class that describes the Yes/No (Boolean) question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionbooleanmodel
---

# `QuestionBooleanModel`

A class that describes the Yes/No (Boolean) question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-boolean/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionBooleanModel`

## Properties

### `booleanValue`

**Type**: `any`

Gets or sets the question value as a Boolean value.

If you set the `valueTrue` and `valueFalse` properties, the `value` property contains their values instead of Boolean values. This may be inconvenient when you operate the question value in code. To access the standard Boolean values, use the `booleanValue` property.

### `labelFalse`

**Type**: `string`

Gets or sets a text label that corresponds to a negative answer.

Default value: "No"

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

### `labelTrue`

**Type**: `string`

Gets or sets a text label that corresponds to a positive answer.

Default value: "Yes"

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

### `swapOrder`

**Type**: `boolean`

Specifies whether to swap the order of the Yes and No answers.

Default value: `false`

By default, the order is [ "No", "Yes"]. Enable this property to reorder the answers as follows: [ "Yes", "No" ].

### `valueFalse`

**Type**: `any`

A value to save in survey results when respondents give a negative answer.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

### `valueTrue`

**Type**: `any`

A value to save in survey results when respondents give a positive answer.

Default value: `true`

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))
