---
title: MatrixDropdownColumn
product: Form Library
api-type: class
description: An auxiliary class that describes a column in a Multi-Select Matrix or Dynamic Matrix.
source: https://surveyjs.io/form-library/documentation/api-reference/matrixdropdowncolumn
---

# `MatrixDropdownColumn`

An auxiliary class that describes a column in a [Multi-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list) or [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model).

You can get an object of this class from the [`columns`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#columns) array or by calling the [`getColumnByName()`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#getColumnByName) method on a matrix instance.

## Inheritance

`Base` &rarr; `MatrixDropdownColumn`

## Properties

### `cellType`

**Type**: `string`

Specifies the type of column cells.

Possible values:

- [`"dropdown"`](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model)
- [`"checkbox"`](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model)
- [`"radiogroup"`](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model)
- [`"tagbox"`](https://surveyjs.io/form-library/documentation/api-reference/dropdown-tag-box-model)
- [`"text"`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model)
- [`"comment"`](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model)
- [`"boolean"`](https://surveyjs.io/form-library/documentation/api-reference/boolean-question-model)
- [`"expression"`](https://surveyjs.io/form-library/documentation/api-reference/expression-model)
- [`"rating"`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model)
- [`"slider"`](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel)
- `"default"` (default) - Inherits the input type from the [`cellType`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#cellType) property specified for the parent matrix.

The input types are based upon standalone question types. Depending on the selected input type, the matrix column can have additional configuration properties inherited from the corresponding question type. For instance, Dropdown, Checkboxes, Radio Button Group, and Tag Box columns can specify the [`choices`](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model#choices) array, similar to the question types upon which they are based. Refer to the API Reference of these question types for a full list of available properties.

[View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))

### `colCount`

**Type**: `number`

Gets or sets the number of columns used to arrange choice options. Applies only to columns of `"checkbox"` or `"radiogroup"` [`cellType`](#cellType).

Default value: -1 (inherits the actual value from the parent matrix's [`columnColCount`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#columnColCount) property)

[View Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))

### `defaultDisplayValue`

**Type**: `string`

A value to show in HTML questions and in the dynamic titles and descriptions of survey elements when the cell value is empty.

Default value: `""`

[Dynamic Texts](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#dynamic-texts (linkStyle))

### `defaultValueExpression`

**Type**: `string`

An expression used to calculate the column's default value. This expression applies to all cells of this column until the cell value is specified by an end user or programmatically.

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

### `enableIf`

**Type**: `string`

A Boolean expression. If it evaluates to `false`, this column becomes read-only.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

[View Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))

### `isRequired`

**Type**: `boolean`

Marks the column as required. If a respondent skips any cell in a required column, the matrix displays a [validation error](#requiredErrorText).

If you want to mark the column as required based on a condition, specify the [`requiredIf`](#requiredIf) property.

### `isUnique`

**Type**: `boolean`

Specifies whether a respondent is required to provide a unique response for each question within this column.

Default value: `false`

### `minWidth`

**Type**: `string`

Gets or sets minimum column width in CSS values. By default, the matrix calculates column widths to optimally fit the content of all columns.

### `name`

**Type**: `string`

A column ID that is not visible to respondents.

> Column IDs must be unique.

### `readOnly`

**Type**: `boolean`

Makes the column read-only.

If you want to switch the column to the read-only state based on a condition, specify the [`enableIf`](#enableIf) property.

### `requiredErrorText`

**Type**: `string`

Specifies a custom error message for a required column.

### `requiredIf`

**Type**: `string`

A Boolean expression. If it evaluates to `true`, this column becomes required.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

### `resetValueIf`

**Type**: `string`

A Boolean expression. If it evaluates to `true`, all cells in this column are set to a value calculated using the [`defaultValueExpression`](#defaultValueExpression).

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

### `setValueExpression`

**Type**: `string`

An expression that calculates a value for all cells in this column.

The `setValueExpression` is re-evaluated whenever a referenced question's value changes. If you also specify the [`setValueIf`](#setValueIf) expression, re-evaluation occurs only when it returns `true`.

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

### `setValueIf`

**Type**: `string`

A Boolean expression. If it evaluates to `true`, all cells in this column are set to a value calculated using the [`setValueExpression`](#setValueExpression).

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

### `showInMultipleColumns`

**Type**: `boolean`

Specifies whether to create an individual column for each choice option. Applies only to columns of `"checkbox"` or `"radiogroup"` [`cellType`](#cellType).

[View Demo](https://surveyjs.io/form-library/examples/columnize-choice-options-of-matrix-cell/ (linkStyle))

### `title`

**Type**: `string`

A user-friendly column caption to display. If `title` is undefined, [`name`](#name) is displayed instead.

### `totalAlignment`

**Type**: `string`

An alignment for calculated total values.

Possible values:

- `"left"`
- `"center"`
- `"right"`
- `"auto"` (default) - Applies one of the values above based on the column's [cell type](#cellType).

[View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))

### `totalCurrency`

**Type**: `string`

Specifies a currency used to display calculated total values. Applies only if [`totalDisplayStyle`](#totalDisplayStyle) is set to `"currency"`.

### `totalDisplayStyle`

**Type**: `string`

A format for calculated total values.

Possible values:

- `"none"` (default)
- `"decimal"`
- `"currency"`
- `"percent"`

[View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))

### `totalExpression`

**Type**: `string`

An expression used to calculate total values. Overrides the [`totalType`](#totalType) property.

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

### `totalFormat`

**Type**: `string`

A string pattern used to display column totals. To reference a total value within this pattern, use the `{0}` placeholder.

[View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))

### `totalType`

**Type**: `string`

An aggregation method used to calculate the column total.

Possible values:

- `"none"` (default) - Disables total calculations.
- `"sum"`
- `"count"`
- `"min"`
- `"max"`
- `"avg"`

[View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))

### `validators`

**Type**: `SurveyValidator[]`

Column validators.

[Data Validation](https://surveyjs.io/form-library/documentation/data-validation (linkStyle))

### `visible`

**Type**: `boolean`

Gets or sets column visibility.

If you want to display or hide a column based on a condition, specify the [`visibleIf`](#visibleIf) property.

### `visibleIf`

**Type**: `string`

A Boolean expression. If it evaluates to `false`, this column becomes hidden.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

### `width`

**Type**: `string`

Gets or sets column width in CSS values. By default, the matrix calculates column widths to optimally fit the content of all columns.
