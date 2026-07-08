---
title: MultipleTextItemModel
product: Form Library
api-type: class
description: A class that describes an item in a Multiple Textboxes question.
source: https://surveyjs.io/form-library/documentation/api-reference/multipletextitemmodel
---

# `MultipleTextItemModel`

A class that describes an [item](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model#items) in a Multiple Textboxes question.

[View Demo](https://surveyjs.io/form-library/examples/multiple-text-box-question/ (linkStyle))

## Inheritance

`Base` &rarr; `MultipleTextItemModel`

## Properties

### `defaultValueExpression`

**Type**: `string`

An [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) used to calculate the default item value.

### `inputSize`

**Type**: `number`

A value passed on to the [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size) attribute of the underlying `<input>` element.

If you want to set a uniform `inputSize` for all text box items, use the [`inputSize`](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model#inputSize) property within the Multiple Textboxes configuration.

### `inputTextAlignment`

**Type**: `"auto" | "left" | "right"`

Specifies text alignment within the input field.

Possible values:

- `"left"` - Aligns input text to the left side.
- `"right"` - Aligns input text to the right side.
- `"auto"` (default) - Applies right alignment if a [numeric or currency input mask](https://surveyjs.io/form-library/documentation/api-reference/multipletextitemmodel#maskType) is specified. Otherwise, applies left alignment.

### `inputType`

**Type**: `string`

A value passed on to the [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) attribute of the underlying `<input>` element.

Default value: `"text"`

[View Demo](https://surveyjs.io/form-library/examples/multiple-text-box-question/ (linkStyle))

### `isRequired`

**Type**: `boolean`

Marks the item as required. If a respondent leaves this item empty, the question displays a [validation error](#requiredErrorText).

### `maskSettings`

**Type**: `InputMaskBase`

An object with properties that configure the mask applied to the input.

Available properties depend on the specified [`maskType`](#maskType) and belong to corresponding classes. Refer to the class APIs for a full list of properties:

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

### `maxLength`

**Type**: `number`

The maximum text length measured in characters. Assign 0 if the length should be unlimited.

Default value: -1 (inherits the actual value from the `SurveyModel`'s [`maxTextLength`](https://surveyjs.io/form-library/documentation/surveymodel#maxTextLength) property).

### `maxValueExpression`

**Type**: `string`

An [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) used to calculate the maximum item value.

### `minValueExpression`

**Type**: `string`

An [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) used to calculate the minimum item value.

### `name`

**Type**: `string`

An item ID that is not visible to respondents.

> Item IDs must be unique.

### `placeholder`

**Type**: `string`

A placeholder for the input field.

### `requiredErrorText`

**Type**: `string`

Specifies a custom error message for a [required item](#isRequired).

### `title`

**Type**: `string`

A user-friendly item label to display. If `title` is undefined, [`name`](https://surveyjs.io/form-library/documentation/api-reference/multipletextitemmodel#name) is displayed instead.

### `validators`

**Type**: `SurveyValidator[]`

Item validators.

[View Demo](https://surveyjs.io/form-library/examples/multiple-text-box-question/ (linkStyle))

### `value`

**Type**: `any`

An item value.
