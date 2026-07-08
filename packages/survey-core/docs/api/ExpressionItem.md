---
title: ExpressionItem
product: Form Library
api-type: class
description: Base class for HtmlConditionItem and UrlConditionItem classes.
source: 
---

# `ExpressionItem`

Base class for HtmlConditionItem and UrlConditionItem classes.

## Inheritance

`Base` &rarr; `ExpressionItem`

## Properties

### `locOwner`

**Type**: `ILocalizableOwner`

### `expression`

The expression property. If this expression returns true, then survey will use html property to show on complete page.

**Type**: `string`

## Methods

### `getType()`

**Return value:** `string`

### `getOwner()`

**Return value:** `ILocalizableOwner`

### `runCondition()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `properties` | `any` |  |

### `getLocale()`

**Return value:** `string`

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

### `getSurvey()`

**Return value:** `ISurvey`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `isLive` | `boolean` |  |
