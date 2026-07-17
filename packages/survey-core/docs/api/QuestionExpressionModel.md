---
title: QuestionExpressionModel
product: Form Library
api-type: class
description: A class that describes the Expression question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionexpressionmodel
---

# `QuestionExpressionModel`

A class that describes the Expression question type. It is a read-only question type that calculates a value based on a specified expression.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-expression/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; `QuestionExpressionModel`

## Properties

### `currency`

**Type**: `string`

A three-letter currency code. Applies only if the `displayStyle` property is set to `"currency"`.

Default value: "USD".

**Related APIs:** [`displayStyle`](#displayStyle), [`minimumFractionDigits`](#minimumFractionDigits), [`maximumFractionDigits`](#maximumFractionDigits), [`format`](#format)

### `displayStyle`

**Type**: `string`

Specifies a display style for the question value.

Possible values:

- `"decimal"`
- `"currency"`
- `"percent"`
- `"date"`
- `"none"` (default)

If you use the `"currency"` display style, you can also set the `currency` property to specify a currency other than USD.

[View Demo](https://surveyjs.io/form-library/examples/expression-question-for-dynamic-form-calculations/ (linkStyle))

**Related APIs:** [`currency`](#currency), [`minimumFractionDigits`](#minimumFractionDigits), [`maximumFractionDigits`](#maximumFractionDigits), [`format`](#format)

### `expression`

**Type**: `string`

An expression used to calculate the question value.

Refer to the following help topic for more information: [Expressions](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#expressions).

[View Demo](https://surveyjs.io/form-library/examples/expression-question-for-dynamic-form-calculations/ (linkStyle))

### `format`

**Type**: `string`

A string that formats a question value. Use `{0}` to reference the question value in the format string.

**Related APIs:** [`displayStyle`](#displayStyle)

### `maximumFractionDigits`

**Type**: `number`

The maximum number of fraction digits. Applies only if the `displayStyle` property is not `"none"`. Accepts values in the range from -1 to 20, where -1 disables the property.

Default value: -1

**Related APIs:** [`displayStyle`](#displayStyle), [`minimumFractionDigits`](#minimumFractionDigits), [`precision`](#precision)

### `minimumFractionDigits`

**Type**: `number`

The minimum number of fraction digits. Applies only if the `displayStyle` property is not `"none"`. Accepts values in the range from -1 to 20, where -1 disables the property.

Default value: -1

**Related APIs:** [`displayStyle`](#displayStyle), [`maximumFractionDigits`](#maximumFractionDigits)

### `precision`

**Type**: `number`

Specifies how many decimal digits to keep in the expression value.

Default value: -1 (unlimited)

**Related APIs:** [`maximumFractionDigits`](#maximumFractionDigits)

### `useGrouping`

**Type**: `boolean`

Specifies whether to use grouping separators in number representation. Separators depend on the selected [locale](https://surveyjs.io/form-library/documentation/surveymodel#locale).

Default value: `true`
