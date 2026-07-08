---
title: ISurveyFileCallbacks
product: Form Library
api-type: interface
description: Callbacks for file upload, download, removal, and file chooser operations.
source: 
---

# `ISurveyFileCallbacks`

Callbacks for file upload, download, removal, and file chooser operations.

## Methods

### `uploadFiles()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `name` | `string` |  |
| `files` | `any[]` |  |
| `uploadingCallback` | `(data: any, errors?: any) => any` |  |
| `sourceType` | `string` |  |

### `downloadFile()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `name` | `string` |  |
| `content` | `string` |  |
| `callback` | `(status: string, data: any) => any` |  |

### `clearFiles()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `name` | `string` |  |
| `value` | `any` |  |
| `fileName` | `string` |  |
| `clearCallback` | `(status: string, data: any) => any` |  |

### `chooseFiles()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `input` | `any` |  |
| `callback` | `(files: any[]) => void` |  |
| `context` | `{ element: Base; item?: any; elementType?: string; propertyName?: string; }` |  |
