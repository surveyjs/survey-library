---
title: ISurveyTitleSettings
product: Form Library
api-type: interface
description: Settings and callbacks for title/numbering display (question titles, numbering, required mark, title tag, element actions).
source: 
---

# `ISurveyTitleSettings`

Settings and callbacks for title/numbering display (question titles, numbering, required mark,
title tag, element actions).

## Properties

### `requiredMark`

**Type**: `string`

### `questionTitlePattern`

**Type**: `string`

### `questionTitleLocation`

**Type**: `string`

### `questionDescriptionLocation`

**Type**: `string`

### `questionErrorLocation`

**Type**: `string`

### `showQuestionNumbers`

**Type**: `string | boolean`

### `beforeShowInplaceDescriptionEditorCallback`

**Type**: `(element: Base, show: boolean) => boolean`

## Methods

### `getQuestionStartIndex()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `pageVisibleIndex` | `number` |  |

### `getElementTitleTagName()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `Base` |  |
| `tagName` | `string` |  |

### `getQuestionDisplayValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IElement` |  |
| `displayValue` | `any` |  |

### `getExpressionDisplayValue()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `value` | `any` |  |
| `displayValue` | `string` |  |

### `getUpdatedQuestionTitle()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `title` | `string` |  |

### `getUpdatedQuestionNo()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `no` | `string` |  |

### `getUpdatedPanelNo()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IPanel` |  |
| `no` | `string` |  |

### `getUpdatedPageNo()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IPage` |  |
| `no` | `string` |  |

### `getUpdatedElementTitleActions()`

**Return value:** `IAction[]<IAction>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `ISurveyElement` |  |
| `titleActions` | `IAction[]` |  |

### `getUpdatedMatrixRowActions()`

**Return value:** `IAction[]<IAction>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `QuestionMatrixDropdownModelBase` |  |
| `row` | `MatrixDropdownRowModelBase` |  |
| `actions` | `IAction[]` |  |

### `getUpdatedPanelFooterActions()`

**Return value:** `IAction[]<IAction>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `panel` | `PanelModel` |  |
| `actions` | `IAction[]` |  |
| `question` | `QuestionPanelDynamicModel` |  |
