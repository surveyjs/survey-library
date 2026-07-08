---
title: MatrixRowRemovingEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `MatrixRowRemovingEvent`

## Inheritance

`MatrixDynamicQuestionEventMixin` &rarr; `MatrixRowRemovingEvent`

## Properties

### `row`

A matrix row to be deleted. If you want to clear row data, set the `options.row.value` property to `undefined`.

**Type**: `MatrixDropdownRowModelBase`

### `rowIndex`

A zero-based index of the matrix row to be deleted.

**Type**: `number`

### `allow`

A Boolean property that you can set to `false` if you want to cancel row deletion.

**Type**: `boolean`
