---
title: InputMaskDateTime
product: Form Library
api-type: class
description: "A class that describes an input mask of the `\"datetime\"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType). The following code shows how to specify the properties of this class within a survey JSON schema: ```js const surveyJson = { \"elements\": [{ \"name\": \"textquestion1\" \"type\": \"text\", \"maskType\": \"datetime\", \"maskSettings\": { // Specify the properties of a date-time input mask here } }] } ``` [View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))"
source: 
---

# `InputMaskDateTime`

A class that describes an input mask of the `"datetime"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType).

The following code shows how to specify the properties of this class within a survey JSON schema:

```js
const surveyJson = {
  "elements": [{
    "name": "textquestion1"
    "type": "text",
    "maskType": "datetime",
    "maskSettings": {
      // Specify the properties of a date-time input mask here
    }
  }]
}
```

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

## Inheritance

`Base` &rarr; `InputMaskBase` &rarr; `InputMaskPattern` &rarr; `InputMaskDateTime`

## Properties

### `defaultDate`

**Type**: `string`

### `turnOfTheCentury`

**Type**: `number`

### `twelve`

**Type**: `number`

### `lexems`

**Type**: `IDateTimeMaskLexem[]`

### `inputDateTimeData`

**Type**: `IInputDateTimeData[]`

### `validBeginningOfNumbers`

**Type**: `{ [key: string]: any; }`

### `min`

A minimum date and time value that respondents can enter.

**Type**: `string`

### `max`

A maximum date and time value that respondents can enter.

**Type**: `string`

### `hasDatePart`

**Type**: `boolean`

### `hasTimePart`

**Type**: `boolean`

### `hasSeconds`

**Type**: `boolean`

## Methods

### `getType()`

**Return value:** `string`

### `getTypeForExpressions()`

**Return value:** `string`

### `getISO_8601Format()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `dateTime` | `IDateTimeComposition` |  |

### `getUnmaskedValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `src` | `string` |  |

### `getMaskedValue()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `src` | `string` |  |

### `processInput()`

**Return value:** `IMaskedInputResult`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `args` | `ITextInputParams` |  |
