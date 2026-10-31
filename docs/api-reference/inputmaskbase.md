---
title: InputMaskBase
product: Form Library
api-type: class
description: "A base class for classes that implement input masks: - `InputMaskNumeric` - `InputMaskCurrency` - `InputMaskDateTime` - `InputMaskPattern` Date-time, numeric, and currency masks inherit format settings from the survey's `regionalFormat` object."
source: https://surveyjs.io/form-library/documentation/api-reference/inputmaskbase
---

# `InputMaskBase`

A base class for classes that implement input masks:

- [`InputMaskNumeric`](https://surveyjs.io/form-library/documentation/inputmasknumeric)
- [`InputMaskCurrency`](https://surveyjs.io/form-library/documentation/inputmaskcurrency)
- [`InputMaskDateTime`](https://surveyjs.io/form-library/documentation/inputmaskdatetime)
- [`InputMaskPattern`](https://surveyjs.io/form-library/documentation/inputmaskpattern)

Date-time, numeric, and currency masks inherit format settings from the survey's [`regionalFormat`](/form-library/documentation/api-reference/survey-data-model#regionalFormat) object. Its [`locale`](/form-library/documentation/api-reference/regionalformat#locale) property selects the default formats. If it is unset, the survey's [`locale`](/form-library/documentation/api-reference/survey-data-model#locale) is used.

Explicit settings on an individual mask override these survey-wide defaults.

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; `InputMaskBase`

## Properties

### `saveMaskedValue`

**Type**: `boolean`

Specifies whether to store the question value with an applied mask in survey results.

Default value: `false`
