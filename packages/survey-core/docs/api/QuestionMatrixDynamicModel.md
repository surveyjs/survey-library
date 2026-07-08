---
title: QuestionMatrixDynamicModel
product: Form Library
api-type: class
description: A class that describes the Dynamic Matrix question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionmatrixdynamicmodel
---

# `QuestionMatrixDynamicModel`

A class that describes the Dynamic Matrix question type.

Dynamic Matrix allows respondents to add and delete matrix rows. You can use the [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel), [Checkboxes](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Radio Button Group](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), [Single-Line Input](https://surveyjs.io/form-library/documentation/questiontextmodel), [Long Text](https://surveyjs.io/form-library/documentation/questioncommentmodel), and other question types as cell editors.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionMatrixBaseModel` &rarr; `QuestionMatrixDropdownModelBase` &rarr; `QuestionMatrixDynamicModel`

## Properties

### `addRowButtonLocation`

**Type**: `string`

Specifies the location of the Add Row button.

Possible values:

- `"top"` - Displays the Add Row button at the top of the matrix.
- `"bottom"` - Displays the Add Row button at the bottom of the matrix.
- `"topBottom"` - Displays the Add Row button at the top and bottom of the matrix.

Default value: `"top"` if [`transposeData`](#transposeData) is `true`; `"bottom"` if `transposeData` is `false` or the matrix is in compact mode.

### `addRowText`

**Type**: `string`

A caption for the Add Row button.

[View Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))

### `allowAddRows`

**Type**: `boolean`

Specifies whether users are allowed to add new rows.

Default value: `true`

### `allowRemoveRows`

**Type**: `boolean`

Specifies whether users are allowed to delete rows.

Default value: `true`

### `allowRowReorder`

**Type**: `boolean`

Specifies whether users can drag and drop matrix rows to reorder them. Applies only if [`transposeData`](#transposeData) is `false`.

Default value: `false`

### `canAddRow`

**Type**: `boolean`

Indicates whether it is possible to add a new row.

This property returns `true` when all of the following conditions apply:

- Users are allowed to add new rows (`allowAddRows` is `true`).
- The question, its parent panel, or survey is not in read-only state.
- `rowCount` is less than `maxRowCount`.

### `canRemoveRows`

**Type**: `boolean`

Indicates whether it is possible to delete rows.

This property returns `true` when all of the following conditions apply:

- Users are allowed to delete rows (`allowRemoveRows` is `true`).
- The question, its parent panel, or survey is not in read-only state.
- `rowCount` exceeds `minRowCount`.

### `confirmDelete`

**Type**: `boolean`

Specifies whether to display a confirmation dialog when a respondent wants to delete a row.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))

### `confirmDeleteText`

**Type**: `string`

A message displayed in a confirmation dialog that appears when a respondent wants to delete a row.

[View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))

### `copyDefaultValueFromLastEntry`

**Type**: `boolean`

Specifies whether default values for a new row/column should be copied from the last row/column.

If you also specify `defaultValue`, it will be merged with the copied values.

### `defaultRowValue`

**Type**: `any`

If it is not empty, then this value is set to every new row, including rows created initially, unless the defaultValue is not empty

### `detailPanelShowOnAdding`

**Type**: `boolean`

Specifies whether to expand the detail section immediately when a respondent adds a new row.

[View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))

### `hideColumnsIfEmpty`

**Type**: `boolean`

Specifies whether to hide columns when the matrix does not contain any rows. If you enable this property, the matrix displays the `noRowsText` message and the Add Row button.

Default value: `false`

### `keyName`

**Type**: `string`

Specifies a key column. Set this property to a column name, and the question will display `keyDuplicationError` if a user tries to enter a duplicate value in this column.

### `maxRowCount`

**Type**: `number`

A maximum number of rows in the matrix. Users cannot add new rows if `rowCount` equals `maxRowCount`.

Default value: 1000 (inherited from [`settings.matrix.maxRowCount`](https://surveyjs.io/form-library/documentation/settings#matrixMaximumRowCount))

[View Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))

### `minRowCount`

**Type**: `number`

A minimum number of rows in the matrix. Users cannot delete rows if `rowCount` equals `minRowCount`.

Default value: 0

[View Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))

### `noRowsText`

**Type**: `string`

A message displayed when the matrix does not contain any rows. Applies only if `hideColumnsIfEmpty` is enabled.

### `removeRowText`

**Type**: `string`

Use this property to change the default value of remove row button text.

[View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))

### `rowCount`

**Type**: `number`

The number of rows in the matrix.

Default value: 2

[View Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))

## Methods

### `addRow()`

Creates and adds a new row to the matrix.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `setFocus` | `boolean` | *(Optional)* Pass `true` to focus the cell in the first column. |

### `removeRow()`

Removes a matrix row with a specified index.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `index` | `number` | A zero-based row index. |
| `confirmDelete` | `boolean` | *(Optional)* A Boolean value that specifies whether to display a confirmation dialog. If you do not specify this parameter, the [`confirmDelete`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#confirmDelete) property value is used. |
| `onRowRemoved` | `() => void` |  |
