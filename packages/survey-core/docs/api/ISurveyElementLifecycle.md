---
title: ISurveyElementLifecycle
product: Form Library
api-type: interface
description: Callbacks for element lifecycle events (question/panel/page add, remove, rename, visibility).
source: 
---

# `ISurveyElementLifecycle`

Callbacks for element lifecycle events (question/panel/page add, remove, rename, visibility).

## Methods

### `questionCreated()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |

### `questionAdded()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `index` | `number` |  |
| `parentPanel` | `any` |  |
| `rootPanel` | `any` |  |

### `panelAdded()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `panel` | `IElement` |  |
| `index` | `number` |  |
| `parentPanel` | `any` |  |
| `rootPanel` | `any` |  |

### `questionRemoved()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |

### `panelRemoved()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `panel` | `IElement` |  |

### `questionRenamed()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `oldName` | `string` |  |
| `oldValueName` | `string` |  |

### `pageVisibilityChanged()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `page` | `IPage` |  |
| `newValue` | `boolean` |  |

### `panelVisibilityChanged()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `panel` | `IPanel` |  |
| `newValue` | `boolean` |  |

### `questionVisibilityChanged()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `newValue` | `boolean` |  |
| `resetIndexes` | `boolean` |  |

### `elementContentVisibilityChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `ISurveyElement` |  |

### `pagePassed()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `page` | `IPage` |  |
