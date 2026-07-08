---
title: MatrixCellValueBaseEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `MatrixCellValueBaseEvent`

## Inheritance

`MatrixDropdownQuestionEventMixin` &rarr; `MatrixCellValueBaseEvent`

## Properties

### `row`

A matrix row to which the cell belongs.

**Type**: `MatrixDropdownRowModelBase`

### `column`

A [matrix column](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) to which the cell belongs.

**Type**: `MatrixDropdownColumn`

### `columnName`

The name of a matrix column to which the cell belongs.

**Type**: `string`

### `cellQuestion`

A Question instance within the matrix cell. You can use the properties and methods exposed by the instance to customize it.

**Type**: `Question`

### `getCellQuestion`

A method that returns a Question instance within the matrix cell given a column name.

**Type**: `(columnName: string) => Question`

### `value`

A new cell value.

**Type**: `any`
