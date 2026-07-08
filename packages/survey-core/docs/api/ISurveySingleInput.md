---
title: ISurveySingleInput
product: Form Library
api-type: interface
description: Settings and callbacks for single-input (single-question-per-page) mode.
source: 
---

# `ISurveySingleInput`

Settings and callbacks for single-input (single-question-per-page) mode.

## Properties

### `currentSingleQuestion`

**Type**: `IQuestion`

### `isSingleVisibleInput`

**Type**: `boolean`

### `currentSingleElement`

**Type**: `IElement`

## Methods

### `updateNavigationElements()`

### `supportsNestedSingleInput()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |

### `updateNestedSingleQuestions()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `nestedQuestions` | `IQuestion[]` |  |
