---
title: QuestionTextModel
product: Form Library
api-type: class
description: A class that describes the Single-Line Input question type, which is used to create textual, numeric, date-time, and color input fields.
source: https://surveyjs.io/form-library/documentation/api-reference/questiontextmodel
---

# `QuestionTextModel`

A class that describes the Single-Line Input question type, which is used to create textual, numeric, date-time, and color input fields.

[Text Entry Demo](https://surveyjs.io/form-library/examples/text-entry-question/ (linkStyle))

[Date-Time Entry Demo](https://surveyjs.io/form-library/examples/datetime-entry-question/ (linkStyle))

[Numeric Entry Demo](https://surveyjs.io/form-library/examples/numeric-entry-question/ (linkStyle))

[Color Input Demo](https://surveyjs.io/form-library/examples/color-input-question/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionTextBase` &rarr; `QuestionTextModel`

## Properties

### `autocomplete`

**Type**: `string`

A value passed on to the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) attribute of the underlying `<input>` element.

### `dataList`

**Type**: `string[]`

An array of predefined options from which users can select. This property configures an HTML [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) element and associates it with the underlying `input` element.

### `inputSize`

**Type**: `number`

A value passed on to the [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size) attribute of the underlying `<input>` element.

### `inputTextAlignment`

**Type**: `"auto" | "left" | "right"`

Specifies text alignment within the input field.

Possible values:

- `"left"` - Aligns input text to the left side.
- `"right"` - Aligns input text to the right side.
- `"auto"` (default) - Applies right alignment if a [numeric or currency input mask](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType) is specified. Otherwise, applies left alignment.

### `inputType`

**Type**: `string`

A value passed on to the [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) attribute of the underlying `<input>` element.

Default value: `"text"`

[Text Entry Demo](https://surveyjs.io/form-library/examples/text-entry-question/ (linkStyle))

[Date-Time Entry Demo](https://surveyjs.io/form-library/examples/datetime-entry-question/ (linkStyle))

[Numeric Entry Demo](https://surveyjs.io/form-library/examples/numeric-entry-question/ (linkStyle))

[Color Input Demo](https://surveyjs.io/form-library/examples/color-input-question/ (linkStyle))

### `isMinMaxType`

**Type**: `boolean`

Returns `true` if the specified `inputType` supports the `min` and `max` properties.

### `maskSettings`

**Type**: `InputMaskBase`

An object with properties that configure the mask applied to the input.

Available properties depend on the specified [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType) and belong to corresponding classes. Refer to the class APIs for a full list of properties:

| `maskType` | Class |
| ---------- | ----- |
| `"numeric"` | [`InputMaskNumeric`](https://surveyjs.io/form-library/documentation/api-reference/inputmasknumeric) |
| `"currency"` | [`InputMaskCurrency`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskcurrency) |
| `"datetime"` | [`InputMaskDateTime`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskdatetime) |
| `"pattern"` | [`InputMaskPattern`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskpattern) |

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

### `maskType`

**Type**: `string`

Specifies the type of a mask applied to the input.

Possible values:

- `"none"` (default)
- `"numeric"`
- `"currency"`
- `"datetime"`
- `"pattern"`

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

### `max`

**Type**: `string`

A value passed on to the [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/max) attribute of the underlying `<input>` element.

### `maxErrorText`

**Type**: `string`

An error message to display when the entered value exceeds the maximum accepted value.

### `maxValueExpression`

**Type**: `string`

The maximum value specified as an [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions). For example, `"maxValueExpression": "today(1)"` sets the maximum value to tomorrow.

### `min`

**Type**: `string`

A value passed on to the [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/min) attribute of the underlying `<input>` element.

### `minErrorText`

**Type**: `string`

An error message to display when the entered value is less than the minimum accepted value.

### `minValueExpression`

**Type**: `string`

The minimum value specified as an [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions). For example, `"minValueExpression": "today(-1)"` sets the minimum value to yesterday.

### `step`

**Type**: `string`

A value passed on to the [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/step) attribute of the underlying `<input>` element.

### `stepErrorText`

**Type**: `string`

An error message to display when the entered value does not match the [step size](#step).
