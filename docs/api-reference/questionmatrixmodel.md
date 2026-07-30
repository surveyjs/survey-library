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

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; [`QuestionMatrixBaseModel`](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixbasemodel.md) &rarr; `QuestionMatrixModel`

## Properties

### `cellComponent`

**Type**: `string`

The name of a component used to render cells.

### `cells`

**Type**: `MatrixCells`

An array of matrix cells. Use this array to get or set cell values.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-matrix-rubric/ (linkStyle))

### `cellType`

**Type**: `string`

Specifies the type of matrix cells.

Possible values:

- `"radio"` (default)
- `"checkbox"`

[Radio-Button Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

[Checkbox Matrix Demo](https://surveyjs.io/form-library/examples/checkbox-matrix-question/ (linkStyle))

### `eachRowRequired`

**Type**: `boolean`

Specifies whether each row requires an answer. If a respondent skips a row, the question displays a validation error.

[View Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

Available since: v2.0.0

**Related APIs:** [`isRequired`](#isRequired), [`eachRowUnique`](#eachRowUnique), [`validators`](#validators)

### `eachRowUnique`

**Type**: `boolean`

Specifies whether answers in all rows should be unique. If any answers duplicate, the question displays a validation error.

**Related APIs:** [`eachRowRequired`](#eachRowRequired), [`validators`](#validators)

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
