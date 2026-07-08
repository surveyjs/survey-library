---
title: ItemValue
product: Form Library
api-type: class
description: "Array of ItemValue is used in checkbox, dropdown and radiogroup choices, matrix columns and rows. It has two main properties: value and text. If text is empty, value is used for displaying. The text property is localizable and support markdown."
source: 
---

# `ItemValue`

Array of ItemValue is used in checkbox, dropdown and radiogroup choices, matrix columns and rows.
It has two main properties: value and text. If text is empty, value is used for displaying.
The text property is localizable and support markdown.

## Properties

### `Separator`

**Type**: `string`

### `ownerPropertyName`

**Type**: `string`

### `locTextValue`

**Type**: `LocalizableString`

### `visibleConditionRunner`

**Type**: `ConditionRunner`

### `enableConditionRunner`

**Type**: `ConditionRunner`

### `isGhost`

**Type**: `boolean`

### `locText`

**Type**: `LocalizableString`

### `_locOwner`

**Type**: `ILocalizableOwner`

### `locOwner`

**Type**: `ILocalizableOwner`

### `value`

**Type**: `any`

### `hasText`

**Type**: `boolean`

### `pureText`

**Type**: `string`

### `text`

**Type**: `string`

### `textOrHtml`

**Type**: `string`

### `calculatedText`

**Type**: `string`

### `shortcutText`

**Type**: `string`

### `visibleIf`

**Type**: `string`

### `enableIf`

**Type**: `string`

### `isVisible`

**Type**: `boolean`

### `isEnabled`

**Type**: `boolean`

### `originalItem`

**Type**: `any`

### `selectedValue`

**Type**: `boolean`

### `selected`

**Type**: `boolean`

### `componentValue`

**Type**: `string`

### `_htmlElement`

**Type**: `any`

### `icon`

**Type**: `string`

### `randomize`

**Type**: `boolean`

### `randomizeCategory`

**Type**: `string`

## Methods

### `getMarkdownHtml()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | `string` |  |
| `name` | `string` |  |
| `item` | `any` |  |

### `getRenderer()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `getRendererContext()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `locStr` | `LocalizableString` |  |

### `getProcessedText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | `string` |  |

### `setData()`

Resets the input array and fills it with values from the values array

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | `ItemValue[]` |  |
| `values` | `any[]` |  |
| `type` | `string` |  |

### `getData()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | `ItemValue[]` |  |

### `getOwner()`

**Return value:** `any`

### `getItemByValue()`

**Return value:** `ItemValue`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | `ItemValue[]` |  |
| `val` | `any` |  |

### `getTextOrHtmlByValue()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | `ItemValue[]` |  |
| `val` | `any` |  |

### `locStrsChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | `ItemValue[]` |  |

### `runConditionsForItems()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | `ItemValue[]` |  |
| `filteredItems` | `ItemValue[]` |  |
| `runner` | `ConditionRunner` |  |
| `properties` | `any` |  |
| `useItemExpression` | `boolean` |  |
| `onItemCallBack` | `(item: ItemValue, val: boolean) => boolean` |  |

### `runEnabledConditionsForItems()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | `ItemValue[]` |  |
| `runner` | `ConditionRunner` |  |
| `properties` | `any` |  |
| `onItemCallBack` | `(item: ItemValue, val: boolean) => boolean` |  |

### `getType()`

**Return value:** `string`

### `getSurvey()`

**Return value:** `ISurvey`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `live` | `boolean` |  |

### `getLocale()`

**Return value:** `string`

### `getLocalizableString()`

**Return value:** `LocalizableString`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `getValueGetterContext()`

**Return value:** `IValueGetterContext`

### `getData()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `ISaveToJSONOptions` |  |

### `toJSON()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `ISaveToJSONOptions` |  |

### `setData()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` |  |
| `isNewItem` | `boolean` |  |

### `setIsVisible()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `boolean` |  |

### `setIsEnabled()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `boolean` |  |

### `getComponent()`

**Return value:** `string`

### `setComponent()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `string` |  |

### `setRootElement()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `any` |  |

### `getRootElement()`

**Return value:** `HTMLElement`
