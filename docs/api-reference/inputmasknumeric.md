---
title: InputMaskNumeric
product: Form Library
api-type: class
description: "A class that describes an input mask of the `\"numeric\"` `maskType`."
source: https://surveyjs.io/form-library/documentation/api-reference/inputmasknumeric
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

[Demo: Masked Input Fields](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`InputMaskBase`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskbase.md) &rarr; `InputMaskNumeric`

## Properties

### `allowNegativeValues`

**Type**: `boolean`

Specifies whether respondents can enter negative values.

Default value: `true`

**Related APIs:** [`min`](#min), [`max`](#max)

### `decimalSeparator`

**Type**: `string`

A symbol that separates the integer and fractional parts of a displayed number.

Specify this property to override the survey-wide decimal separator.

Default value: `undefined` (the mask inherits [`regionalFormat.decimalSeparator`](/form-library/documentation/api-reference/regionalformat#decimalSeparator) or the separator used by the [format locale](/form-library/documentation/api-reference/regionalformat#locale) (`"."` in English))

**Related APIs:** [`precision`](#precision), [`thousandsSeparator`](#thousandsSeparator)

### `max`

**Type**: `number`

A maximum value that respondents can enter.

**Related APIs:** [`min`](#min), [`allowNegativeValues`](#allowNegativeValues)

### `min`

**Type**: `number`

A minimum value that respondents can enter.

**Related APIs:** [`max`](#max), [`allowNegativeValues`](#allowNegativeValues)

### `precision`

**Type**: `number`

Limits how many digits to retain after the decimal point for a displayed number.

Default value: 2

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

**Related APIs:** [`decimalSeparator`](#decimalSeparator)

### `thousandsSeparator`

**Type**: `string`

A symbol that separates the digits of a large number into groups of three.

Set this property to override the survey-wide thousands separator, or use an empty string to disable grouping. Grouping is also disabled if the separator matches this mask's [`decimalSeparator`](#decimalSeparator).

Default value: `undefined` (the mask inherits [`regionalFormat.thousandsSeparator`](/form-library/documentation/api-reference/regionalformat#thousandsSeparator) or the separator used by the [format locale](/form-library/documentation/api-reference/regionalformat#locale) (`","` in English))

**Related APIs:** [`decimalSeparator`](#decimalSeparator)
