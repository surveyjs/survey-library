---
title: MatrixDropdownColumn
product: Form Library
api-type: class
description: "An auxiliary class that describes a column in a [Multi-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list) or [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model). You can get an object of this class from the [`columns`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#columns) array or by calling the [`getColumnByName()`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#getColumnByName) method on a matrix instance."
source: 
---

# `MatrixDropdownColumn`

An auxiliary class that describes a column in a [Multi-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list) or [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model).

You can get an object of this class from the [`columns`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#columns) array or by calling the [`getColumnByName()`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#getColumnByName) method on a matrix instance.

## Inheritance

`Base` &rarr; `MatrixDropdownColumn`

## Properties

### `templateQuestionValue`

**Type**: `Question`

### `templateQuestionJsonValue`

**Type**: `any`

### `colOwnerValue`

**Type**: `IMatrixColumnOwner`

### `indexValue`

**Type**: `number`

### `_hasVisibleCell`

**Type**: `boolean`

### `_visiblechoices`

**Type**: `any[]`

### `colOwner`

**Type**: `IMatrixColumnOwner`

### `index`

**Type**: `number`

### `cellType`

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

**Type**: `string`

### `templateQuestion`

**Type**: `Question`

### `value`

**Type**: `string`

### `isVisible`

**Type**: `boolean`

### `isColumnVisible`

**Type**: `boolean`

### `visible`

Gets or sets column visibility.

If you want to display or hide a column based on a condition, specify the [`visibleIf`](#visibleIf) property.

**Type**: `boolean`

### `hasVisibleCell`

**Type**: `boolean`

### `isColumnsVisibleIf`

**Type**: `boolean`

### `getVisibleChoicesInCell`

**Type**: `any[]`

### `isFilteredMultipleColumns`

**Type**: `boolean`

### `name`

A column ID that is not visible to respondents.

> Column IDs must be unique.

**Type**: `string`

### `title`

A user-friendly column caption to display. If `title` is undefined, [`name`](#name) is displayed instead.

**Type**: `string`

### `locTitle`

**Type**: `LocalizableString`

### `fullTitle`

**Type**: `string`

### `defaultDisplayValue`

A value to show in HTML questions and in the dynamic titles and descriptions of survey elements when the cell value is empty.

Default value: `""`

[Dynamic Texts](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#dynamic-texts (linkStyle))

**Type**: `string`

### `locDefaultDisplayValue`

**Type**: `LocalizableString`

### `isRequired`

Marks the column as required. If a respondent skips any cell in a required column, the matrix displays a [validation error](#requiredErrorText).

If you want to mark the column as required based on a condition, specify the [`requiredIf`](#requiredIf) property.

**Type**: `boolean`

### `isRenderedRequired`

**Type**: `boolean`

### `requiredMark`

**Type**: `string`

### `requiredErrorText`

Specifies a custom error message for a required column.

**Type**: `string`

### `readOnly`

Makes the column read-only.

If you want to switch the column to the read-only state based on a condition, specify the [`enableIf`](#enableIf) property.

**Type**: `boolean`

### `hasOther`

**Type**: `boolean`

### `showOtherItem`

**Type**: `boolean`

### `visibleIf`

A Boolean expression. If it evaluates to `false`, this column becomes hidden.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `string`

### `enableIf`

A Boolean expression. If it evaluates to `false`, this column becomes read-only.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

[View Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))

**Type**: `string`

### `requiredIf`

A Boolean expression. If it evaluates to `true`, this column becomes required.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `string`

### `resetValueIf`

A Boolean expression. If it evaluates to `true`, all cells in this column are set to a value calculated using the [`defaultValueExpression`](#defaultValueExpression).

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

**Type**: `string`

### `defaultValueExpression`

An expression used to calculate the column's default value. This expression applies to all cells of this column until the cell value is specified by an end user or programmatically.

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

**Type**: `string`

### `setValueIf`

A Boolean expression. If it evaluates to `true`, all cells in this column are set to a value calculated using the [`setValueExpression`](#setValueExpression).

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

**Type**: `string`

### `setValueExpression`

An expression that calculates a value for all cells in this column.

The `setValueExpression` is re-evaluated whenever a referenced question's value changes. If you also specify the [`setValueIf`](#setValueIf) expression, re-evaluation occurs only when it returns `true`.

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

**Type**: `string`

### `isUnique`

Specifies whether a respondent is required to provide a unique response for each question within this column.

Default value: `false`

**Type**: `boolean`

### `showInMultipleColumns`

Specifies whether to create an individual column for each choice option. Applies only to columns of `"checkbox"` or `"radiogroup"` [`cellType`](#cellType).

[View Demo](https://surveyjs.io/form-library/examples/columnize-choice-options-of-matrix-cell/ (linkStyle))

**Type**: `boolean`

### `isSupportMultipleColumns`

**Type**: `boolean`

### `isShowInMultipleColumns`

**Type**: `boolean`

### `validators`

Column validators.

[Data Validation](https://surveyjs.io/form-library/documentation/data-validation (linkStyle))

**Type**: `SurveyValidator[]`

### `totalType`

An aggregation method used to calculate the column total.

Possible values:

- `"none"` (default) - Disables total calculations.
- `"sum"`
- `"count"`
- `"min"`
- `"max"`
- `"avg"`

[View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))

**Type**: `string`

### `totalExpression`

An expression used to calculate total values. Overrides the [`totalType`](#totalType) property.

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

**Type**: `string`

### `hasTotal`

**Type**: `boolean`

### `totalFormat`

A string pattern used to display column totals. To reference a total value within this pattern, use the `{0}` placeholder.

[View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))

**Type**: `string`

### `cellHint`

**Type**: `string`

### `renderAs`

**Type**: `string`

### `totalMaximumFractionDigits`

**Type**: `number`

### `totalMinimumFractionDigits`

**Type**: `number`

### `totalDisplayStyle`

A format for calculated total values.

Possible values:

- `"none"` (default)
- `"decimal"`
- `"currency"`
- `"percent"`

[View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))

**Type**: `string`

### `totalAlignment`

An alignment for calculated total values.

Possible values:

- `"left"`
- `"center"`
- `"right"`
- `"auto"` (default) - Applies one of the values above based on the column's [cell type](#cellType).

[View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))

**Type**: `string`

### `totalCurrency`

Specifies a currency used to display calculated total values. Applies only if [`totalDisplayStyle`](#totalDisplayStyle) is set to `"currency"`.

**Type**: `string`

### `minWidth`

Gets or sets minimum column width in CSS values. By default, the matrix calculates column widths to optimally fit the content of all columns.

**Type**: `string`

### `width`

Gets or sets column width in CSS values. By default, the matrix calculates column widths to optimally fit the content of all columns.

**Type**: `string`

### `colCount`

Gets or sets the number of columns used to arrange choice options. Applies only to columns of `"checkbox"` or `"radiogroup"` [`cellType`](#cellType).

Default value: -1 (inherits the actual value from the parent matrix's [`columnColCount`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#columnColCount) property)

[View Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))

**Type**: `number`

### `previousChoicesId`

**Type**: `string`

## Methods

### `getColumnTypes()`

**Return value:** `string[]<any>`

### `getOriginalObj()`

**Return value:** `Base`

### `getSurvey()`

**Return value:** `ISurvey`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `live` | `boolean` |  |

### `getOwner()`

**Return value:** `IMatrixColumnOwner`

### `getValueGetterContext()`

**Return value:** `IValueGetterContext`

### `getDesignRowContext()`

**Return value:** `IValueGetterContext`

### `locStrsChanged()`

### `addUsedLocales()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `locales` | `string[]` |  |

### `setIndex()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `number` |  |

### `getType()`

**Return value:** `string`

### `onCellVisibilityChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `isVisible` | `boolean` |  |

### `getVisibleMultipleChoices()`

**Return value:** `ItemValue[]<ItemValue>`

### `setVisibleChoicesInCell()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `any[]` |  |

### `updateIsRenderedRequired()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `boolean` |  |

### `getLocale()`

**Return value:** `string`

### `getMarkdownHtml()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | `string` |  |
| `name` | `string` |  |
| `item` | `any` |  |

### `getRenderer()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `getRendererContext()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `locStr` | `LocalizableString` |  |

### `getProcessedText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | `string` |  |

### `createCellQuestion()`

**Return value:** `Question`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `MatrixDropdownRowModelBase` |  |

### `updateCellQuestion()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cellQuestion` | `Question` |  |
| `data` | `any` |  |
| `onUpdateJson` | `(json: any) => any` |  |
