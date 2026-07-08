---
title: SurveyElementCore
product: Form Library
api-type: class
description: "A base class for the [`SurveyElement`](https://surveyjs.io/form-library/documentation/surveyelement) and [`SurveyModel`](https://surveyjs.io/form-library/documentation/surveymodel) classes."
source: 
---

# `SurveyElementCore`

A base class for the [`SurveyElement`](https://surveyjs.io/form-library/documentation/surveyelement) and [`SurveyModel`](https://surveyjs.io/form-library/documentation/surveymodel) classes.

## Inheritance

`Base` &rarr; `SurveyElementCore`

## Properties

### `title`

A title for the survey element. If `title` is undefined, the `name` property value is displayed instead.

Empty pages and panels do not display their titles or names.

**Type**: `string`

### `hasDescription`

Returns `true` if the survey element has a description.

**Type**: `boolean`

### `description`

Explanatory text displayed under the title.

**Type**: `string`

### `titleTagName`

**Type**: `string`

### `hasTitle`

**Type**: `boolean`

### `hasTitleActions`

**Type**: `boolean`

### `hasTitleEvents`

**Type**: `boolean`

### `isTitleOwner`

**Type**: `boolean`

### `isTitleRenderedAsString`

**Type**: `boolean`

### `cssClasses`

**Type**: `any`

### `cssTitle`

**Type**: `string`

### `ariaTitleId`

**Type**: `string`

### `ariaDescriptionId`

**Type**: `string`

### `titleTabIndex`

**Type**: `number`

### `titleAriaExpanded`

**Type**: `any`

### `titleAriaRole`

**Type**: `any`

### `ariaLabel`

**Type**: `string`

### `titleAriaLabel`

**Type**: `string`

## Methods

### `getAllowLineBreaks()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `getTitleToolbar()`

**Return value:** `AdaptiveActionContainer<Action>`

### `getTitleOwner()`

**Return value:** `ITitleOwner`

### `toggleState()`

**Return value:** `boolean`

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
| `context` | `any` |  |
