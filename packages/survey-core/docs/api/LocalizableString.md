---
title: LocalizableString
product: Form Library
api-type: class
description: The class represents the string that supports multi-languages and markdown. It uses in all objects where support for multi-languages and markdown is required.
source: 
---

# `LocalizableString`

The class represents the string that supports multi-languages and markdown.
It uses in all objects where support for multi-languages and markdown is required.

## Properties

### `SerializeAsObject`

**Type**: `boolean`

### `defaultLocale`

**Type**: `string`

### `defaultRenderer`

**Type**: `string`

### `editableRenderer`

**Type**: `string`

### `values`

**Type**: `any`

### `htmlValues`

**Type**: `{}`

### `renderedText`

**Type**: `string`

### `calculatedTextValue`

**Type**: `string`

### `_localizationName`

**Type**: `string`

### `localizationName`

**Type**: `string`

### `_allowLineBreaks`

**Type**: `boolean`

### `allowLineBreaks`

**Type**: `boolean`

### `onGetTextCallback`

**Type**: `(str: string, nonProcessedText?: string) => string`

### `storeDefaultText`

**Type**: `boolean`

### `serializeCallBackText`

**Type**: `boolean`

### `onStrChanged`

**Type**: `(oldValue: string, newValue: string) => void`

### `lastChangedLoc`

**Type**: `string`

### `onSearchChanged`

**Type**: `() => void`

### `sharedData`

**Type**: `LocalizableString`

### `searchText`

**Type**: `string`

### `searchIndex`

**Type**: `number`

### `disableLocalization`

**Type**: `boolean`

### `defaultValue`

**Type**: `string`

### `locale`

**Type**: `string`

### `isDefautlLocale`

**Type**: `boolean`

### `text`

**Type**: `string`

### `calculatedText`

**Type**: `string`

### `isTextRequested`

**Type**: `boolean`

### `pureText`

**Type**: `string`

### `hasHtml`

**Type**: `boolean`

### `html`

**Type**: `string`

### `isEmpty`

**Type**: `boolean`

### `textOrHtml`

**Type**: `string`

### `renderedHtml`

**Type**: `string`

### `renderAs`

**Type**: `string`

### `renderAsData`

**Type**: `any`

### `searchableText`

**Type**: `string`

## Methods

### `getIsMultiple()`

**Return value:** `boolean`

### `getStringViewerClassName()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `textClass` | `string` |  |

### `strChanged()`

### `getPlaceholder()`

**Return value:** `string`

### `getLocaleText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `loc` | `string` |  |

### `clear()`

### `clearLocale()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `loc` | `string` |  |

### `setLocaleText()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `loc` | `string` |  |
| `value` | `string` |  |

### `hasNonDefaultText()`

**Return value:** `boolean`

### `getLocales()`

**Return value:** `string[]<any>`

### `getJson()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `ISaveToJSONOptions` |  |

### `setJson()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` |  |
| `isLoading` | `boolean` |  |

### `mergeWith()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `locStr` | `LocalizableString` |  |
| `locales` | `string[]` |  |

### `equals()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |

### `setFindText()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | `string` |  |

### `onChanged()`

### `getHtmlValue()`

**Return value:** `string`
