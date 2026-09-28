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

The mask inherits its currency symbol, currency pattern, and numeric separators from the survey's [`regionalFormat`](/form-library/documentation/api-reference/survey-data-model#regionalFormat) settings. Explicit values in `maskSettings` override these defaults.

[Demo: Masked Input Fields](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`InputMaskBase`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskbase.md) &rarr; [`InputMaskNumeric`](https://surveyjs.io/form-library/documentation/api-reference/inputmasknumeric.md) &rarr; `InputMaskCurrency`

## Properties

### `currencyPattern`

**Type**: `string`

A pattern that specifies the position of the number, currency symbol, and minus sign.

The pattern supports the following tokens:

- `#` &ndash; The formatted number, including decimal and thousands separators. Required exactly once.
- `@` &ndash; *(Optional)* The [currency symbol](#currencySymbol).
- `-` &ndash; *(Optional)* The minus sign for negative values. Omitted for positive values. If this token is absent, the minus sign appears at the beginning of a negative value.

Other characters are displayed as literal text. Digits and control characters are not allowed.

Examples:

- `"@#"` &rarr; `$1.2`
- `"#@"` &rarr; `1.2$`
- `"@ -#"` &rarr; `$ -1.2`

A valid explicit pattern overrides [`regionalFormat.currencyPattern`](/form-library/documentation/api-reference/regionalformat#currencyPattern). If this property is unset, empty, or invalid, the mask uses the regional pattern, falling back to the [format locale](/form-library/documentation/api-reference/regionalformat#locale)'s currency pattern.

Default value: `undefined` (the mask inherits its currency pattern)

Available since: v3.1.0

### `currencySymbol`

**Type**: `string`

A currency symbol or code displayed by the mask, for example, `"$"` or `"USD"`.

The symbol's position is specified by the `@` token in the [`currencyPattern`](#currencyPattern). A pattern without this token displays no symbol.

Specify this property to override the survey-wide currency symbol, or use an empty string to display no symbol.

Default value: `undefined` (the mask inherits [`regionalFormat.currencySymbol`](/form-library/documentation/api-reference/regionalformat#currencySymbol) or the symbol used by the [format locale](/form-library/documentation/api-reference/regionalformat#locale) (`"$"` in English))

Available since: v3.1.0

### `prefix`

**Type**: `string`

One or several symbols to be displayed before the currency value.

### `suffix`

**Type**: `string`

One or several symbols to be displayed after the currency value.
