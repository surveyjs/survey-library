---
title: LocalizableStrings
product: Form Library
api-type: class
description: The class represents the list of strings that supports multi-languages.
source: 
---

# `LocalizableStrings`

The class represents the list of strings that supports multi-languages.

## Properties

### `values`

**Type**: `any`

### `onValueChanged`

**Type**: `(oldValue: any, newValue: any) => void`

### `locale`

**Type**: `string`

### `value`

**Type**: `string[]`

### `text`

**Type**: `string`

### `isEmpty`

**Type**: `boolean`

## Methods

### `getIsMultiple()`

**Return value:** `boolean`

### `getLocaleText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `loc` | `string` |  |

### `setLocaleText()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `loc` | `string` |  |
| `newValue` | `string` |  |

### `getValue()`

**Return value:** `string[]<any>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `loc` | `string` |  |

### `setValue()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `loc` | `string` |  |
| `val` | `string[]` |  |

### `hasValue()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `loc` | `string` |  |

### `getLocales()`

**Return value:** `string[]<any>`

### `getJson()`

**Return value:** `any`

### `setJson()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` |  |
