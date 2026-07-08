---
title: MatrixAfterCellRenderEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `MatrixAfterCellRenderEvent`

## Inheritance

`AfterRenderElementEventMixin` &rarr; `QuestionEventMixin` &rarr; `MatrixAfterCellRenderEvent`

## Properties

### `cell`

A matrix cell for which the event is raised.

**Type**: `MatrixDropdownCell`

### `cellQuestion`

A Question instance within the matrix cell.

**Type**: `Question`

### `row`

A matrix row to which the cell belongs.

**Type**: `MatrixDropdownRowModelBase`

### `column`

A [matrix column](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) to which the cell belongs.

**Type**: `MatrixDropdownColumn | MatrixDropdownCell`
