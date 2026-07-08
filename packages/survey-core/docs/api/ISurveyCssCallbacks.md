---
title: ISurveyCssCallbacks
product: Form Library
api-type: interface
description: Callbacks for CSS class updates on questions, panels, pages, and choice items.
source: 
---

# `ISurveyCssCallbacks`

Callbacks for CSS class updates on questions, panels, pages, and choice items.

## Methods

### `updateQuestionCssClasses()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `cssClasses` | `any` |  |

### `updatePanelCssClasses()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `panel` | `IPanel` |  |
| `cssClasses` | `any` |  |

### `updatePageCssClasses()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `panel` | `IPanel` |  |
| `cssClasses` | `any` |  |

### `updateChoiceItemCss()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `options` | `any` |  |
