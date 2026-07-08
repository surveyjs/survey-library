---
title: DynamicPanelValueChangedEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `DynamicPanelValueChangedEvent`

## Inheritance

`PanelDynamicQuestionEventMixin` &rarr; `DynamicPanelValueChangedEvent`

## Properties

### `panelData`

The panel's data object that includes all item values.

**Type**: `{ [index: string]: any; }`

### `panelIndex`

The panel's index within Dynamic Panel.

**Type**: `number`

### `name`

The item's name.

**Type**: `string`

### `panel`

A panel that nests the item with a changed value.

**Type**: `PanelModel`

### `value`

The item's new value.

**Type**: `any`
