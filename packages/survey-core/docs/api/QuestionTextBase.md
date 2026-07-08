---
title: QuestionTextBase
product: Form Library
api-type: class
description: A base class for the Single-Line Input and Long Text question types.
source: https://surveyjs.io/form-library/documentation/api-reference/questiontextbase
---

# `QuestionTextBase`

A base class for the [Single-Line Input](https://surveyjs.io/form-library/documentation/questiontextmodel) and [Long Text](https://surveyjs.io/form-library/documentation/questioncommentmodel) question types.

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionTextBase`

## Properties

### `maxLength`

**Type**: `number`

The maximum text length measured in characters. Assign 0 if the length should be unlimited.

Default value: -1 (inherits the actual value from the `SurveyModel`'s [`maxTextLength`](https://surveyjs.io/form-library/documentation/surveymodel#maxTextLength) property).

[Long Text Demo](https://surveyjs.io/form-library/examples/add-open-ended-question-to-a-form/ (linkStyle))

### `placeholder`

**Type**: `string`

A placeholder for the input field.

[View Demo](https://surveyjs.io/form-library/examples/text-entry-question/ (linkStyle))

### `textUpdateMode`

**Type**: `string`

Specifies when to update the question value.

Possible values:

- `"onBlur"` - Updates the value after the input field loses focus.
- `"onTyping"` - Updates the value on every key press.
- `"default"` (default) - Inherits the value from the `SurveyModel`'s [`textUpdateMode`](https://surveyjs.io/form-library/documentation/surveymodel#textUpdateMode) property.

> Do not use the `"onTyping"` mode if your survey contains many expressions. Expressions are re-evaluated each time a question value is changed. In `"onTyping"` mode, the question value changes frequently. This may cause performance degradation.
