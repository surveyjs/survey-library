---
title: InputMaskCurrency
product: Form Library
api-type: class
description: "A class that describes an input mask of the `\"currency\"` `maskType`."
source: https://surveyjs.io/form-library/documentation/api-reference/inputmaskcurrency
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

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`InputMaskBase`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskbase.md) &rarr; [`InputMaskNumeric`](https://surveyjs.io/form-library/documentation/api-reference/inputmasknumeric.md) &rarr; `InputMaskCurrency`

## Properties

### `prefix`

**Type**: `string`

One or several symbols to be displayed before the currency value.

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

**Related APIs:** [`suffix`](#suffix)

### `suffix`

**Type**: `string`

One or several symbols to be displayed after the currency value.

**Related APIs:** [`prefix`](#prefix)
