---
title: ISurveyChoiceCallbacks
product: Form Library
api-type: interface
description: Callbacks and settings for choice/select-based questions (choice visibility, display values, server-populated choices, custom items).
source: 
---

# `ISurveyChoiceCallbacks`

Callbacks and settings for choice/select-based questions (choice visibility, display values,
server-populated choices, custom items).

## Properties

### `storeOthersAsComment`

**Type**: `boolean`

### `clearValueOnDisableItems`

**Type**: `boolean`

### `clearDisabledChoices`

**Type**: `boolean`

## Methods

### `canChangeChoiceItemsVisibility()`

**Return value:** `boolean`

### `getChoiceItemVisibility()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `item` | `any` |  |
| `val` | `boolean` |  |

### `loadQuestionChoices()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `{ question: IQuestion; filter: string; skip: number; take: number; setItems: (items: any[], totalCount: number) => void; }` |  |

### `getChoiceDisplayValue()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `{ question: IQuestion; values: any[]; setItems: (displayValues: string[], ...customValues: IValueItemCustomPropValues[]) => void; }` |  |

### `updateChoicesFromServer()`

**Return value:** `any[]<any>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `choices` | `any[]` |  |
| `serverResult` | `any` |  |

### `loadedChoicesFromServer()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |

### `createCustomChoiceItem()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `CreateCustomChoiceItemEvent` |  |
