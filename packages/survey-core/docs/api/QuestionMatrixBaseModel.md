---
title: QuestionMatrixBaseModel
product: Form Library
api-type: class
description: A base class for all matrix question types.
source: https://surveyjs.io/form-library/documentation/api-reference/questionmatrixbasemodel
---

# `QuestionMatrixBaseModel`

A base class for all matrix question types.

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; `QuestionMatrixBaseModel`

## Properties

### `alternateRows`

**Type**: `boolean`

Specifies whether to apply shading to alternate matrix rows.

[Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

### `columnMinWidth`

**Type**: `string`

Minimum column width in CSS values.

[Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))

[Dynamic Matrix Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))

**Related APIs:** [`width`](#width)

### `columns`

**Type**: `any[]`

An array of matrix columns.

For a Single-Select Matrix, the `columns` array can contain configuration objects with the `text` (display value) and `value` (value to be saved in survey results) properties. Alternatively, the array can contain primitive values that will be used as both the display values and values to be saved in survey results.

[Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

For a Multi-Select Matrix or Dynamic Matrix, the `columns` array should contain configuration objects with properties described in the [`MatrixDropdownColumn`](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) API Reference section.

[Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/ (linkStyle))

### `columnsVisibleIf`

**Type**: `string`

A Boolean expression that is evaluated against each matrix column. If the expression evaluates to `false`, the column becomes hidden.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Use the `{item}` placeholder to reference the current column in the expression.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

[View Demo](https://surveyjs.io/form-library/examples/change-visibility-of-rows-in-matrix-table/ (linkStyle))

**Related APIs:** [`rowsVisibleIf`](#rowsVisibleIf)

### `displayMode`

**Type**: `"auto" | "list" | "table"`

Specifies how to arrange matrix questions.

Possible values:

- `"table"` - Displays matrix questions in a table.
- `"list"` - Displays matrix questions one under another as a list.
- `"auto"` (default) - Uses the `"table"` mode if the survey has sufficient width to fit the table or the `"list"` mode otherwise.

### `rows`

**Type**: `any[]`

An array of matrix rows.

This array can contain primitive values or objects with the `text` (display value) and `value` (value to be saved in survey results) properties.

[Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

[Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))
+

### `rowsVisibleIf`

**Type**: `string`

A Boolean expression that is evaluated against each matrix row. If the expression evaluates to `false`, the row becomes hidden.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Use the `{item}` placeholder to reference the current row in the expression.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

[View Demo](https://surveyjs.io/form-library/examples/change-visibility-of-rows-in-matrix-table/ (linkStyle))

**Related APIs:** [`visibleRows`](#visibleRows), [`columnsVisibleIf`](#columnsVisibleIf)

### `rowTitleWidth`

**Type**: `string`

A width for the column that displays row titles (first column). Accepts CSS values.

### `showHeader`

**Type**: `boolean`

Specifies whether to display the table header that contains column captions.

Default value: `true`

### `verticalAlign`

**Type**: `"top" | "middle"`

Aligns matrix cell content in the vertical direction.

### `visibleRows`

**Type**: `TRow[]`

Returns an array of visible matrix rows.

**Related APIs:** [`rowsVisibleIf`](#rowsVisibleIf)
