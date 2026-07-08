---
title: QuestionMatrixModel
product: Form Library
api-type: class
description: A class that describes the Single-Select Matrix question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionmatrixmodel
---

# `QuestionMatrixModel`

A class that describes the Single-Select Matrix question type.

[View Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionMatrixBaseModel` &rarr; `QuestionMatrixModel`

## Properties

### `cellComponent`

The name of a component used to render cells.

**Type**: `string`

### `cells`

An array of matrix cells. Use this array to get or set cell values.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-matrix-rubric/ (linkStyle))

**Type**: `MatrixCells`

### `cellType`

Specifies the type of matrix cells.

Possible values:

- `"radio"` (default)
- `"checkbox"`

[Radio-Button Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

[Checkbox Matrix Demo](https://surveyjs.io/form-library/examples/checkbox-matrix-question/ (linkStyle))

**Type**: `string`

### `eachRowRequired`

Specifies whether each row requires an answer. If a respondent skips a row, the question displays a validation error.

[View Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

**Type**: `boolean`

### `eachRowUnique`

Specifies whether answers in all rows should be unique. If any answers duplicate, the question displays a validation error.

**Type**: `boolean`

### `hideIfRowsEmpty`

Specifies whether to hide the question when the matrix has no visible rows.

**Type**: `boolean`

### `rowOrder`

Specifies a sort order for matrix rows.

Possible values:

- `"initial"` (default) - Preserves the original order of the `rows` array.
- `"random"` - Arranges matrix rows in random order each time the question is displayed.

**Type**: `string`
