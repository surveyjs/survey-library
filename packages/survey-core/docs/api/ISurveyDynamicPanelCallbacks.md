---
title: ISurveyDynamicPanelCallbacks
product: Form Library
api-type: interface
description: Callbacks for dynamic panel events (add, remove, tab title, index change).
source: 
---

# `ISurveyDynamicPanelCallbacks`

Callbacks for dynamic panel events (add, remove, tab title, index change).

## Methods

### `dynamicPanelAdded()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `panelIndex` | `number` |  |
| `panel` | `IPanel` |  |
| `updateIndexes` | `boolean` |  |

### `dynamicPanelRemoved()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `panelIndex` | `number` |  |
| `panel` | `IPanel` |  |
| `updateIndexes` | `boolean` |  |

### `dynamicPanelRemoving()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `panelIndex` | `number` |  |
| `panel` | `IPanel` |  |

### `dynamicPanelGetTabTitle()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `options` | `any` |  |

### `dynamicPanelCurrentIndexChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `options` | `any` |  |
