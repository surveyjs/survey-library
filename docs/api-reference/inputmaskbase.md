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

> Leave this property disabled if your survey allows changing [`locale`](/form-library/documentation/api-reference/survey-data-model#locale) or [`regionalFormat`](/form-library/documentation/api-reference/survey-data-model#regionalFormat) at runtime or loads responses saved with a different regional format. Saved masked text can be misinterpreted in another format. For example, `"2,222.22"` may be read as `2.22` when the decimal separator is a comma. With `saveMaskedValue` disabled, the question stores the plain value and displays it correctly in the current format.
