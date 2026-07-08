---
title: ISurveyMatrixCallbacks
product: Form Library
api-type: interface
description: Callbacks for matrix question events (row/cell add, remove, validate, render).
source: 
---

# `ISurveyMatrixCallbacks`

Callbacks for matrix question events (row/cell add, remove, validate, render).

## Properties

### `matrixDragHandleArea`

**Type**: `string`

## Methods

### `matrixRowAdded()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `row` | `any` |  |

### `matrixColumnAdded()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `column` | `any` |  |

### `matrixBeforeRowAdded()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `{ question: IQuestion; canAddRow: boolean; }` |  |

### `matrixRowRemoved()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `rowIndex` | `number` |  |
| `row` | `any` |  |

### `matrixRowRemoving()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `rowIndex` | `number` |  |
| `row` | `any` |  |

### `matrixAllowRemoveRow()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `rowIndex` | `number` |  |
| `row` | `any` |  |

### `matrixDetailPanelVisibleChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `rowIndex` | `number` |  |
| `row` | `any` |  |
| `visible` | `boolean` |  |

### `matrixCellCreating()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `options` | `any` |  |

### `matrixCellCreated()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `options` | `any` |  |

### `matrixAfterCellRender()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `any` |  |

### `matrixCellValueChanged()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `options` | `any` |  |

### `matrixCellValueChanging()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `options` | `any` |  |

### `matrixCellValidate()`

**Return value:** `SurveyError`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `options` | `any` |  |
