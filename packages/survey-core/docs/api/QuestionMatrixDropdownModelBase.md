---
title: QuestionMatrixDropdownModelBase
product: Form Library
api-type: class
description: "A base class for the [`QuestionMatrixDropdownModel`](https://surveyjs.io/form-library/documentation/questionmatrixdropdownmodel) and [`QuestionMatrixDynamicModel`](https://surveyjs.io/form-library/documentation/questionmatrixdynamicmodel) classes."
source: 
---

# `QuestionMatrixDropdownModelBase`

A base class for the [`QuestionMatrixDropdownModel`](https://surveyjs.io/form-library/documentation/questionmatrixdropdownmodel) and [`QuestionMatrixDynamicModel`](https://surveyjs.io/form-library/documentation/questionmatrixdynamicmodel) classes.

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionMatrixBaseModel` &rarr; `QuestionMatrixDropdownModelBase`

## Properties

### `matrixCallbacks`

**Type**: `ISurveyMatrixCallbacks`

### `choiceCallbacks`

**Type**: `ISurveyChoiceCallbacks`

### `defaultCellType`

**Type**: `string`

### `detailPanelValue`

**Type**: `PanelModel`

### `useCaseSensitiveComparisonValue`

**Type**: `boolean`

### `columnsChangedCallback`

**Type**: `() => void`

### `onRenderedTableResetCallback`

**Type**: `() => void`

### `onCellCreatedCallback`

**Type**: `(options: any) => void`

### `onCellValueChangedCallback`

**Type**: `(options: any) => void`

### `onHasDetailPanelCallback`

**Type**: `(row: MatrixDropdownRowModelBase) => boolean`

### `onCreateDetailPanelCallback`

**Type**: `(row: MatrixDropdownRowModelBase, panel: PanelModel) => void`

### `onCreateDetailPanelRenderedRowCallback`

**Type**: `(renderedRow: QuestionMatrixDropdownRenderedRow) => void`

### `onAddColumn`

**Type**: `(column: MatrixDropdownColumn) => void`

### `onRemoveColumn`

**Type**: `(column: MatrixDropdownColumn) => void`

### `cellValueChangingCallback`

**Type**: `(row: any, columnName: string, value: any, oldValue: any) => any`

### `isContainer`

**Type**: `boolean`

### `isRowsDynamic`

**Type**: `boolean`

### `isUpdating`

**Type**: `boolean`

### `transposeData`

Specifies whether to display [`columns`](#columns) as rows and [`rows`](#rows) as columns.

Default value: `false`

[Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))

[Dynamic Matrix Demo](https://surveyjs.io/form-library/examples/transpose-dynamic-rows-to-columns-in-matrix/ (linkStyle))

**Type**: `boolean`

### `columnLayout`

**Type**: `string`

### `detailErrorLocation`

Specifies the error message position for questions within detail sections.

Possible values:

- `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
- `"top"` - Displays error messages above questions.
- `"bottom"` - Displays error messages below questions.

**Type**: `string`

### `cellErrorLocation`

Specifies the error message position relative to matrix cells.

Possible values:

- `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
- `"top"` - Displays error messages above matrix cells.
- `"bottom"` - Displays error messages below matrix cells.

**Type**: `string`

### `isColumnLayoutHorizontal`

Returns `true` if [`columns`](#columns) are placed in the horizontal direction and [`rows`](#columns) in the vertical direction.

To specify the layout, use the [`transposeData`](#transposeData) property. If you set it to `true`, the survey applies it only when the screen has enough space. Otherwise, the survey falls back to the original layout, but the `transposeData` property remains set to `true`. Unlike `transposeData`, the `isColumnLayoutHorizontal` property always indicates the current layout.

**Type**: `boolean`

### `useCaseSensitiveComparison`

Enables case-sensitive comparison in columns with the `isUnique` property set to `true`.

When this property is `true`, `"ABC"` and `"abc"` are considered different values.

Default value: `false`

**Type**: `boolean`

### `isUniqueCaseSensitive`

**Type**: `boolean`

### `detailPanelMode`

Specifies the location of detail sections.

Possible values:

- `"underRow"` - Displays detail sections under their respective rows. Users can expand any number of detail sections.
- `"underRowSingle"` - Displays detail sections under their respective rows, but only one detail section can be expanded at a time.
- `"none"` (default) - Hides detail sections.

Use the [`detailElements`](#detailElements) property to specify content of detail sections.

[View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))

**Type**: `string`

### `detailPanel`

Contains a [`PanelModel`](https://surveyjs.io/form-library/documentation/panelmodel) instance that represents a detail section template.

**Type**: `PanelModel`

### `detailElements`

An array of survey elements (questions and panels) to be displayed in detail sections.

Detail sections are expandable panels displayed under each matrix row. You can use them to display questions that do not fit into the row.

Set the [`detailPanelMode`](#detailPanelMode) property to `"underRow"` or `"underRowSingle"` to display detail sections.

[View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))

**Type**: `IElement[]`

### `hasRowText`

**Type**: `boolean`

### `canAddRow`

**Type**: `boolean`

### `canRemoveRows`

**Type**: `boolean`

### `lockResetRenderedTable`

**Type**: `boolean`

### `renderedTable`

**Type**: `QuestionMatrixDropdownRenderedTable`

### `cellType`

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

**Type**: `string`

### `columnColCount`

Specifies the number of columns in Radiogroup and Checkbox cells.

Default value: 0 (the number of columns is selected automatically based on the available column width)

**Type**: `number`

### `horizontalScroll`

**Type**: `boolean`

### `allowAdaptiveActions`

**Type**: `boolean`

### `hasFooter`

**Type**: `boolean`

### `hasTotal`

**Type**: `boolean`

### `isRunningCellsCondition`

**Type**: `boolean`

### `choices`

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

**Type**: `any[]`

### `placeholder`

A placeholder for Dropdown matrix cells.

**Type**: `string`

### `optionsCaption`

**Type**: `string`

### `keyDuplicationError`

An error message displayed when users enter a duplicate value into a column that accepts only unique values (`isUnique` is set to `true` or `keyName` is specified).

A default value for this property is taken from a [localization dictionary](https://github.com/surveyjs/survey-library/tree/01bd8abd0c574719956d4d579d48c8010cd389d4/packages/survey-core/src/localization). Refer to the following help topic for more information: [Localization & Globalization](https://surveyjs.io/form-library/documentation/localization).

**Type**: `string`

### `singleInputTitleTemplate`

A title template that applies when the survey is in [input-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode).

Default value: `"Row {rowIndex}"` for Dynamic Matrix | `"{rowTitle}"` for Multi-Select Matrix

The template can contain the following placeholders:

- `{rowIndex}` - A row index within the collection of all rows. Starts with 1.
- `{visibleRowIndex}` - A row index within the collection of visible rows. Starts with 1.
- `{rowName}` - A row name (the `value` property within objects in the [`rows`](#rows) array). Use this placeholder if you need to distinguish between matrix rows.
- `{rowTitle}` - A row title (the `text` property within objects in the `rows` array).
- `{row.columnname}` - The value of a cell in the same row.

[View Demo](https://surveyjs.io/form-library/examples/loop-and-merge/ (linkStyle))

**Type**: `string`

### `storeOthersAsComment`

**Type**: `boolean`

### `visibleRowsArray`

**Type**: `MatrixDropdownRowModelBase[]`

### `isGenereatingRows`

**Type**: `boolean`

### `allRows`

**Type**: `MatrixDropdownRowModelBase[]`

### `totalValue`

**Type**: `any`

### `visibleTotalRow`

**Type**: `MatrixDropdownRowModelBase`

### `isDoingonAnyValueChanged`

**Type**: `boolean`

### `isValueChangedWithoutRows`

**Type**: `boolean`

### `rootElement`

**Type**: `any`

### `dragDropMatrixAttribute`

**Type**: `string`

## Methods

### `addDefaultColumns()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `matrix` | `QuestionMatrixDropdownModelBase` |  |

### `getType()`

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

**Return value:** `string`

### `dispose()`

### `beginUpdate()`

### `endUpdate()`

### `itemValuePropertyChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |
| `name` | `string` |  |
| `oldValue` | `any` |  |
| `newValue` | `any` |  |

### `getChildErrorLocation()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `child` | `Question` |  |

### `getPanels()`

**Return value:** `IPanel[]<IPanel>`

### `getPanelInDesignMode()`

**Return value:** `PanelModel`

### `getFooterText()`

**Return value:** `LocalizableString`

### `canRemoveRow()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `MatrixDropdownRowModelBase` |  |

### `onPointerDown()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `pointerDownEvent` | `any` |  |
| `row` | `MatrixDropdownRowModelBase` |  |

### `resetRenderedTable()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `columnVisibilityChanged` | `boolean` |  |

### `hasChoices()`

**Return value:** `boolean`

### `getRowTitleWidth()`

**Return value:** `string`

### `getAddRowLocation()`

**Return value:** `string`

### `getShowColumnsIfEmpty()`

**Return value:** `boolean`

### `getConditionJson()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `operator` | `string` |  |
| `path` | `string` |  |

### `clearIncorrectValues()`

### `clearErrors()`

### `localeChanged()`

### `runTriggers()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `value` | `any` |  |
| `keys` | `any` |  |

### `updateElementVisibility()`

### `IsMultiplyColumn()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `column` | `MatrixDropdownColumn` |  |

### `locStrsChanged()`

### `randomSeedChanged()`

### `getColumnByName()`

Returns a matrix column with a given `name` or `null` if a column with this is not found.

**Return value:** `MatrixDropdownColumn`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `columnName` | `string` | A column name. |

### `getColumnWidth()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `column` | `MatrixDropdownColumn` |  |

### `getMatrixDropdownBaseSingleQuestionLocTitleCore()`

**Return value:** `LocalizableString`

### `getSingleInputTitleTemplate()`

**Return value:** `string`

### `processSingleInputTitle()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | `string` |  |
| `row` | `MatrixDropdownRowModelBase` |  |

### `addColumn()`

**Return value:** `MatrixDropdownColumn`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `title` | `string` |  |

### `onSurveyLoad()`

### `getRowValue()`

Returns an object with row values. If a row has no answers, this method returns an empty object.

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `rowIndex` | `number` | A zero-based row index. |

### `getItemData()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ISurveyData` |  |

### `checkIfValueInRowDuplicated()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `checkedRow` | `MatrixDropdownRowModelBase` |  |
| `cellQuestion` | `Question` |  |

### `setRowValue()`

Assigns values to a row.

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `rowIndex` | `number` | A zero-based row index. |
| `rowValue` | `any` | An object with the following structure: `{ "column_name": columnValue, ... }` |

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

### `onHidingContent()`

### `getProgressInfo()`

**Return value:** `IProgressInfo`

### `getAllErrors()`

**Return value:** `SurveyError[]<SurveyError>`

### `getFirstQuestionToFocus()`

**Return value:** `Question`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `withError` | `boolean` |  |

### `createQuestion()`

**Return value:** `Question`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `MatrixDropdownRowModelBase` |  |
| `column` | `MatrixDropdownColumn` |  |

### `getElementsInDesign()`

**Return value:** `IElement[]<IElement>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `includeHidden` | `boolean` |  |

### `getDetailPanelButtonCss()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `MatrixDropdownRowModelBase` |  |

### `getDetailPanelIconCss()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `MatrixDropdownRowModelBase` |  |

### `getDetailPanelIconId()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `row` | `MatrixDropdownRowModelBase` |  |

### `getQuestionFromArray()`

**Return value:** `IQuestion`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `index` | `number` |  |

### `getCellTemplateData()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `QuestionMatrixDropdownRenderedCell` |  |

### `getCellWrapperComponentName()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `MatrixDropdownCell` |  |

### `getCellWrapperComponentData()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `MatrixDropdownCell` |  |

### `getColumnHeaderWrapperComponentName()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `MatrixDropdownCell` |  |

### `getColumnHeaderWrapperComponentData()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `MatrixDropdownCell` |  |

### `getRowHeaderWrapperComponentName()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `MatrixDropdownCell` |  |

### `getRowHeaderWrapperComponentData()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cell` | `MatrixDropdownCell` |  |

### `getRootCss()`

**Return value:** `string`

### `afterRenderQuestionElement()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |

### `beforeDestroyQuestionElement()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |

### `setRootElement()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `any` |  |

### `getRootElement()`

**Return value:** `HTMLElement`
