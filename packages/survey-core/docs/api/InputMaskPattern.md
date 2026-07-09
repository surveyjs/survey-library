---
title: InputMaskPattern
product: Form Library
api-type: class
description: "A class that describes an input mask of the `\"pattern\"` `maskType`."
source: https://surveyjs.io/form-library/documentation/api-reference/inputmaskpattern
---

# `InputMaskPattern`

A class that describes an input mask of the `"pattern"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType).

The following code shows how to specify the properties of this class within a survey JSON schema:

```js
const surveyJson = {
  "elements": [{
    "name": "textquestion1"
    "type": "text",
    "maskType": "pattern",
    "maskSettings": {
      // Specify the properties of a pattern input mask here
    }
  }]
}
```

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`InputMaskBase`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskbase.md) &rarr; `InputMaskPattern`

## Properties

### `pattern`

**Type**: `string`

A pattern for the input value.

If you set the [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType) to `"pattern"`, the mask can contain string literals and the following placeholders:

- `9` - A digit.
- `a` - An upper- or lower-case letter.
- `#` - A digit or an upper- or lower-case letter.

Characters not listed above are treated as literals automatically. Use backslash `\` to escape a definition character and insert it as a literal (e.g., `\9` inserts a literal `9`).

Example: `+1(999)-999-99-99`

If you set the [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType) to `"datetime"`, the mask can contain separator characters and the following placeholders:

- `m` - Month number.
- `mm` - Month number, with leading zero for single-digit values.
- `d` - Day of the month.
- `dd` - Day of the month, with leading zero for single-digit values.
- `yy` - Last two digits of the year.
- `yyyy` - A four-digit year.
- `H` - Hours in 24-hour format.
- `HH` - Hours in 24-hour format, with leading zero for single-digit values.
- `h` - Hours in 12-hour format.
- `hh` - Hours in 12-hour format, with leading zero for single-digit values.
- `MM` - Minutes.
- `ss` - Seconds.
- `TT` - 12-hour clock period in upper case (AM/PM).
- `tt` - 12-hour clock period in lower case (am/pm).

Example: `mm/dd/yyyy HH:MM:ss`

[View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))

**Related APIs:** [`[settings.maskSettings](https://surveyjs.io/form-library/documentation/api-reference/settings#maskSettings)`](#[settings.maskSettings](https://surveyjs.io/form-library/documentation/api-reference/settings#maskSettings))
