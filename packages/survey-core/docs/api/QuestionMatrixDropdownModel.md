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

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionMatrixBaseModel` &rarr; `QuestionMatrixDropdownModelBase` &rarr; `QuestionMatrixDropdownModel`

## Properties

### `hideIfRowsEmpty`

**Type**: `boolean`

Specifies whether to hide the question when the matrix has no visible rows.

### `rowOrder`

**Type**: `string`

Specifies a sort order for matrix rows.

Possible values:

- `"initial"` (default) - Preserves the original order of the `rows` array.
- `"random"` - Arranges matrix rows in random order each time the question is displayed.

### `totalText`

**Type**: `string`

A title for the total row. Applies if at least one column displays total values.
