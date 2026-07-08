---
title: QuestionBooleanModel
product: Form Library
api-type: class
description: "A class that describes the Yes/No (Boolean) question type. [View Demo](https://surveyjs.io/form-library/examples/questiontype-boolean/ (linkStyle))"
source: 
---

# `QuestionBooleanModel`

A class that describes the Yes/No (Boolean) question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-boolean/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionBooleanModel`

## Properties

### `isIndeterminate`

**Type**: `boolean`

### `booleanValue`

Gets or sets the question value as a Boolean value.

If you set the `valueTrue` and `valueFalse` properties, the `value` property contains their values instead of Boolean values. This may be inconvenient when you operate the question value in code. To access the standard Boolean values, use the `booleanValue` property.

**Type**: `any`

### `defaultValue`

**Type**: `any`

### `locTitle`

**Type**: `LocalizableString`

### `labelRenderedAriaID`

**Type**: `string`

### `label`

**Type**: `string`

### `useTitleAsLabel`

**Type**: `boolean`

### `labelTrue`

Gets or sets a text label that corresponds to a positive answer.

Default value: "Yes"

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

**Type**: `string`

### `swapOrder`

Specifies whether to swap the order of the Yes and No answers.

Default value: `false`

By default, the order is [ "No", "Yes"]. Enable this property to reorder the answers as follows: [ "Yes", "No" ].

**Type**: `boolean`

### `labelFalse`

Gets or sets a text label that corresponds to a negative answer.

Default value: "No"

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

**Type**: `string`

### `valueTrue`

A value to save in survey results when respondents give a positive answer.

Default value: `true`

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

**Type**: `any`

### `valueFalse`

A value to save in survey results when respondents give a negative answer.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))

**Type**: `any`

### `svgIcon`

**Type**: `string`

### `itemSvgIcon`

**Type**: `string`

### `allowClick`

**Type**: `boolean`

### `isNewA11yStructure`

**Type**: `boolean`

### `a11y_input_ariaRole`

**Type**: `string`

## Methods

### `getType()`

**Return value:** `string`

### `getDefaultValue()`

**Return value:** `any`

### `beforeDestroyQuestionElement()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |

### `getValueTrue()`

**Return value:** `any`

### `getValueFalse()`

**Return value:** `any`

### `getItemCss()`

**Return value:** `string`

### `getCheckboxItemCss()`

**Return value:** `string`

### `getLabelCss()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `checked` | `boolean` |  |

### `getCheckedLabel()`

**Return value:** `LocalizableString`

### `onLabelClick()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `event` | `any` |  |
| `value` | `boolean` |  |

### `onSwitchClickModel()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `event` | `any` |  |

### `onKeyDownCore()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `event` | `any` |  |

### `getRadioItemClass()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `css` | `any` |  |
| `value` | `any` |  |
