---
title: MatrixAllowRemoveRowEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `MatrixAllowRemoveRowEvent`

## Inheritance

`MatrixDynamicQuestionEventMixin` &rarr; `MatrixAllowRemoveRowEvent`

## Properties

### `row`

A matrix row for which the event is raised.

**Type**: `MatrixDropdownRowModelBase`

### `rowIndex`

A zero-based row index.

**Type**: `number`

### `allow`

A Boolean property that you can set to `false` if you want to hide the Remove button for this row.

**Type**: `boolean`
