---
title: InputMaskDateTime
product: Form Library
api-type: class
description: "A class that describes an input mask of the `\"datetime\"` `maskType`."
source: https://surveyjs.io/form-library/documentation/api-reference/inputmaskdatetime
---

# `InputMaskDateTime`

A class that describes an input mask of the `"datetime"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType).

The mask inherits its format from the survey's [`regionalFormat`](/form-library/documentation/api-reference/survey-data-model#regionalFormat) settings and format locale. Set [`pattern`](#pattern) to specify a custom format.

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

[Demo: Masked Input Fields](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`InputMaskBase`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskbase.md) &rarr; [`InputMaskPattern`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskpattern.md) &rarr; `InputMaskDateTime`

## Properties

### `max`

**Type**: `string`

A maximum date and time value that respondents can enter.

**Related APIs:** [`min`](#min)

### `min`

**Type**: `string`

A minimum date and time value that respondents can enter.

**Related APIs:** [`max`](#max)
