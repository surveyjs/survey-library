---
title: MatrixDetailPanelVisibleChangedEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `MatrixDetailPanelVisibleChangedEvent`

## Inheritance

`MatrixDropdownQuestionEventMixin` &rarr; `MatrixDetailPanelVisibleChangedEvent`

## Properties

### `row`

A matrix row to which the detail section belongs.

**Type**: `MatrixDropdownRowModelBase`

### `rowIndex`

A zero-based row index.

**Type**: `number`

### `detailPanel`

A [PanelModel](https://surveyjs.io/form-library/documentation/panelmodel) that represents the detail section.

**Type**: `PanelModel`

### `visible`

Indicates whether the detail section is visible now.

**Type**: `boolean`
