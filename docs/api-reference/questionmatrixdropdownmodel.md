---
title: QuestionMatrixDropdownModel
product: Form Library
api-type: class
description: A class that describes the Multi-Select Matrix question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionmatrixdropdownmodel
---

# `QuestionMatrixDropdownModel`

A class that describes the Multi-Select Matrix question type. Multi-Select Matrix allows you to use the [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel), [Checkbox](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Radiogroup](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), [Text](https://surveyjs.io/form-library/documentation/questiontextmodel), and [Comment](https://surveyjs.io/form-library/documentation/questioncommentmodel) question types as cell editors.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; [`QuestionMatrixBaseModel`](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixbasemodel.md) &rarr; [`QuestionMatrixDropdownModelBase`](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixdropdownmodelbase.md) &rarr; `QuestionMatrixDropdownModel`

## Properties

### `hideIfRowsEmpty`

**Type**: `boolean`

Specifies whether to hide the question when the matrix has no visible rows.

**Related APIs:** [`rowsVisibleIf`](#rowsVisibleIf)

### `rowOrder`

**Type**: `string`

Specifies a sort order for matrix rows.

Possible values:

- `"initial"` (default) - Preserves the original order of the `rows` array.
- `"random"` - Arranges matrix rows in random order each time the question is displayed.

Available since: v2.0.0

**Related APIs:** [`rows`](#rows)

### `totalText`

**Type**: `string`

A title for the total row. Applies if at least one column displays total values.

**Related APIs:** [`rowTitleWidth`](#rowTitleWidth), [`columns`](#columns)
