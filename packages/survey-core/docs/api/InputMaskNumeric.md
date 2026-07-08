---
title: InputMaskNumeric
product: Form Library
api-type: class
description: "A class that describes an input mask of the `\"numeric\"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType). The following code shows how to specify the properties of this class within a survey JSON schema: ```js const surveyJson = { \"elements\": [{ \"name\": \"textquestion1\" \"type\": \"text\", \"maskType\": \"numeric\", \"maskSettings\": { // Specify the properties of a numeric input mask here } }] } ``` [View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))"
source: 
---

# `InputMaskNumeric`

A class that describes an input mask of the `"numeric"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType).

The following code shows how to specify the properties of this class within a survey JSON schema:

```js
const surveyJson = {
  "elements": [{
    "name": "textquestion1"
    "type": "text",
    "maskType": "numeric",
    "maskSettings": {
      // Specify the properties of a numeric input mask here
    }
  }]
}
```

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

## Inheritance

`Base` &rarr; `InputMaskBase` &rarr; `InputMaskNumeric`

## Properties

### `allowNegativeValues`

Specifies whether respondents can enter negative values.

Default value: `true`

**Type**: `boolean`

### `decimalSeparator`

A symbol used to separate the fractional part from the integer part of a displayed number.

Default value: `"."`

**Type**: `string`

### `precision`

Limits how many digits to retain after the decimal point for a displayed number.

Default value: 2

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

**Type**: `number`

### `thousandsSeparator`

A symbol used to separate the digits of a large number into groups of three.

Default value: `","`

**Type**: `string`

### `min`

A minimum value that respondents can enter.

**Type**: `number`

### `max`

A maximum value that respondents can enter.

**Type**: `number`

## Methods

### `displayNumber()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `parsedNumber` | `INumericalComposition` |  |
| `insertThousandsSeparator` | `boolean` |  |
| `matchWholeMask` | `boolean` |  |

### `convertNumber()`

**Return value:** `number`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `parsedNumber` | `INumericalComposition` |  |

### `validateNumber()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `number` | `INumericalComposition` |  |
| `matchWholeMask` | `boolean` |  |

### `parseNumber()`

**Return value:** `INumericalComposition`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `src` | `string` |  |

### `getNumberMaskedValue()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `src` | `string` |  |
| `matchWholeMask` | `boolean` |  |

### `getTextAlignment()`

**Return value:** `"auto" | "left" | "right"`

### `getMaskedValue()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `src` | `any` |  |

### `getUnmaskedValue()`

**Return value:** `any`

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

### `getType()`

**Return value:** `string`
