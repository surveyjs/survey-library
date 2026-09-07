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

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; `QuestionBooleanModel`

## Properties

### `booleanValue`

**Type**: `any`

Gets or sets the question value as a Boolean value.

If you set the `valueTrue` and `valueFalse` properties, the `value` property contains their values instead of Boolean values. This may be inconvenient when you operate the question value in code. To access the standard Boolean values, use the `booleanValue` property.

**Related APIs:** [`valueTrue`](#valueTrue), [`valueFalse`](#valueFalse)

### `displayMode`

**Type**: `"custom" | "checkbox" | "radio" | "segmented" | "switch"`

Specifies the visual representation of the Yes/No question.

Possible values:

- `"segmented"` (default) - Displays a segmented toggle on wide screens and radio buttons on narrow screens.
- `"radio"` - Displays Yes/No options as radio buttons.
- `"checkbox"` - Displays a single checkbox.
- `"switch"` - Displays a switch control with the question title.
- `"custom"` - Assigned automatically when the `renderAs` property contains a custom renderer name.

Available since: v3.0.0

**Related APIs:** [`useTitleAsLabel`](#useTitleAsLabel)

### `labelFalse`

**Type**: `string`

Gets or sets a text label that corresponds to a negative answer.

Default value: "No"

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

**Related APIs:** [`valueTrue`](#valueTrue), [`valueFalse`](#valueFalse)

### `labelTrue`

**Type**: `string`

Gets or sets a text label that corresponds to a positive answer.

Default value: "Yes"

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

**Related APIs:** [`valueTrue`](#valueTrue), [`valueFalse`](#valueFalse)

### `swapOrder`

**Type**: `boolean`

Specifies whether to swap the order of the Yes and No answers.

Default value: `false`

By default, the order is [ "No", "Yes"]. Enable this property to reorder the answers as follows: [ "Yes", "No" ].

### `useTitleAsLabel`

**Type**: `boolean`

Specifies whether to display the question title as a label next to the checkbox or switch control. Applies only when [`displayMode`](#displayMode) is set to `"checkbox"` or `"switch"`.

Default value: `true`

Set this property to `false` to display the question title according to the [`titleLocation`](https://surveyjs.io/form-library/documentation/api-reference/boolean-question-model#titleLocation) property.

Available since: v3.0.0

### `valueFalse`

**Type**: `any`

A value to save in survey results when respondents give a negative answer.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

**Related APIs:** [`labelTrue`](#labelTrue), [`labelFalse`](#labelFalse)

### `valueTrue`

**Type**: `any`

A value to save in survey results when respondents give a positive answer.

Default value: `true`

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

**Related APIs:** [`labelTrue`](#labelTrue), [`labelFalse`](#labelFalse)
