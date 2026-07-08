---
title: InputMaskCurrency
product: Form Library
api-type: class
description: "A class that describes an input mask of the `\"currency\"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType). The following code shows how to specify the properties of this class within a survey JSON schema: ```js const surveyJson = { \"elements\": [{ \"name\": \"textquestion1\" \"type\": \"text\", \"maskType\": \"currency\", \"maskSettings\": { // Specify the properties of a currency input mask here } }] } ``` [View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))"
source: 
---

# `InputMaskCurrency`

A class that describes an input mask of the `"currency"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType).

The following code shows how to specify the properties of this class within a survey JSON schema:

```js
const surveyJson = {
  "elements": [{
    "name": "textquestion1"
    "type": "text",
    "maskType": "currency",
    "maskSettings": {
      // Specify the properties of a currency input mask here
    }
  }]
}
```

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

## Inheritance

`Base` &rarr; `InputMaskBase` &rarr; `InputMaskNumeric` &rarr; `InputMaskCurrency`

## Properties

### `prefix`

One or several symbols to be displayed before the currency value.

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

**Type**: `string`

### `suffix`

One or several symbols to be displayed after the currency value.

**Type**: `string`

## Methods

### `getType()`

**Return value:** `string`

### `unwrapInputArgs()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `args` | `ITextInputParams` |  |

### `processInput()`

**Return value:** `IMaskedInputResult`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `args` | `ITextInputParams` |  |

### `getMaskedValue()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `src` | `any` |  |
