---
title: MultipleTextItemModel
product: Form Library
api-type: class
description: "A class that describes an [item](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model#items) in a Multiple Textboxes question. [View Demo](https://surveyjs.io/form-library/examples/multiple-text-box-question/ (linkStyle))"
source: 
---

# `MultipleTextItemModel`

A class that describes an [item](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model#items) in a Multiple Textboxes question.

[View Demo](https://surveyjs.io/form-library/examples/multiple-text-box-question/ (linkStyle))

## Inheritance

`Base` &rarr; `MultipleTextItemModel`

## Properties

### `editorValue`

**Type**: `MultipleTextEditorModel`

### `data`

**Type**: `IMultipleTextData`

### `valueChangedCallback`

**Type**: `(newValue: any) => void`

### `id`

**Type**: `string`

### `name`

An item ID that is not visible to respondents.

> Item IDs must be unique.

**Type**: `string`

### `question`

**Type**: `Question`

### `editor`

**Type**: `MultipleTextEditorModel`

### `focusIn`

**Type**: `() => void`

### `isRequired`

Marks the item as required. If a respondent leaves this item empty, the question displays a [validation error](#requiredErrorText).

**Type**: `boolean`

### `inputType`

A value passed on to the [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) attribute of the underlying `<input>` element.

Default value: `"text"`

[View Demo](https://surveyjs.io/form-library/examples/multiple-text-box-question/ (linkStyle))

**Type**: `string`

### `title`

A user-friendly item label to display. If `title` is undefined, [`name`](https://surveyjs.io/form-library/documentation/api-reference/multipletextitemmodel#name) is displayed instead.

**Type**: `string`

### `fullTitle`

**Type**: `string`

### `maxLength`

The maximum text length measured in characters. Assign 0 if the length should be unlimited.

Default value: -1 (inherits the actual value from the `SurveyModel`'s [`maxTextLength`](https://surveyjs.io/form-library/documentation/surveymodel#maxTextLength) property).

**Type**: `number`

### `placeholder`

A placeholder for the input field.

**Type**: `string`

### `placeHolder`

**Type**: `string`

### `requiredErrorText`

Specifies a custom error message for a [required item](#isRequired).

**Type**: `string`

### `inputSize`

A value passed on to the [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size) attribute of the underlying `<input>` element.

If you want to set a uniform `inputSize` for all text box items, use the [`inputSize`](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model#inputSize) property within the Multiple Textboxes configuration.

**Type**: `number`

### `size`

**Type**: `number`

### `defaultValueExpression`

An [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) used to calculate the default item value.

**Type**: `string`

### `minValueExpression`

An [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) used to calculate the minimum item value.

**Type**: `string`

### `maxValueExpression`

An [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) used to calculate the maximum item value.

**Type**: `string`

### `validators`

Item validators.

[View Demo](https://surveyjs.io/form-library/examples/multiple-text-box-question/ (linkStyle))

**Type**: `SurveyValidator[]`

### `maskType`

Specifies the type of a mask applied to the input.

Possible values:

- `"none"` (default)
- `"numeric"`
- `"currency"`
- `"datetime"`
- `"pattern"`

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

**Type**: `string`

### `maskSettings`

An object with properties that configure the mask applied to the input.

Available properties depend on the specified [`maskType`](#maskType) and belong to corresponding classes. Refer to the class APIs for a full list of properties:

| `maskType` | Class |
| ---------- | ----- |
| `"numeric"` | [`InputMaskNumeric`](https://surveyjs.io/form-library/documentation/api-reference/inputmasknumeric) |
| `"currency"` | [`InputMaskCurrency`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskcurrency) |
| `"datetime"` | [`InputMaskDateTime`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskdatetime) |
| `"pattern"` | [`InputMaskPattern`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskpattern) |

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

**Type**: `InputMaskBase`

### `inputTextAlignment`

Specifies text alignment within the input field.

Possible values:

- `"left"` - Aligns input text to the left side.
- `"right"` - Aligns input text to the right side.
- `"auto"` (default) - Applies right alignment if a [numeric or currency input mask](https://surveyjs.io/form-library/documentation/api-reference/multipletextitemmodel#maskType) is specified. Otherwise, applies left alignment.

**Type**: `"auto" | "left" | "right"`

### `value`

An item value.

**Type**: `any`

## Methods

### `getType()`

**Return value:** `string`

### `getOwner()`

**Return value:** `Question`

### `getOriginalObj()`

**Return value:** `Base`

### `addUsedLocales()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `locales` | `string[]` |  |

### `localeChanged()`

### `locStrsChanged()`

### `getMaxLength()`

**Return value:** `any`

### `getValidators()`

**Return value:** `SurveyValidator[]<SurveyValidator>`

### `isEmpty()`

**Return value:** `boolean`

### `onValueChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `newValue` | `any` |  |
