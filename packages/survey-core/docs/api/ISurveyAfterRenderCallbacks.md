---
title: ISurveyAfterRenderCallbacks
product: Form Library
api-type: interface
description: Callbacks fired after rendering questions, panels, and pages.
source: 
---

# `ISurveyAfterRenderCallbacks`

Callbacks fired after rendering questions, panels, and pages.

## Methods

### `afterRenderQuestion()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `htmlElement` | `any` |  |

### `afterRenderQuestionInput()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `htmlElement` | `any` |  |

### `afterRenderPanel()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `panel` | `IElement` |  |
| `htmlElement` | `any` |  |

### `afterRenderPage()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `htmlElement` | `any` |  |
