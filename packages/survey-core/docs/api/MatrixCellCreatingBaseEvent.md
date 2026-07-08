---
title: MatrixCellCreatingBaseEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `MatrixCellCreatingBaseEvent`

## Inheritance

`MatrixDropdownQuestionEventMixin` &rarr; `MatrixCellCreatingBaseEvent`

## Properties

### `column`

A [matrix column](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) to which the cell belongs.

**Type**: `MatrixDropdownColumn`

### `columnName`

The name of the matrix column to which the cell belongs.

**Type**: `string`

### `row`

A matrix row to which the cell belongs.

**Type**: `MatrixDropdownRowModelBase`

### `rowValue`

The values of this matrix row.\
To access a particular column's value, use the following code: `options.rowValue["columnName"]`

**Type**: `any`
