---
title: QuestionMatrixModel
product: Form Library
api-type: class
description: "A class that describes the Single-Select Matrix question type. [View Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))"
source: 
---

# `QuestionMatrixModel`

A class that describes the Single-Select Matrix question type.

[View Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionMatrixBaseModel` &rarr; `QuestionMatrixModel`

## Properties

### `isRowChanging`

**Type**: `boolean`

### `cellsValue`

**Type**: `MatrixCells`

### `cellType`

Specifies the type of matrix cells.

Possible values:

- `"radio"` (default)
- `"checkbox"`

[Radio-Button Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

[Checkbox Matrix Demo](https://surveyjs.io/form-library/examples/checkbox-matrix-question/ (linkStyle))

**Type**: `string`

### `isMultiSelect`

**Type**: `boolean`

### `cellComponent`

The name of a component used to render cells.

**Type**: `string`

### `hasSingleInput`

**Type**: `boolean`

### `eachRowRequired`

Specifies whether each row requires an answer. If a respondent skips a row, the question displays a validation error.

[View Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))

**Type**: `boolean`

### `isAllRowRequired`

**Type**: `boolean`

### `eachRowUnique`

Specifies whether answers in all rows should be unique. If any answers duplicate, the question displays a validation error.

**Type**: `boolean`

### `hasRows`

**Type**: `boolean`

### `rowOrder`

Specifies a sort order for matrix rows.

Possible values:

- `"initial"` (default) - Preserves the original order of the `rows` array.
- `"random"` - Arranges matrix rows in random order each time the question is displayed.

**Type**: `string`

### `rowsOrder`

**Type**: `string`

### `hideIfRowsEmpty`

Specifies whether to hide the question when the matrix has no visible rows.

**Type**: `boolean`

### `checkType`

**Type**: `string`

### `itemSvgIcon`

**Type**: `string`

### `cssItemValue`

**Type**: `string`

### `cssMaterialDecorator`

**Type**: `string`

### `cssItemDecorator`

**Type**: `string`

### `nestedQuestionsValue`

**Type**: `Question[]`

### `visibleRows`

**Type**: `MatrixRowModel[]`

### `cells`

An array of matrix cells. Use this array to get or set cell values.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-matrix-rubric/ (linkStyle))

**Type**: `MatrixCells`

### `hasCellText`

**Type**: `boolean`

### `emptyLocalizableString`

**Type**: `LocalizableString`

### `errorsInRow`

**Type**: `HashTable<boolean>`

## Methods

### `getType()`

**Return value:** `string`

### `addColumn()`

**Return value:** `MatrixColumn`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` |  |
| `text` | `string` |  |

### `getItemClass()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `any` |  |
| `column` | `any` |  |

### `getItemSvgIcon()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `any` |  |
| `column` | `any` |  |

### `locStrsChanged()`

### `getMatrixRows()`

**Return value:** `MatrixRowModel[]<MatrixRowModel>`

### `getMatrixSingleInputQuestions()`

**Return value:** `Question[]<Question>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |
| `checkDynamic` | `boolean` |  |

### `resetSingleInput()`

### `dispose()`

### `randomSeedChanged()`

### `setCellText()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `any` |  |
| `column` | `any` |  |
| `val` | `string` |  |

### `getCellText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `any` |  |
| `column` | `any` |  |

### `setDefaultCellText()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `column` | `any` |  |
| `val` | `string` |  |

### `getDefaultCellText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `column` | `any` |  |

### `getCellDisplayText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `any` |  |
| `column` | `any` |  |

### `getCellDisplayLocText()`

**Return value:** `LocalizableString`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `any` |  |
| `column` | `any` |  |

### `getValueGetterContext()`

**Return value:** `IValueGetterContext`

### `getPlainData()`

**Return value:** `IQuestionPlainData`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `IPlainDataOptions` |  |

### `addConditionObjectsByContext()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `objects` | `IConditionObject[]` |  |
| `context` | `any` |  |

### `getConditionJson()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `operator` | `string` |  |
| `path` | `string` |  |

### `clearIncorrectValues()`

### `getColumnHeaderWrapperComponentName()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `ItemValue` |  |

### `getColumnHeaderWrapperComponentData()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `ItemValue` |  |

### `getRowHeaderWrapperComponentName()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `ItemValue` |  |

### `getRowHeaderWrapperComponentData()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `ItemValue` |  |
