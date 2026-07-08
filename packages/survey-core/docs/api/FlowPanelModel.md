---
title: FlowPanelModel
product: Form Library
api-type: class
description: The flow panel object. It is a container with flow layout where you can mix questions with markdown text.
source: 
---

# `FlowPanelModel`

The flow panel object. It is a container with flow layout where you can mix questions with markdown text.

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `PanelModelBase` &rarr; `PanelModel` &rarr; `FlowPanelModel`

## Properties

### `contentElementNamePrefix`

**Type**: `string`

### `contentChangedCallback`

**Type**: `() => void`

### `onGetHtmlForQuestion`

**Type**: `(question: Question) => string`

### `onCustomHtmlProducing`

**Type**: `() => string`

### `content`

**Type**: `string`

### `html`

**Type**: `string`

## Methods

### `getType()`

**Return value:** `string`

### `produceHtml()`

**Return value:** `string`

### `getQuestionFromText()`

**Return value:** `Question`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `str` | `string` |  |

### `getElementContentText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `IElement` |  |
