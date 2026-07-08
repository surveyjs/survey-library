---
title: InputMaskDateTime
product: Form Library
api-type: class
description: "A class that describes an input mask of the `\"datetime\"` `maskType`."
source: https://surveyjs.io/form-library/documentation/api-reference/inputmaskdatetime
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

### `max`

**Type**: `string`

A maximum date and time value that respondents can enter.

### `min`

**Type**: `string`

A minimum date and time value that respondents can enter.
