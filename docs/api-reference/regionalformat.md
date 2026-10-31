---
title: RegionalFormat
product: Form Library
api-type: class
description: Configures date, time, number, and currency formats for input masks throughout a survey.
source: https://surveyjs.io/form-library/documentation/api-reference/regionalformat
---

# `RegionalFormat`

Configures date, time, number, and currency formats for input masks throughout a survey.

Access this object through the survey's [`regionalFormat`](/form-library/documentation/api-reference/survey-data-model#regionalFormat) property.

Set [`locale`](#locale) to select default formats independently of the survey's display language, or specify individual properties to override the locale defaults.

Settings in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object take precedence over these survey-wide settings.

Available since: v3.1.0

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; `RegionalFormat`

## Properties

### `currencyPattern`

**Type**: `string`

A pattern that specifies the position of the number, currency symbol, and minus sign in [currency input masks](/form-library/documentation/api-reference/inputmaskcurrency).

The pattern supports the following tokens:

- `#` &ndash; The formatted number, including decimal and thousands separators. Required exactly once.
- `@` &ndash; *(Optional)* The [currency symbol](#currencySymbol).
- `-` &ndash; *(Optional)* The minus sign for negative values. Omitted for positive values. If this token is absent, the minus sign appears at the beginning of a negative value.

Other characters are displayed as literal text. Digits and control characters are not allowed.

Examples:

- `"@#"` &rarr; `$1.2`
- `"#@"` &rarr; `1.2$`
- `"@ -#"` &rarr; `$ -1.2`

An explicit [`currencyPattern`](/form-library/documentation/api-reference/inputmaskcurrency#currencyPattern) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.

Default value: `undefined` (uses the [format locale](#locale)'s currency pattern)

Available since: v3.1.0

### `currencySymbol`

**Type**: `string`

A currency symbol or code displayed by [currency input masks](/form-library/documentation/api-reference/inputmaskcurrency), for example, `"$"` or `"USD"`.

The symbol's position is specified by the `@` token in [`currencyPattern`](#currencyPattern). A pattern without this token displays no symbol.

An explicit [`currencySymbol`](/form-library/documentation/api-reference/inputmaskcurrency#currencySymbol) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.

Default value: `undefined` (uses the [format locale](#locale)'s currency symbol)

Available since: v3.1.0

### `datePattern`

**Type**: `string`

A date pattern for [date-time input masks](/form-library/documentation/api-reference/inputmaskdatetime).

The pattern can contain separator characters and the following placeholders:

- `m` - Month number.
- `mm` - Month number, with leading zero for single-digit values.
- `d` - Day of the month.
- `dd` - Day of the month, with leading zero for single-digit values.
- `yy` - Last two digits of the year.
- `yyyy` - A four-digit year.

Examples: `"mm/dd/yyyy"`, `"yyyy-mm-dd"`, `"dd.mm.yy"`

An explicit [`pattern`](/form-library/documentation/api-reference/inputmaskdatetime#pattern) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.

Default value: `undefined` (uses the [format locale](#locale)'s date pattern)

Available since: v3.1.0

**Related APIs:** [`timePattern`](#timePattern)

### `decimalSeparator`

**Type**: `string`

A symbol that separates the integer and fractional parts of a displayed number in [numeric](/form-library/documentation/api-reference/inputmasknumeric) and [currency input masks](/form-library/documentation/api-reference/inputmaskcurrency).

An explicit [`decimalSeparator`](/form-library/documentation/api-reference/inputmasknumeric#decimalSeparator) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.

Default value: `undefined` (uses the [format locale](#locale)'s decimal separator)

Available since: v3.1.0

**Related APIs:** [`thousandsSeparator`](#thousandsSeparator)

### `locale`

**Type**: `string`

The locale used to resolve default date, time, number, and currency formats for input masks.

This property affects formatting only. The survey's [`locale`](/form-library/documentation/api-reference/survey-data-model#locale) property controls the language of survey texts.

Use a BCP 47 language tag, such as `"de"`, `"en-GB"`, or `"pt-BR"`. If a format is unavailable for the specified locale, the language's format is used, with the English format as a fallback. Format properties in this object override these locale defaults.

Default value: `undefined` (uses the survey's locale)

Available since: v3.1.0

### `thousandsSeparator`

**Type**: `string`

A symbol that separates the digits of a large number into groups of three in [numeric](/form-library/documentation/api-reference/inputmasknumeric) and [currency input masks](/form-library/documentation/api-reference/inputmaskcurrency).

Set this property to an empty string to disable grouping. Grouping is also disabled if the separator matches the mask's [`decimalSeparator`](#decimalSeparator).

An explicit [`thousandsSeparator`](/form-library/documentation/api-reference/inputmasknumeric#thousandsSeparator) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.

Default value: `undefined` (uses the [format locale](#locale)'s thousands separator)

Available since: v3.1.0

### `timePattern`

**Type**: `string`

A time pattern for [date-time input masks](/form-library/documentation/api-reference/inputmaskdatetime).

The pattern can contain separator characters and the following placeholders:

- `H` - Hours in 24-hour format.
- `HH` - Hours in 24-hour format, with leading zero for single-digit values.
- `h` - Hours in 12-hour format.
- `hh` - Hours in 12-hour format, with leading zero for single-digit values.
- `MM` - Minutes.
- `ss` - Seconds.
- `TT` - 12-hour clock period in uppercase (AM/PM).
- `tt` - 12-hour clock period in lowercase (am/pm).

Examples: `"HH:MM"`, `"HH:MM:ss"`, `"hh:MM TT"`

An explicit [`pattern`](/form-library/documentation/api-reference/inputmaskdatetime#pattern) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.

Default value: `undefined` (uses the [format locale](#locale)'s time pattern)

Available since: v3.1.0

**Related APIs:** [`datePattern`](#datePattern)
