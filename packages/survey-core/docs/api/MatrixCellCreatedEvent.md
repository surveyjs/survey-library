---
title: MatrixCellCreatedEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `MatrixCellCreatedEvent`

## Inheritance

`MatrixDropdownQuestionEventMixin` &rarr; `MatrixCellCreatingBaseEvent` &rarr; `MatrixCellCreatedEvent`

## Properties

### `cell`

A matrix cell for which the event is raised.

**Type**: `MatrixDropdownCell`

### `cellQuestion`

A Question instance within the matrix cell. You can use the properties and methods exposed by the instance to customize it.

**Type**: `Question`
