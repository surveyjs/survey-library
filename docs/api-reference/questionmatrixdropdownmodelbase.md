---
title: QuestionMatrixDropdownModelBase
product: Form Library
api-type: class
description: A base class for the `QuestionMatrixDropdownModel` and `QuestionMatrixDynamicModel` classes.
source: https://surveyjs.io/form-library/documentation/api-reference/questionmatrixdropdownmodelbase
---

# `QuestionMatrixDropdownModelBase`

A base class for the [`QuestionMatrixDropdownModel`](https://surveyjs.io/form-library/documentation/questionmatrixdropdownmodel) and [`QuestionMatrixDynamicModel`](https://surveyjs.io/form-library/documentation/questionmatrixdynamicmodel) classes.

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; `QuestionMatrixDropdownModelBase`

## Properties

### `alternateRows`

**Type**: `boolean`

Specifies whether to apply shading to alternate matrix rows.

[Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

### `cellErrorLocation`

**Type**: `string`

Specifies the error message position relative to matrix cells.

Possible values:

- `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
- `"top"` - Displays error messages above matrix cells.
- `"bottom"` - Displays error messages below matrix cells.

**Related APIs:** [`detailErrorLocation`](#detailErrorLocation)

### `cellType`

**Type**: `string`

Specifies the type of matrix cells. You can override this property for individual columns.

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

Default value: `"dropdown"` (inherited from [`settings.matrix.defaultCellType`](https://surveyjs.io/form-library/documentation/settings#matrixDefaultCellType))

[Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))

[Dynamic Matrix Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))

### `choices`

**Type**: `any[]`

Gets or sets choice items for Dropdown, Checkbox, and Radiogroup matrix cells. You can override this property for individual columns.

This property accepts an array of objects with the following structure:

```js
{
  "value": any, // A value to be saved in survey results
  "text": string, // A display text. This property supports Markdown. When `text` is undefined, `value` is used.
  "customProperty": any // Any property that you find useful.
}
```

To enable Markdown support for the `text` property, implement Markdown-to-HTML conversion in the [onTextMarkdown](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onTextMarkdown) event handler. For an example, refer to the following demo: [Convert Markdown to HTML with markdown-it](https://surveyjs.io/form-library/examples/edit-survey-questions-markdown/).

If you add custom properties, refer to the following help topic to learn how to serialize them into JSON: [Add Custom Properties to Property Grid](https://surveyjs.io/survey-creator/documentation/property-grid#add-custom-properties-to-the-property-grid).

If you need to specify only the `value` property, you can set the `choices` property to an array of primitive values, for example, `[ "item1", "item2", "item3" ]`. These values are both saved in survey results and used as display text.

**Related APIs:** [`cellType`](#cellType)

### `columnColCount`

**Type**: `number`

Specifies the number of columns in Radiogroup and Checkbox cells.

Default value: 0 (the number of columns is selected automatically based on the available column width)

**Related APIs:** [`cellType`](#cellType)

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

### `detailElements`

**Type**: `IElement[]`

An array of survey elements (questions and panels) to be displayed in detail sections.

Detail sections are expandable panels displayed under each matrix row. You can use them to display questions that do not fit into the row.

Set the [`detailPanelMode`](#detailPanelMode) property to `"underRow"` or `"underRowSingle"` to display detail sections.

[View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))

**Related APIs:** [`detailPanel`](#detailPanel)

### `detailErrorLocation`

**Type**: `string`

Specifies the error message position for questions within detail sections.

Possible values:

- `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
- `"top"` - Displays error messages above questions.
- `"bottom"` - Displays error messages below questions.

**Related APIs:** [`cellErrorLocation`](#cellErrorLocation)

### `detailPanel`

**Type**: `PanelModel`

Contains a [`PanelModel`](https://surveyjs.io/form-library/documentation/panelmodel) instance that represents a detail section template.

**Related APIs:** [`detailElements`](#detailElements), [`detailPanelMode`](#detailPanelMode)

### `detailPanelMode`

**Type**: `string`

Specifies the location of detail sections.

Possible values:

- `"underRow"` - Displays detail sections under their respective rows. Users can expand any number of detail sections.
- `"underRowSingle"` - Displays detail sections under their respective rows, but only one detail section can be expanded at a time.
- `"none"` (default) - Hides detail sections.

Use the [`detailElements`](#detailElements) property to specify content of detail sections.

[View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))

**Related APIs:** [`detailPanel`](#detailPanel)

### `displayMode`

**Type**: `"auto" | "list" | "table"`

Specifies how to arrange matrix questions.

Possible values:

- `"table"` - Displays matrix questions in a table.
- `"list"` - Displays matrix questions one under another as a list.
- `"auto"` (default) - Uses the `"table"` mode if the survey has sufficient width to fit the table or the `"list"` mode otherwise.

### `isColumnLayoutHorizontal`

**Type**: `boolean`

Returns `true` if [`columns`](#columns) are placed in the horizontal direction and [`rows`](#columns) in the vertical direction.

To specify the layout, use the [`transposeData`](#transposeData) property. If you set it to `true`, the survey applies it only when the screen has enough space. Otherwise, the survey falls back to the original layout, but the `transposeData` property remains set to `true`. Unlike `transposeData`, the `isColumnLayoutHorizontal` property always indicates the current layout.

**Related APIs:** [`transposeData`](#transposeData)

### `keyDuplicationError`

**Type**: `string`

An error message displayed when users enter a duplicate value into a column that accepts only unique values (`isUnique` is set to `true` or `keyName` is specified).

A default value for this property is taken from a [localization dictionary](https://github.com/surveyjs/survey-library/tree/01bd8abd0c574719956d4d579d48c8010cd389d4/packages/survey-core/src/localization). Refer to the following help topic for more information: [Localization & Globalization](https://surveyjs.io/form-library/documentation/localization).

**Related APIs:** [`useCaseSensitiveComparison`](#useCaseSensitiveComparison)

### `placeholder`

**Type**: `string`

A placeholder for Dropdown matrix cells.

**Related APIs:** [`cellType`](#cellType)

### `rows`

**Type**: `any[]`

An array of matrix rows.

This array can contain primitive values or objects with the `text` (display value) and `value` (value to be saved in survey results) properties.

[Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

[Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))

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

### `singleInputTitleTemplate`

**Type**: `string`

A title template that applies when the survey is in [input-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode).

Default value: `"Row {rowIndex}"` for Dynamic Matrix | `"{rowTitle}"` for Multi-Select Matrix

The template can contain the following placeholders:

- `{rowIndex}` - A row index within the collection of all rows. Starts with 1.
- `{visibleRowIndex}` - A row index within the collection of visible rows. Starts with 1.
- `{rowName}` - A row name (the `value` property within objects in the [`rows`](#rows) array). Use this placeholder if you need to distinguish between matrix rows.
- `{rowTitle}` - A row title (the `text` property within objects in the `rows` array).
- `{row.columnname}` - The value of a cell in the same row.

[View Demo](https://surveyjs.io/form-library/examples/loop-and-merge/ (linkStyle))

Available since: v2.0.6

### `transposeData`

**Type**: `boolean`

Specifies whether to display [`columns`](#columns) as rows and [`rows`](#rows) as columns.

Default value: `false`

[Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))

[Dynamic Matrix Demo](https://surveyjs.io/form-library/examples/transpose-dynamic-rows-to-columns-in-matrix/ (linkStyle))

### `useCaseSensitiveComparison`

**Type**: `boolean`

Enables case-sensitive comparison in columns with the `isUnique` property set to `true`.

When this property is `true`, `"ABC"` and `"abc"` are considered different values.

Default value: `false`

Available since: v2.0.0

**Related APIs:** [`keyDuplicationError`](#keyDuplicationError)

### `verticalAlign`

**Type**: `"top" | "middle"`

Aligns matrix cell content in the vertical direction.

### `visibleRows`

**Type**: `MatrixDropdownRowModelBase[]`

Returns an array of visible matrix rows.

**Related APIs:** [`rowsVisibleIf`](#rowsVisibleIf)

## Methods

### `getColumnByName()`

**Return value:** `MatrixDropdownColumn`

Returns a matrix column with a given `name` or `null` if a column with this is not found.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `columnName` | `string` | A column name. |

### `getRowValue()`

**Return value:** `any`

Returns an object with row values. If a row has no answers, this method returns an empty object.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `rowIndex` | `number` | A zero-based row index. |

**Related APIs:** [`setRowValue`](#setRowValue)

### `getType()`

**Return value:** `string`

Returns the question type.
Possible values:
- [*"boolean"*](https://surveyjs.io/Documentation/Library?id=questionbooleanmodel)
- [*"checkbox"*](https://surveyjs.io/Documentation/Library?id=questioncheckboxmodel)
- [*"comment"*](https://surveyjs.io/Documentation/Library?id=questioncommentmodel)
- [*"dropdown"*](https://surveyjs.io/Documentation/Library?id=questiondropdownmodel)
- [*"tagbox"*](https://surveyjs.io/form-library/documentation/questiontagboxmodel)
- [*"expression"*](https://surveyjs.io/Documentation/Library?id=questionexpressionmodel)
- [*"file"*](https://surveyjs.io/Documentation/Library?id=questionfilemodel)
- [*"html"*](https://surveyjs.io/Documentation/Library?id=questionhtmlmodel)
- [*"image"*](https://surveyjs.io/Documentation/Library?id=questionimagemodel)
- [*"imagepicker"*](https://surveyjs.io/Documentation/Library?id=questionimagepickermodel)
- [*"matrix"*](https://surveyjs.io/Documentation/Library?id=questionmatrixmodel)
- [*"matrixdropdown"*](https://surveyjs.io/Documentation/Library?id=questionmatrixdropdownmodel)
- [*"matrixdynamic"*](https://surveyjs.io/Documentation/Library?id=questionmatrixdynamicmodel)
- [*"multipletext"*](https://surveyjs.io/Documentation/Library?id=questionmultipletextmodel)
- [*"panel"*](https://surveyjs.io/Documentation/Library?id=panelmodel)
- [*"paneldynamic"*](https://surveyjs.io/Documentation/Library?id=questionpaneldynamicmodel)
- [*"radiogroup"*](https://surveyjs.io/Documentation/Library?id=questionradiogroupmodel)
- [*"rating"*](https://surveyjs.io/Documentation/Library?id=questionratingmodel)
- [*"ranking"*](https://surveyjs.io/Documentation/Library?id=questionrankingmodel)
- [*"signaturepad"*](https://surveyjs.io/Documentation/Library?id=questionsignaturepadmodel)
- [*"text"*](https://surveyjs.io/Documentation/Library?id=questiontextmodel)

### `setRowValue()`

**Return value:** `any`

Assigns values to a row.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `rowIndex` | `number` | A zero-based row index. |
| `rowValue` | `any` | An object with the following structure: `{ "column_name": columnValue, ... }` |

**Related APIs:** [`getRowValue`](#getRowValue)
