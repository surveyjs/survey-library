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

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionExpressionModel`

## Properties

### `currency`

A three-letter currency code. Applies only if the `displayStyle` property is set to `"currency"`.

Default value: "USD".

**Type**: `string`

### `displayStyle`

Specifies a display style for the question value.

Possible values:

- `"decimal"`
- `"currency"`
- `"percent"`
- `"date"`
- `"none"` (default)

If you use the `"currency"` display style, you can also set the `currency` property to specify a currency other than USD.

[View Demo](https://surveyjs.io/form-library/examples/expression-question-for-dynamic-form-calculations/ (linkStyle))

**Type**: `string`

### `expression`

An expression used to calculate the question value.

Refer to the following help topic for more information: [Expressions](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#expressions).

[View Demo](https://surveyjs.io/form-library/examples/expression-question-for-dynamic-form-calculations/ (linkStyle))

**Type**: `string`

### `format`

A string that formats a question value. Use `{0}` to reference the question value in the format string.

**Type**: `string`

### `maximumFractionDigits`

The maximum number of fraction digits. Applies only if the `displayStyle` property is not `"none"`. Accepts values in the range from -1 to 20, where -1 disables the property.

Default value: -1

**Type**: `number`

### `minimumFractionDigits`

The minimum number of fraction digits. Applies only if the `displayStyle` property is not `"none"`. Accepts values in the range from -1 to 20, where -1 disables the property.

Default value: -1

**Type**: `number`

### `precision`

Specifies how many decimal digits to keep in the expression value.

Default value: -1 (unlimited)

**Type**: `number`

### `useGrouping`

Specifies whether to use grouping separators in number representation. Separators depend on the selected [locale](https://surveyjs.io/form-library/documentation/surveymodel#locale).

Default value: `true`

**Type**: `boolean`
